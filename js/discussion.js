/**
 * Discussion profile page – load by id, Join → store + redirect to chat
 */

(function () {
  'use strict';

  var JOINED_KEY = 'trellis_joined_discussions';

  function getJoined() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(JOINED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setJoined(ids) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(JOINED_KEY, JSON.stringify(ids));
      }
    } catch (e) {}
  }

  function markJoined(id) {
    var ids = getJoined();
    if (ids.indexOf(id) < 0) ids.push(id);
    setJoined(ids);
  }

  function isJoined(id) {
    return getJoined().indexOf(String(id)) >= 0;
  }

  function getGroupId() {
    var m = /[?&]id=([^&]+)/.exec(window.location.search || '');
    return m ? m[1] : null;
  }

  function init() {
    var id = getGroupId();
    var data = typeof TrellisDiscussions !== 'undefined' ? TrellisDiscussions : null;
    var d = data && data.getDiscussion ? data.getDiscussion(id) : null;

    var card = document.getElementById('discussion-profile-card');
    var joinArea = document.getElementById('discussion-join-area');
    var joinedArea = document.getElementById('discussion-joined-actions');
    var joinBtn = document.getElementById('discussion-join-btn');
    var openChatBtn = document.getElementById('discussion-open-chat');

    if (!d) {
      if (card) card.innerHTML = '<p>Discussion not found. <a href="community.html">Back to Community</a>.</p>';
      return;
    }

    var avatarEl = document.getElementById('discussion-avatar');
    var categoryEl = document.getElementById('discussion-category');
    var titleEl = document.getElementById('discussion-title');
    var descEl = document.getElementById('discussion-description');
    var memberCountEl = document.getElementById('discussion-member-count');
    var categoryValueEl = document.getElementById('discussion-category-value');
    var createdEl = document.getElementById('discussion-created');

    if (avatarEl) avatarEl.textContent = d.avatar || '💬';
    if (categoryEl) categoryEl.textContent = d.categoryLabel || d.category || '—';
    if (titleEl) titleEl.textContent = d.title || d.content || '—';
    if (descEl) descEl.textContent = d.description || d.content || '—';
    if (memberCountEl) memberCountEl.textContent = (d.memberCount != null ? d.memberCount : '—');
    if (categoryValueEl) categoryValueEl.textContent = d.categoryLabel || d.category || '—';
    if (createdEl) createdEl.textContent = d.lastActive || d.timestamp || 'Recently';

    var joined = isJoined(d.id);

    if (joined) {
      if (joinArea) joinArea.hidden = true;
      if (joinedArea) joinedArea.hidden = false;
      if (openChatBtn) {
        openChatBtn.href = 'chat.html?groupId=' + encodeURIComponent(d.id);
        openChatBtn.textContent = 'Open chat';
      }
    } else {
      if (joinArea) joinArea.hidden = false;
      if (joinedArea) joinedArea.hidden = true;
      if (joinBtn) {
        joinBtn.href = 'chat.html?groupId=' + encodeURIComponent(d.id) + '&join=1';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
