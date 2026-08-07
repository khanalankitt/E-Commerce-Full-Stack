import { Schema, model, Types } from "mongoose";

export interface IAddress {
  user: Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  area: string;
  fullAddress: string;
  isDefaultShippingAddress: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },
    isDefaultShippingAddress: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

addressSchema.index({ user: 1, createdAt: -1 });
addressSchema.index({ user: 1, isDefaultShippingAddress: 1 });

export const Address = model<IAddress>("Address", addressSchema);
