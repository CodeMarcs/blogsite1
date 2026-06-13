/* =============================================================
   ThoughtStream — app.js
   Sections:
     1.  Sample Data
     2.  App State
     3.  Auth (Login / Logout)
     4.  Feed — Render Posts
     5.  Feed — Compose & Submit
     6.  Feed — Post Interactions (Like, Bookmark, Repost)
     7.  Right Sidebar — Trending & Follow Suggestions
     8.  DMs — Conversation List & Chat Window
     9.  Explore Page
    10.  Notifications Page
    11.  Bookmarks Page
    12.  Navigation (page switching)
    13.  Tabs
    14.  Sidebar Collapse & Mobile Menu
    15.  Theme (Light / Dark)
    16.  Toast Notification
    17.  Bootstrap (init on load)
   ============================================================= */


/* ── 1. SAMPLE DATA ────────────────────────────────────────── */

const POSTS = [
    {
        id: 1,
        name: "Maya Chen", handle: "mayabuilds", avatar: "M", time: "2m",
        topic: "Philosophy",
        text: "The most underrated skill in thinking isn't logic — it's knowing when to stop and let an idea breathe. Half of our worst ideas were great ones we didn't sit with long enough.",
        likes: 142, reposts: 38, comments: 24, liked: false, bookmarked: false
    },
    {
        id: 2,
        name: "Jordan Osei", handle: "jordanthinks", avatar: "J", time: "14m",
        topic: "Technology",
        text: "We're building tools that think faster than we can. The question isn't whether AI will be smarter than humans — it's whether we'll stay curious enough to ask the right questions when it is.",
        likes: 89, reposts: 21, comments: 15, liked: false, bookmarked: false
    },
    {
        id: 3,
        name: "Sana Mirza", handle: "sanamirza", avatar: "S", time: "1h",
        topic: "Culture",
        text: "Language is the original interface. Every time we add a word to a culture, we're shipping a feature. Every word that disappears is a feature deprecated. What does it mean when we stop having words for slowness?",
        likes: 214, reposts: 67, comments: 42, liked: false, bookmarked: false
    },
    {
        id: 4,
        name: "Tomás Vega", handle: "tomasv", avatar: "T", time: "3h",
        topic: "Science",
        text: "There's a beautiful tension between wanting to explain everything and accepting that some things just are. Physics keeps pushing the boundary of that second category further and further back.",
        likes: 56, reposts: 12, comments: 8, liked: false, bookmarked: false
    },
    {
        id: 5,
        name: "Priya Nair", handle: "priyanair_", avatar: "P", time: "5h",
        topic: "Writing",
        text: "Good writing is 10% inspiration and 90% deleting the first thing you wrote. The first draft is just you telling yourself the story. Everything after is you making it worth someone else's time.",
        likes: 388, reposts: 94, comments: 61, liked: true, bookmarked: true
    },
    {
        id: 6,
        name: "Felix Müller", handle: "felixthinks", avatar: "F", time: "8h",
        topic: "Ideas",
        text: "Counterintuitive realization: constraints are where creativity actually lives. Infinite canvas → paralysis. The 280-character limit didn't kill Twitter's ideas, it forced them to be sharper.",
        likes: 175, reposts: 44, comments: 29, liked: false, bookmarked: false
    }
];

const TRENDS = [
    { cat: "Philosophy", tag: "#ConsciousnessDebate", count: "24.1K posts" },
    { cat: "Technology",  tag: "#AIAlignment",         count: "89.3K posts" },
    { cat: "Culture",     tag: "#SlowLiving",           count: "12.4K posts" },
    { cat: "Science",     tag: "#QuantumComputing",     count: "41.2K posts" },
    { cat: "Writing",     tag: "#CraftOfWords",         count: "8.9K posts"  },
];

const FOLLOWS = [
    { name: "Kezia Okonkwo", handle: "keziawrites", avatar: "K" },
    { name: "Rafael Lima",   handle: "rafaelthinks", avatar: "R" },
    { name: "Amara Diallo",  handle: "amarad",        avatar: "D" },
];

const DMS_DATA = [
    {
        id: 1, name: "Maya Chen", handle: "mayabuilds", avatar: "M",
        preview: "That's such a good point about the...", time: "2m", unread: 2,
        messages: [
        { from: "them", text: "Hey! Just saw your post about consciousness. Loved it.", time: "10:14" },
        { from: "me",   text: "Thanks! It's something I've been chewing on for weeks.", time: "10:16" },
        { from: "them", text: "That's such a good point about the boundary between thinking and feeling. Do you think AI ever crosses it?", time: "10:18" },
        ]
    },
    {
        id: 2, name: "Jordan Osei", handle: "jordanthinks", avatar: "J",
        preview: "Let's collab on that piece!", time: "1h", unread: 1,
        messages: [
        { from: "them", text: "Hey! Really loved your last post. Would you want to collab on a piece about AI and creativity?", time: "9:00" },
        { from: "me",   text: "That sounds like a great idea, I'm in!", time: "9:15" },
        { from: "them", text: "Let's collab on that piece!", time: "9:20" },
        ]
    },
    {
        id: 3, name: "Sana Mirza", handle: "sanamirza", avatar: "S",
        preview: "You're invited to the writing...", time: "3h", unread: 0,
        messages: [
        { from: "them", text: "You're invited to the writing circle — we meet every Thursday. Would love your voice in there.", time: "Yesterday" },
        { from: "me",   text: "This sounds wonderful, count me in!", time: "Yesterday" },
        { from: "them", text: "Amazing! I'll send the link closer to the date.", time: "Yesterday" },
        ]
    }
];

const NOTIFS = [
    { avatar: "M", name: "Mogu-mogu",   action: "liked your post",    post: "\u201c Enamerls \u201d", time: "2m" },
    { avatar: "K", name: "Kukukrukyaw", action: "reposted your thought", post: "\u201c Edibols \u201d",    time: "15m" },
    { avatar: "H", name: "Hahatchu",  action: "started following you", post: null,                                    time: "1h" },
    { avatar: "A", name: "Aizzz",  action: "replied to your post",  post: "\u201c Kanibalismoooo~...\u201d", time: "2h" },
    { avatar: "I", name: "Iwankuuuu",action: "bookmarked your post",  post: "\u201c lagi nalang talaguhh ...\u201d",   time: "4h" },
];


/* ── 2. APP STATE ───────────────────────────────────────────── */

// Mutable copy of posts so we can add / mutate
let posts = [...POSTS];

// Which DM conversation is open
let activeDM = null;

// Follow states keyed by handle
let followState = {};


/* ── 3. AUTH (LOGIN / LOGOUT) ──────────────────────────────── */

/**
 * Validates the login form and transitions to the app view.
 * Called by the Sign in button and Enter-key listener.
 */
function doLogin() {
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    const errorEl  = document.getElementById('loginError');

    if (!email || !password) {
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display        = 'flex';
    renderAll();
}

/**
 * Resets to the login screen and hides the app.
 */
function doLogout() {
    document.getElementById('app').style.display         = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}


/* ── 4. FEED — RENDER POSTS ────────────────────────────────── */

/**
 * Builds the HTML string for a single post card.
 * @param {Object} p - post data object
 * @returns {string} HTML string
 */
function postHTML(p) {
    return `
        <div class="post" id="post-${p.id}">
        <div class="avatar" style="flex-shrink:0">${p.avatar}</div>
        <div class="post-body">
            <div class="post-header">
            <span class="post-name">${p.name}</span>
            <span class="post-handle">@${p.handle}</span>
            <span class="post-time">${p.time}</span>
            </div>
            <div class="post-topic"># ${p.topic}</div>
            <div class="post-text">${p.text}</div>
            <div class="post-actions">

            <!-- Like -->
            <div class="post-action${p.liked ? ' liked' : ''}" onclick="toggleLike(${p.id}, event)">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                <span>${p.likes}</span>
            </div>

            <!-- Repost -->
            <div class="post-action" onclick="showToast('Reposted!')">
                <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
                <span>${p.reposts}</span>
            </div>

            <!-- Comment -->
            <div class="post-action" onclick="showToast('Replies coming soon!')">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span>${p.comments}</span>
            </div>

            <!-- Bookmark -->
            <div class="post-action${p.bookmarked ? ' bookmarked' : ''}" onclick="toggleBookmark(${p.id}, event)">
                <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </div>

            <!-- Share / Copy link -->
            <div class="post-action" onclick="showToast('Link copied!')">
                <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </div>

            </div>
        </div>
        </div>`;
}

/**
 * Re-renders all posts into #postsContainer.
 */
function renderPosts() {
    document.getElementById('postsContainer').innerHTML = posts.map(postHTML).join('');
}


/* ── 5. FEED — COMPOSE & SUBMIT ────────────────────────────── */

/**
 * Submits a new post from the compose textarea.
 */
function submitPost() {
    const textarea = document.getElementById('composeText');
    const text     = textarea.value.trim();
    if (!text) return;

    const newPost = {
        id: Date.now(),
        name: "Mer", handle: "mer", avatar: "M",
        time: "now", topic: "Ideas",
        text,
        likes: 0, reposts: 0, comments: 0,
        liked: false, bookmarked: false
    };

    posts.unshift(newPost);
    textarea.value = '';
    document.getElementById('charCount').textContent = '280';

    // Prepend directly so we don't re-render the whole list
    document.getElementById('postsContainer')
            .insertAdjacentHTML('afterbegin', postHTML(newPost));
    showToast('Posted!');
}

/**
 * Updates the remaining-character counter as the user types.
 */
function updateCharCount() {
    const remaining = 280 - document.getElementById('composeText').value.length;
    const el        = document.getElementById('charCount');
    el.textContent  = remaining;
    el.style.color  = remaining < 20 ? '#e1306c'
                    : remaining < 50 ? '#f59e0b'
                    : 'var(--text-muted)';
    }

    /**
     * Navigates to the feed and focuses the compose textarea.
     */
    function focusCompose() {
    navigate('feed', document.querySelector('.nav-item'));
    setTimeout(() => document.getElementById('composeText').focus(), 100);
}


/* ── 6. FEED — POST INTERACTIONS ───────────────────────────── */

/**
 * Toggles the like state for a post.
 * Updates both the data model and the DOM in place.
 */
function toggleLike(id, event) {
    event.stopPropagation();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.liked  = !post.liked;
    post.likes += post.liked ? 1 : -1;

    const actionEl = document.querySelector(`#post-${id} .post-action:first-child`);
    if (actionEl) {
        actionEl.classList.toggle('liked', post.liked);
        actionEl.querySelector('span').textContent = post.likes;
    }
}

/**
 * Toggles the bookmark state for a post.
 * Also refreshes the bookmarks page if currently visible.
 */
function toggleBookmark(id, event) {
    event.stopPropagation();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.bookmarked = !post.bookmarked;

    document.querySelectorAll(`#post-${id} .post-action:nth-child(4)`)
            .forEach(el => el.classList.toggle('bookmarked', post.bookmarked));

    showToast(post.bookmarked ? 'Bookmarked!' : 'Removed bookmark');

    // Refresh bookmarks page if it's currently visible
    if (document.getElementById('bookmarksPage').style.display !== 'none') {
        renderBookmarks();
    }
}


/* ── 7. RIGHT SIDEBAR — TRENDING & FOLLOW SUGGESTIONS ─────── */

/**
 * Renders the trending topics widget.
 */
function renderTrending() {
    const widget = document.getElementById('trendingWidget');
    if (!widget) return;
    widget.innerHTML = TRENDS.map(t => `
        <div class="trend-item" onclick="navigate('explore', document.querySelector('.nav-item:nth-child(2)')); setBottomNav('bnExplore')">
        <div class="trend-cat">${t.cat}</div>
        <div class="trend-tag">${t.tag}</div>
        <div class="trend-count">${t.count}</div>
        </div>`).join('');
}

/**
 * Renders the "who to follow" suggestions widget.
 */
function renderFollow() {
    const widget = document.getElementById('followWidget');
    if (!widget) return;
    widget.innerHTML = FOLLOWS.map(f => `
        <div class="suggest-item">
        <div class="avatar" style="width:38px;height:38px;font-size:14px">${f.avatar}</div>
        <div class="suggest-info">
            <div class="suggest-name">${f.name}</div>
            <div class="suggest-handle">@${f.handle}</div>
        </div>
        <button class="follow-btn${followState[f.handle] ? ' following' : ''}"
                onclick="toggleFollow('${f.handle}', this)">
            ${followState[f.handle] ? 'Following' : 'Follow'}
        </button>
        </div>`).join('');
}

/**
 * Toggles the follow state for a suggested user.
 */
function toggleFollow(handle, btn) {
    followState[handle] = !followState[handle];
    btn.classList.toggle('following', followState[handle]);
    btn.textContent = followState[handle] ? 'Following' : 'Follow';

    // If the Following tab is currently active, refresh it
    const activeTab = document.querySelector('#feedPage .tab.active');
    if (activeTab && activeTab.textContent.trim() === 'Following') {
        activeTab.click();
    }
}


/* ── 8. DMs — CONVERSATION LIST & CHAT WINDOW ─────────────── */

/**
 * Renders the DM conversation list.
 */
function renderDMs() {
    const list = document.getElementById('dmList');
    if (!list) return;
    list.innerHTML = DMS_DATA.map(d => `
        <div class="dm-item${activeDM === d.id ? ' active' : ''}" onclick="openDM(${d.id})">
        <div class="avatar" style="width:42px;height:42px;font-size:16px">${d.avatar}</div>
        <div class="dm-info">
            <div class="dm-name">${d.name}</div>
            <div class="dm-preview">${d.preview}</div>
        </div>
        <div class="dm-meta">
            <div class="dm-time">${d.time}</div>
            ${d.unread ? `<div class="dm-unread">${d.unread}</div>` : ''}
        </div>
        </div>`).join('');
}

/**
 * Closes the chat panel on mobile (goes back to DM list).
 */
function closeDMChat() {
    if (window.innerWidth <= 600) {
        document.getElementById('dmsPage').classList.remove('dm-chat-open');
    }
}

/**
 * Opens a DM conversation and renders the chat window.
 */
function openDM(id) {
    activeDM = id;
    const dm = DMS_DATA.find(d => d.id === id);
    dm.unread = 0;   // mark as read
    renderDMs();
    // On mobile: show chat panel
    document.getElementById('dmsPage').classList.add('dm-chat-open');

    chatArea.innerHTML = `
        <div class="chat-header">
        <button class="chat-back-btn" onclick="closeDMChat()" aria-label="Back">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="avatar" style="width:38px;height:38px;font-size:15px">${dm.avatar}</div>
        <div>
            <div style="font-size:15px;font-weight:600">${dm.name}</div>
            <div style="font-size:12px;color:var(--text-muted)">@${dm.handle}</div>
        </div>
        </div>

        <div class="chat-messages" id="chatMsgs">
        ${dm.messages.map(m => `
            <div class="msg ${m.from === 'me' ? 'sent' : 'recv'}">
            <div class="msg-bubble">${m.text}</div>
            <div class="msg-time">${m.time}</div>
            </div>`).join('')}
        </div>

        <div class="chat-input-area">
        <textarea class="chat-input" id="chatInput"
            placeholder="Write a message…" rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg(${id})}">
        </textarea>
        <button class="chat-send" onclick="sendMsg(${id})">
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
        </div>`;

  // Scroll to the latest message
    const msgEl = document.getElementById('chatMsgs');
    if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;
}

/**
 * Sends a new message in the active DM conversation.
 */
function sendMsg(id) {
    const input = document.getElementById('chatInput');
    const text  = input.value.trim();
    if (!text) return;

  const dm = DMS_DATA.find(d => d.id === id);
    dm.messages.push({ from: 'me', text, time: 'now' });
    input.value = '';

  const msgEl = document.getElementById('chatMsgs');
    msgEl.insertAdjacentHTML('beforeend', `
        <div class="msg sent">
        <div class="msg-bubble">${text}</div>
        <div class="msg-time">now</div>
        </div>`);
    msgEl.scrollTop = msgEl.scrollHeight;
}


/* ── 9. EXPLORE PAGE ───────────────────────────────────────── */

/**
 * Renders trending topics on the Explore page.
 */
function renderExplore() {
    const el = document.getElementById('exploreTrends');
    if (!el) return;
    el.innerHTML = TRENDS.map(t => `
        <div class="trend-item trend-item--lg" onclick="navigate('explore', document.querySelector('.nav-item:nth-child(2)')); setBottomNav('bnExplore')">
        <div class="trend-cat">${t.cat}</div>
        <div class="trend-tag trend-tag--lg">${t.tag}</div>
        <div class="trend-count">${t.count}</div>
        </div>`).join('');
}


/* ── 10. NOTIFICATIONS PAGE ────────────────────────────────── */

/**
 * Renders the activity notifications list.
 */
function renderNotifs() {
    const el = document.getElementById('notifList');
    if (!el) return;
    el.innerHTML = NOTIFS.map(n => `
        <div class="notif-item">
            <div class="avatar notif-avatar">${n.avatar}</div>
            <div class="notif-body">
                <span class="notif-name">${n.name}</span>
                <span class="notif-action"> ${n.action}</span>
                ${n.post ? `<div class="notif-post">${n.post}</div>` : ''}
            </div>
            <div class="notif-time">${n.time}</div>
        </div>`).join('');
}


/* ── 11. BOOKMARKS PAGE ────────────────────────────────────── */

/**
 * Renders all bookmarked posts, or an empty-state message.
 */
function renderBookmarks() {
    const el = document.getElementById('bookmarksList');
    if (!el) return;

  const bookmarked = posts.filter(p => p.bookmarked);
  if (bookmarked.length === 0) {
    el.innerHTML = `
        <div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
            <svg style="width:48px;height:48px;stroke:var(--text-muted);fill:none;stroke-width:1.5;opacity:.3;margin:0 auto 12px;display:block"
                viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
                <p>No bookmarks yet</p>
        </div>`;
    return;
  }
  el.innerHTML = bookmarked.map(postHTML).join('');
}


/* ── 12. NAVIGATION (PAGE SWITCHING) ───────────────────────── */

const ALL_PAGES = ['feed', 'dms', 'explore', 'notifications', 'bookmarks', 'settings'];

/**
 * Switches to the named page, hides all others, and updates the active nav item.
 * @param {string} page - page key (matches page IDs like "feedPage")
 * @param {Element|null} navEl - the nav-item element to mark active
 */
function navigate(page, navEl) {
    closeMobileMenu();

  // Hide all pages
ALL_PAGES.forEach(p => {
        document.getElementById(p + 'Page').style.display = 'none';
  });

  // Show the selected page
    document.getElementById(page + 'Page').style.display = '';

  // Show right sidebar only on feed and explore
    const rightCol = document.getElementById('rightCol');
    if (rightCol) {
        rightCol.style.display = ['feed', 'explore'].includes(page) ? '' : 'none';
  }

  // Update active nav highlight
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navEl) navEl.classList.add('active');

  // Page-specific side effects
    if (page === 'bookmarks')   renderBookmarks();
    if (page === 'settings')    syncDarkToggle();
    if (page === 'feed')        document.getElementById('feedPage').style.display = '';
}


/* ── 13. TABS ──────────────────────────────────────────────── */

// Handles who the user follows (pre-seed a couple so Following tab has content)
const DEFAULT_FOLLOWS = ['mayabuilds', 'sanamirza', 'felixthinks'];

/**
 * Activates a feed tab and updates the posts shown.
 * @param {Element} el  - the clicked tab element
 * @param {string}  key - 'for-you' | 'following' | 'trending'
 */
function setTab(el, key) {
    document.querySelectorAll('#feedPage .tabs .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    const container = document.getElementById('postsContainer');

    if (key === 'for-you') {
        container.innerHTML = posts.map(postHTML).join('');

    } else if (key === 'following') {
        // Merge static defaults + anything the user toggled on in the widget
        const followed = new Set([
            ...DEFAULT_FOLLOWS,
            ...Object.keys(followState).filter(h => followState[h])
        ]);
        const filtered = posts.filter(p => followed.has(p.handle));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
                    <svg style="width:48px;height:48px;stroke:var(--text-muted);fill:none;stroke-width:1.5;opacity:.3;margin:0 auto 12px;display:block" viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                    <p style="font-size:15px;font-weight:500;margin-bottom:6px">No one followed yet</p>
                    <p style="font-size:13px">Follow people from the suggestions on the right</p>
                </div>`;
        } else {
            container.innerHTML = filtered.map(postHTML).join('');
        }

    } else if (key === 'trending') {
        // Show posts sorted by likes descending
        const sorted = [...posts].sort((a, b) => b.likes - a.likes);
        container.innerHTML = sorted.map(postHTML).join('');
    }
}


/* ── 14. SIDEBAR COLLAPSE & MOBILE MENU ────────────────────── */

/**
 * Toggles the sidebar between expanded and icon-only collapsed states (desktop).
 */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

/**
 * Opens the slide-in sidebar on mobile, shows the backdrop overlay.
 */
function openMobileMenu() {
    document.getElementById('sidebar').classList.add('mobile-open');
    document.getElementById('mobileOverlay').classList.add('show');
}

/**
 * Closes the mobile sidebar and hides the backdrop.
 */
function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('mobileOverlay').classList.remove('show');
}


/* ── 15. THEME (LIGHT / DARK) ──────────────────────────────── */

/**
 * Toggles between light and dark theme by changing data-theme on <html>.
 */
function toggleTheme() {
    const html   = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    syncDarkToggle();
}

/**
 * Keeps the Settings dark-mode toggle checkbox in sync with the current theme.
 */
function syncDarkToggle() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
  }
}


/* ── 16. TOAST NOTIFICATION ────────────────────────────────── */

let toastTimer = null;

/**
 * Shows a brief toast message at the bottom of the screen.
 * @param {string} message - text to display
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}


/* ── 17. BOOTSTRAP ─────────────────────────────────────────── */

/**
 * Initialises all dynamic content once the user has logged in.
 */
function renderAll() {
    renderPosts();
    renderTrending();
    renderFollow();
    renderDMs();
    renderExplore();
    renderNotifs();
    renderBookmarks();
    syncDarkToggle();
}

/**
 * Sets the active state on the bottom nav bar (mobile).
 */
function setBottomNav(id) {
    document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

// Allow Enter key to submit the login form
document.addEventListener('keydown', e => {
    const loginVisible = document.getElementById('loginScreen').style.display !== 'none';
    if (e.key === 'Enter' && loginVisible) doLogin();
});