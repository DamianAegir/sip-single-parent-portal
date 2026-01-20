// Interactions for Financial Aid page

// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Advanced Filters Toggle
const toggleFiltersBtn = document.getElementById("toggle-advanced-filters");
const advancedFiltersPanel = document.getElementById("advanced-filters");

if (toggleFiltersBtn && advancedFiltersPanel) {
  toggleFiltersBtn.addEventListener("click", () => {
    const isHidden = advancedFiltersPanel.classList.contains("hidden");
    if (isHidden) {
      advancedFiltersPanel.classList.remove("hidden");
      toggleFiltersBtn.textContent = "Hide Advanced Filters";
      toggleFiltersBtn.setAttribute("aria-expanded", "true");
    } else {
      advancedFiltersPanel.classList.add("hidden");
      toggleFiltersBtn.textContent = "Show Advanced Filters";
      toggleFiltersBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Pagination & Filtering Logic
const schemeCards = document.querySelectorAll(".scheme-card");
const filterForm = document.getElementById("filter-form");
const clearFiltersBtn = document.getElementById("clear-filters");
const searchInput = document.getElementById("scheme-search");
const searchBtn = document.querySelector(".search-btn");
const paginationContainer = document.getElementById("pagination-controls");
const filterResults = document.getElementById("filter-results");

const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let visibleCards = []; // Array of card elements that match current filters

function init() {
  visibleCards = Array.from(schemeCards);
  renderPage(1);
  setupPagination();
  
  // Update results text on initial load - always show total
  if (filterResults) {
    const totalSchemes = schemeCards.length;
    filterResults.innerHTML = `Showing all <strong>${totalSchemes}</strong> result${totalSchemes !== 1 ? 's' : ''}`;
    filterResults.style.display = "";
  }
}

function filterSchemes() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  
  // Advanced Filter Values
  const workingStatus = document.getElementById("working-status")?.value || "";
  const householdIncome = document.getElementById("household-income")?.value || "";
  const childAge = document.getElementById("child-age")?.value || "";
  const supportType = document.getElementById("support-type")?.value || "";

  visibleCards = [];

  schemeCards.forEach((card) => {
    let matches = true;

    // 1. Text Search
    if (query) {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const summary = card.querySelector(".scheme-summary")?.textContent.toLowerCase() || "";
      if (!title.includes(query) && !summary.includes(query)) {
        matches = false;
      }
    }

    // 2. Advanced Filters (only if selected)
    if (matches && workingStatus) {
      const data = card.getAttribute("data-working") || "";
      if (!data.includes(workingStatus)) matches = false;
    }
    if (matches && householdIncome) {
      const data = card.getAttribute("data-income") || "";
      if (!data.includes(householdIncome)) matches = false;
    }
    if (matches && childAge) {
      const data = card.getAttribute("data-age") || "";
      if (!data.includes(childAge)) matches = false;
    }
    if (matches && supportType) {
      const data = card.getAttribute("data-support") || "";
      if (!data.includes(supportType)) matches = false;
    }

    if (matches) {
      visibleCards.push(card);
    }
  });

  // Reset to page 1 after filtering
  renderPage(1);
  setupPagination();
  
  // Update result text - always show total count
  if (filterResults) {
    const totalSchemes = schemeCards.length;
    if (visibleCards.length === totalSchemes && !query && !workingStatus && !householdIncome && !childAge && !supportType) {
      filterResults.innerHTML = `Showing all <strong>${totalSchemes}</strong> result${totalSchemes !== 1 ? 's' : ''}`;
      filterResults.style.display = ""; // Ensure it's visible
    } else {
      filterResults.innerHTML = `Showing <strong>${visibleCards.length}</strong> of <strong>${totalSchemes}</strong> result${totalSchemes !== 1 ? 's' : ''}`;
      filterResults.style.display = ""; // Ensure it's visible
    }
  }
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  // First hide all cards
  schemeCards.forEach(card => card.classList.add("hidden"));

  // Show only visible cards for this page
  const cardsToShow = visibleCards.slice(start, end);
  cardsToShow.forEach(card => card.classList.remove("hidden"));
  
  // Scroll to top of grid if not initial load
  if (window.scrollY > 200) {
    const grid = document.getElementById("scheme-list");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  
  updatePaginationButtons();
}

function setupPagination() {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(visibleCards.length / ITEMS_PER_PAGE);

  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  }
  
  paginationContainer.style.display = "flex";

  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "←";
  prevBtn.className = "page-btn";
  prevBtn.onclick = () => {
    if (currentPage > 1) renderPage(currentPage - 1);
  };
  paginationContainer.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.onclick = () => renderPage(i);
    paginationContainer.appendChild(btn);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "→";
  nextBtn.className = "page-btn";
  nextBtn.onclick = () => {
    if (currentPage < totalPages) renderPage(currentPage + 1);
  };
  paginationContainer.appendChild(nextBtn);
}

function updatePaginationButtons() {
  const btns = paginationContainer.querySelectorAll(".page-btn");
  const totalPages = Math.ceil(visibleCards.length / ITEMS_PER_PAGE);
  
  btns.forEach(btn => {
    // Update active state
    if (btn.textContent == currentPage) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
    
    // Disable Prev/Next if at bounds
    if (btn.textContent === "←") {
      btn.disabled = currentPage === 1;
    }
    if (btn.textContent === "→") {
      btn.disabled = currentPage === totalPages;
    }
  });
}

// Event Listeners
if (filterForm) {
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterSchemes();
  });
  
  filterForm.addEventListener("reset", () => {
    setTimeout(filterSchemes, 10); // Wait for form reset
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", filterSchemes);
}

if (searchInput) {
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") filterSchemes();
  });
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    setTimeout(filterSchemes, 10);
  });
}

// Initial Load
document.addEventListener("DOMContentLoaded", init);
