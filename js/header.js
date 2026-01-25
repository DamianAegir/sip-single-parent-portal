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
          '<span class="auth-user-notification-badge" id="auth-user-notification-badge" hidden>0</span>' +
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
      
      // Update notification badges after rendering
      setTimeout(updateNotificationBadge, 100);
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
    var resourcesLink = document.querySelector('.nav-resources-link');
    var dropdown = document.querySelector('.nav-resources-dropdown');
    var resourcesItem = document.querySelector('.nav-item-resources');
    if (!resourcesLink || !dropdown || !resourcesItem) return;

    // Only enable dropdown toggle on desktop (not mobile)
    var isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    
    if (!isMobile) {
      // Click functionality
      resourcesLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = dropdown.classList.toggle('open');
        resourcesLink.setAttribute('aria-expanded', String(open));
        if (open) document.addEventListener('click', closeResourcesDropdown);
        else document.removeEventListener('click', closeResourcesDropdown);
      });

      // Hover functionality
      resourcesItem.addEventListener('mouseenter', function () {
        dropdown.classList.add('open');
        resourcesLink.setAttribute('aria-expanded', 'true');
      });

      resourcesItem.addEventListener('mouseleave', function () {
        dropdown.classList.remove('open');
        resourcesLink.setAttribute('aria-expanded', 'false');
      });

      function closeResourcesDropdown() {
        dropdown.classList.remove('open');
        resourcesLink.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeResourcesDropdown);
      }
    }
  }

  function initNavToggle() {
    var navToggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    var navList = nav ? nav.querySelector('.nav-list') : null;
    if (!navToggle || !nav || !navList) return;

    function addSignOutOption() {
      // Remove existing sign out if present
      var existing = navList.querySelector('.nav-item-signout');
      if (existing) {
        existing.remove();
      }

      var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
      var isLoggedIn = auth && auth.isLoggedIn && auth.isLoggedIn();
      var isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;

      if (isLoggedIn && isMobile) {
        var signOutLi = document.createElement('li');
        signOutLi.className = 'nav-item-signout';
        signOutLi.innerHTML = '<button type="button" class="nav-link nav-signout-btn">Sign Out</button>';
        navList.appendChild(signOutLi);

        var signOutBtn = signOutLi.querySelector('.nav-signout-btn');
        if (signOutBtn) {
          signOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (auth && auth.signOut) {
              auth.signOut();
              nav.classList.remove('open');
              navToggle.setAttribute('aria-expanded', 'false');
              window.location.reload();
            }
          });
        }
      }
    }

    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        addSignOutOption();
      }
    });

    nav.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      var signOutBtn = e.target.closest ? e.target.closest('.nav-signout-btn') : null;
      if (link && (link.classList.contains('nav-link') || link.closest('.nav-resources-dropdown'))) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
      // Don't close menu when clicking sign out button (it handles its own logic)
      if (signOutBtn) {
        return;
      }
    });

    // Also add on initial load if menu is already open (shouldn't happen, but just in case)
    addSignOutOption();
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
    
    // Also update auth user badge and bottom nav badge
    var count = notif && notif.getUnreadCount ? notif.getUnreadCount() : 0;
    
    // Update auth user badge
    var authBadge = document.getElementById('auth-user-notification-badge');
    if (authBadge) {
      if (count > 0) {
        authBadge.textContent = count > 99 ? '99+' : String(count);
        authBadge.hidden = false;
      } else {
        authBadge.hidden = true;
      }
    }
    
    // Update bottom nav profile badge
    var bottomNavProfile = document.getElementById('bottom-nav-profile');
    if (bottomNavProfile) {
      var existingBadge = bottomNavProfile.querySelector('.bottom-nav-notification-badge');
      if (count > 0) {
        if (!existingBadge) {
          existingBadge = document.createElement('span');
          existingBadge.className = 'bottom-nav-notification-badge';
          bottomNavProfile.appendChild(existingBadge);
        }
        existingBadge.textContent = count > 99 ? '99+' : String(count);
        existingBadge.hidden = false;
      } else {
        if (existingBadge) {
          existingBadge.hidden = true;
        }
      }
    }
    
    // Update profile page notification badge
    var profileBadge = document.getElementById('profile-notification-badge');
    if (profileBadge) {
      if (count > 0) {
        profileBadge.textContent = count > 99 ? '99+' : String(count);
        profileBadge.hidden = false;
      } else {
        profileBadge.hidden = true;
      }
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
