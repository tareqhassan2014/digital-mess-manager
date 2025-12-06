import mongoose, { Schema, model, models } from "mongoose";

export interface IMeal extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  hostel: mongoose.Types.ObjectId;
  date: Date; // The specific date (stored as midnight UTC)
  breakfast: number; // Member's own breakfast meals
  lunch: number; // Member's own lunch meals
  dinner: number; // Member's own dinner meals
  breakfastGuests: number; // Extra breakfast meals for guests
  lunchGuests: number; // Extra lunch meals for guests
  dinnerGuests: number; // Extra dinner meals for guests
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    breakfast: {
      type: Number,
      default: 0,
    },
    lunch: {
      type: Number,
      default: 0,
    },
    dinner: {
      type: Number,
      default: 0,
    },
    breakfastGuests: {
      type: Number,
      default: 0,
    },
    lunchGuests: {
      type: Number,
      default: 0,
    },
    dinnerGuests: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// COMPOUND INDEX:
// Ensures a user can only have ONE record per date.
// Prevents duplicate entries.
MealSchema.index({ user: 1, date: 1 }, { unique: true });

// Create index on hostel for faster queries
MealSchema.index({ hostel: 1 });

// Create index on date for filtering by date range
MealSchema.index({ date: 1 });

// Create compound index for hostel and date (for manager queries)
MealSchema.index({ hostel: 1, date: 1 });

const Meal = models.Meal || model<IMeal>("Meal", MealSchema);

export default Meal;
