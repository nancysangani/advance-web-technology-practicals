export type PantryCategory =
  | "produce"
  | "dairy"
  | "protein"
  | "grains"
  | "snacks"
  | "other";

export type PantryStatus = "active" | "used" | "expired";

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  expiresAt: string;
  status: PantryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePantryItemInput {
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  expiresAt: string;
}

export interface UpdatePantryItemInput {
  status?: PantryStatus;
  quantity?: number;
}
