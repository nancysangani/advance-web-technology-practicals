const socket = io();

const joinForm = document.getElementById("join-form");
const usernameInput = document.getElementById("username");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const notifyForm = document.getElementById("notify-form");
const notifyInput = document.getElementById("notify-input");
const messagesEl = document.getElementById("messages");
const onlineUsersEl = document.getElementById("online-users");
const presencePanel = document.getElementById("presence-panel");
const typingIndicator = document.getElementById("typing-indicator");
const statusDot = document.getElementById("status-dot");
const toastStack = document.getElementById("toast-stack");

let selfName = "";
let typingTimer = null;
const activeTypers = new Set();

function timeString(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function appendMessage(message, kind = "other") {
  const node = document.createElement("article");
  node.className = `msg ${kind}`;

  if (kind === "system") {
    node.textContent = message.text;
  } else {
    node.innerHTML = `
      <span class="meta">${message.username} • ${timeString(message.timestamp)}</span>
      <span>${message.text}</span>
    `;
  }

  messagesEl.appendChild(node);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showToast({ title, body, by }) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><span>${body} <em>by ${by}</em></span>`;
  toastStack.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4200);
}

function updateTypingLabel() {
  if (activeTypers.size === 0) {
    typingIndicator.textContent = "Nobody is typing";
    return;
  }

  const names = Array.from(activeTypers);
  typingIndicator.textContent =
    names.length === 1
      ? `${names[0]} is typing...`
      : `${names.slice(0, 2).join(", ")} and others are typing...`;
}

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const candidate = usernameInput.value.trim();
  if (!candidate) {
    return;
  }

  selfName = candidate.slice(0, 24);
  socket.emit("join", selfName);

  joinForm.classList.add("hidden");
  messageForm.classList.remove("hidden");
  notifyForm.classList.remove("hidden");
  presencePanel.classList.remove("hidden");
  statusDot.classList.add("online");

  messageInput.focus();
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) {
    return;
  }

  socket.emit("chat-message", text);
  socket.emit("typing", false);
  messageInput.value = "";
  messageInput.focus();
});

messageInput.addEventListener("input", () => {
  if (!selfName) {
    return;
  }

  socket.emit("typing", true);
  if (typingTimer) {
    clearTimeout(typingTimer);
  }

  typingTimer = setTimeout(() => {
    socket.emit("typing", false);
  }, 850);
});

notifyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = notifyInput.value.trim();
  if (!text) {
    return;
  }

  socket.emit("notify-all", text);
  notifyInput.value = "";
  notifyInput.focus();
});

socket.on("connect", () => {
  statusDot.classList.add("online");
});

socket.on("disconnect", () => {
  statusDot.classList.remove("online");
  typingIndicator.textContent = "Connection lost, reconnecting...";
});

socket.on("history", (history) => {
  messagesEl.innerHTML = "";
  history.forEach((msg) => {
    appendMessage(msg, msg.username === selfName ? "self" : "other");
  });
});

socket.on("chat-message", (message) => {
  const kind = message.username === selfName ? "self" : "other";
  appendMessage(message, kind);
});

socket.on("system", (event) => {
  appendMessage(event, "system");
});

socket.on("presence", (users) => {
  onlineUsersEl.innerHTML = "";
  users.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name === selfName ? `${name} (you)` : name;
    onlineUsersEl.appendChild(li);
  });
});

socket.on("typing", ({ username, isTyping }) => {
  if (isTyping) {
    activeTypers.add(username);
  } else {
    activeTypers.delete(username);
  }

  updateTypingLabel();
});

socket.on("notification", (payload) => {
  showToast(payload);
});
