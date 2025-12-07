import mongoose, { Schema, model, models } from "mongoose";
import { GroceryItemCategory, GroceryItemUnit } from "./grocery-item";

export interface IPresetGroceryItem extends mongoose.Document {
  name: string;
  category: GroceryItemCategory;
  defaultUnit: GroceryItemUnit; // Suggested unit, but users can change when adding to bazar
  isCustom: boolean; // true if added by user, false if system default
  isActive: boolean; // Allow disabling presets without deleting
  createdAt: Date;
  updatedAt: Date;
}

const PresetGroceryItemSchema = new Schema<IPresetGroceryItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Consistent with GroceryItem
    },
    category: {
      type: String,
      enum: ["RICE_GRAINS", "PROTEIN", "VEGETABLE", "SPICES_OIL", "OTHER"],
      required: true,
    },
    defaultUnit: {
      type: String,
      enum: ["KG", "LITER", "PCS", "DOZEN", "PACKET", "GM"],
      required: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
      required: true,
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

// Index for category-based queries
PresetGroceryItemSchema.index({ category: 1, isActive: 1 });

// Unique index for name (to prevent duplicates)
PresetGroceryItemSchema.index({ name: 1 }, { unique: true });

// Index for searching by name
PresetGroceryItemSchema.index({ name: 1 });

const PresetGroceryItem =
  models.PresetGroceryItem ||
  model<IPresetGroceryItem>("PresetGroceryItem", PresetGroceryItemSchema);

export default PresetGroceryItem;
