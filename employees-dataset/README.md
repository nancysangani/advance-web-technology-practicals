# Employees Dataset API (Node.js + Express + TypeScript)

This project provides a type-safe REST API for an employees dataset using:

- Node.js
- Express
- TypeScript
- Zod for runtime validation + inferred types

## Setup

```bash
npm install
npm run dev
```

The API runs at `http://localhost:3000` by default.

## Scripts

```bash
npm run dev    # Start in watch mode with tsx
npm run build  # Compile TypeScript to dist/
npm start      # Run compiled app
```

## Endpoints

- `GET /health`
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

## Example Payload (Create Employee)

```json
{
  "firstName": "Anika",
  "lastName": "Patel",
  "email": "anika.patel@company.com",
  "department": "Engineering",
  "role": "Frontend Developer",
  "salary": 88000,
  "startDate": "2024-05-20",
  "isActive": true
}
```

## Notes on Type Safety

- Request body schemas are defined with Zod in `src/types/employee.ts`.
- TypeScript types (`Employee`, `CreateEmployeeInput`, `UpdateEmployeeInput`) are inferred directly from schemas.
- Route handlers use typed request params and typed response payloads.
