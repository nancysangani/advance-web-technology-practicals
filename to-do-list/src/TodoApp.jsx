import React from "react";

export default function TodoApp({ title, initialTasks }) {
  const [newToDo, setNewToDo] = React.useState("");
  const [list, setList] = React.useState(initialTasks || []);
  const [filter, setFilter] = React.useState("all");
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editText, setEditText] = React.useState("");

  const afterSubmit = (e) => {
    e.preventDefault();
    if (newToDo.trim() !== "") {
      setList([...list, { text: newToDo, complete: false }]);
      setNewToDo("");
    }
  };

  const deleteTask = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setList(list.map((todo, i) =>
      i === index ? { ...todo, complete: !todo.complete } : todo
    ));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(list[index].text);
  };

  const saveEdit = (index) => {
    if (editText.trim() !== "") {
      setList(list.map((todo, i) =>
        i === index ? { ...todo, text: editText } : todo
      ));
    }
    setEditingIndex(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const clearCompleted = () => {
    setList(list.filter((todo) => !todo.complete));
  };

  const filteredList = list.filter((todo) => {
    if (filter === "active") return !todo.complete;
    if (filter === "completed") return todo.complete;
    return true;
  });

  const activeCount = list.filter((t) => !t.complete).length;
  const completedCount = list.filter((t) => t.complete).length;

  return (
    <div className="app-wrapper">
      <div className="todo-card">
        <h1 className="todo-title">{title}</h1>

        <form className="todo-form" onSubmit={afterSubmit}>
          <input
            className="todo-input"
            type="text"
            placeholder="Add a new task…"
            value={newToDo}
            onChange={(e) => setNewToDo(e.target.value)}
          />
          <button className="todo-add-btn" type="submit">Add</button>
        </form>

        <div className="filter-bar">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className="todo-list">
          {filteredList.length === 0 && (
            <li className="empty-state">Nothing here!</li>
          )}
          {filteredList.map((todo, index) => {
            const realIndex = list.indexOf(todo);
            return (
              <li key={index} className={`todo-item ${todo.complete ? "done" : ""}`}>
                <button
                  className={`check-btn ${todo.complete ? "checked" : ""}`}
                  onClick={() => toggleComplete(index)}
                  aria-label="Toggle complete"
                >
                  {todo.complete ? "✓" : ""}
                </button>

                {editingIndex === index ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(realIndex);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}

                <div className="todo-actions">
                  {editingIndex === realIndex ? (
                    <>
                      <button className="action-btn save-btn" onClick={() => saveEdit(realIndex)}>Save</button>
                      <button className="action-btn cancel-btn" onClick={cancelEdit}>✕</button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn edit-btn" onClick={() => startEdit(realIndex)}>Edit</button>
                      <button className="action-btn delete-btn" onClick={() => deleteTask(realIndex)}>Delete</button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="todo-footer">
          <span className="task-count">{activeCount} task{activeCount !== 1 ? "s" : ""} left</span>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed ({completedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}