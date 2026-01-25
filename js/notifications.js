/**
 * Notifications system – Store and display notifications (replaces alerts)
 */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'trellis_notifications';
  var MAX_NOTIFICATIONS = 50;

  function getNotifications() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveNotifications(notifications) {
    try {
      if (global.localStorage) {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      }
    } catch (e) {}
  }

  function addNotification(type, title, message) {
    var notifications = getNotifications();
    var notification = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      type: type || 'info', // 'success', 'info', 'warning', 'error'
      title: title || '',
      message: message || '',
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.unshift(notification);
    if (notifications.length > MAX_NOTIFICATIONS) {
      notifications = notifications.slice(0, MAX_NOTIFICATIONS);
    }
    saveNotifications(notifications);
    // Update badge immediately and also trigger full update
    updateNotificationBadge();
    // Also immediately update bottom nav badge for faster response
    setTimeout(function() {
      updateBottomNavBadge();
    }, 0);
    return notification;
  }
  
  function updateBottomNavBadge() {
    var count = getUnreadCount();
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
        existingBadge.style.display = '';
      } else {
        if (existingBadge) {
          existingBadge.hidden = true;
          existingBadge.style.display = 'none';
        }
      }
    }
  }

  function markAsRead(id) {
    var notifications = getNotifications();
    var found = false;
    notifications.forEach(function (n) {
      if (n.id === id) {
        n.read = true;
        found = true;
      }
    });
    if (found) {
      saveNotifications(notifications);
      updateNotificationBadge();
    }
  }

  function markAllAsRead() {
    var notifications = getNotifications();
    notifications.forEach(function (n) {
      n.read = true;
    });
    saveNotifications(notifications);
    updateNotificationBadge();
  }

  function deleteNotification(id) {
    var notifications = getNotifications();
    notifications = notifications.filter(function (n) {
      return n.id !== id;
    });
    saveNotifications(notifications);
    updateNotificationBadge();
  }

  function clearAll() {
    saveNotifications([]);
    updateNotificationBadge();
  }

  function getUnreadCount() {
    var notifications = getNotifications();
    return notifications.filter(function (n) { return !n.read; }).length;
  }

  function updateNotificationBadge() {
    var count = getUnreadCount();
    var badges = document.querySelectorAll('.notification-badge, .notifications-badge, .auth-user-notification-badge, .bottom-nav-notification-badge, .profile-notification-badge');
    badges.forEach(function (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : String(count);
        badge.hidden = false;
        // Set appropriate display based on badge type
        if (badge.classList.contains('profile-notification-badge')) {
          badge.style.display = 'inline-flex';
        } else {
          badge.style.display = '';
        }
      } else {
        badge.hidden = true;
        badge.style.display = 'none';
      }
    });
    // Also update bottom nav badge
    updateBottomNavBadge();
  }

  global.TrellisNotifications = {
    add: addNotification,
    getAll: getNotifications,
    markAsRead: markAsRead,
    markAllAsRead: markAllAsRead,
    delete: deleteNotification,
    clearAll: clearAll,
    getUnreadCount: getUnreadCount,
    updateBadge: updateNotificationBadge,
    updateBottomNavBadge: updateBottomNavBadge
  };

  // Update badge on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNotificationBadge);
  } else {
    updateNotificationBadge();
  }
})(typeof window !== 'undefined' ? window : this);
