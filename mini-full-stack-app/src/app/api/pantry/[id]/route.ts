import { NextResponse } from "next/server";
import {
  deletePantryItem,
  isPantryStatus,
  updatePantryItem,
} from "@/lib/pantry-store";
import { UpdatePantryItemInput } from "@/types/pantry";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const payload = (await req.json()) as UpdatePantryItemInput;

    if (
      payload.quantity !== undefined &&
      (typeof payload.quantity !== "number" || payload.quantity < 0)
    ) {
      return NextResponse.json(
        { message: "Quantity must be zero or a positive number." },
        { status: 400 },
      );
    }

    if (payload.status !== undefined && !isPantryStatus(payload.status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    const updated = await updatePantryItem(id, payload);

    if (!updated) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deletePantryItem(id);

  if (!deleted) {
    return NextResponse.json({ message: "Item not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
