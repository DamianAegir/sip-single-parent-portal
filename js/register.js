/**
 * Register page – form submit, create account
 */

(function () {
  'use strict';

  var form = document.getElementById('register-form');
  var errorEl = document.getElementById('register-error');

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || 'Please fill in all required fields.';
    errorEl.hidden = false;
  }

  function hideError() {
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function getFormData() {
    if (!form) return null;
    
    var formData = new FormData(form);
    var data = {};
    
    // Basic fields
    data.username = formData.get('username') || '';
    data.displayName = formData.get('displayName') || '';
    data.password = formData.get('password') || '';
    data.age = parseInt(formData.get('age') || '0', 10);
    data.occupation = formData.get('occupation') || '';
    data.location = formData.get('location') || '';
    data.children = parseInt(formData.get('children') || '0', 10);
    data.income = formData.get('income') || '';
    data.support = formData.get('support') || '';
    
    // Checkboxes
    data.challenges = formData.getAll('challenges') || [];
    
    return data;
  }

  function validateForm(data) {
    if (!data.username.trim()) {
      showError('Please enter a username.');
      return false;
    }
    if (!data.displayName.trim()) {
      showError('Please enter your display name.');
      return false;
    }
    if (!data.password || data.password.length < 6) {
      showError('Password must be at least 6 characters.');
      return false;
    }
    if (!data.age || data.age < 18) {
      showError('You must be at least 18 years old.');
      return false;
    }
    if (!data.occupation.trim()) {
      showError('Please enter your occupation.');
      return false;
    }
    if (!data.location) {
      showError('Please select your location.');
      return false;
    }
    if (!data.children || data.children < 1) {
      showError('Please enter the number of children.');
      return false;
    }
    if (!data.income) {
      showError('Please select your income range.');
      return false;
    }
    return true;
  }

  function createAvatar(displayName) {
    var initials = displayName.split(' ').map(function(n) { return n.charAt(0); }).join('').substring(0, 2).toUpperCase();
    return 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="%230F766E"/><text x="24" y="30" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-size="14" font-weight="700">' + initials + '</text></svg>'
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    hideError();

    var data = getFormData();
    if (!data) {
      showError('Form not found.');
      return;
    }

    if (!validateForm(data)) {
      return;
    }

    // Create user object
    var user = {
      username: data.username.trim().toLowerCase(),
      displayName: data.displayName.trim(),
      password: data.password, // In real app, this would be hashed
      age: data.age,
      occupation: data.occupation.trim(),
      location: data.location,
      children: data.children,
      income: data.income,
      challenges: data.challenges,
      support: data.support.trim(),
      avatar: createAvatar(data.displayName.trim()),
      communityCredits: 50, // Starting credits
    };

    // Store user (in real app, this would be sent to server)
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (auth && auth.setUser) {
      auth.setUser(user);
      
      // Auto login
      var base = auth.getBase ? auth.getBase() : '../';
      window.location.href = base + 'html/profile.html';
    } else {
      showError('Unable to create account. Please try again.');
    }
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
})();
