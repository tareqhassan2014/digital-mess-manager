import mongoose, { Schema, model, models } from "mongoose";

export type SeatStatus = "OCCUPIED" | "AVAILABLE_FOR_RENT" | "IN_MAINTENANCE";

export interface ISeat extends mongoose.Document {
  seatNumber: string;
  roomNumber: string;
  hostel: mongoose.Types.ObjectId;
  status: SeatStatus;
  rent: number;
  occupant?: mongoose.Types.ObjectId; // User who occupies this seat (if status is OCCUPIED)
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    seatNumber: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    status: {
      type: String,
      enum: ["OCCUPIED", "AVAILABLE_FOR_RENT", "IN_MAINTENANCE"],
      required: true,
      default: "AVAILABLE_FOR_RENT",
    },
    rent: {
      type: Number,
      required: true,
      default: 0,
    },
    occupant: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for seat number and hostel (unique seat per hostel)
SeatSchema.index({ seatNumber: 1, hostel: 1 }, { unique: true });

// Create index on hostel for faster queries
SeatSchema.index({ hostel: 1 });

// Create index on status for filtering
SeatSchema.index({ status: 1 });

const Seat = models.Seat || model<ISeat>("Seat", SeatSchema);

export default Seat;
