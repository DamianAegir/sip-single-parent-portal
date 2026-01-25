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
