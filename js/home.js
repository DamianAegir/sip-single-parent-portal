/**
 * Home page – App-style behaviour
 * Update Profile tile when logged in; optional home-specific logic.
 */

(function () {
  'use strict';

  function init() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    var tile = document.getElementById('app-tile-profile');
    if (!tile) return;

    if (auth && auth.isLoggedIn && auth.isLoggedIn()) {
      tile.href = 'html/profile.html';
      var sub = tile.querySelector('.app-tile-sub');
      if (sub) sub.textContent = 'View profile';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
