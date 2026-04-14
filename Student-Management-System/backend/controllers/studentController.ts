import type { Request, Response } from "express";
import Student from "../models/Students.ts";
import type { IStudent } from "../models/Students.ts";

// GET all students
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students: IStudent[] = await Student.find();
    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET student by ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404).json({ message: "Student not found!" });
      return;
    }

    res.status(200).json(student);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE student
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = new Student(req.body as IStudent);
    await student.save();
    res.status(201).json(student);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE student
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      res.status(404).json({ message: "Student not found!" });
      return;
    }

    res.status(200).json(student);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE student
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      res.status(404).json({ message: "Student not found!" });
      return;
    }

    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
