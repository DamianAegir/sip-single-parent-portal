/**
 * Profile page – show user info, redirect to sign-in if not logged in
 */

(function () {
  'use strict';

  var base = typeof TrellisAuth !== 'undefined' && TrellisAuth.getBase ? TrellisAuth.getBase() : '';
  var inHtml = base === '../';

  function profileHref(path) {
    return inHtml ? path : 'html/' + path;
  }

  function init() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (!auth || !auth.isLoggedIn || !auth.isLoggedIn()) {
      try {
        if (window.sessionStorage) window.sessionStorage.setItem('trellis_return', window.location.href);
      } catch (e) {}
      window.location.href = profileHref('login.html');
      return;
    }

    var user = auth.getCurrentUser && auth.getCurrentUser();
    var nameEl = document.getElementById('profile-name');
    var usernameEl = document.getElementById('profile-username');
    var avatarWrap = document.getElementById('profile-avatar-wrap');
    var pointsEl = document.getElementById('profile-points-value');
    var ageEl = document.getElementById('profile-age');
    var occupationEl = document.getElementById('profile-occupation');
    var childrenEl = document.getElementById('profile-children');
    var locationEl = document.getElementById('profile-location');

    if (user) {
      if (nameEl) nameEl.textContent = user.displayName || 'User';
      if (usernameEl) usernameEl.textContent = '@' + (user.username || '');
      if (pointsEl) pointsEl.textContent = user.communityCredits || user.villagePoints || '50';
      if (ageEl) ageEl.textContent = user.age ? user.age + ' years old' : '—';
      if (occupationEl) occupationEl.textContent = user.occupation || '—';
      if (childrenEl) childrenEl.textContent = user.children ? user.children + ' child' + (user.children > 1 ? 'ren' : '') : '—';
      if (locationEl) locationEl.textContent = user.location || '—';
      
      if (avatarWrap) {
        avatarWrap.innerHTML = '';
        var parts = (user.displayName || '?').trim().split(/\s+/);
        var initials = parts.map(function (n) { return n.charAt(0); }).join('').substring(0, 3).toUpperCase() || '?';
        var ini = document.createElement('span');
        ini.className = 'profile-avatar-initials';
        ini.textContent = initials;
        ini.setAttribute('aria-hidden', 'true');
        avatarWrap.appendChild(ini);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
