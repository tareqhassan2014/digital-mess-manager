import mongoose, { Schema, model, models } from "mongoose";

export interface IUser extends mongoose.Document {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  currentHostel?: mongoose.Types.ObjectId; // Reference to current hostel for faster queries
  upcomingHostel?: {
    hostel: mongoose.Types.ObjectId; // Reference to hostel they will join
    joinDate: Date; // Date when they will join the new hostel
    securityPaid: boolean; // Whether security money has been paid
    securityAmount?: number; // Amount of security money paid
    agreedAt?: Date; // Date when agreement was made
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    currentHostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
    },
    upcomingHostel: {
      hostel: {
        type: Schema.Types.ObjectId,
        ref: "Hostel",
      },
      joinDate: {
        type: Date,
      },
      securityPaid: {
        type: Boolean,
        default: false,
      },
      securityAmount: {
        type: Number,
      },
      agreedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries on currentHostel
UserSchema.index({ currentHostel: 1 });

const User = models.User || model<IUser>("User", UserSchema);

export default User;
