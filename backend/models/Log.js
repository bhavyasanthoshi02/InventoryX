import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },

    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model('Log', logSchema);
export default Log;
