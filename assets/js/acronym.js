// MIST acronym animation.
// Reads word lists from window.mistWords (injected by the homepage from
// _data/acronym.yaml). Every 3 seconds one letter swaps to its next word.
// To change the words, edit _data/acronym.yaml — not this file.
(function () {
  var words = window.mistWords;
  if (!words) return;

  var indices = { m: 0, i: 0, s: 0, t: 0 };
  var order = ["m", "i", "s", "t"];
  var tick = 0;

  function swapWord(letter) {
    var el = document.getElementById("mist-" + letter);
    var list = words[letter];
    if (!el || !list || list.length < 2) return;

    var next = (indices[letter] + 1) % list.length;

    el.classList.add("exiting");
    setTimeout(function () {
      el.textContent = list[next];
      el.classList.remove("exiting");
      el.classList.add("entering");
      void el.offsetWidth; // force reflow so the transition fires
      el.classList.remove("entering");
      indices[letter] = next;
    }, 250);
  }

  setInterval(function () {
    swapWord(order[tick % order.length]);
    tick++;
  }, 3000);
})();
