import { Request, Response, Router } from "express";
import { employeesSeed } from "../data/employees";
import { ApiError } from "../types/api";
import {
  createEmployeeSchema,
  CreateEmployeeInput,
  Employee,
  updateEmployeeSchema,
} from "../types/employee";

type EmployeeIdParams = {
  id: string;
};

const router = Router();
let employees: Employee[] = [...employeesSeed];

const getNextId = (): number => {
  if (employees.length === 0) {
    return 1;
  }

  return Math.max(...employees.map((employee) => employee.id)) + 1;
};

router.get("/", (_req: Request, res: Response<Employee[]>) => {
  res.status(200).json(employees);
});

router.get(
  "/:id",
  (req: Request<EmployeeIdParams>, res: Response<Employee | ApiError>) => {
    const id = Number(req.params.id);
    const employee = employees.find((entry) => entry.id === id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json(employee);
  },
);

router.post(
  "/",
  (
    req: Request<{}, Employee | ApiError, CreateEmployeeInput>,
    res: Response<Employee | ApiError>,
  ) => {
    const parsed = createEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    const newEmployee: Employee = {
      id: getNextId(),
      ...parsed.data,
    };

    employees.push(newEmployee);
    return res.status(201).json(newEmployee);
  },
);

router.put(
  "/:id",
  (
    req: Request<EmployeeIdParams, Employee | ApiError>,
    res: Response<Employee | ApiError>,
  ) => {
    const id = Number(req.params.id);
    const index = employees.findIndex((entry) => entry.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const parsed = updateEmployeeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    const updatedEmployee: Employee = {
      ...employees[index],
      ...parsed.data,
    };

    employees[index] = updatedEmployee;
    return res.status(200).json(updatedEmployee);
  },
);

router.delete(
  "/:id",
  (req: Request<EmployeeIdParams>, res: Response<void | ApiError>) => {
    const id = Number(req.params.id);
    const index = employees.findIndex((entry) => entry.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employees.splice(index, 1);
    return res.status(204).send();
  },
);

export const employeesRouter = router;
