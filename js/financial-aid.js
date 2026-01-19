// Interactions for Financial Aid page

// Mobile navigation toggle
const navToggleFa = document.querySelector(".nav-toggle");
const navFa = document.querySelector(".site-nav");

if (navToggleFa && navFa) {
  navToggleFa.addEventListener("click", () => {
    const isOpen = navFa.classList.toggle("open");
    navToggleFa.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navFa) {
  navFa.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList && target.classList.contains("nav-link")) {
      navFa.classList.remove("open");
      if (navToggleFa) {
        navToggleFa.setAttribute("aria-expanded", "false");
      }
    }
  });
}

// Simple eligibility checker
const eligibilityForm = document.getElementById("eligibility-form");
const resultBox = document.getElementById("eligibility-result");

if (eligibilityForm) {
  eligibilityForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const workingEl = document.getElementById("working-status");
    const childAgeEl = document.getElementById("child-age");
    const educationEl = document.getElementById("education-level");

    const workingStatus = workingEl && "value" in workingEl ? workingEl.value : "";
    const childAge = childAgeEl && "value" in childAgeEl ? childAgeEl.value : "";
    const educationLevel = educationEl && "value" in educationEl ? educationEl.value : "";

    if (!resultBox) return;

    if (!workingStatus || !childAge || !educationLevel) {
      resultBox.innerHTML =
        "<strong>Please answer all questions.</strong><span>We can only give a suggestion when each field is filled in.</span>";
      return;
    }

    let suggestion = "";
    let reason = "";

    if ((workingStatus === "not-working" || workingStatus === "part-time") && childAge === "no") {
      suggestion = "ComCare Short-to-Medium Term Assistance";
      reason =
        "Because you are not working or have irregular work and may need help with daily expenses, ComCare is a common starting point for short- to medium-term support.";
    } else if (childAge === "yes") {
      suggestion = "KidSTART";
      reason =
        "Since you have a young child below 7, KidSTART may support your child's early development and your parenting journey.";
    } else if (educationLevel === "yes") {
      suggestion = "Higher Education Community Bursary";
      reason =
        "Because you are supporting a child in secondary school or higher education, the bursary can help with school fees and living costs.";
    } else {
      suggestion = "ComCare or a Family Service Centre";
      reason =
        "You may benefit from speaking with a Social Service Office or Family Service Centre to explore ComCare and other schemes together.";
    }

    resultBox.innerHTML =
      "<strong>Suggested starting point: " +
      suggestion +
      "</strong><span>" +
      reason +
      "</span><p>This is only a guide. An officer or social worker will assess your actual eligibility.</p>";
  });
}

