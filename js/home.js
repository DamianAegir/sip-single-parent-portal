/**
 * Home page – Modern app-style behaviour
 * Personalized hero, activity feed, quick actions, and dynamic content
 */

(function () {
  'use strict';

  function escapeHtml(text) {
    var el = document.createElement('div');
    el.textContent = text || '';
    return el.innerHTML;
  }

  function getRecentDiscussions(limit) {
    var discussions = typeof TrellisDiscussions !== 'undefined' ? TrellisDiscussions : null;
    if (!discussions) return [];
    
    var mock = discussions.MOCK_DISCUSSIONS || [];
    var user = discussions.getUserDiscussions ? discussions.getUserDiscussions() : [];
    var all = user.concat(mock);
    
    // Sort by timestamp (most recent first) - simplified for demo
    return all.slice(0, limit || 3);
  }

  function getRecentTasks(limit) {
    try {
      var tasks = JSON.parse(localStorage.getItem('village_tasks') || '[]');
      return tasks.slice(0, limit || 3);
    } catch (e) {
      return [];
    }
  }

  function renderFeedItem(item, type) {
    var link = document.createElement('a');
    link.className = 'feed-item';
    link.href = type === 'discussion' 
      ? 'html/discussion.html?id=' + encodeURIComponent(item.id)
      : 'html/village.html';
    
    var avatar = item.avatar || '👤';
    var author = item.authorId || 'Anonymous';
    var timestamp = item.timestamp || 'Recently';
    var content = item.content || item.description || item.title || '';
    var category = item.categoryLabel || '';
    
    if (type === 'task') {
      author = item.postedBy || 'Parent';
      timestamp = item.postedAt || 'Recently';
      content = item.title || '';
      category = 'Task';
    }

    link.innerHTML = 
      '<div class="feed-item-header">' +
        '<div class="feed-item-avatar">' + escapeHtml(avatar) + '</div>' +
        '<div class="feed-item-info">' +
          '<div class="feed-item-author">' + escapeHtml(author) + 
            (category ? '<span class="feed-item-badge">' + escapeHtml(category) + '</span>' : '') +
          '</div>' +
          '<div class="feed-item-meta">' + escapeHtml(timestamp) + '</div>' +
        '</div>' +
      '</div>' +
      '<p class="feed-item-content">' + escapeHtml(content.length > 120 ? content.substring(0, 120) + '...' : content) + '</p>';
    
    return link;
  }

  function renderFeed(type) {
    var feedContent = document.getElementById('feed-content');
    if (!feedContent) return;

    var items = [];
    if (type === 'all' || type === 'discussions') {
      var discussions = getRecentDiscussions(2);
      discussions.forEach(function(d) {
        items.push({ item: d, type: 'discussion' });
      });
    }
    if (type === 'all' || type === 'tasks') {
      var tasks = getRecentTasks(2);
      tasks.forEach(function(t) {
        items.push({ item: t, type: 'task' });
      });
    }

    if (items.length === 0) {
      feedContent.innerHTML = '<div class="feed-empty"><p>No recent activity. Start by posting a task or joining a discussion!</p></div>';
      return;
    }

    feedContent.innerHTML = '';
    items.forEach(function(data) {
      feedContent.appendChild(renderFeedItem(data.item, data.type));
    });
  }

  function init() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    var isLoggedIn = auth && auth.isLoggedIn && auth.isLoggedIn();
    var user = isLoggedIn && auth.getCurrentUser ? auth.getCurrentUser() : null;

    // Update action buttons based on login state
    var actionProfile = document.getElementById('action-profile');
    if (actionProfile) {
      if (isLoggedIn) {
        actionProfile.href = 'html/profile.html';
      } else {
        actionProfile.href = 'html/login.html';
      }
    }

    var actionPostTask = document.getElementById('action-post-task');
    var actionDiscuss = document.getElementById('action-discuss');
    if (actionPostTask && !isLoggedIn) {
      actionPostTask.href = 'html/login.html';
    }
    if (actionDiscuss && !isLoggedIn) {
      actionDiscuss.href = 'html/login.html';
    }

    // Personalized hero section
    var heroHeading = document.getElementById('hero-heading');
    var heroTagline = document.getElementById('hero-tagline');
    var heroStats = document.getElementById('hero-stats');
    var heroCredits = document.getElementById('hero-credits');
    var heroTasks = document.getElementById('hero-tasks');

    if (isLoggedIn && user) {
      // Update welcome message
      if (heroHeading) {
        var firstName = user.displayName ? user.displayName.split(' ')[0] : 'there';
        heroHeading.textContent = 'Welcome back, ' + firstName + '!';
      }
      if (heroTagline) {
        heroTagline.textContent = 'Here\'s what\'s happening in your community today.';
      }

      // Show and update stats
      if (heroStats) {
        heroStats.hidden = false;
      }
      if (heroCredits) {
        heroCredits.textContent = user.communityCredits || 0;
      }
      if (heroTasks) {
        try {
          var tasks = JSON.parse(localStorage.getItem('village_tasks') || '[]');
          var activeTasks = tasks.filter(function(t) {
            return t.status === 'open' || t.status === 'accepted';
          }).length;
          heroTasks.textContent = activeTasks;
        } catch (e) {
          heroTasks.textContent = '0';
        }
      }
    }

    // Activity feed (only show when logged in)
    var feedSection = document.getElementById('app-feed-section');
    var statsSection = document.getElementById('app-stats-section');
    
    if (feedSection && statsSection) {
      if (isLoggedIn) {
        feedSection.hidden = false;
        statsSection.hidden = true;
        
        // Initialize feed tabs
        var feedTabs = document.querySelectorAll('.feed-tab');
        var currentFeedType = 'all';
        
        feedTabs.forEach(function(tab) {
          tab.addEventListener('click', function() {
            feedTabs.forEach(function(t) { t.classList.remove('feed-tab-active'); });
            this.classList.add('feed-tab-active');
            currentFeedType = this.getAttribute('data-feed') || 'all';
            renderFeed(currentFeedType);
          });
        });
        
        // Render initial feed
        renderFeed(currentFeedType);
      } else {
        feedSection.hidden = true;
        statsSection.hidden = false;
      }
    }

    // Update notification badge
    var notificationBadge = document.getElementById('action-notification-badge');
    if (notificationBadge && typeof TrellisNotifications !== 'undefined') {
      try {
        var notifications = TrellisNotifications.getNotifications ? TrellisNotifications.getNotifications() : [];
        var unreadCount = notifications.filter(function(n) { return !n.read; }).length;
        if (unreadCount > 0) {
          notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
          notificationBadge.hidden = false;
        } else {
          notificationBadge.hidden = true;
        }
      } catch (e) {
        notificationBadge.hidden = true;
      }
    }

    // Hide CTA section when logged in
    var ctaSection = document.getElementById('app-cta-section');
    if (ctaSection && isLoggedIn) {
      ctaSection.hidden = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

