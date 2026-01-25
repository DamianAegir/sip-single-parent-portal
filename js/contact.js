// Interactions for Contact & Support page
// Nav toggle is handled by header.js

// Simple client-side form validation
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");
const formSuccess = document.getElementById("form-success");

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    if (!nameInput || !emailInput || !messageInput) {
      return;
    }

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = "Please enter your name.";
      isValid = false;
    } else if (nameError) {
      nameError.textContent = "";
    }

    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = "Please enter your email.";
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    } else if (emailError) {
      emailError.textContent = "";
    }

    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = "Please enter a short message.";
      isValid = false;
    } else if (messageError) {
      messageError.textContent = "";
    }

    if (!formSuccess) return;

    if (!isValid) {
      formSuccess.textContent = "";
      return;
    }

    formSuccess.textContent =
      "Thank you for reaching out. This demo form does not send emails, but your message has been recorded locally.";
    contactForm.reset();
  });
}

