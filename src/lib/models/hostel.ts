import mongoose, { Schema, model, models } from "mongoose";

export interface IHostel extends mongoose.Document {
  name: string;
  shortCode: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  members: mongoose.Types.ObjectId[];
  seats: {
    total: number;
    occupied: number;
    availableForRent: number;
    inMaintenance: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // e.g., "DH-402"
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seats: {
      total: {
        type: Number,
        required: true,
        default: 0,
      },
      occupied: {
        type: Number,
        required: true,
        default: 0,
      },
      availableForRent: {
        type: Number,
        required: true,
        default: 0,
      },
      inMaintenance: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
HostelSchema.index({ location: "2dsphere" });

const Hostel = models.Hostel || model<IHostel>("Hostel", HostelSchema);

export default Hostel;
