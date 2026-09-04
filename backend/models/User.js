import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['DRIVER', 'OPERATOR'],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
