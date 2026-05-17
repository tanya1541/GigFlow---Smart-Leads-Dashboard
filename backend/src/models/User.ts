import mongoose, { Schema } from "mongoose";
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "sales"],
      default: "sales",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;