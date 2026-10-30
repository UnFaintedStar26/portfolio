/* Grid fields (css/grid.css), shared by every page.
   - A small patch brightens under a mouse pointer and follows it (mouse only, off with reduced motion).
   - window.softenGridFields() turns each field's stepped outline (--shape) into a blurred mask at the field's
     real size, so the grid fades into the page instead of stopping on a hard line. Call it after a field
     is added, moved or resized. */
(function () {
  var rm = matchMedia("(prefers-reduced-motion: reduce)");
  var fields = function () { return document.querySelectorAll(".grid-field"); };
  var unlight = function () { fields().forEach(function (g) { g.classList.remove("is-lit"); }); };

  addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || rm.matches) return;
    fields().forEach(function (g) {
      var b = g.getBoundingClientRect();
      var x = e.clientX - b.left;
      var y = e.clientY - b.top;
      var near = b.width > 0 && x > -60 && y > -60 && x < b.width + 60 && y < b.height + 60;
      if (near) {
        g.style.setProperty("--mx", x + "px");
        g.style.setProperty("--my", y + "px");
      }
      g.classList.toggle("is-lit", near);
    });
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", unlight);
  rm.addEventListener("change", unlight);

  /* The outline is inset by the blur so the fade never meets the box edge. */
  window.softenGridFields = function () {
    fields().forEach(function (g) {
      var r = g.getBoundingClientRect();
      var w = r.width, h = r.height;
      if (!w || !h) return;
      var shape = getComputedStyle(g).getPropertyValue("--shape");
      var pts = [];
      shape.replace(/([\d.]+)%\s+([\d.]+)%/g, function (_, px, py) { pts.push([+px / 100, +py / 100]); });
      if (pts.length < 3) return;
      var blur = Math.min(18, Math.max(6, Math.min(w, h) * 0.06));
      var pad = 2 * blur;
      var poly = pts.map(function (p) {
        return (pad + p[0] * (w - 2 * pad)).toFixed(1) + "," + (pad + p[1] * (h - 2 * pad)).toFixed(1);
      }).join(" ");
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '">' +
        '<filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="' + blur.toFixed(1) + '"/></filter>' +
        '<polygon points="' + poly + '" fill="#fff" filter="url(#f)"/></svg>';
      var url = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
      g.style.webkitMaskImage = url;
      g.style.maskImage = url;
      g.style.clipPath = "none";
    });
  };
})();
