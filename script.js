/* Page-to-page navigation: prev/next arrows + left/right keyboard shortcuts.
   Order below drives both. To add or reorder pages, edit this list only. */
(function () {
  var PAGES = [
    { file: 'index.html',      label: 'Home' },
    { file: 'experience.html', label: 'Experience' },
    { file: 'websites.html',   label: 'My Websites' },
    { file: '3d-models.html',  label: '3D Artwork' },
    { file: 'contact.html',    label: 'Contact Me' }
  ];

  // Match on the bare page name, not the filename. Netlify's Pretty URLs
  // serve experience.html as /experience, and a directory root ('/', or
  // '/Portfolio/' on project Pages) has no last segment at all.
  function slugify(path) {
    var last = path.substring(path.lastIndexOf('/') + 1);
    return last.replace(/\.html$/i, '').toLowerCase() || 'index';
  }

  var current = slugify(window.location.pathname);
  var i = PAGES.findIndex(function (p) { return slugify(p.file) === current; });
  if (i === -1) return;

  // Home is the start of the sequence — nothing to its left.
  // Forward still wraps, so every page keeps a next arrow.
  var prev = i > 0 ? PAGES[i - 1] : null;
  var next = PAGES[(i + 1) % PAGES.length];

  var CHEVRON = {
    prev: 'M15 4 L7 12 L15 20',
    next: 'M9 4 L17 12 L9 20'
  };

  function makeArrow(dir, page) {
    var a = document.createElement('a');
    a.className = 'page-arrow page-arrow--' + dir;
    a.href = page.file;
    a.setAttribute('aria-label', (dir === 'next' ? 'Next page: ' : 'Previous page: ') + page.label);
    a.innerHTML =
      '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="' + CHEVRON[dir] + '"/></svg>' +
      '<span class="page-arrow-label">' + page.label + '</span>';
    return a;
  }

  if (prev) document.body.appendChild(makeArrow('prev', prev));
  document.body.appendChild(makeArrow('next', next));

  /* Preload the adjacent pages so arrow/key navigation is instant.
     Speculation Rules prerender the whole page (Chrome/Edge); everywhere
     else falls back to prefetching the document into the HTTP cache. */
  (function preloadNeighbours() {
    var urls = [next.file];
    if (prev) urls.push(prev.file);

    var supportsRules = typeof HTMLScriptElement !== 'undefined' &&
                        HTMLScriptElement.supports &&
                        HTMLScriptElement.supports('speculationrules');

    if (supportsRules) {
      var rules = document.createElement('script');
      rules.type = 'speculationrules';
      rules.textContent = JSON.stringify({
        prerender: [{ urls: urls, eagerness: 'immediate' }]
      });
      document.head.appendChild(rules);
      return;
    }

    urls.forEach(function (url) {
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = url;
      document.head.appendChild(link);
    });
  })();

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    // Don't hijack arrows from text fields.
    var t = e.target;
    if (t && t.closest &&
        t.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }

    var target = e.key === 'ArrowRight' ? next : prev;
    if (target) window.location.href = target.file;
  });
})();
