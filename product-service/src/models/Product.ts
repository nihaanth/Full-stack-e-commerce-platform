import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  brand: string;
  image_url: string;
  features: string[];
  specifications: Record<string, string>;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true, index: 'text' },
    description: { type: String, required: true, index: 'text' },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    brand: { type: String, required: true, index: true },
    image_url: { type: String, required: true },
    features: [{ type: String }],
    specifications: { type: Map, of: String },
    stock: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

ProductSchema.index({ category: 1, price: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
