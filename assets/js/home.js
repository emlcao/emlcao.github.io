// Home page only: smooth anchor scrolling, mobile menu close, analytics.
(function ($) {
  var OFFSET = 60; // fixed navbar height

  function scrollToHash(hash) {
    if (!hash || hash.length < 2) return false;
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return false;
    $('html, body').animate({ scrollTop: $(el).offset().top - OFFSET });
    return true;
  }

  // Honour a #hash in the URL on first load
  $(window).on('load', function () {
    scrollToHash(window.location.hash);
  });

  // Any link to a hash on THIS page (works for "#research" and "/#research")
  $('body').on('click', 'a[href*="#"]', function (e) {
    var samePage =
      this.hostname === location.hostname &&
      this.pathname.replace(/^\//, '') === location.pathname.replace(/^\//, '');
    if (!samePage) return;

    if (scrollToHash(this.hash)) {
      e.preventDefault();
      if (window.history && history.pushState) {
        history.pushState({}, document.title, this.hash);
      }
      $('.navbar-collapse.in').collapse('hide'); // close hamburger menu on mobile
    }
  });
})(jQuery);

// Microsoft Clarity
(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, 'clarity', 'script', 'z2r9e98z54');
