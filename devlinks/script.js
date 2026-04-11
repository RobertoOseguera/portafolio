// DevLinks - Gestor de Enlaces para Desarrolladores
// Funcionalidades: CRUD, LocalStorage, búsqueda, categorías, exportación JSON

const STORAGE_KEY = "devlinks_data";
let links = [];
let currentFilter = "all";

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadLinks();
  setupEventListeners();
  renderLinks();
});

// Load from LocalStorage
function loadLinks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    links = JSON.parse(stored);
  } else {
    // Sample data
    links = [
      {
        id: generateId(),
        url: "https://developer.mozilla.org/es/",
        title: "MDN Web Docs",
        category: "docs",
        description: "La mejor documentación para web",
      },
      {
        id: generateId(),
        url: "https://github.com/",
        title: "GitHub",
        category: "tools",
        description: "Control de versiones y colaboración",
      },
      {
        id: generateId(),
        url: "https://stackoverflow.com/",
        title: "Stack Overflow",
        category: "community",
        description: "Respuestas a tus preguntas de código",
      },
    ];
    saveLinks();
  }
}

// Save to LocalStorage
function saveLinks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Setup Event Listeners
function setupEventListeners() {
  // Form submit
  document.getElementById("linkForm").addEventListener("submit", handleAddLink);

  // Search
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);

  // Category filter
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleCategoryFilter);
  });

  // Export
  document.getElementById("exportBtn").addEventListener("click", exportLinks);

  // Edit form
  document
    .getElementById("editForm")
    .addEventListener("submit", handleEditSave);

  // Modal close on outside click
  document.getElementById("editModal").addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) closeModal();
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// Add new link
function handleAddLink(e) {
  e.preventDefault();

  const newLink = {
    id: generateId(),
    url: document.getElementById("urlInput").value.trim(),
    title: document.getElementById("titleInput").value.trim(),
    category: document.getElementById("categoryInput").value,
    description: document.getElementById("descInput").value.trim(),
  };

  links.unshift(newLink);
  saveLinks();
  renderLinks();

  // Reset form
  e.target.reset();
  showToast("Enlace agregado correctamente");
}

// Search handler
function handleSearch() {
  renderLinks();
}

// Category filter handler
function handleCategoryFilter(e) {
  const btn = e.currentTarget;
  currentFilter = btn.dataset.category;

  // Update active state
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  renderLinks();
}

// Render links
function renderLinks() {
  const grid = document.getElementById("linksGrid");
  const emptyState = document.getElementById("emptyState");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  // Filter links
  let filtered = links;

  if (currentFilter !== "all") {
    filtered = filtered.filter((link) => link.category === currentFilter);
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (link) =>
        link.title.toLowerCase().includes(searchTerm) ||
        link.url.toLowerCase().includes(searchTerm) ||
        link.description.toLowerCase().includes(searchTerm),
    );
  }

  // Update count
  document.getElementById("linkCount").textContent = `(${filtered.length})`;

  // Show/hide empty state
  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.add("show");
    return;
  }

  emptyState.classList.remove("show");

  // Render cards
  grid.innerHTML = filtered
    .map(
      (link) => `
    <div class="link-card" data-id="${link.id}">
      <div class="link-card-header">
        <span class="link-category">${getCategoryIcon(link.category)} ${getCategoryName(link.category)}</span>
        <div class="link-actions">
          <button onclick="openEditModal('${link.id}')" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete" onclick="deleteLink('${link.id}')" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <h3 class="link-title">${escapeHtml(link.title)}</h3>
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="link-url">
        <i class="fas fa-external-link-alt"></i> ${truncateUrl(link.url)}
      </a>
      ${link.description ? `<p class="link-desc">${escapeHtml(link.description)}</p>` : ""}
    </div>
  `,
    )
    .join("");
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    docs: "📚",
    tools: "🛠️",
    tutorials: "📖",
    ui: "🎨",
    apis: "🔌",
    learning: "🎓",
    community: "👥",
    other: "📌",
  };
  return icons[category] || "🔗";
}

// Get category name
function getCategoryName(category) {
  const names = {
    docs: "Docs",
    tools: "Tools",
    tutorials: "Tutoriales",
    ui: "UI/UX",
    apis: "APIs",
    learning: "Aprendizaje",
    community: "Comunidad",
    other: "Otros",
  };
  return names[category] || "Otro";
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Truncate URL for display
function truncateUrl(url) {
  const maxLen = 40;
  if (url.length <= maxLen) return url;
  return url.substring(0, maxLen) + "...";
}

// Delete link
function deleteLink(id) {
  if (confirm("¿Estás seguro de eliminar este enlace?")) {
    links = links.filter((link) => link.id !== id);
    saveLinks();
    renderLinks();
    showToast("Enlace eliminado");
  }
}

// Open edit modal
function openEditModal(id) {
  const link = links.find((l) => l.id === id);
  if (!link) return;

  document.getElementById("editId").value = link.id;
  document.getElementById("editUrl").value = link.url;
  document.getElementById("editTitle").value = link.title;
  document.getElementById("editCategory").innerHTML = `
    <option value="docs" ${link.category === "docs" ? "selected" : ""}>📚 Documentación</option>
    <option value="tools" ${link.category === "tools" ? "selected" : ""}>🛠️ Herramientas</option>
    <option value="tutorials" ${link.category === "tutorials" ? "selected" : ""}>📖 Tutoriales</option>
    <option value="ui" ${link.category === "ui" ? "selected" : ""}>🎨 UI/UX</option>
    <option value="apis" ${link.category === "apis" ? "selected" : ""}>🔌 APIs</option>
    <option value="learning" ${link.category === "learning" ? "selected" : ""}>🎓 Aprendizaje</option>
    <option value="community" ${link.category === "community" ? "selected" : ""}>👥 Comunidad</option>
    <option value="other" ${link.category === "other" ? "selected" : ""}>📌 Otros</option>
  `;
  document.getElementById("editDesc").value = link.description || "";

  document.getElementById("editModal").classList.add("show");
}

// Close modal
function closeModal() {
  document.getElementById("editModal").classList.remove("show");
}

// Handle edit save
function handleEditSave(e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const index = links.findIndex((l) => l.id === id);

  if (index === -1) return;

  links[index] = {
    id,
    url: document.getElementById("editUrl").value.trim(),
    title: document.getElementById("editTitle").value.trim(),
    category: document.getElementById("editCategory").value,
    description: document.getElementById("editDesc").value.trim(),
  };

  saveLinks();
  renderLinks();
  closeModal();
  showToast("Enlace actualizado");
}

// Export links as JSON
function exportLinks() {
  const data = JSON.stringify(links, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `devlinks-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("Backup descargado");
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
