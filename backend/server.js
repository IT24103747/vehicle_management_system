import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import User from './models/User.js';
import ParkingLocation from './models/ParkingLocation.js';
import ParkingSlot from './models/ParkingSlot.js';
import Reservation from './models/Reservation.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const DEMO_OWNER_EMAIL = 'owner@parksl.lk';
const DEMO_OWNER_PASSWORD = 'Password123';

app.use(cors());
app.use(express.json());

// Helper function to seed initial owner & sample data
async function seedInitialData() {
  try {
    let owner = await User.findOne({ email: 'owner@parksl.lk' });
    if (!owner) {
      owner = await User.create({
        name: 'Sri Lanka Parking Manager',
        email: 'owner@parksl.lk',
        phone: '0770000000',
        password: 'Password123',
        role: 'OPERATOR',
      });
      console.log('Seeded hardcoded Parking Owner: owner@parksl.lk / Password123');
    }

    const locationCount = await ParkingLocation.countDocuments();
    if (locationCount === 0) {
      const location = await ParkingLocation.create({
        name: 'SLIIT Malabe Parking',
        city: 'Malabe',
        address: 'New Kandy Road, Malabe',
        pricePerHour: 100,
        ownerId: owner._id,
        totalSlots: 10,
      });

      const slots = [];
      for (let i = 1; i <= 10; i++) {
        const slotNum = `P${i < 10 ? '0' + i : i}`;
        let initialStatus = 'AVAILABLE';
        if (i === 2 || i === 5) initialStatus = 'OCCUPIED';
        if (i === 3) initialStatus = 'RESERVED';

        slots.push({
          locationId: location._id,
          slotNumber: slotNum,
          status: initialStatus,
        });
      }
      const insertedSlots = await ParkingSlot.insertMany(slots);
      console.log('Seeded initial location SLIIT Malabe Parking with 10 slots');

      // Seed a sample reservation for P03
      const reservedSlot = insertedSlots.find(s => s.slotNumber === 'P03');
      if (reservedSlot) {
        await Reservation.create({
          ticketId: 'PS1024',
          slotId: reservedSlot._id,
          locationId: location._id,
          driverName: 'Kasun Perera',
          driverPhone: '0771234567',
          vehicleNumber: 'CAB-1234',
          durationHours: 2,
          totalCost: 200,
          status: 'RESERVED',
        });
        console.log('Seeded sample reservation PS1024 for P03');
      }
    }
  } catch (err) {
    console.error('Error seeding initial data:', err.message);
  }
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.get('/api/health', (_request, response) => {
  response.status(200).json({ message: 'ParkSL API is running' });
});

// Driver login plus one fixed demo owner account for the operator dashboard.
app.post('/api/auth/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email?.trim() || !password) {
      return response.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    const isDemoOwner =
      normalizedEmail === DEMO_OWNER_EMAIL
      && password === DEMO_OWNER_PASSWORD
      && user?.role === 'OPERATOR'
      && (user.password === DEMO_OWNER_PASSWORD || await user.comparePassword(password));
    const isValidDriver = user?.role === 'DRIVER' && await user.comparePassword(password);

    if (!isDemoOwner && !isValidDriver) {
      return response.status(401).json({ message: 'Incorrect email or password.' });
    }

    return response.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        vehicleNumber: user.vehicleNumber || '',
        role: user.role,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Registration Endpoint
app.post('/api/auth/register', async (request, response) => {
  try {
    const { name, email, phone, password, vehicleNumber = '' } = request.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password || !vehicleNumber.trim()) {
      return response.status(400).json({ message: 'Name, email, phone number, vehicle number, and password are required.' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return response.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return response.status(400).json({ message: 'Password must be at least 8 characters and include letters and numbers.' });
    }

    const existingUser = await User.findOne({ $or: [{ phone: phone.trim() }, { email: email.trim().toLowerCase() }] });
    if (existingUser) {
      return response.status(409).json({ message: 'An account already exists with this email or phone number.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      vehicleNumber: vehicleNumber.trim(),
      role: 'DRIVER',
    });

    return response.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        vehicleNumber: user.vehicleNumber,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ message: 'An account already exists for this phone number.' });
    }
    return response.status(500).json({ message: 'Could not create the account. Please try again.' });
  }
});

// ----------------------------------------------------
// DRIVER RESERVATION ENDPOINTS (Member 3 integration)
// ----------------------------------------------------

async function generateTicketId() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const ticketId = `PS${Math.floor(1000 + Math.random() * 9000)}`;
    const exists = await Reservation.exists({ ticketId });
    if (!exists) return ticketId;
  }

  return `PS${Date.now().toString().slice(-6)}`;
}

app.post('/api/reservations', async (request, response) => {
  try {
    const {
      userId,
      locationId,
      slotId,
      driverName,
      driverPhone,
      vehicleNumber,
      durationHours,
    } = request.body;

    if (!locationId || !slotId || !driverName?.trim() || !driverPhone?.trim() || !vehicleNumber?.trim()) {
      return response.status(400).json({ message: 'Location, slot, driver, phone, and vehicle details are required.' });
    }

    const hours = Number(durationHours);
    if (!Number.isInteger(hours) || hours < 1 || hours > 12) {
      return response.status(400).json({ message: 'Duration must be an integer between 1 and 12 hours.' });
    }

    const [location, slot] = await Promise.all([
      ParkingLocation.findById(locationId),
      ParkingSlot.findById(slotId),
    ]);

    if (!location) {
      return response.status(404).json({ message: 'Parking location not found.' });
    }

    if (!slot || slot.locationId.toString() !== location._id.toString()) {
      return response.status(404).json({ message: 'Parking slot not found for this location.' });
    }

    if (slot.status !== 'AVAILABLE') {
      return response.status(409).json({ message: 'This parking slot is no longer available.' });
    }

    const reservation = await Reservation.create({
      ticketId: await generateTicketId(),
      userId: userId || undefined,
      slotId: slot._id,
      locationId: location._id,
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      durationHours: hours,
      totalCost: hours * Number(location.pricePerHour),
      status: 'RESERVED',
    });

    slot.status = 'RESERVED';
    await slot.save();

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('locationId', 'name city address pricePerHour')
      .populate('slotId', 'slotNumber status');

    return response.status(201).json({
      message: 'Reservation created successfully.',
      reservation: populatedReservation,
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ message: 'Ticket ID collision. Please try again.' });
    }
    return response.status(500).json({ message: 'Could not create reservation', error: error.message });
  }
});

app.get('/api/driver/reservations', async (request, response) => {
  try {
    const { userId, phone, vehicleNumber } = request.query;
    const filters = [];

    if (userId) filters.push({ userId });
    if (phone) filters.push({ driverPhone: phone.trim() });
    if (vehicleNumber) filters.push({ vehicleNumber: vehicleNumber.trim().toUpperCase() });

    if (filters.length === 0) {
      return response.status(400).json({ message: 'Driver identifier is required.' });
    }

    const reservations = await Reservation.find({ $or: filters })
      .populate('locationId', 'name city address pricePerHour')
      .populate('slotId', 'slotNumber status')
      .sort({ createdAt: -1 });

    return response.status(200).json(reservations);
  } catch (error) {
    return response.status(500).json({ message: 'Error fetching driver reservations', error: error.message });
  }
});

// ----------------------------------------------------
// OWNER / OPERATOR ENDPOINTS (Member 4)
// ----------------------------------------------------

// Get Owner Stats Dashboard
app.get('/api/owner/stats', async (request, response) => {
  try {
    const owner = await User.findOne({ role: 'OPERATOR' });
    const ownerId = owner ? owner._id : null;

    const locations = await ParkingLocation.find(ownerId ? { ownerId } : {});
    const locationIds = locations.map(l => l._id);

    const slots = await ParkingSlot.find({ locationId: { $in: locationIds } });
    const reservations = await Reservation.find({ locationId: { $in: locationIds }, status: 'RESERVED' });

    const totalSlots = slots.length;
    const availableSlots = slots.filter(s => s.status === 'AVAILABLE').length;
    const reservedSlots = slots.filter(s => s.status === 'RESERVED').length;
    const occupiedSlots = slots.filter(s => s.status === 'OCCUPIED').length;

    return response.status(200).json({
      totalLocations: locations.length,
      totalSlots,
      availableSlots,
      reservedSlots,
      occupiedSlots,
      activeReservationsCount: reservations.length,
    });
  } catch (error) {
    return response.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get Locations for Owner
app.get('/api/owner/locations', async (request, response) => {
  try {
    const locations = await ParkingLocation.find().sort({ createdAt: -1 });

    // Attach slot count breakdown for each location
    const populatedLocations = await Promise.all(
      locations.map(async (loc) => {
        const slots = await ParkingSlot.find({ locationId: loc._id });
        const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;
        return {
          ...loc.toObject(),
          totalSlots: slots.length,
          availableSlots: availableCount,
        };
      })
    );

    return response.status(200).json(populatedLocations);
  } catch (error) {
    return response.status(500).json({ message: 'Error fetching locations', error: error.message });
  }
});

// Add New Parking Location (with Input Validation)
app.post('/api/owner/locations', async (request, response) => {
  try {
    const { name, city, address, pricePerHour, numberOfSlots, ownerId } = request.body;

    // Strict Validations
    if (!name || !name.trim()) {
      return response.status(400).json({ message: 'Parking name is required.' });
    }
    if (!city || !city.trim()) {
      return response.status(400).json({ message: 'Location/City is required.' });
    }
    if (!address || !address.trim()) {
      return response.status(400).json({ message: 'Address is required.' });
    }
    const priceNum = Number(pricePerHour);
    if (isNaN(priceNum) || priceNum <= 0) {
      return response.status(400).json({ message: 'Price per hour must be greater than 0.' });
    }
    const slotsNum = Number(numberOfSlots);
    if (isNaN(slotsNum) || slotsNum <= 0) {
      return response.status(400).json({ message: 'Number of slots must be greater than 0.' });
    }

    let defaultOwner = ownerId;
    if (!defaultOwner) {
      const owner = await User.findOne({ role: 'OPERATOR' });
      defaultOwner = owner ? owner._id : undefined;
    }

    const newLocation = await ParkingLocation.create({
      name: name.trim(),
      city: city.trim(),
      address: address.trim(),
      pricePerHour: priceNum,
      totalSlots: slotsNum,
      ownerId: defaultOwner,
    });

    // Auto-create initial slots P01, P02...
    const slots = [];
    for (let i = 1; i <= slotsNum; i++) {
      const slotNum = `P${i < 10 ? '0' + i : i}`;
      slots.push({
        locationId: newLocation._id,
        slotNumber: slotNum,
        status: 'AVAILABLE',
      });
    }
    await ParkingSlot.insertMany(slots);

    return response.status(201).json({
      message: 'Parking location created successfully.',
      location: {
        ...newLocation.toObject(),
        availableSlots: slotsNum,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to create parking location', error: error.message });
  }
});

// Edit Parking Location
app.put('/api/owner/locations/:id', async (request, response) => {
  try {
    const { name, city, address, pricePerHour } = request.body;
    const { id } = request.params;

    if (!name || !name.trim()) return response.status(400).json({ message: 'Parking name is required.' });
    if (!city || !city.trim()) return response.status(400).json({ message: 'City is required.' });
    if (Number(pricePerHour) <= 0) return response.status(400).json({ message: 'Price per hour must be greater than 0.' });

    const updated = await ParkingLocation.findByIdAndUpdate(
      id,
      { name: name.trim(), city: city.trim(), address: address.trim(), pricePerHour: Number(pricePerHour) },
      { new: true }
    );

    return response.status(200).json({ message: 'Parking location updated', location: updated });
  } catch (error) {
    return response.status(500).json({ message: 'Update failed', error: error.message });
  }
});

// Delete Parking Location
app.delete('/api/owner/locations/:id', async (request, response) => {
  try {
    const { id } = request.params;
    await ParkingLocation.findByIdAndDelete(id);
    await ParkingSlot.deleteMany({ locationId: id });
    await Reservation.deleteMany({ locationId: id });

    return response.status(200).json({ message: 'Parking location and associated slots removed.' });
  } catch (error) {
    return response.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// Get Slots for a Location
app.get('/api/owner/locations/:locationId/slots', async (request, response) => {
  try {
    const { locationId } = request.params;
    const slots = await ParkingSlot.find({ locationId }).sort({ slotNumber: 1 });
    return response.status(200).json(slots);
  } catch (error) {
    return response.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
});

// Add Slot to Location
app.post('/api/owner/locations/:locationId/slots', async (request, response) => {
  try {
    const { locationId } = request.params;
    const existingSlots = await ParkingSlot.find({ locationId });
    const nextIndex = existingSlots.length + 1;
    const slotNumber = `P${nextIndex < 10 ? '0' + nextIndex : nextIndex}`;

    const newSlot = await ParkingSlot.create({
      locationId,
      slotNumber,
      status: 'AVAILABLE',
    });

    await ParkingLocation.findByIdAndUpdate(locationId, { $inc: { totalSlots: 1 } });

    return response.status(201).json({ message: 'Slot added', slot: newSlot });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to add slot', error: error.message });
  }
});

// Delete Slot
app.delete('/api/owner/slots/:slotId', async (request, response) => {
  try {
    const { slotId } = request.params;
    const slot = await ParkingSlot.findById(slotId);
    if (slot) {
      await ParkingLocation.findByIdAndUpdate(slot.locationId, { $inc: { totalSlots: -1 } });
      await ParkingSlot.findByIdAndDelete(slotId);
    }
    return response.status(200).json({ message: 'Slot deleted' });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to delete slot', error: error.message });
  }
});

// Change Slot Status (AVAILABLE ↔ OCCUPIED)
app.patch('/api/owner/slots/:slotId/status', async (request, response) => {
  try {
    const { slotId } = request.params;
    const { status } = request.body;

    if (!['AVAILABLE', 'OCCUPIED', 'RESERVED'].includes(status)) {
      return response.status(400).json({ message: 'Invalid slot status' });
    }

    const updatedSlot = await ParkingSlot.findByIdAndUpdate(
      slotId,
      { status },
      { new: true }
    );

    return response.status(200).json({ message: 'Slot status updated', slot: updatedSlot });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to update slot status', error: error.message });
  }
});

// Get Reservations List for Owner
app.get('/api/owner/reservations', async (request, response) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'name email phone vehicleNumber')
      .populate('locationId', 'name city address')
      .populate('slotId', 'slotNumber status')
      .sort({ createdAt: -1 });

    return response.status(200).json(reservations);
  } catch (error) {
    return response.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
});

// Update Reservation & Sync Slot Status
// Step 1: RESERVED -> ACTIVE (Slot: RESERVED -> OCCUPIED)
// Step 2: ACTIVE -> COMPLETED (Slot: OCCUPIED -> AVAILABLE)
app.patch('/api/owner/reservations/:id/status', async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body; // 'ACTIVE' or 'COMPLETED' or 'CANCELLED'

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return response.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    // Auto sync Slot status
    if (status === 'ACTIVE') {
      await ParkingSlot.findByIdAndUpdate(reservation.slotId, { status: 'OCCUPIED' });
    } else if (status === 'COMPLETED' || status === 'CANCELLED') {
      await ParkingSlot.findByIdAndUpdate(reservation.slotId, { status: 'AVAILABLE' });
    }

    return response.status(200).json({
      message: `Reservation updated to ${status}`,
      reservation,
    });
  } catch (error) {
    return response.status(500).json({ message: 'Status update failed', error: error.message });
  }
});

// ----------------------------------------------------
// SERVER INITIALIZATION
// ----------------------------------------------------

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Create backend/.env using backend/.env.example.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    await seedInitialData();

    app.listen(port, () => {
      console.log(`ParkSL API listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
