import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSlot',
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLocation',
      required: true,
    },
    driverName: {
      type: String,
      default: 'Driver',
    },
    driverPhone: {
      type: String,
      default: '',
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true,
      uppercase: true,
    },
    durationHours: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 hour'],
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['RESERVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'RESERVED',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Reservation', reservationSchema);
