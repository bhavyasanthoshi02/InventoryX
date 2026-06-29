import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a supplier name'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Please provide a contact person name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a contact email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone'],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
