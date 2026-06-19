(function() {
  // threshold:0 so even blocks taller than the viewport (e.g. the full
  // publications list) reveal as soon as any part enters view — a tall element
  // can never reach a high visible ratio, so a non-zero threshold would leave
  // it stuck at opacity:0.
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });

  // Safety net: if anything is still hidden after load (e.g. JS timing or no
  // IntersectionObserver support), make sure content is never permanently
  // invisible.
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('revealed');
      });
    }, 300);
  });
})();
