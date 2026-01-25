/**
 * Shared mock data for Community discussions, profile, and chat
 */

(function (global) {
  'use strict';

  var MENTOR_IDS = ['Parent_A3bM', 'Parent_x9Lp'];

  var MOCK_DISCUSSIONS = [
    {
      id: '1',
      authorId: 'Parent_7K2m',
      category: 'emotional-support',
      categoryLabel: 'Emotional Support',
      title: 'Feeling overwhelmed with work today',
      description: 'Juggling a sick kid and deadlines — anyone else been there? Just needed to vent. A safe space to share and support each other through tough days.',
      content: 'Feeling overwhelmed with work today. Juggling a sick kid and deadlines — anyone else been there? Just needed to vent. 💙',
      timestamp: '2 hours ago',
      avatar: '🌱',
      memberCount: 12,
      createdBy: 'Parent_7K2m',
      lastActive: '45 minutes ago',
    },
    {
      id: '2',
      authorId: 'Parent_A3bM',
      category: 'advice',
      categoryLabel: 'Advice',
      title: 'How do I apply for childcare subsidy?',
      description: 'Single mum in Jurong — girl starting preschool next year. Sharing step-by-step tips and experiences with childcare subsidies. Get help with forms, documents, and timelines.',
      content: 'How do I apply for childcare subsidy? I\'m a single mum in Jurong and my girl will start preschool next year. Any step-by-step tips?',
      timestamp: '5 hours ago',
      avatar: '🪴',
      memberCount: 24,
      createdBy: 'Parent_A3bM',
      lastActive: '1 hour ago',
    },
    {
      id: '3',
      authorId: 'Parent_x9Lp',
      category: 'success-stories',
      categoryLabel: 'Success Stories',
      title: 'ComCare approved after 3 months',
      description: 'Don\'t give up — keep following up with your FSC worker. Sharing what worked for us. Celebrate wins and inspire others.',
      content: 'Finally got my ComCare application approved after 3 months. Don\'t give up — keep following up with your FSC worker. It made a huge difference for us.',
      timestamp: '1 day ago',
      avatar: '🌿',
      memberCount: 18,
      createdBy: 'Parent_x9Lp',
      lastActive: '2 hours ago',
    },
    {
      id: '4',
      authorId: 'Parent_m4Nq',
      category: 'emotional-support',
      categoryLabel: 'Emotional Support',
      title: 'First Father\'s Day as a single dad',
      description: 'Bittersweet but we\'re okay. A space for single dads to connect and support each other. Share your journey and find understanding.',
      content: 'First Father\'s Day as a single dad. It\'s bittersweet but my son drew me a card. We\'re okay. Sending love to everyone riding this alone.',
      timestamp: '2 days ago',
      avatar: '🍀',
      memberCount: 8,
      createdBy: 'Parent_m4Nq',
      lastActive: '3 hours ago',
    },
    {
      id: '5',
      authorId: 'Parent_k8Rt',
      category: 'advice',
      categoryLabel: 'Advice',
      title: 'Flexible side gigs for single parents',
      description: 'Working only when kids are in school? Share what\'s worked for you — gigs, remote work, and flexible jobs. Build income while prioritizing family.',
      content: 'Best flexible side gigs for single parents? I can only work when my kids are in school. Would love to hear what\'s worked for you.',
      timestamp: '3 days ago',
      avatar: '🌾',
      memberCount: 31,
      createdBy: 'Parent_k8Rt',
      lastActive: '30 minutes ago',
    },
  ];

  /** Mock chat messages per group. `authorId` null = system (e.g. "X joined"). */
  var MOCK_CHAT = {
    '1': [
      { id: 'm1', authorId: 'Parent_7K2m', text: 'Feeling overwhelmed with work today. Juggling a sick kid and deadlines — anyone else been there? 💙', timestamp: '2h ago', avatar: '🌱' },
      { id: 'm2', authorId: 'Parent_A3bM', text: 'Been there. Take it one hour at a time. You\'ve got this.', timestamp: '1h ago', avatar: '🪴' },
      { id: 'm3', authorId: 'Parent_x9Lp', text: 'Sending love. Rest when you can, even 10 mins helps.', timestamp: '45m ago', avatar: '🌿' },
    ],
    '2': [
      { id: 'm1', authorId: 'Parent_A3bM', text: 'How do I apply for childcare subsidy? Single mum in Jurong, girl starting preschool next year.', timestamp: '5h ago', avatar: '🪴' },
      { id: 'm2', authorId: 'Parent_x9Lp', text: 'Check MSF website — you\'ll need your income docs and child\'s birth cert. FSC can help with the form.', timestamp: '4h ago', avatar: '🌿' },
      { id: 'm3', authorId: 'Parent_k8Rt', text: 'I did it through the preschool directly. They forwarded to ECDA. Took about 3 weeks.', timestamp: '3h ago', avatar: '🌾' },
    ],
    '3': [
      { id: 'm1', authorId: 'Parent_x9Lp', text: 'Finally got ComCare approved after 3 months. Don\'t give up — keep following up with your FSC worker!', timestamp: '1d ago', avatar: '🌿' },
      { id: 'm2', authorId: 'Parent_7K2m', text: 'So happy for you! Gives me hope.', timestamp: '1d ago', avatar: '🌱' },
      { id: 'm3', authorId: 'Parent_m4Nq', text: 'Congratulations! Persistence pays off.', timestamp: '23h ago', avatar: '🍀' },
    ],
    '4': [
      { id: 'm1', authorId: 'Parent_m4Nq', text: 'First Father\'s Day as a single dad. Bittersweet but my son drew me a card. We\'re okay. 💙', timestamp: '2d ago', avatar: '🍀' },
      { id: 'm2', authorId: 'Parent_A3bM', text: 'That\'s beautiful. You\'re doing great.', timestamp: '2d ago', avatar: '🪴' },
    ],
    '5': [
      { id: 'm1', authorId: 'Parent_k8Rt', text: 'Best flexible side gigs for single parents? I can only work when kids are in school.', timestamp: '3d ago', avatar: '🌾' },
      { id: 'm2', authorId: 'Parent_A3bM', text: 'Tutoring, food delivery during school hours, or remote admin work. WSG has flexible job listings.', timestamp: '3d ago', avatar: '🪴' },
      { id: 'm3', authorId: 'Parent_x9Lp', text: 'I do freelance proofreading. Set your own hours. Upwork, Fiverr — worth a look.', timestamp: '2d ago', avatar: '🌿' },
    ],
  };

  var QUICK_REPLIES = [
    'Thanks for sharing!',
    'Same here 💙',
    'Sending love',
    'This helps a lot',
    'Here for you',
  ];

  var USER_DISCUSSIONS_KEY = 'trellis_user_discussions';

  function getUserDiscussions() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(USER_DISCUSSIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function addUserDiscussion(d) {
    var list = getUserDiscussions();
    list.unshift(d);
    try {
      if (global.localStorage) global.localStorage.setItem(USER_DISCUSSIONS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getDiscussion(id) {
    var mock = MOCK_DISCUSSIONS.find(function (d) { return d.id === String(id); });
    if (mock) return mock;
    var user = getUserDiscussions().find(function (d) { return d.id === String(id); });
    return user || null;
  }

  function getChatMessages(groupId) {
    var mock = MOCK_CHAT[String(groupId)];
    if (mock) return mock.slice();
    var user = getUserDiscussions().find(function (d) { return d.id === String(groupId); });
    return user ? (user.chatMessages || []).slice() : [];
  }

  function isMentor(authorId) {
    return MENTOR_IDS.indexOf(authorId) >= 0;
  }

  global.TrellisDiscussions = {
    MOCK_DISCUSSIONS: MOCK_DISCUSSIONS,
    MOCK_CHAT: MOCK_CHAT,
    QUICK_REPLIES: QUICK_REPLIES,
    getDiscussion: getDiscussion,
    getChatMessages: getChatMessages,
    isMentor: isMentor,
    getUserDiscussions: getUserDiscussions,
    addUserDiscussion: addUserDiscussion,
  };
})(typeof window !== 'undefined' ? window : this);
