import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  CreatePantryItemInput,
  PantryItem,
  PantryStatus,
  UpdatePantryItemInput,
} from "@/types/pantry";

const DB_PATH = path.join(process.cwd(), "src", "data", "pantry.json");

async function readItems(): Promise<PantryItem[]> {
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw) as PantryItem[];
  return parsed;
}

async function writeItems(items: PantryItem[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listPantryItems(): Promise<PantryItem[]> {
  const items = await readItems();
  return items.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
}

export async function createPantryItem(
  input: CreatePantryItemInput,
): Promise<PantryItem> {
  const now = new Date().toISOString();

  const item: PantryItem = {
    id: randomUUID(),
    name: input.name.trim(),
    category: input.category,
    quantity: input.quantity,
    unit: input.unit.trim(),
    expiresAt: input.expiresAt,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const items = await readItems();
  items.push(item);
  await writeItems(items);

  return item;
}

export async function updatePantryItem(
  id: string,
  input: UpdatePantryItemInput,
): Promise<PantryItem | null> {
  const items = await readItems();
  const target = items.find((item) => item.id === id);

  if (!target) {
    return null;
  }

  if (typeof input.quantity === "number") {
    target.quantity = input.quantity;
  }

  if (input.status) {
    target.status = input.status;
  }

  target.updatedAt = new Date().toISOString();

  await writeItems(items);
  return target;
}

export async function deletePantryItem(id: string): Promise<boolean> {
  const items = await readItems();
  const nextItems = items.filter((item) => item.id !== id);

  if (nextItems.length === items.length) {
    return false;
  }

  await writeItems(nextItems);
  return true;
}

export function isPantryStatus(value: string): value is PantryStatus {
  return value === "active" || value === "used" || value === "expired";
}
