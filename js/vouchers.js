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
      category: 'Essential Goods',
      info: 'This voucher can be used at any NTUC FairPrice outlet in Singapore. Valid for 3 months from redemption date. Can be used for groceries, household items, and daily essentials.',
      website: 'https://www.fairprice.com.sg',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v2',
      title: 'Public Transport Voucher',
      description: '$15 EZ-Link top-up for public transport',
      icon: '🚇',
      cost: 25,
      provider: 'EZ-Link / LTA',
      category: 'Transport',
      info: 'Top-up your EZ-Link card for use on MRT, buses, and other public transport. Valid immediately upon redemption. Can be used at any TransitLink Ticket Office or top-up machine.',
      website: 'https://www.ezlink.com.sg',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v3',
      title: 'Polyclinic Consultation',
      description: '$30 polyclinic consultation voucher',
      icon: '🏥',
      cost: 40,
      provider: 'MOH / Polyclinics',
      category: 'Healthcare',
      info: 'Covers consultation fees at any polyclinic in Singapore. Valid for 6 months. Can be used for yourself or your children. Book appointments through HealthHub app or call the polyclinic directly.',
      website: 'https://www.moh.gov.sg/polyclinics',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v4',
      title: 'Childcare Subsidy',
      description: '$50 childcare subsidy voucher',
      icon: '👶',
      cost: 60,
      provider: 'ECDA',
      category: 'Childcare',
      info: 'Government-backed childcare subsidy. Can be used at any ECDA-licensed childcare centre. Valid for 6 months. Contact your childcare centre to apply the subsidy. Additional subsidies may be available through ComCare.',
      website: 'https://www.ecda.gov.sg',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v5',
      title: 'Utilities Assistance',
      description: '$40 utilities bill assistance voucher',
      icon: '💡',
      cost: 50,
      provider: 'SP Group / MSF',
      category: 'Utilities',
      info: 'Assistance for electricity and water bills. Can be applied to your SP Group account. Valid for 3 months. Contact SP Group customer service to apply the credit. Additional assistance available through ComCare.',
      website: 'https://www.spgroup.com.sg',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v6',
      title: 'School Supplies',
      description: '$25 school supplies voucher',
      icon: '📚',
      cost: 35,
      provider: 'MOE',
      category: 'Education',
      info: 'Voucher for school supplies, uniforms, and educational materials. Can be used at Popular Bookstore, Times Bookstore, or school bookshops. Valid for 6 months. Present voucher code at checkout.',
      website: 'https://www.moe.gov.sg',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v7',
      title: 'ComCare Assistance',
      description: '$100 ComCare financial assistance voucher',
      icon: '💰',
      cost: 80,
      provider: 'MSF ComCare',
      category: 'Financial Aid',
      info: 'Government financial assistance through ComCare. This voucher provides information and application support for ComCare schemes. Our team will help you apply for ComCare Short-to-Medium-Term Assistance (SMTA) or Long-Term Assistance. Valid for application within 3 months.',
      website: 'https://www.msf.gov.sg/comcare',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v8',
      title: 'KidSTART Support',
      description: '$75 KidSTART programme support voucher',
      icon: '🌟',
      cost: 70,
      provider: 'MSF KidSTART',
      category: 'Child Development',
      info: 'Support for KidSTART programme which provides early childhood development support for children from low-income families. Includes home visits, developmental health screening, and learning support. Valid for 6 months.',
      website: 'https://www.kidstart.gov.sg',
      eligibility: 'Available to single parents with children aged 0-6 years'
    },
    {
      id: 'v9',
      title: 'HDB Rental Assistance',
      description: '$60 HDB rental assistance information voucher',
      icon: '🏠',
      cost: 65,
      provider: 'HDB',
      category: 'Housing',
      info: 'Information and application support for HDB rental flats and rental assistance schemes. Our team will guide you through the application process for public rental housing or rental assistance. Valid for application support within 6 months.',
      website: 'https://www.hdb.gov.sg',
      eligibility: 'Available to all single parents with Community Credits'
    },
    {
      id: 'v10',
      title: 'Workfare Income Supplement',
      description: '$90 Workfare application support voucher',
      icon: '💼',
      cost: 75,
      provider: 'CPF / IRAS',
      category: 'Employment',
      info: 'Support for Workfare Income Supplement (WIS) application. WIS provides cash and CPF top-ups for lower-wage workers. Our team will help you understand eligibility and apply. Valid for application support within 6 months.',
      website: 'https://www.workfare.gov.sg',
      eligibility: 'Available to working single parents aged 35 and above'
    },
    {
      id: 'v11',
      title: 'Student Care Fee Assistance',
      description: '$45 student care fee assistance voucher',
      icon: '🎒',
      cost: 40,
      provider: 'MSF',
      category: 'Childcare',
      info: 'Assistance for student care centre fees. Can be used at any MSF-licensed student care centre. Valid for 6 months. Contact your student care centre to apply. Additional subsidies available through ComCare.',
      website: 'https://www.msf.gov.sg',
      eligibility: 'Available to single parents with children in student care'
    },
    {
      id: 'v12',
      title: 'MediSave / MediShield',
      description: '$35 healthcare insurance information voucher',
      icon: '🏥',
      cost: 30,
      provider: 'CPF / MOH',
      category: 'Healthcare',
      info: 'Information and application support for MediSave and MediShield Life. Learn about healthcare financing options and how to use MediSave for medical expenses. Valid for consultation within 3 months.',
      website: 'https://www.cpf.gov.sg',
      eligibility: 'Available to all single parents with Community Credits'
    }
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

    var categoryBadge = voucher.category ? '<span class="voucher-category">' + escapeHtml(voucher.category) + '</span>' : '';
    var providerInfo = voucher.provider ? '<div class="voucher-provider">Provided by: ' + escapeHtml(voucher.provider) + '</div>' : '';
    var infoText = voucher.info ? '<p class="voucher-info">' + escapeHtml(voucher.info) + '</p>' : '';
    var websiteLink = voucher.website ? '<a href="' + escapeHtml(voucher.website) + '" target="_blank" rel="noopener" class="voucher-website-link">Learn more →</a>' : '';
    var eligibilityText = voucher.eligibility ? '<div class="voucher-eligibility">' + escapeHtml(voucher.eligibility) + '</div>' : '';

    card.innerHTML =
      '<div class="voucher-header">' +
        '<div class="voucher-icon">' + escapeHtml(voucher.icon) + '</div>' +
        '<div class="voucher-title-section">' +
          '<h3 class="voucher-title">' + escapeHtml(voucher.title) + '</h3>' +
          categoryBadge +
        '</div>' +
      '</div>' +
      '<p class="voucher-description">' + escapeHtml(voucher.description) + '</p>' +
      providerInfo +
      infoText +
      eligibilityText +
      '<div class="voucher-actions">' +
        '<div class="voucher-cost-section">' +
          '<span class="voucher-cost-label">Cost:</span>' +
          '<span class="voucher-cost">' + escapeHtml(voucher.cost) + ' credits</span>' +
        '</div>' +
        '<button type="button" class="btn btn-primary voucher-redeem-btn" ' +
          (canAfford ? '' : 'disabled') + '>' +
          (canAfford ? 'Redeem Now' : 'Insufficient Credits') +
        '</button>' +
      '</div>' +
      (websiteLink ? '<div class="voucher-footer">' + websiteLink + '</div>' : '');

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

  function saveRedeemedVoucher(voucher) {
    try {
      var redeemed = JSON.parse(localStorage.getItem('trellis_redeemed_vouchers') || '[]');
      var redemption = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        voucherId: voucher.id,
        title: voucher.title,
        description: voucher.description,
        icon: voucher.icon,
        provider: voucher.provider || '',
        category: voucher.category || '',
        cost: voucher.cost,
        redeemedAt: new Date().toISOString(),
        code: 'VCH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        website: voucher.website || '',
        info: voucher.info || '',
        eligibility: voucher.eligibility || ''
      };
      redeemed.unshift(redemption);
      localStorage.setItem('trellis_redeemed_vouchers', JSON.stringify(redeemed));
    } catch (e) {
      console.error('Failed to save redeemed voucher:', e);
    }
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

    // Redeem directly without popup confirmation
    var auth = typeof TrellisAuth !== 'undefined' ? TrellisAuth : null;
    if (auth && auth.getCurrentUser) {
      var user = auth.getCurrentUser();
      if (user) {
        user.communityCredits = (user.communityCredits || 0) - voucher.cost;
        if (auth.setUser) auth.setUser(user);
        saveRedeemedVoucher(voucher);
        updateCreditsDisplay();
        renderVouchers();
        var notif = typeof TrellisNotifications !== 'undefined' ? TrellisNotifications : null;
        if (notif && notif.add) {
          notif.add('success', 'Voucher Redeemed', 'You have successfully redeemed ' + voucher.title + ' for ' + voucher.cost + ' credits. You will receive the voucher code via email/SMS.');
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
