import mongoose, { Document, Schema } from "mongoose";

// 1. Create and export the interface
export interface IStudent extends Document {
  name: string;
  email: string;
  age: number;
  course: string;
  grade: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define schema with type
const studentSchema: Schema<IStudent> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    grade: { type: String, required: true },
  },
  { timestamps: true }
);

// 3. Export typed model
const Student = mongoose.model<IStudent>("Student", studentSchema);
export default Student;
