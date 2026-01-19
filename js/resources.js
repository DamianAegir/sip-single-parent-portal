// Interactions for Resources Directory

// Mobile navigation toggle
const navToggleRes = document.querySelector(".nav-toggle");
const navRes = document.querySelector(".site-nav");

if (navToggleRes && navRes) {
  navToggleRes.addEventListener("click", () => {
    const isOpen = navRes.classList.toggle("open");
    navToggleRes.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navRes) {
  navRes.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList && target.classList.contains("nav-link")) {
      navRes.classList.remove("open");
      if (navToggleRes) {
        navToggleRes.setAttribute("aria-expanded", "false");
      }
    }
  });
}

// Filtering and search
const filterButtons = document.querySelectorAll(".filter-btn");
const resourceCards = document.querySelectorAll(".resource-card");
const searchInput = document.getElementById("search-input");

function applyFilters() {
  const activeButton = document.querySelector(".filter-btn.active");
  const filter = activeButton && activeButton.getAttribute("data-filter") ? activeButton.getAttribute("data-filter") : "all";
  const query = searchInput && "value" in searchInput ? searchInput.value.trim().toLowerCase() : "";

  resourceCards.forEach((card) => {
    const category = card.getAttribute("data-category") || "";
    const name = (card.getAttribute("data-name") || "").toLowerCase();
    const location = (card.getAttribute("data-location") || "").toLowerCase();

    const matchesFilter = filter === "all" || category === filter;
    const matchesSearch = !query || name.includes(query) || location.includes(query);

    if (matchesFilter && matchesSearch) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    applyFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    applyFilters();
  });
}

