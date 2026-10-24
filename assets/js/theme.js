(function () {
  var storageKey = 'theme-preference';

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getThemePreference() {
    try {
      var stored = localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      // LocalStorage might be disabled or unavailable
    }
    return getSystemPreference();
  }

  function setThemePreference(theme, persist) {
    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {}
    }
    document.documentElement.setAttribute('data-theme', theme);
    updateUI(theme);
  }

  function updateUI(theme) {
    var isDark = theme === 'dark';
    var nextThemeText = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    var iconClass = isDark ? 'fa fa-sun-o theme-toggle-icon' : 'fa fa-moon-o theme-toggle-icon';

    var buttons = document.querySelectorAll('.theme-toggle-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-label', nextThemeText);
      buttons[i].setAttribute('title', nextThemeText);
    }

    var icons = document.querySelectorAll('.theme-toggle-icon');
    for (var j = 0; j < icons.length; j++) {
      icons[j].className = iconClass;
    }
  }

  function toggleTheme(e) {
    if (e && e.preventDefault) e.preventDefault();
    var currentTheme = document.documentElement.getAttribute('data-theme') || getThemePreference();
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(newTheme, true);
  }

  // --- Category Filtering for posts.html ---
  function initCategoryFilter() {
    var postCards = document.querySelectorAll('#post-list .post-card');
    if (!postCards.length) return;

    var filterBanner = document.getElementById('filter-banner');
    var filterTagName = document.getElementById('filter-tag-name');
    var clearFilterBtn = document.getElementById('clear-filter-btn');
    var noPostsMsg = document.getElementById('no-posts-message');
    var categoryLinks = document.querySelectorAll('.sidebar-categories .category-link');

    function applyFilter(category, updateHistory) {
      var catLower = (category || 'all').toLowerCase().trim();
      var visibleCount = 0;

      var visibleCards = [];
      postCards.forEach(function (card) {
        var cardCats = (card.getAttribute('data-categories') || '').toLowerCase().split(',');
        if (catLower === 'all' || cardCats.indexOf(catLower) !== -1) {
          card.style.display = '';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      // Update dividers between visible cards
      var dividers = document.querySelectorAll('#post-list .post-divider');
      dividers.forEach(function (div) { div.style.display = 'none'; });
      for (var v = 0; v < visibleCards.length - 1; v++) {
        var nextEl = visibleCards[v].nextElementSibling;
        while (nextEl && !nextEl.classList.contains('post-divider')) {
          nextEl = nextEl.nextElementSibling;
        }
        if (nextEl) nextEl.style.display = '';
      }

      if (noPostsMsg) {
        noPostsMsg.style.display = visibleCards.length === 0 ? 'block' : 'none';
      }

      // Update Active Category Links in Sidebar
      categoryLinks.forEach(function (link) {
        var linkCat = (link.getAttribute('data-category') || '').toLowerCase();
        if (linkCat === catLower) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Show / Hide filter banner
      if (filterBanner && filterTagName) {
        if (catLower === 'all') {
          filterBanner.style.display = 'none';
        } else {
          filterTagName.textContent = category;
          filterBanner.style.display = 'flex';
        }
      }

      if (updateHistory && window.history && window.history.pushState) {
        var newUrl = catLower === 'all' 
          ? window.location.pathname 
          : window.location.pathname + '?category=' + encodeURIComponent(category);
        window.history.pushState({ category: category }, '', newUrl);
      }
    }

    // Read URL param on load
    var urlParams = new URLSearchParams(window.location.search);
    var initialCategory = urlParams.get('category');
    if (initialCategory) {
      applyFilter(initialCategory, false);
    }

    // Handle clicks on tag pills & sidebar links
    document.addEventListener('click', function (e) {
      var target = e.target.closest('.tag-pill, .category-link');
      if (target && target.hasAttribute('data-category')) {
        e.preventDefault();
        var cat = target.getAttribute('data-category');
        applyFilter(cat, true);
      }
    });

    if (clearFilterBtn) {
      clearFilterBtn.addEventListener('click', function (e) {
        e.preventDefault();
        applyFilter('all', true);
      });
    }

    window.addEventListener('popstate', function () {
      var params = new URLSearchParams(window.location.search);
      applyFilter(params.get('category') || 'all', false);
    });
  }

  // --- Copy Code Button for Code Blocks ---
  function initCopyCode() {
    var preElements = document.querySelectorAll('.post-body pre, .container pre');
    preElements.forEach(function (pre) {
      // Don't add multiple times
      if (pre.parentNode.classList.contains('code-block-wrapper')) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.innerHTML = '<i class="fa fa-clone" aria-hidden="true"></i> Copy';

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.innerText || code.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> Copied!';
          setTimeout(function () {
            btn.innerHTML = '<i class="fa fa-clone" aria-hidden="true"></i> Copy';
          }, 2000);
        }).catch(function () {
          btn.textContent = 'Failed';
        });
      });

      wrapper.appendChild(btn);
    });
  }

  // --- Main Init ---
  function init() {
    updateUI(document.documentElement.getAttribute('data-theme') || getThemePreference());

    var buttons = document.querySelectorAll('.theme-toggle-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].removeEventListener('click', toggleTheme);
      buttons[i].addEventListener('click', toggleTheme);
    }

    initCategoryFilter();
    initCopyCode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // React to OS scheme change if user hasn't set an explicit preference
  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var handleChange = function (e) {
      try {
        if (!localStorage.getItem(storageKey)) {
          var sysTheme = e.matches ? 'dark' : 'light';
          setThemePreference(sysTheme, false);
        }
      } catch (err) {}
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }
  }
})();
