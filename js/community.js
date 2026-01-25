/**
 * The Huddle (Community) – Feed, tabs, search, clickable discussions → profile
 * Uses discussions-data.js for mock data.
 */

(function () {
  'use strict';

  var data = typeof TrellisDiscussions !== 'undefined' ? TrellisDiscussions : null;

  function getPosts() {
    var mock = (data && data.MOCK_DISCUSSIONS) ? data.MOCK_DISCUSSIONS.slice() : [];
    var user = (data && data.getUserDiscussions) ? data.getUserDiscussions() : [];
    return user.concat(mock);
  }

  var posts = [];

  function isMentor(authorId) {
    return data && data.isMentor ? data.isMentor(authorId) : false;
  }

  function escapeHtml(text) {
    var el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function filterByCategory(list, category) {
    if (category === 'all') return list;
    if (category === 'mentors') {
      return list.filter(function (p) { return isMentor(p.authorId); });
    }
    return list.filter(function (p) { return p.category === category; });
  }

  function filterBySearch(list, q) {
    var qq = (q || '').trim().toLowerCase();
    if (!qq) return list;
    return list.filter(function (p) {
      var title = (p.title || '').toLowerCase();
      var content = (p.content || '').toLowerCase();
      var desc = (p.description || '').toLowerCase();
      var cat = (p.categoryLabel || p.category || '').toLowerCase();
      return title.indexOf(qq) >= 0 || content.indexOf(qq) >= 0 || desc.indexOf(qq) >= 0 || cat.indexOf(qq) >= 0;
    });
  }

  function renderPost(post) {
    var link = document.createElement('a');
    link.href = 'discussion.html?id=' + encodeURIComponent(post.id);
    link.className = 'huddle-post-link';

    var mentorBadge = isMentor(post.authorId)
      ? '<span class="huddle-badge huddle-badge-mentor" title="Verified mentor - experienced parent offering guidance" role="button" tabindex="0" data-filter="mentors">Mentor</span>'
      : '';

    link.innerHTML =
      '<article class="huddle-post" data-category="' + escapeHtml(post.category || '') + '">' +
        '<span class="huddle-category">' + escapeHtml(post.categoryLabel || '') + '</span>' +
        '<div class="huddle-post-header">' +
          '<div class="huddle-avatar" aria-hidden="true">' + escapeHtml(post.avatar || '') + '</div>' +
          '<div>' +
            '<div class="huddle-author-row">' +
              '<span class="huddle-author">' + escapeHtml(post.authorId || '') + '</span>' +
              mentorBadge +
            '</div>' +
            '<div class="huddle-meta">' + escapeHtml(post.timestamp || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="huddle-post-body">' +
          '<p>' + escapeHtml(post.content || '') + '</p>' +
        '</div>' +
      '</article>';

    return link;
  }

  function getFilteredPosts(category, searchQ) {
    posts = getPosts();
    var list = filterByCategory(posts, category);
    return filterBySearch(list, searchQ);
  }

  function renderFeed(category, searchQ) {
    var feed = document.getElementById('huddle-feed');
    if (!feed) return;

    var list = getFilteredPosts(category, searchQ);
    feed.innerHTML = '';

    if (list.length === 0) {
      feed.innerHTML = '<div class="huddle-empty"><p>No discussions match. Try a different category or search.</p></div>';
      return;
    }

    list.forEach(function (post) {
      feed.appendChild(renderPost(post));
    });
  }

  var currentCategory = 'all';
  var currentSearch = '';

  function switchTab(category) {
    currentCategory = category;
    var tabs = document.querySelectorAll('.huddle-tab');
    tabs.forEach(function (tab) {
      var cat = tab.getAttribute('data-category');
      var isActive = cat === category;
      tab.classList.toggle('huddle-tab-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    renderFeed(currentCategory, currentSearch);
  }

  function onSearchInput() {
    var input = document.getElementById('huddle-search');
    currentSearch = input ? input.value : '';
    renderFeed(currentCategory, currentSearch);
  }

  function initTabs() {
    var tabList = document.querySelector('.huddle-tabs');
    if (!tabList) return;

    tabList.addEventListener('click', function (e) {
      var tab = e.target.closest('.huddle-tab');
      if (!tab) return;
      var category = tab.getAttribute('data-category');
      if (category) switchTab(category);
    });
  }

  function initSearch() {
    var input = document.getElementById('huddle-search');
    if (!input) return;

    input.addEventListener('input', onSearchInput);
    input.addEventListener('change', onSearchInput);
  }

  function initMentorBadges() {
    var feed = document.getElementById('huddle-feed');
    if (!feed) return;

    feed.addEventListener('click', function (e) {
      var badge = e.target.closest('.huddle-badge-mentor');
      if (badge) {
        e.preventDefault();
        e.stopPropagation();
        switchTab('mentors');
        var tab = document.getElementById('tab-mentors');
        if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    feed.addEventListener('keydown', function (e) {
      var badge = e.target.closest('.huddle-badge-mentor');
      if (badge && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.stopPropagation();
        switchTab('mentors');
        var tab = document.getElementById('tab-mentors');
        if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  var CATEGORY_LABELS = {
    'emotional-support': 'Emotional Support',
    'advice': 'Advice',
    'success-stories': 'Success Stories',
  };

  var AVATARS = ['🌱', '🪴', '🌿', '🍀', '🌾'];

  function randomId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  function randomAuthor() {
    return 'Parent_' + Math.random().toString(36).substr(2, 4);
  }

  function initCreateModal() {
    var modal = document.getElementById('huddle-create-modal');
    var btn = document.getElementById('huddle-create-btn');
    var form = document.getElementById('huddle-create-form');
    var closeBtn = document.getElementById('huddle-create-modal-close');
    var cancelBtn = document.getElementById('huddle-create-cancel');

    if (!modal || !btn) return;

    function openModal() {
      modal.hidden = false;
    }

    function closeModal() {
      modal.hidden = true;
      if (form) form.reset();
    }

    btn.addEventListener('click', function () {
      openModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        e.preventDefault();
        closeModal();
      }
    });

    if (form && data && data.addUserDiscussion) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var titleEl = document.getElementById('create-discussion-title');
        var categoryEl = document.getElementById('create-discussion-category');
        var contentEl = document.getElementById('create-discussion-content');
        var title = (titleEl && titleEl.value || '').trim();
        var category = categoryEl ? categoryEl.value : '';
        var content = (contentEl && contentEl.value || '').trim();

        if (!title || !category || !content) {
          var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
          if (notif && notif.add) {
            notif.add('warning', 'Incomplete', 'Please fill in title, category, and content.');
          }
          return;
        }

        var id = randomId();
        var authorId = randomAuthor();
        var categoryLabel = CATEGORY_LABELS[category] || category;
        var avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

        var d = {
          id: id,
          authorId: authorId,
          category: category,
          categoryLabel: categoryLabel,
          title: title,
          description: content.substring(0, 120) + (content.length > 120 ? '…' : ''),
          content: content,
          timestamp: 'Just now',
          avatar: avatar,
          memberCount: 1,
          createdBy: authorId,
          lastActive: 'Just now',
          chatMessages: [],
        };

        data.addUserDiscussion(d);
        closeModal();
        switchTab('all');
        renderFeed(currentCategory, currentSearch);

        var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
        if (notif && notif.add) {
          notif.add('success', 'Discussion Created', 'Your discussion "' + title + '" has been created. Others can join and chat.');
        }
      });
    }
  }

  function init() {
    initTabs();
    initSearch();
    initMentorBadges();
    initCreateModal();
    switchTab('all');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
