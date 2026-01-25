// Interactions for Resources Directory

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
  // Nav toggle is handled by header.js

  // Advanced Filters Toggle
  const toggleFiltersBtn = document.getElementById("toggle-advanced-filters");
  const advancedFiltersPanel = document.getElementById("advanced-filters");

  if (toggleFiltersBtn && advancedFiltersPanel) {
    // Ensure panel starts hidden
    advancedFiltersPanel.classList.add("hidden");
    
    toggleFiltersBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
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

  // Geolocation Logic
  const useLocationBtn = document.getElementById("use-location-btn");
  const locationSelect = document.getElementById("location-filter");

  // Coordinates for Singapore Locations (Approximate)
  const LOCATION_COORDS = {
    "Ang Mo Kio": { lat: 1.3691, lon: 103.8454 },
    "Bedok": { lat: 1.3236, lon: 103.9273 },
    "Bukit Batok": { lat: 1.3590, lon: 103.7637 },
    "Choa Chu Kang": { lat: 1.3840, lon: 103.7470 },
    "Clementi": { lat: 1.3162, lon: 103.7649 },
    "Hougang": { lat: 1.3612, lon: 103.8863 },
    "Jurong": { lat: 1.3329, lon: 103.7436 },
    "Jurong East": { lat: 1.3333, lon: 103.7424 },
    "Pasir Ris": { lat: 1.3721, lon: 103.9474 },
    "Punggol": { lat: 1.4052, lon: 103.9024 },
    "Sengkang": { lat: 1.3868, lon: 103.8914 },
    "Tampines": { lat: 1.3521, lon: 103.9298 },
    "Woodlands": { lat: 1.4382, lon: 103.7890 },
    "Yishun": { lat: 1.4304, lon: 103.8354 }
  };

  function findNearestLocation(lat, lon) {
    let nearestLoc = null;
    let minDistance = Infinity;

    for (const [locName, coords] of Object.entries(LOCATION_COORDS)) {
      const dist = getDistanceFromLatLonInKm(lat, lon, coords.lat, coords.lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearestLoc = locName;
      }
    }
    return nearestLoc;
  }

  // Haversine formula to calculate distance
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  if (useLocationBtn && locationSelect) {
    useLocationBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!navigator.geolocation) {
        var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
        if (notif && notif.add) {
          notif.add('warning', 'Location Not Supported', 'Geolocation is not supported by your browser.');
        }
        return;
      }

      useLocationBtn.textContent = "Locating...";
      useLocationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          
          const nearest = findNearestLocation(userLat, userLon);
          
          if (nearest) {
            locationSelect.value = nearest;
            // Trigger change event to ensure select updates
            locationSelect.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Show filters if they are hidden so user sees the change
            if (advancedFiltersPanel && advancedFiltersPanel.classList.contains("hidden")) {
              advancedFiltersPanel.classList.remove("hidden");
              if (toggleFiltersBtn) {
                toggleFiltersBtn.textContent = "Hide Advanced Filters";
                toggleFiltersBtn.setAttribute("aria-expanded", "true");
              }
            }
            
            // Small delay to ensure DOM is updated, then filter
            setTimeout(() => {
              filterResources();
              alert(`Location found! Nearest area: ${nearest}. Resources filtered accordingly.`);
            }, 50);
          } else {
            alert("Could not determine nearest location.");
          }
          useLocationBtn.textContent = "📍 Use My Location";
          useLocationBtn.disabled = false;
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMsg = "Unable to retrieve your location. ";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg += "Please allow location access in your browser settings.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg += "Location information is unavailable.";
          } else {
            errorMsg += "Please check your browser settings.";
          }
          var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
          if (notif && notif.add) {
            notif.add('error', 'Location Error', errorMsg);
          }
          useLocationBtn.textContent = "📍 Use My Location";
          useLocationBtn.disabled = false;
        }
      );
    });
  }

  // Filtering Logic (No Pagination - Show All Results)
  const resourceCards = document.querySelectorAll(".resource-card");
  const resourceFilterForm = document.getElementById("resource-filter-form");
  const clearResourceFiltersBtn = document.getElementById("clear-resource-filters");
  const searchInput = document.getElementById("resource-search");
  const searchBtn = document.querySelector(".search-btn");
  const paginationContainer = document.getElementById("pagination-controls");
  const resourceFilterResults = document.getElementById("resource-filter-results");

  function init() {
    // Hide pagination container
    if (paginationContainer) {
      paginationContainer.style.display = "none";
    }
    // Pre-fill location from profile when logged in
    var auth = typeof TrellisAuth !== "undefined" ? TrellisAuth : null;
    if (auth && auth.isLoggedIn && auth.isLoggedIn() && locationSelect) {
      var user = auth.getCurrentUser && auth.getCurrentUser();
      var loc = user && user.location ? user.location : "";
      if (loc) {
        locationSelect.value = loc;
        if (advancedFiltersPanel && advancedFiltersPanel.classList.contains("hidden")) {
          advancedFiltersPanel.classList.remove("hidden");
          if (toggleFiltersBtn) {
            toggleFiltersBtn.textContent = "Hide Advanced Filters";
            toggleFiltersBtn.setAttribute("aria-expanded", "true");
          }
        }
      }
    }
    filterResources();
  }

  function filterResources() {
    // Get fresh references to all cards each time (in case DOM changes)
    const allCards = document.querySelectorAll(".resource-card");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    
    // Advanced Filter Values - get fresh references each time
    const resourceTypeEl = document.getElementById("resource-type");
    const locationEl = document.getElementById("location-filter");
    const availabilityEl = document.getElementById("availability-filter");
    const costEl = document.getElementById("cost-filter");
    
    const resourceType = resourceTypeEl ? resourceTypeEl.value : "";
    const location = locationEl ? locationEl.value : "";
    const availability = availabilityEl ? availabilityEl.value : "";
    const cost = costEl ? costEl.value : "";

    let visibleCount = 0;

    allCards.forEach((card) => {
      let matches = true;

      // 1. Text Search - must match if query exists
      if (query) {
        const text = card.textContent.toLowerCase();
        if (!text.includes(query)) {
          matches = false;
        }
      }

      // 2. Resource Type Filter - must match exactly
      if (matches && resourceType) {
        const category = card.getAttribute("data-category") || "";
        if (category !== resourceType) {
          matches = false;
        }
      }

      // 3. Location Filter - must match exactly
      if (matches && location) {
        const loc = card.getAttribute("data-location") || "";
        if (loc !== location) {
          matches = false;
        }
      }

      // 4. Availability Filter - check if value is included in data attribute
      if (matches && availability) {
        const avail = card.getAttribute("data-availability") || "";
        if (!avail.includes(availability)) {
          matches = false;
        }
      }

      // 5. Cost Filter - check if value is included in data attribute
      if (matches && cost) {
        const c = card.getAttribute("data-cost") || "";
        if (!c.includes(cost)) {
          matches = false;
        }
      }

      // Show or hide card based on match - use both class and style for reliability
      if (matches) {
        card.classList.remove("hidden");
        card.style.display = "";
        visibleCount++;
      } else {
        card.classList.add("hidden");
        card.style.display = "none";
      }
    });

    // Update results message - always show total
    if (resourceFilterResults) {
      const totalCards = allCards.length;
      if (visibleCount === totalCards && !query && !resourceType && !location && !availability && !cost) {
        resourceFilterResults.innerHTML = `Showing all <strong>${totalCards}</strong> result${totalCards !== 1 ? 's' : ''}`;
      } else {
        resourceFilterResults.innerHTML = `Showing <strong>${visibleCount}</strong> of <strong>${totalCards}</strong> result${totalCards !== 1 ? 's' : ''}`;
      }
    }

    // Scroll to top of results if filters were applied
    if (window.scrollY > 200 && (query || resourceType || location || availability || cost)) {
      const grid = document.getElementById("resource-list");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  
  // Add change listeners to all filter dropdowns for real-time filtering
  const resourceTypeEl = document.getElementById("resource-type");
  const availabilityEl = document.getElementById("availability-filter");
  const costEl = document.getElementById("cost-filter");

  if (resourceTypeEl) {
    resourceTypeEl.addEventListener("change", filterResources);
  }
  if (locationSelect) {
    locationSelect.addEventListener("change", filterResources);
  }
  if (availabilityEl) {
    availabilityEl.addEventListener("change", filterResources);
  }
  if (costEl) {
    costEl.addEventListener("change", filterResources);
  }

  if (resourceFilterForm) {
    resourceFilterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      filterResources();
    });
    
    resourceFilterForm.addEventListener("reset", () => {
      // Clear all filter values
      if (searchInput) searchInput.value = "";
      if (resourceTypeEl) resourceTypeEl.value = "";
      if (locationSelect) locationSelect.value = "";
      if (availabilityEl) availabilityEl.value = "";
      if (costEl) costEl.value = "";
      setTimeout(filterResources, 10);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", filterResources);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") filterResources();
    });
    
    // Also filter on input for real-time search
    searchInput.addEventListener("input", filterResources);
  }

  if (clearResourceFiltersBtn) {
    clearResourceFiltersBtn.addEventListener("click", () => {
      // Clear all filter values
      if (searchInput) searchInput.value = "";
      if (resourceTypeEl) resourceTypeEl.value = "";
      if (locationSelect) locationSelect.value = "";
      if (availabilityEl) availabilityEl.value = "";
      if (costEl) costEl.value = "";
      filterResources();
    });
  }

  // Initialize after all event listeners are set up
  init();
});
