import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({ message: 'ParkSL API is running' });
});

app.post('/api/auth/register', async (request, response) => {
  try {
    const { name, phone, vehicleNumber = '', role } = request.body;

    if (!name?.trim() || !phone?.trim() || !role) {
      return response.status(400).json({ message: 'Name, phone number, and account type are required.' });
    }

    if (!['DRIVER', 'OPERATOR'].includes(role)) {
      return response.status(400).json({ message: 'Account type must be DRIVER or OPERATOR.' });
    }

    if (role === 'DRIVER' && !vehicleNumber.trim()) {
      return response.status(400).json({ message: 'Vehicle number is required for drivers.' });
    }

    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return response.status(409).json({ message: 'An account already exists for this phone number.' });
    }

    const user = await User.create({ name, phone, vehicleNumber, role });
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

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Create backend/.env using backend/.env.example.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`ParkSL API listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
