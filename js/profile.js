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

  function escapeHtml(text) {
    var el = document.createElement('div');
    el.textContent = text || '';
    return el.innerHTML;
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
    
    // Merge missing fields from DEMO_ACCOUNT if user is missing them (for existing logged-in users)
    if (user && auth.DEMO_ACCOUNT) {
      var demo = auth.DEMO_ACCOUNT;
      if (!user.familyBackground && demo.familyBackground) user.familyBackground = demo.familyBackground;
      if (!user.likes && demo.likes) user.likes = demo.likes;
      if (!user.dislikes && demo.dislikes) user.dislikes = demo.dislikes;
      if ((!user.challenges || user.challenges.length === 0) && demo.challenges) user.challenges = demo.challenges;
      if ((!user.needs || user.needs.length === 0) && demo.needs) user.needs = demo.needs;
      // Save updated user
      if (auth.setUser) auth.setUser(user);
    }
    
    var nameEl = document.getElementById('profile-name');
    var usernameEl = document.getElementById('profile-username');
    var avatarWrap = document.getElementById('profile-avatar-wrap');
    var pointsEl = document.getElementById('profile-points-value');
    var ageEl = document.getElementById('profile-age');
    var occupationEl = document.getElementById('profile-occupation');
    var childrenEl = document.getElementById('profile-children');
    var locationEl = document.getElementById('profile-location');
    var familyBackgroundEl = document.getElementById('profile-family-background');
    var likesEl = document.getElementById('profile-likes');
    var dislikesEl = document.getElementById('profile-dislikes');
    var challengesEl = document.getElementById('profile-challenges');
    var needsEl = document.getElementById('profile-needs');

    if (user) {
      if (nameEl) nameEl.textContent = user.displayName || 'User';
      if (usernameEl) usernameEl.textContent = '@' + (user.username || '');
      if (pointsEl) pointsEl.textContent = user.communityCredits || user.villagePoints || '50';
      if (ageEl) ageEl.textContent = user.age ? user.age + ' years old' : '—';
      if (occupationEl) occupationEl.textContent = user.occupation || '—';
      if (childrenEl) childrenEl.textContent = user.children ? user.children + ' child' + (user.children > 1 ? 'ren' : '') : '—';
      if (locationEl) locationEl.textContent = user.location || '—';
      
      // Family Background
      if (familyBackgroundEl) {
        var fbText = user.familyBackground || '';
        if (fbText && fbText.trim()) {
          familyBackgroundEl.textContent = fbText;
          familyBackgroundEl.style.color = 'var(--text-main)';
          familyBackgroundEl.style.fontStyle = 'normal';
        } else {
          familyBackgroundEl.textContent = 'No family background information provided.';
          familyBackgroundEl.style.color = 'var(--text-muted)';
          familyBackgroundEl.style.fontStyle = 'italic';
        }
      }
      
      // Likes & Dislikes
      if (likesEl) {
        var likesText = user.likes || '';
        if (likesText && likesText.trim()) {
          likesEl.textContent = likesText;
          likesEl.style.color = 'var(--text-main)';
          likesEl.style.fontStyle = 'normal';
        } else {
          likesEl.textContent = 'No likes listed';
          likesEl.style.color = 'var(--text-muted)';
          likesEl.style.fontStyle = 'italic';
        }
      }
      if (dislikesEl) {
        var dislikesText = user.dislikes || '';
        if (dislikesText && dislikesText.trim()) {
          dislikesEl.textContent = dislikesText;
          dislikesEl.style.color = 'var(--text-main)';
          dislikesEl.style.fontStyle = 'normal';
        } else {
          dislikesEl.textContent = 'No dislikes listed';
          dislikesEl.style.color = 'var(--text-muted)';
          dislikesEl.style.fontStyle = 'italic';
        }
      }
      
      // Challenges
      if (challengesEl) {
        challengesEl.innerHTML = '';
        if (user.challenges && Array.isArray(user.challenges) && user.challenges.length > 0) {
          user.challenges.forEach(function(challenge) {
            if (challenge && challenge.trim()) {
              var li = document.createElement('li');
              li.textContent = challenge;
              challengesEl.appendChild(li);
            }
          });
        }
        if (challengesEl.children.length === 0) {
          var emptyLi = document.createElement('li');
          emptyLi.textContent = 'No challenges listed';
          emptyLi.style.color = 'var(--text-muted)';
          emptyLi.style.fontStyle = 'italic';
          challengesEl.appendChild(emptyLi);
        }
      }
      
      // Top 3 Needs
      if (needsEl) {
        needsEl.innerHTML = '';
        if (user.needs && Array.isArray(user.needs) && user.needs.length > 0) {
          user.needs.forEach(function(need) {
            if (need) {
              var li = document.createElement('li');
              if (typeof need === 'object' && need.title) {
                li.innerHTML = '<strong>' + escapeHtml(need.title) + '</strong>' + 
                  (need.description ? '<p>' + escapeHtml(need.description) + '</p>' : '');
              } else {
                li.textContent = need;
              }
              needsEl.appendChild(li);
            }
          });
        }
        if (needsEl.children.length === 0) {
          var emptyLi = document.createElement('li');
          emptyLi.textContent = 'No needs listed';
          emptyLi.style.color = 'var(--text-muted)';
          emptyLi.style.fontStyle = 'italic';
          needsEl.appendChild(emptyLi);
        }
      }
      
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
    
    // Show/hide action buttons based on login status
    var notificationsBtn = document.getElementById('profile-notifications-btn');
    var redeemBtn = document.getElementById('profile-redeem-btn');
    if (notificationsBtn) {
      notificationsBtn.style.display = user ? 'inline-flex' : 'none';
    }
    if (redeemBtn) {
      redeemBtn.style.display = user ? 'inline-block' : 'none';
    }
    
    // Only show redeemed vouchers section if logged in
    var redeemedVouchersSection = document.querySelector('.profile-info-section:has(#profile-redeemed-vouchers)');
    if (redeemedVouchersSection) {
      redeemedVouchersSection.style.display = user ? 'block' : 'none';
    }
    
    // Load and display redeemed vouchers (only if logged in)
    var redeemedVouchersEl = document.getElementById('profile-redeemed-vouchers');
    if (redeemedVouchersEl && user) {
      try {
        var redeemed = JSON.parse(localStorage.getItem('trellis_redeemed_vouchers') || '[]');
        if (redeemed && redeemed.length > 0) {
          redeemedVouchersEl.innerHTML = '';
          redeemed.forEach(function(redemption) {
            var voucherCard = document.createElement('div');
            voucherCard.className = 'profile-redeemed-voucher';
            var date = new Date(redemption.redeemedAt);
            var dateStr = date.toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' });
            var websiteLink = redemption.website ? '<a href="' + escapeHtml(redemption.website) + '" target="_blank" rel="noopener" class="redeemed-voucher-website">Visit website →</a>' : '';
            voucherCard.innerHTML = 
              '<div class="redeemed-voucher-header">' +
                '<span class="redeemed-voucher-icon">' + escapeHtml(redemption.icon || '🎁') + '</span>' +
                '<div class="redeemed-voucher-info">' +
                  '<strong class="redeemed-voucher-title">' + escapeHtml(redemption.title) + '</strong>' +
                  '<span class="redeemed-voucher-date">Redeemed ' + dateStr + '</span>' +
                  (redemption.provider ? '<span class="redeemed-voucher-provider">' + escapeHtml(redemption.provider) + '</span>' : '') +
                '</div>' +
              '</div>' +
              '<div class="redeemed-voucher-code">' +
                '<span class="redeemed-code-label">Voucher Code:</span>' +
                '<span class="redeemed-code-value">' + escapeHtml(redemption.code) + '</span>' +
              '</div>' +
              (websiteLink ? '<div class="redeemed-voucher-footer">' + websiteLink + '</div>' : '');
            redeemedVouchersEl.appendChild(voucherCard);
          });
        } else {
          redeemedVouchersEl.innerHTML = '<p class="profile-empty-message">No vouchers redeemed yet. Visit the Redeem page to use your Community Credits.</p>';
        }
      } catch (e) {
        redeemedVouchersEl.innerHTML = '<p class="profile-empty-message">Unable to load redeemed vouchers.</p>';
      }
    } else if (redeemedVouchersEl && !user) {
      redeemedVouchersEl.innerHTML = '<p class="profile-empty-message">Please sign in to view your redeemed vouchers.</p>';
    }
    
    // Update notification badge
    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif) {
      function updateProfileBadge() {
        var count = notif.getUnreadCount ? notif.getUnreadCount() : 0;
        var profileBadge = document.getElementById('profile-notification-badge');
        if (profileBadge) {
          if (count > 0) {
            profileBadge.textContent = count > 99 ? '99+' : String(count);
            profileBadge.hidden = false;
            profileBadge.style.display = 'inline-flex';
          } else {
            profileBadge.hidden = true;
            profileBadge.style.display = 'none';
          }
        }
      }
      
      // Update immediately and also call the global update
      if (notif.updateBadge) {
        notif.updateBadge();
      }
      setTimeout(updateProfileBadge, 100);
      setTimeout(updateProfileBadge, 500); // Double check after a delay
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
