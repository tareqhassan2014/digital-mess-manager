import mongoose, { Schema, model, models } from "mongoose";

export interface IHostel extends mongoose.Document {
  name: string;
  shortCode: string;
  address?: string;
  type: "BOYS" | "GIRLS";

  // Rules Structure (Perfect)
  rules: {
    order: number;
    level: "CRITICAL" | "MODERATE" | "INFO";
    title: string;
    description?: string;
    fine: string;
  }[];

  // Location (Fixed: Made optional to match interface)
  location?: {
    type: "Point";
    coordinates: [number, number]; // [Longitude, Latitude]
  };

  owner: mongoose.Types.ObjectId;
  manager?: mongoose.Types.ObjectId;

  // Members (Advice: Keep only ACTIVE members here)
  members: {
    user: mongoose.Types.ObjectId;
    joinDate: Date;
    leavingDate?: Date; // Only strictly necessary if tracking notice period
    securityPaid?: boolean;
    securityAmount?: number;
    agreedAt?: Date;
  }[];

  seats: {
    total: number;
    occupied: number;
    availableForRent: number;
    inMaintenance: number;
  };

  // Renamed for clarity vs 'Global Lock'
  serviceSuspendedUntil?: Date | null;
  suspensionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const HostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: ["BOYS", "GIRLS"],
      required: true,
    },

    rules: [
      {
        order: {
          type: Number,
          default: 0,
        },
        level: {
          type: String,
          enum: ["CRITICAL", "MODERATE", "INFO"],
          default: "INFO",
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        fine: {
          type: String,
          default: "0 BDT",
        },
      },
    ],

    // FIXED: Removed 'required: true' to prevent crashes if location is missing
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [Longitude, Latitude]
        index: "2dsphere",
      },
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinDate: {
          type: Date,
          required: true,
        },
        leavingDate: {
          type: Date,
        },
        securityPaid: {
          type: Boolean,
          default: false,
        },
        securityAmount: {
          type: Number,
          default: 0,
        },
        agreedAt: {
          type: Date,
        },
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

    serviceSuspendedUntil: {
      type: Date,
      default: null,
    },
    suspensionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// GeoJSON Index
HostelSchema.index({ location: "2dsphere" });

// Prevents Next.js hot-reload model overwrite error
const Hostel = models.Hostel || model<IHostel>("Hostel", HostelSchema);

export default Hostel;
