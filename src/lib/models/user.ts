import mongoose, { Schema, model, models } from "mongoose";

export interface IUser extends mongoose.Document {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
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
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
