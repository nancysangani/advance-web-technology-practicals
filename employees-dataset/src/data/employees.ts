import { Employee } from "../types/employee";

export const employeesSeed: Employee[] = [
  {
    id: 1,
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@company.com",
    department: "Engineering",
    role: "Backend Developer",
    salary: 92000,
    startDate: "2021-06-15",
    isActive: true,
  },
  {
    id: 2,
    firstName: "Meera",
    lastName: "Iyer",
    email: "meera.iyer@company.com",
    department: "Human Resources",
    role: "HR Manager",
    salary: 78000,
    startDate: "2019-03-11",
    isActive: true,
  },
  {
    id: 3,
    firstName: "Rohan",
    lastName: "Verma",
    email: "rohan.verma@company.com",
    department: "Finance",
    role: "Financial Analyst",
    salary: 85000,
    startDate: "2020-09-01",
    isActive: false,
  },
];
