/**
 * Auth helpers – localStorage-based demo auth
 * Demo account: Tan Chow Geng (username: tanchowgeng, password: demo2026)
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'trellis_user';

  var DEMO_ACCOUNT = {
    username: 'tanchowgeng',
    password: 'demo2026',
    displayName: 'Tan Chow Geng',
    avatar: 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="%230F766E"/><text x="24" y="30" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-size="14" font-weight="700">TCG</text></svg>'
    ),
    age: 41,
    occupation: 'Cleaner',
    children: 2,
    location: 'Punggol',
    communityCredits: 50,
    familyBackground: 'Was married until partner cheated, causing him to have to take care of both kids. Financial struggles are prominent.',
    likes: 'Takes great pride in maintaining a clean and organized environment. Enjoys having a small, close circle of friends for stress relief.',
    dislikes: 'Dislikes asking for help, especially financial aid due to shame.',
    challenges: [
      'Low salary and lack of paid sick leave',
      'Too tired, No Time',
      'Physically demanding work hours'
    ],
    needs: [
      {
        title: 'Caregiving Support',
        description: 'I need accessible caregiving support so I can better manage essential household responsibilities without sacrificing time, energy, or presence in my child\'s lives'
      },
      {
        title: 'Peer Support',
        description: 'I need to feel understood, connected and have access to peer support services/groups with relevant and helpful information'
      },
      {
        title: 'Financial Aid',
        description: 'I need a straightforward way to identify financial help that accepts my unique family status, allowing me to seek support without feeling like a burden.'
      }
    ]
  };

  function getBase() {
    var p = (global.location && global.location.pathname) || '';
    return p.indexOf('/html/') !== -1 ? '../' : '';
  }

  function getStored() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setStored(user) {
    try {
      if (global.localStorage) {
        if (user) global.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        else global.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  function getCurrentUser() {
    return getStored();
  }

  function isLoggedIn() {
    return !!getStored();
  }

  function setUser(user) {
    setStored(user);
  }

  function clearUser() {
    setStored(null);
  }

  function signIn(username, password) {
    var u = (username || '').trim().toLowerCase();
    var p = password || '';
    if (u === DEMO_ACCOUNT.username && p === DEMO_ACCOUNT.password) {
      var user = {
        displayName: DEMO_ACCOUNT.displayName,
        username: DEMO_ACCOUNT.username,
        avatar: DEMO_ACCOUNT.avatar,
        age: DEMO_ACCOUNT.age,
        occupation: DEMO_ACCOUNT.occupation,
        children: DEMO_ACCOUNT.children,
        location: DEMO_ACCOUNT.location,
        communityCredits: DEMO_ACCOUNT.communityCredits,
        familyBackground: DEMO_ACCOUNT.familyBackground,
        likes: DEMO_ACCOUNT.likes,
        dislikes: DEMO_ACCOUNT.dislikes,
        challenges: DEMO_ACCOUNT.challenges,
        needs: DEMO_ACCOUNT.needs,
      };
      setUser(user);
      return user;
    }
    return null;
  }

  function signOut() {
    clearUser();
  }

  global.TrellisAuth = {
    getBase: getBase,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
    setUser: setUser,
    clearUser: clearUser,
    signIn: signIn,
    signOut: signOut,
    DEMO_ACCOUNT: DEMO_ACCOUNT,
  };
})(typeof window !== 'undefined' ? window : this);
