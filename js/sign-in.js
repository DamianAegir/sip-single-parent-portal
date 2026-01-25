/**
 * Sign-in page – form submit, redirect
 */

(function () {
  'use strict';

  var form = document.getElementById('sign-in-form');
  var errorEl = document.getElementById('sign-in-error');

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || 'Invalid username or password.';
    errorEl.hidden = false;
  }

  function hideError() {
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    hideError();

    var username = (form && form.querySelector('[name="username"]')) && form.querySelector('[name="username"]').value;
    var password = (form && form.querySelector('[name="password"]')) && form.querySelector('[name="password"]').value;

    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (!auth || !auth.signIn) {
      showError('Auth not available.');
      return;
    }

    var user = auth.signIn(username, password);
    if (user) {
      var base = auth.getBase ? auth.getBase() : '../';
      var returnTo = (typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.getItem('trellis_return')) || base + 'index.html';
      try {
        if (window.sessionStorage) window.sessionStorage.removeItem('trellis_return');
      } catch (err) {}
      window.location.href = returnTo;
      return;
    }

    showError('Invalid username or password. Please use the demo account.');
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
})();
