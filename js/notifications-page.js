/**
 * Notifications page – Display and manage notifications
 */

(function () {
  'use strict';

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function formatTimestamp(isoString) {
    try {
      var date = new Date(isoString);
      var now = new Date();
      var diff = now - date;
      var minutes = Math.floor(diff / 60000);
      var hours = Math.floor(diff / 3600000);
      var days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return minutes + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
      if (hours < 24) return hours + ' hour' + (hours === 1 ? '' : 's') + ' ago';
      if (days < 7) return days + ' day' + (days === 1 ? '' : 's') + ' ago';
      return date.toLocaleDateString();
    } catch (e) {
      return '';
    }
  }

  function getTypeIcon(type) {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  }

  function renderNotification(notif) {
    var div = document.createElement('div');
    div.className = 'notification-item' + (notif.read ? ' notification-read' : '');
    div.setAttribute('data-id', notif.id);

    var icon = getTypeIcon(notif.type);
    var title = notif.title || 'Notification';
    var message = notif.message || '';
    var time = formatTimestamp(notif.timestamp);

    div.innerHTML =
      '<div class="notification-icon notification-icon-' + escapeHtml(notif.type) + '" aria-hidden="true">' + escapeHtml(icon) + '</div>' +
      '<div class="notification-content">' +
        '<div class="notification-header">' +
          '<h3 class="notification-title">' + escapeHtml(title) + '</h3>' +
          '<button type="button" class="notification-delete" aria-label="Delete notification" data-id="' + escapeHtml(notif.id) + '">×</button>' +
        '</div>' +
        '<p class="notification-message">' + escapeHtml(message) + '</p>' +
        '<div class="notification-meta">' +
          '<span class="notification-time">' + escapeHtml(time) + '</span>' +
        '</div>' +
      '</div>';

    if (!notif.read) {
      div.addEventListener('click', function (e) {
        if (!e.target.closest('.notification-delete')) {
          markAsRead(notif.id);
        }
      });
    }

    var deleteBtn = div.querySelector('.notification-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteNotification(notif.id);
      });
    }

    return div;
  }

  function renderList() {
    var list = document.getElementById('notifications-list');
    var empty = document.getElementById('notifications-empty');
    if (!list) return;

    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (!notif || !notif.getAll) {
      if (empty) empty.hidden = false;
      list.innerHTML = '';
      return;
    }

    var notifications = notif.getAll();
    list.innerHTML = '';

    if (notifications.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    notifications.forEach(function (n) {
      list.appendChild(renderNotification(n));
    });
  }

  function markAsRead(id) {
    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif && notif.markAsRead) {
      notif.markAsRead(id);
      renderList();
    }
  }

  function deleteNotification(id) {
    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif && notif.delete) {
      notif.delete(id);
      renderList();
    }
  }

  function markAllAsRead() {
    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif && notif.markAllAsRead) {
      notif.markAllAsRead();
      renderList();
    }
  }

  function clearAll() {
    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif && notif.clearAll) {
      notif.clearAll();
      renderList();
    }
  }

  function init() {
    var markAllBtn = document.getElementById('mark-all-read-btn');
    var clearAllBtn = document.getElementById('clear-all-btn');

    if (markAllBtn) {
      markAllBtn.addEventListener('click', markAllAsRead);
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAll);
    }

    renderList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
