"use client";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_URL;

const initialForm = {
  title: "",
  description: "",
  status: "planned",
};

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("items:snapshot", (nextItems) => {
      setItems(nextItems);
      setLoading(false);
    });

    fetchItems();

    return () => {
      socket.disconnect();
    };
  }, []);

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [items],
  );

  async function fetchItems() {
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        cache: "no-store",
      });
      const data = await response.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function beginEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      status: item.status,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function submitItem(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    setSubmitting(true);

    const isEditMode = Boolean(editingId);
    const endpoint = isEditMode
      ? `${API_URL}/api/items/${editingId}`
      : `${API_URL}/api/items`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          status: form.status,
        }),
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  async function removeItem(id) {
    await fetch(`${API_URL}/api/items/${id}`, {
      method: "DELETE",
    });
  }

  return (
    <main>
      <section className="hero">
        <p className="kicker">Realtime Product Board</p>
        <h1>CRUD dashboard with live team synchronization.</h1>
        <p>
          Built with Next.js on the frontend and a Node.js API with Socket.IO.
          Open this page in multiple tabs and watch updates propagate instantly.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>{editingId ? "Edit item" : "Create new item"}</h2>
          <form onSubmit={submitItem}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Add concise title"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="Add details"
              />
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value)}
              >
                <option value="planned">planned</option>
                <option value="active">active</option>
                <option value="done">done</option>
              </select>
            </div>

            <div className="actions">
              <button className="primary" disabled={submitting} type="submit">
                {submitting
                  ? editingId
                    ? "Saving..."
                    : "Creating..."
                  : editingId
                    ? "Save changes"
                    : "Create item"}
              </button>
              {editingId && (
                <button className="ghost" type="button" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="panel">
          <h2>Live items</h2>
          <div className="status">
            <span className="dot" />
            {isConnected ? "Socket connected" : "Socket reconnecting..."}
          </div>

          {loading ? (
            <div className="empty">Loading items...</div>
          ) : sortedItems.length === 0 ? (
            <div className="empty">No items yet. Create your first one.</div>
          ) : (
            <div className="list">
              {sortedItems.map((item) => (
                <section key={item.id} className="card">
                  <div className="card-header">
                    <h3>{item.title}</h3>
                    <span className="badge">{item.status}</span>
                  </div>
                  <p>{item.description || "No description added."}</p>
                  <div className="time">
                    Updated {new Date(item.updatedAt).toLocaleString()}
                  </div>
                  <div className="actions" style={{ marginTop: "0.65rem" }}>
                    <button
                      className="ghost"
                      type="button"
                      onClick={() => beginEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </section>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
