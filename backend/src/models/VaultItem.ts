import mongoose from "mongoose";

export interface IVaultItem extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  username: string;
  password: string; // This will be encrypted on client-side
  url: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const vaultItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: [100, "Username cannot exceed 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // Note: This will store encrypted password from client
    },
    url: {
      type: String,
      trim: true,
      maxlength: [500, "URL cannot exceed 500 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
vaultItemSchema.index({ userId: 1, createdAt: -1 });

export const VaultItem = mongoose.model<IVaultItem>(
  "VaultItem",
  vaultItemSchema
);
