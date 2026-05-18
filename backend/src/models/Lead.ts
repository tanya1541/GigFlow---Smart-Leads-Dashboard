import mongoose, { Schema } from "mongoose";

import ILead from '../types/interfaces';

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New",
    },

    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const LeadModel = mongoose.model<ILead>("Lead", leadSchema);

export default LeadModel;