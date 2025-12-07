import mongoose, { Schema, model, models } from "mongoose";

export interface IBazar extends mongoose.Document {
  hostel: mongoose.Types.ObjectId;
  addedBy?: mongoose.Types.ObjectId;
  date: Date;
  grandTotal: number; // Calculated Sum of all items.totalCost
  receipts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BazarSchema = new Schema<IBazar>(
  {
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    // Calculated Sum of all items.totalCost
    grandTotal: {
      type: Number,
      required: true,
    },
    // Optional: Upload photos of the physical receipt for audit
    receipts: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index on hostel for faster queries
BazarSchema.index({ hostel: 1 });

// Index on date for filtering by date range
BazarSchema.index({ date: 1 });

// Compound index for hostel and date (for manager queries)
BazarSchema.index({ hostel: 1, date: 1 });

const Bazar = models.Bazar || model<IBazar>("Bazar", BazarSchema);

export default Bazar;
