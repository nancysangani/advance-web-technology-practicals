import { NextResponse } from "next/server";
import { createPantryItem, listPantryItems } from "@/lib/pantry-store";
import { CreatePantryItemInput, PantryCategory } from "@/types/pantry";

const categories: PantryCategory[] = [
  "produce",
  "dairy",
  "protein",
  "grains",
  "snacks",
  "other",
];

function isValidCategory(value: string): value is PantryCategory {
  return categories.includes(value as PantryCategory);
}

export async function GET() {
  const items = await listPantryItems();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<CreatePantryItemInput>;

    if (!payload.name || payload.name.trim().length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters." },
        { status: 400 },
      );
    }

    if (!payload.category || !isValidCategory(payload.category)) {
      return NextResponse.json(
        { message: "Invalid category." },
        { status: 400 },
      );
    }

    if (
      typeof payload.quantity !== "number" ||
      Number.isNaN(payload.quantity) ||
      payload.quantity <= 0
    ) {
      return NextResponse.json(
        { message: "Quantity must be a positive number." },
        { status: 400 },
      );
    }

    if (!payload.unit || payload.unit.trim().length < 1) {
      return NextResponse.json(
        { message: "Unit is required." },
        { status: 400 },
      );
    }

    if (!payload.expiresAt) {
      return NextResponse.json(
        { message: "Expiration date is required." },
        { status: 400 },
      );
    }

    const created = await createPantryItem({
      name: payload.name,
      category: payload.category,
      quantity: payload.quantity,
      unit: payload.unit,
      expiresAt: payload.expiresAt,
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }
}
