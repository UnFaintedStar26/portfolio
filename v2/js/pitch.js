/* The pitch bar under the hero banner, from content.js (pitch.headline and pitch.support). */
(() => {
  const root = document.getElementById("pitch");
  const pitch = window.SITE && window.SITE.pitch;
  if (!root || !pitch || !(pitch.headline || pitch.support)) return;
  if (pitch.headline) root.append(Object.assign(document.createElement("h2"), { className: "pitch-title", textContent: pitch.headline }));
  if (pitch.support) root.append(Object.assign(document.createElement("p"), { className: "pitch-support", textContent: pitch.support }));
})();
