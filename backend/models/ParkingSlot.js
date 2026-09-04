import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLocation',
      required: true,
    },
    slotNumber: {
      type: String,
      required: [true, 'Slot number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED'],
      default: 'AVAILABLE',
    },
  },
  { timestamps: true },
);

export default mongoose.model('ParkingSlot', parkingSlotSchema);
