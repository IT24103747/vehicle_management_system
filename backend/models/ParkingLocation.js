import mongoose from 'mongoose';

const parkingLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Parking name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City/Location is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [1, 'Price per hour must be greater than 0'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalSlots: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model('ParkingLocation', parkingLocationSchema);
