/**
 * Header: auth UI (Sign in vs user menu), Resources dropdown, Village visibility
 * Include auth.js before this. Expects #header-auth and .nav-item-village in DOM.
 */

(function () {
  'use strict';

  var base = typeof TrellisAuth !== 'undefined' && TrellisAuth.getBase ? TrellisAuth.getBase() : '';
  var inHtml = base === '../';

  function authHref(name) {
    return inHtml ? name : 'html/' + name;
  }

  function renderSignIn() {
    return '<div class="header-auth-buttons">' +
      '<a href="' + authHref('login.html') + '" class="btn btn-secondary header-sign-in">Login</a>' +
      '<a href="' + authHref('register.html') + '" class="btn btn-primary header-sign-up">Sign up</a>' +
      '</div>';
  }

  function getInitials(name) {
    if (!name || !String(name).trim()) return '?';
    var parts = String(name).trim().split(/\s+/);
    var s = parts.map(function (p) { return p.charAt(0); }).join('').toUpperCase();
    return s.length ? s.substring(0, 3) : (name.charAt(0) || '?');
  }

  function renderUserMenu(user) {
    var name = (user && user.displayName) || 'User';
    var initials = getInitials(name);
    var avatar = '<span class="auth-avatar auth-avatar-initials" aria-hidden="true">' + escapeHtml(initials) + '</span>';
    return (
      '<div class="auth-user-wrapper">' +
        '<button type="button" class="auth-user-trigger" aria-expanded="false" aria-haspopup="true" aria-label="Account menu">' +
          avatar +
          '<span class="auth-user-name">' + escapeHtml(name) + '</span>' +
          '<span class="auth-user-chevron" aria-hidden="true">▾</span>' +
        '</button>' +
        '<div class="auth-dropdown" hidden>' +
          '<a href="' + authHref('notifications.html') + '" class="auth-dropdown-item">' +
            'Notifications' +
            '<span class="notification-badge" id="header-notification-badge" hidden>0</span>' +
          '</a>' +
          '<a href="' + authHref('profile.html') + '" class="auth-dropdown-item">Profile</a>' +
          '<button type="button" class="auth-dropdown-item auth-dropdown-signout">Sign out</button>' +
        '</div>' +
      '</div>'
    );
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderAuth() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    var container = document.getElementById('header-auth');
    if (!container) return;

    if (auth && auth.isLoggedIn && auth.isLoggedIn()) {
      var user = auth.getCurrentUser && auth.getCurrentUser();
      container.innerHTML = renderUserMenu(user);
      container.classList.add('auth-logged-in');
      container.classList.remove('auth-guest');

      var trigger = container.querySelector('.auth-user-trigger');
      var dropdown = container.querySelector('.auth-dropdown');
      var signOut = container.querySelector('.auth-dropdown-signout');

      if (trigger && dropdown) {
        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          var open = dropdown.hidden;
          dropdown.hidden = !open;
          trigger.setAttribute('aria-expanded', String(!open));
          if (open) {
            document.addEventListener('click', closeAuthDropdown);
          } else {
            document.removeEventListener('click', closeAuthDropdown);
          }
        });
      }

      function closeAuthDropdown() {
        if (dropdown) dropdown.hidden = true;
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeAuthDropdown);
      }

      if (signOut) {
        signOut.addEventListener('click', function () {
          if (auth && auth.signOut) auth.signOut();
          closeAuthDropdown();
          window.location.reload();
        });
      }
    } else {
      container.innerHTML = renderSignIn();
      container.classList.remove('auth-logged-in');
      container.classList.add('auth-guest');
    }
  }

  function setVillageVisibility() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    var loggedIn = !!(auth && auth.isLoggedIn && auth.isLoggedIn());
    var body = document.body;
    if (body) {
      if (loggedIn) body.classList.add('logged-in'); else body.classList.remove('logged-in');
    }
    var village = document.querySelector('.nav-item-village');
    if (village) {
      village.style.display = loggedIn ? '' : 'none';
    }
  }

  function initResourcesDropdown() {
    var trigger = document.querySelector('.nav-resources-toggle');
    var dropdown = document.querySelector('.nav-resources-dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
      if (open) document.addEventListener('click', closeResourcesDropdown);
      else document.removeEventListener('click', closeResourcesDropdown);
    });

    function closeResourcesDropdown() {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', closeResourcesDropdown);
    }
  }

  function initNavToggle() {
    var navToggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link && (link.classList.contains('nav-link') || link.closest('.nav-resources-dropdown'))) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function setBottomNavProfile() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    var loggedIn = !!(auth && auth.isLoggedIn && auth.isLoggedIn());
    var profileLinks = document.querySelectorAll('#bottom-nav-profile');
    var mobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;

    profileLinks.forEach(function (link) {
      if (!link) return;
      if (mobile) {
        link.style.display = '';
        link.href = loggedIn ? authHref('profile.html') : authHref('login.html');
      } else {
        link.style.display = loggedIn ? '' : 'none';
        link.href = authHref('profile.html');
      }
    });
  }

  function updateNotificationBadge() {
    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif && notif.updateBadge) {
      notif.updateBadge();
    }
  }

  function init() {
    renderAuth();
    setVillageVisibility();
    setBottomNavProfile();
    initResourcesDropdown();
    initNavToggle();
    updateNotificationBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
