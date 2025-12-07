import mongoose, { Schema, model, models } from "mongoose";

export interface IMarket extends mongoose.Document {
  name: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  description?: string; // Optional description
  isActive: boolean; // Allow disabling markets without deleting
  createdAt: Date;
  updatedAt: Date;
}

const MarketSchema = new Schema<IMarket>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (value: number[]) {
            if (!value || value.length !== 2) return false;
            return (
              value[0] >= -180 &&
              value[0] <= 180 && // longitude
              value[1] >= -90 &&
              value[1] <= 90
            ); // latitude
          },
          message:
            "Coordinates must be [longitude, latitude] with valid ranges",
        },
      },
      _id: false,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for active markets (common query pattern)
MarketSchema.index({ isActive: 1 });

// Unique index for name (to prevent duplicate markets)
MarketSchema.index({ name: 1 }, { unique: true });

// Index for searching by name
MarketSchema.index({ name: 1 });

// Geospatial index for location queries
MarketSchema.index({ location: "2dsphere" });

const Market = models.Market || model<IMarket>("Market", MarketSchema);

export default Market;
