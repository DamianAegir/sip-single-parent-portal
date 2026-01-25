/**
 * Chat page – "You joined", mock messages, quick replies, send input
 */

(function () {
  'use strict';

  var JOINED_KEY = 'trellis_joined_discussions';

  function getJoined() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(JOINED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function markJoined(id) {
    var ids = getJoined();
    if (ids.indexOf(String(id)) < 0) ids.push(String(id));
    try {
      if (window.localStorage) window.localStorage.setItem(JOINED_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  function getGroupId() {
    var m = /[?&]groupId=([^&]+)/.exec(window.location.search || '');
    return m ? decodeURIComponent(m[1]) : null;
  }

  function isJoin() {
    return /[?&]join=1/.test(window.location.search || '');
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderSystem(text) {
    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg-system';
    div.innerHTML = '<div class="chat-msg-bubble">' + escapeHtml(text) + '</div>';
    return div;
  }

  function renderMsg(msg, isMe) {
    var div = document.createElement('div');
    div.className = 'chat-msg' + (isMe ? ' chat-msg-me' : '');
    var avatar;
    var authorName = '';
    if (isMe) {
      try {
        var u = typeof TrellisAuth !== 'undefined' && TrellisAuth.getCurrentUser && TrellisAuth.getCurrentUser();
        avatar = (u && u.displayName) ? String(u.displayName).charAt(0) : 'You';
        authorName = (u && u.displayName) ? u.displayName : 'You';
      } catch (e) {
        avatar = 'You';
        authorName = 'You';
      }
    } else {
      avatar = msg.avatar || '👤';
      authorName = msg.authorId || 'Parent';
    }
    var authorEl = isMe ? '' : '<span class="chat-msg-author">' + escapeHtml(authorName) + '</span>';
    var bubbleHtml = '';
    var hasText = msg.text && String(msg.text).trim();
    if (hasText) bubbleHtml += '<div class="chat-msg-bubble">' + escapeHtml(msg.text) + '</div>';
    if (msg.attachments && msg.attachments.length) {
      msg.attachments.forEach(function (att) {
        if (att.dataUrl && /^data:image\//i.test(att.dataUrl)) {
          bubbleHtml += '<div class="chat-msg-attachment"><img src="' + att.dataUrl + '" alt="' + escapeHtml(att.name || 'Image') + '" /></div>';
        } else {
          bubbleHtml += '<div class="chat-msg-attachment"><a href="' + (att.dataUrl || '#') + '" class="chat-file-link" target="_blank" rel="noopener">📎 ' + escapeHtml(att.name || 'File') + '</a></div>';
        }
      });
    }
    if (!bubbleHtml) bubbleHtml = '<div class="chat-msg-bubble"> </div>';
    div.innerHTML =
      '<div class="chat-msg-avatar" aria-hidden="true">' + escapeHtml(String(avatar)) + '</div>' +
      '<div class="chat-msg-content">' +
        authorEl +
        bubbleHtml +
        '<div class="chat-msg-meta"><span class="chat-msg-time">' + escapeHtml(msg.timestamp || '') + '</span></div>' +
      '</div>';
    return div;
  }

  function init() {
    var groupId = getGroupId();
    var data = typeof TrellisDiscussions !== 'undefined' ? TrellisDiscussions : null;
    var d = data && data.getDiscussion ? data.getDiscussion(groupId) : null;
    var messages = data && data.getChatMessages ? data.getChatMessages(groupId) : [];
    var quickReplies = (data && data.QUICK_REPLIES) ? data.QUICK_REPLIES.slice() : ['Thanks for sharing!', 'Same here 💙', 'Sending love', 'This helps a lot', 'Here for you'];

    var back = document.getElementById('chat-back');
    var title = document.getElementById('chat-title');
    var subtitle = document.getElementById('chat-subtitle');
    var headerAvatar = document.getElementById('chat-header-avatar');
    var menuBtn = document.getElementById('chat-menu-btn');
    var list = document.getElementById('chat-messages');
    var quickWrap = document.getElementById('chat-quick-replies');
    var input = document.getElementById('chat-input');
    var sendBtn = document.getElementById('chat-send');
    var attachBtn = document.getElementById('chat-attach-btn');
    var fileInput = document.getElementById('chat-file-input');
    var attachPreview = document.getElementById('chat-attach-preview');

    if (back) back.href = 'discussion.html?id=' + encodeURIComponent(groupId || '');

    if (!d) {
      if (title) title.textContent = 'Discussion not found';
      if (subtitle) subtitle.textContent = '';
      if (list) list.appendChild(renderSystem('Discussion not found. Go back to Community.'));
      return;
    }

    if (title) title.textContent = d.title || 'Discussion';
    if (subtitle) {
      var parts = [];
      if (d.memberCount != null) parts.push(d.memberCount + ' members');
      if (d.categoryLabel) parts.push(d.categoryLabel);
      if (d.lastActive) parts.push('Active ' + d.lastActive);
      subtitle.textContent = parts.join(' · ') || '—';
    }
    if (headerAvatar) headerAvatar.textContent = d.avatar || '💬';

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        window.location.href = 'discussion.html?id=' + encodeURIComponent(groupId || '');
      });
    }

    if (!list) return;

    list.innerHTML = '';

    var showJoined = isJoin();
    if (showJoined) {
      markJoined(groupId);
      list.appendChild(renderSystem('You joined the group'));
    }

    messages.forEach(function (m) {
      list.appendChild(renderMsg(m, false));
    });

    var userMessages = [];
    var pendingAttachments = [];

    function appendUserMessage(text, attachments) {
      var msg = { text: text || '', timestamp: 'Just now', isMe: true };
      if (attachments && attachments.length) msg.attachments = attachments;
      userMessages.push(msg);
      list.appendChild(renderMsg(msg, true));
      list.scrollTop = list.scrollHeight;
    }

    function clearPendingAttachments() {
      pendingAttachments = [];
      if (fileInput) fileInput.value = '';
      renderAttachPreview();
      updateSendButton();
    }

    function renderAttachPreview() {
      if (!attachPreview) return;
      attachPreview.innerHTML = '';
      if (pendingAttachments.length === 0) {
        attachPreview.hidden = true;
        return;
      }
      attachPreview.hidden = false;
      pendingAttachments.forEach(function (att, i) {
        var wrap = document.createElement('div');
        wrap.className = 'chat-attach-preview-item';
        if (att.dataUrl && /^data:image\//i.test(att.dataUrl)) {
          var img = document.createElement('img');
          img.src = att.dataUrl;
          img.alt = att.name || 'Image';
          wrap.appendChild(img);
        } else {
          var name = document.createElement('div');
          name.className = 'chat-attach-name';
          name.textContent = att.name || 'File';
          wrap.appendChild(name);
        }
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'chat-attach-remove';
        rm.textContent = '×';
        rm.setAttribute('aria-label', 'Remove attachment');
        (function (idx) {
          rm.addEventListener('click', function () {
            pendingAttachments.splice(idx, 1);
            renderAttachPreview();
            updateSendButton();
          });
        })(i);
        wrap.appendChild(rm);
        attachPreview.appendChild(wrap);
      });
    }

    function sendText(text, attachments) {
      var t = (text || '').trim();
      var att = attachments || pendingAttachments.slice();
      if (!t && att.length === 0) return;
      appendUserMessage(t || undefined, att.length ? att : undefined);
      if (input) {
        input.value = '';
        input.style.height = 'auto';
      }
      clearPendingAttachments();
    }

    quickReplies.forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-quick-chip';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        sendText(label);
      });
      if (quickWrap) quickWrap.appendChild(btn);
    });

    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        sendText(input && input.value);
      });
    }

    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', function () {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var files = fileInput.files;
        if (!files || !files.length) return;
        var maxSize = 5 * 1024 * 1024;
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          if (f.size > maxSize) continue;
          var att = { name: f.name, type: f.type };
          var reader = new FileReader();
          reader.onload = (function (a) {
            return function (e) {
              a.dataUrl = e.target.result;
              pendingAttachments.push(a);
              renderAttachPreview();
              updateSendButton();
            };
          })(att);
          reader.readAsDataURL(f);
        }
        fileInput.value = '';
      });
    }

    function updateInputHeight() {
      if (input) {
        input.style.height = 'auto';
        var h = Math.min(input.scrollHeight, 120);
        input.style.height = h + 'px';
      }
    }

    function updateSendButton() {
      if (!sendBtn) return;
      var hasText = input && input.value.trim().length > 0;
      var hasAttach = pendingAttachments.length > 0;
      sendBtn.disabled = !hasText && !hasAttach;
    }

    if (input) {
      input.addEventListener('input', function () {
        updateInputHeight();
        updateSendButton();
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (input.value.trim() || pendingAttachments.length) {
            sendText(input.value);
            updateInputHeight();
          }
        }
      });

      updateSendButton();
    }

    if (sendBtn) updateSendButton();

    list.scrollTop = list.scrollHeight;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
