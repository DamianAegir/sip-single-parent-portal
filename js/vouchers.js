/**
 * Vouchers redemption page
 */

(function () {
  'use strict';

  var MOCK_VOUCHERS = [
    {
      id: 'v1',
      title: 'Grocery Voucher',
      description: '$20 NTUC FairPrice voucher for essential groceries',
      icon: '🛒',
      cost: 30,
      provider: 'NTUC FairPrice',
    },
    {
      id: 'v2',
      title: 'Transport Voucher',
      description: '$15 EZ-Link top-up for public transport',
      icon: '🚇',
      cost: 25,
      provider: 'EZ-Link',
    },
    {
      id: 'v3',
      title: 'Medical Voucher',
      description: '$30 polyclinic consultation voucher',
      icon: '🏥',
      cost: 40,
      provider: 'MOH',
    },
    {
      id: 'v4',
      title: 'Childcare Voucher',
      description: '$50 childcare subsidy voucher',
      icon: '👶',
      cost: 60,
      provider: 'ECDA',
    },
    {
      id: 'v5',
      title: 'Utilities Voucher',
      description: '$40 utilities bill assistance voucher',
      icon: '💡',
      cost: 50,
      provider: 'SP Group',
    },
    {
      id: 'v6',
      title: 'Education Voucher',
      description: '$25 school supplies voucher',
      icon: '📚',
      cost: 35,
      provider: 'MOE',
    },
  ];

  function getCurrentCredits() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (!auth || !auth.isLoggedIn || !auth.isLoggedIn()) {
      return 0;
    }
    var user = auth.getCurrentUser && auth.getCurrentUser();
    return user ? (user.communityCredits || 0) : 0;
  }

  function updateCreditsDisplay() {
    var creditsEl = document.getElementById('vouchers-credits-value');
    if (creditsEl) {
      creditsEl.textContent = getCurrentCredits();
    }
  }

  function renderVoucher(voucher) {
    var card = document.createElement('article');
    card.className = 'voucher-card';
    card.setAttribute('data-id', voucher.id);

    var credits = getCurrentCredits();
    var canAfford = credits >= voucher.cost;

    card.innerHTML =
      '<div class="voucher-icon">' + escapeHtml(voucher.icon) + '</div>' +
      '<h3 class="voucher-title">' + escapeHtml(voucher.title) + '</h3>' +
      '<p class="voucher-description">' + escapeHtml(voucher.description) + '</p>' +
      '<div class="voucher-details">' +
        '<span class="voucher-cost">' + escapeHtml(voucher.cost) + ' credits</span>' +
        '<button type="button" class="btn btn-primary voucher-redeem-btn" ' +
          (canAfford ? '' : 'disabled') + '>' +
          (canAfford ? 'Redeem' : 'Insufficient Credits') +
        '</button>' +
      '</div>';

    var btn = card.querySelector('.voucher-redeem-btn');
    if (btn && canAfford) {
      btn.addEventListener('click', function () {
        handleRedeem(voucher);
      });
    }

    return card;
  }

  function escapeHtml(text) {
    var el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function handleRedeem(voucher) {
    var credits = getCurrentCredits();
    if (credits < voucher.cost) {
      var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
      if (notif && notif.add) {
        notif.add('warning', 'Insufficient Credits', 'You need ' + voucher.cost + ' credits to redeem this voucher. You currently have ' + credits + ' credits.');
      }
      return;
    }

    if (confirm('Redeem ' + voucher.title + ' for ' + voucher.cost + ' credits?')) {
      var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
      if (auth && auth.getCurrentUser) {
        var user = auth.getCurrentUser();
        if (user) {
          user.communityCredits = (user.communityCredits || 0) - voucher.cost;
          if (auth.setUser) auth.setUser(user);
          updateCreditsDisplay();
          renderVouchers();
          var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
          if (notif && notif.add) {
            notif.add('success', 'Voucher Redeemed', 'Voucher redeemed successfully! You will receive the voucher code via email/SMS.');
          }
        }
      }
    }
  }

  function renderVouchers() {
    var grid = document.getElementById('vouchers-grid');
    if (!grid) return;

    grid.innerHTML = '';
    MOCK_VOUCHERS.forEach(function (voucher) {
      grid.appendChild(renderVoucher(voucher));
    });
  }

  function init() {
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (!auth || !auth.isLoggedIn || !auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    updateCreditsDisplay();
    renderVouchers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
