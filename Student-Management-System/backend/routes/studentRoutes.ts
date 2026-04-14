import express, { Router } from "express";
import {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.ts";

const router: Router = express.Router();

router.get("/students", getStudents);
router.post("/students", createStudent);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;