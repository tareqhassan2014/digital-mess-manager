import mongoose, { Schema, model, models } from "mongoose";

export type GroceryItemCategory =
  | "RICE_GRAINS"
  | "PROTEIN"
  | "VEGETABLE"
  | "SPICES_OIL"
  | "OTHER";

export type GroceryItemUnit =
  | "KG"
  | "LITER"
  | "PCS"
  | "DOZEN"
  | "PACKET"
  | "GM";

export interface IGroceryItem extends mongoose.Document {
  bazar: mongoose.Types.ObjectId; // Reference to the Bazar document
  market?: mongoose.Types.ObjectId; // Reference to the Market document (optional for backward compatibility)
  name: string;
  category: GroceryItemCategory;
  quantity: number;
  unit: GroceryItemUnit;
  pricePerUnit: number; // This is the data point for your "Price Change Graph"
  totalCost: number; // quantity * pricePerUnit
  createdAt: Date;
  updatedAt: Date;
}

const GroceryItemSchema = new Schema<IGroceryItem>(
  {
    bazar: {
      type: Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    market: {
      type: Schema.Types.ObjectId,
      ref: "Market",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Helps in grouping "Chicken" and "chicken" for graphs
    },
    category: {
      type: String,
      enum: ["RICE_GRAINS", "PROTEIN", "VEGETABLE", "SPICES_OIL", "OTHER"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["KG", "LITER", "PCS", "DOZEN", "PACKET", "GM"],
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    }, // This is the data point for your "Price Change Graph"
    totalCost: {
      type: Number,
      required: true,
    }, // quantity * pricePerUnit
  },
  {
    timestamps: true,
  }
);

// INDEXING FOR ANALYTICS (Crucial for Graphs)
// Allows fast queries like: "Find all records where item.name is 'onion'"
GroceryItemSchema.index({ name: 1, createdAt: 1 });
GroceryItemSchema.index({ category: 1 });
GroceryItemSchema.index({ bazar: 1 });

// Compound index for bazar and name (for price change tracking)
GroceryItemSchema.index({ bazar: 1, name: 1 });

// Index for market-based price tracking
GroceryItemSchema.index({ market: 1, name: 1, createdAt: 1 });

const GroceryItem =
  models.GroceryItem || model<IGroceryItem>("GroceryItem", GroceryItemSchema);

export default GroceryItem;
