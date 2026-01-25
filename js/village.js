/**
 * Village Board – Single task list, location filter, advanced filters
 * Accept task → credits added to profile (redeem on vouchers page)
 */

(function () {
  'use strict';

  var MOCK_TASKS = [
    { id: 'n1', title: 'Need someone to walk my son to school', description: 'Short walk to primary school, 7.30am. Near Punggol MRT.', points: 20, pointsLabel: '20 credits', location: 'Punggol', icon: '🚶', mine: false },
    { id: 'n2', title: 'Grocery run – can\'t leave the kids', description: 'Quick run to NTUC. List provided. Can meet at void deck.', points: 10, pointsLabel: '10 credits', location: 'Bedok', icon: '🛒', mine: false },
    { id: 'n3', title: 'Pick up medication from polyclinic', description: 'Collect prescription from Jurong Polyclinic. ID & details given.', points: 15, pointsLabel: '15 credits', location: 'Tampines', icon: '💊', mine: false },
    { id: 'j1', title: 'Grocery shopping assistance', description: 'Help with grocery shopping at nearby supermarket. List provided.', points: 15, pointsLabel: '15 credits', location: 'Ang Mo Kio', icon: '🛒', mine: false },
    { id: 'j2', title: 'School pick-up service', description: 'Pick up child from school at 3pm, bring to home. Near Clementi.', points: 20, pointsLabel: '20 credits', location: 'Clementi', icon: '👧', mine: false },
    { id: 'j3', title: 'Package collection', description: 'Collect package from neighbor and deliver to my address.', points: 10, pointsLabel: '10 credits', location: 'Bishan', icon: '📦', mine: false },
    { id: 'j4', title: 'Simple errand run', description: 'Pick up documents from office and drop at my home.', points: 12, pointsLabel: '12 credits', location: 'Tampines', icon: '📄', mine: false },
    { id: 'p1', title: 'School run – Punggol Primary', description: 'Walk my daughter to school 7.45am. Near Punggol MRT.', points: 18, pointsLabel: '18 credits', location: 'Punggol', icon: '🚶', mine: false },
    { id: 'p2', title: 'Grocery pickup at FairPrice Punggol', description: 'Collect online order. List and ID provided.', points: 12, pointsLabel: '12 credits', location: 'Punggol', icon: '🛒', mine: false },
    { id: 'p3', title: 'Babysit for 2 hours – Punggol', description: 'Look after toddler at my place. Emergency cover needed.', points: 25, pointsLabel: '25 credits', location: 'Punggol', icon: '👶', mine: false },
    { id: 't1', title: 'Collect parcel from POPStation Tampines', description: 'Code provided. Drop at my void deck.', points: 10, pointsLabel: '10 credits', location: 'Tampines', icon: '📦', mine: false },
    { id: 'b1', title: 'Quick grocery run – Bedok NTUC', description: 'Small list. Can meet at void deck.', points: 10, pointsLabel: '10 credits', location: 'Bedok', icon: '🛒', mine: false },
    { id: 'b2', title: 'School pickup – Bedok Secondary', description: 'Pick up child 4pm, bring home. Near Bedok MRT.', points: 22, pointsLabel: '22 credits', location: 'Bedok', icon: '👧', mine: false },
    { id: 's1', title: 'Errand – Sengkang to Buangkok', description: 'Drop a small package at relative\'s place.', points: 15, pointsLabel: '15 credits', location: 'Sengkang', icon: '📄', mine: false },
  ];

  var userTasks = [];

  function getTasks() {
    var mine = userTasks.map(function (t) {
      var x = Object.assign({}, t);
      x.mine = true;
      return x;
    });
    return mine.concat(MOCK_TASKS);
  }

  function escapeHtml(text) {
    var el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function filterBySearch(tasks, q) {
    var qq = (q || '').trim().toLowerCase();
    if (!qq) return tasks;
    return tasks.filter(function (t) {
      var title = (t.title || '').toLowerCase();
      var desc = (t.description || '').toLowerCase();
      var loc = (t.location || '').toLowerCase();
      return title.indexOf(qq) >= 0 || desc.indexOf(qq) >= 0 || loc.indexOf(qq) >= 0;
    });
  }

  function filterByLocation(tasks, loc) {
    if (!loc) return tasks;
    return tasks.filter(function (t) { return (t.location || '') === loc; });
  }

  function filterByCredits(tasks, min, max) {
    var mn = min != null && min !== '' ? parseInt(min, 10) : null;
    var mx = max != null && max !== '' ? parseInt(max, 10) : null;
    if (mn == null && mx == null) return tasks;
    return tasks.filter(function (t) {
      var p = t.points || 0;
      if (mn != null && p < mn) return false;
      if (mx != null && p > mx) return false;
      return true;
    });
  }

  function filterByShow(tasks, show) {
    if (show === 'mine') return tasks.filter(function (t) { return t.mine; });
    if (show === 'others') return tasks.filter(function (t) { return !t.mine; });
    return tasks;
  }

  function applyFilters() {
    var tasks = getTasks();
    var searchEl = document.getElementById('village-search');
    var locEl = document.getElementById('village-location');
    var minEl = document.getElementById('village-min-credits');
    var maxEl = document.getElementById('village-max-credits');
    var showEl = document.getElementById('village-show');

    var q = searchEl ? searchEl.value : '';
    var loc = locEl ? locEl.value : '';
    var min = minEl ? minEl.value : '';
    var max = maxEl ? maxEl.value : '';
    var show = showEl ? showEl.value : 'all';

    tasks = filterByShow(tasks, show);
    tasks = filterByLocation(tasks, loc);
    tasks = filterBySearch(tasks, q);
    tasks = filterByCredits(tasks, min, max);
    return tasks;
  }

  function renderTask(task) {
    var card = document.createElement('article');
    card.className = 'village-task-card';
    card.setAttribute('data-id', task.id);

    var pointsLabel = task.pointsLabel || (task.points + ' credits');
    var icon = task.icon || '✨';
    var desc = task.description ? '<p class="village-task-description">' + escapeHtml(task.description) + '</p>' : '';
    var isMine = !!task.mine;
    var actionHtml = isMine
      ? '<span class="village-task-badge">Your task</span>'
      : '<button type="button" class="village-task-btn">Accept Task</button>';

    card.innerHTML =
      '<div class="village-task-header">' +
        '<div class="village-task-icon" aria-hidden="true">' + escapeHtml(icon) + '</div>' +
        '<h3 class="village-task-title">' + escapeHtml(task.title) + '</h3>' +
      '</div>' +
      desc +
      '<div class="village-task-meta">' +
        '<span class="village-task-points">' + escapeHtml(pointsLabel) + '</span>' +
        '<span class="village-task-location">' + escapeHtml(task.location) + '</span>' +
      '</div>' +
      '<div class="village-task-actions">' + actionHtml + '</div>';

    if (!isMine) {
      var btn = card.querySelector('.village-task-btn');
      if (btn) {
        btn.addEventListener('click', function () { handleAcceptTask(task); });
      }
    }

    return card;
  }

  function handleAcceptTask(task) {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (!auth || !auth.isLoggedIn || !auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }
    var user = auth.getCurrentUser && auth.getCurrentUser();
    if (!user) return;
    if (task.mine) return;

    var creditsEarned = task.points || 0;
    user.communityCredits = (user.communityCredits || 0) + creditsEarned;
    if (auth.setUser) auth.setUser(user);

    var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
    if (notif && notif.add) {
      notif.add('success', 'Task Accepted', 'You earned ' + creditsEarned + ' Community Credits for: "' + task.title + '". Your total: ' + user.communityCredits + ' credits. Use them on the Redeem page.');
    }
    renderList();
  }

  function renderList() {
    var list = document.getElementById('village-task-list');
    if (!list) return;

    var tasks = applyFilters();
    list.innerHTML = '';

    if (tasks.length === 0) {
      list.innerHTML = '<div class="village-empty"><p>No tasks match your filters. Try changing location, search, or advanced filters.</p></div>';
      return;
    }

    tasks.forEach(function (task) {
      list.appendChild(renderTask(task));
    });
  }

  function initFilters() {
    var locEl = document.getElementById('village-location');
    var searchEl = document.getElementById('village-search');
    var minEl = document.getElementById('village-min-credits');
    var maxEl = document.getElementById('village-max-credits');
    var showEl = document.getElementById('village-show');

    function onChange() { renderList(); }

    if (locEl) {
      locEl.addEventListener('change', onChange);
      var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
      if (auth && auth.isLoggedIn && auth.isLoggedIn()) {
        var user = auth.getCurrentUser && auth.getCurrentUser();
        var loc = user && user.location ? user.location : '';
        if (loc && locEl.querySelector('option[value="' + loc + '"]')) {
          locEl.value = loc;
        }
      }
    }
    if (searchEl) {
      searchEl.addEventListener('input', onChange);
      searchEl.addEventListener('change', onChange);
    }
    if (minEl) minEl.addEventListener('input', onChange);
    if (maxEl) maxEl.addEventListener('input', onChange);
    if (showEl) showEl.addEventListener('change', onChange);
  }

  function initAdvanced() {
    var toggle = document.getElementById('village-advanced-toggle');
    var panel = document.getElementById('village-advanced-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      var open = !panel.classList.contains('hidden');
      panel.classList.toggle('hidden', open);
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? 'Advanced filters' : 'Hide advanced filters';
    });
  }

  function initModal() {
    var modal = document.getElementById('village-modal');
    var postBtn = document.getElementById('village-post-btn');
    var closeBtn = document.getElementById('village-modal-close');
    var cancelBtn = document.getElementById('village-modal-cancel');
    var form = document.getElementById('village-post-form');

    if (!modal || !postBtn) return;

    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    var isLoggedIn = !!(auth && auth.isLoggedIn && auth.isLoggedIn());

    if (!isLoggedIn) {
      postBtn.style.display = 'none';
      return;
    }

    modal.hidden = true;

    function openModal() {
      modal.hidden = false;
    }

    function closeModal() {
      modal.hidden = true;
      if (form) form.reset();
    }

    postBtn.addEventListener('click', openModal);

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

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var formData = new FormData(form);
        var title = (formData.get('title') || '').trim();
        var description = (formData.get('description') || '').trim();
        var location = formData.get('location') || '';
        var points = parseInt(formData.get('points') || '10', 10);

        if (!title || !location || points < 5) {
          var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
          if (notif && notif.add) {
            notif.add('warning', 'Incomplete Form', 'Please fill in all fields. Minimum 5 credits required.');
          }
          return;
        }

        var task = {
          id: 'user_' + Date.now(),
          title: title,
          description: description,
          location: location,
          points: points,
          pointsLabel: points + ' credits',
          icon: '📌',
          mine: true,
        };
        userTasks.unshift(task);
        closeModal();
        renderList();

        var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
        if (notif && notif.add) {
          notif.add('success', 'Task Posted', 'Your task "' + title + '" has been posted successfully!');
        }
      });
    }
  }

  function init() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (!auth || !auth.isLoggedIn || !auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    initFilters();
    initAdvanced();
    initModal();
    renderList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
