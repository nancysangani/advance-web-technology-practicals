"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PantryCategory, PantryItem, PantryStatus } from "@/types/pantry";

const categories: PantryCategory[] = [
  "produce",
  "dairy",
  "protein",
  "grains",
  "snacks",
  "other",
];

const statusOptions: PantryStatus[] = ["active", "used", "expired"];

const categoryLabel: Record<PantryCategory, string> = {
  produce: "Produce",
  dairy: "Dairy",
  protein: "Protein",
  grains: "Grains",
  snacks: "Snacks",
  other: "Other",
};

function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil((target.getTime() - now.getTime()) / oneDay);
}

export default function Home() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | PantryCategory>(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<"all" | PantryStatus>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "produce" as PantryCategory,
    quantity: 1,
    unit: "pcs",
    expiresAt: "",
  });

  async function fetchItems() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pantry", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load pantry data.");
      }

      const data = (await res.json()) as PantryItem[];
      setItems(data);
    } catch {
      setError("Could not load your pantry right now. Please retry.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchQuery = item.name
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      const matchCategory =
        filterCategory === "all" || item.category === filterCategory;
      const matchStatus =
        filterStatus === "all" || item.status === filterStatus;
      return matchQuery && matchCategory && matchStatus;
    });
  }, [items, query, filterCategory, filterStatus]);

  const metrics = useMemo(() => {
    const soon = items.filter(
      (item) => item.status === "active" && daysUntil(item.expiresAt) <= 3,
    ).length;
    const active = items.filter((item) => item.status === "active").length;
    const used = items.filter((item) => item.status === "used").length;
    return { soon, active, used, total: items.length };
  }, [items]);

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? "Could not add item.");
      }

      setForm({
        name: "",
        category: "produce",
        quantity: 1,
        unit: "pcs",
        expiresAt: "",
      });
      await fetchItems();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not add item.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: PantryStatus) {
    const res = await fetch(`/api/pantry/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      await fetchItems();
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/pantry/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchItems();
    }
  }

  return (
    <main className="min-h-screen w-full bg-canvas px-4 py-10 text-ink sm:px-8">
      <section className="mx-auto grid w-full max-w-6xl gap-7 lg:grid-cols-[1.05fr_1.35fr]">
        <aside className="card rise-in space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-ink-muted">
              Smart Pantry Planner
            </p>
            <h1 className="mt-2 text-4xl font-display leading-[1.05] sm:text-5xl">
              Cut kitchen waste before it happens.
            </h1>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
              Track what you bought, what expires soon, and what was actually
              used. This mini full-stack app helps households save money and
              reduce food waste.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="metric-card">
              <p>Total</p>
              <strong>{metrics.total}</strong>
            </div>
            <div className="metric-card">
              <p>Active</p>
              <strong>{metrics.active}</strong>
            </div>
            <div className="metric-card">
              <p>Expiring Soon</p>
              <strong>{metrics.soon}</strong>
            </div>
            <div className="metric-card">
              <p>Used</p>
              <strong>{metrics.used}</strong>
            </div>
          </div>

          <form
            onSubmit={handleAddItem}
            className="space-y-3 rounded-2xl bg-white/70 p-4"
          >
            <h2 className="text-lg font-semibold">Add Pantry Item</h2>
            <input
              className="input"
              placeholder="Item name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
              minLength={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="input"
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    category: event.target.value as PantryCategory,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel[category]}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="input"
                value={form.quantity}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    quantity: Number(event.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Unit (e.g. kg, pcs)"
                value={form.unit}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, unit: event.target.value }))
                }
                required
              />
              <input
                className="input"
                type="date"
                value={form.expiresAt}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    expiresAt: event.target.value,
                  }))
                }
                required
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="cta">
              {isSubmitting ? "Saving..." : "Add Item"}
            </button>
          </form>
        </aside>

        <section className="card rise-in [animation-delay:140ms]">
          <div className="flex flex-col gap-3 border-b border-ink-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-display">Pantry Inventory</h2>
            <div className="flex flex-wrap gap-2">
              <input
                className="input min-w-44"
                placeholder="Search item"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                className="input"
                value={filterCategory}
                onChange={(event) =>
                  setFilterCategory(
                    event.target.value as "all" | PantryCategory,
                  )
                }
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel[category]}
                  </option>
                ))}
              </select>
              <select
                className="input"
                value={filterStatus}
                onChange={(event) =>
                  setFilterStatus(event.target.value as "all" | PantryStatus)
                }
              >
                <option value="all">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

          {isLoading ? (
            <p className="mt-6 text-ink-soft">Loading inventory...</p>
          ) : visibleItems.length === 0 ? (
            <p className="mt-6 text-ink-soft">
              No items match your filters yet.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {visibleItems.map((item) => {
                const days = daysUntil(item.expiresAt);
                const urgency =
                  days < 0
                    ? "Overdue"
                    : days <= 3
                      ? `${days} day${days === 1 ? "" : "s"} left`
                      : `Good for ${days} days`;

                return (
                  <li key={item.id} className="item-row">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-ink-soft">
                        {item.quantity} {item.unit} •{" "}
                        {categoryLabel[item.category]} • {urgency}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        className="input"
                        onChange={(event) =>
                          handleStatusChange(
                            item.id,
                            event.target.value as PantryStatus,
                          )
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg border border-ink-border px-3 py-2 text-sm transition hover:bg-black hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
