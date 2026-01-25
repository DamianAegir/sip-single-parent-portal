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
    updateNotificationBadge();
    return notification;
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
    var badges = document.querySelectorAll('.notification-badge, .notifications-badge');
    badges.forEach(function (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : String(count);
        badge.style.display = '';
        badge.hidden = false;
      } else {
        badge.style.display = 'none';
        badge.hidden = true;
      }
    });
  }

  global.TrellisNotifications = {
    add: addNotification,
    getAll: getNotifications,
    markAsRead: markAsRead,
    markAllAsRead: markAllAsRead,
    delete: deleteNotification,
    clearAll: clearAll,
    getUnreadCount: getUnreadCount,
    updateBadge: updateNotificationBadge
  };

  // Update badge on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNotificationBadge);
  } else {
    updateNotificationBadge();
  }
})(typeof window !== 'undefined' ? window : this);
