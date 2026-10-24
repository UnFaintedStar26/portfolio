(() => {
  "use strict";

  const rm = matchMedia("(prefers-reduced-motion: reduce)");
  const fp = matchMedia("(hover: hover) and (pointer: fine)");
  const narrow = matchMedia("(max-width: 640px)");
  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const works = window.WORKS || [];
  const ctx = document.createElement("canvas").getContext("2d");

  /* Hand-drawn singer in a hood, head thrown back, mouth wide open over a mic held in the fist. Facing left, 420 x 540 box. */
  const BODY =
    "M150 58 C180 26 236 12 282 16 C332 22 362 50 374 92 C388 142 390 204 392 256 C394 304 402 342 420 364 L420 540 L214 540" +
    " C208 500 200 466 190 438 C182 414 172 396 160 384 C150 360 140 336 132 318 C124 308 110 302 96 300" +
    " C86 300 78 294 78 284 C78 276 80 268 84 262 L134 230 L90 194 C84 190 82 184 84 180 C86 176 90 175 94 175" +
    " C86 172 78 166 74 158 C84 148 98 134 106 124 C104 116 106 108 112 102 C118 90 132 72 150 58 Z";
  const MIC = "M16 262 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0 Z";
  const GRIP = "M70 276 L44 290 L92 372 L120 358 Z";
  const FIST = "M78 330 C84 312 108 304 128 308 C150 314 162 334 160 358 C158 384 142 400 118 400 C94 400 78 386 78 364 Z";
  const ARM = "M92 384 C114 432 136 488 148 540 L250 540 C226 476 196 418 156 366 Z";
  const CABLE = "M90 390 C72 432 52 478 46 540 L62 540 C68 482 88 438 106 396 Z";
  const FIGURE = [BODY, MIC, GRIP, FIST, ARM, CABLE].map((d) => new Path2D(d));

  /* Tone regions, applied in order: "*" darkens, "+" lightens, "=" sets. */
  const TONES = [
    ["M150 58 C132 72 118 90 112 102 L40 102 L40 360 L150 360 C182 300 198 240 198 186 C198 130 178 86 150 58 Z", "+", 0.16],
    ["M150 58 C178 86 198 130 198 186 C198 240 182 300 150 352 L170 366 C208 306 224 246 224 186 C224 120 196 70 160 48 Z", "=", 0.02],
    ["M150 58 C180 26 236 12 282 16 C236 26 190 44 164 70 Z", "+", 0.3],
    ["M300 36 C330 110 342 210 334 316 C352 210 346 110 318 40 Z", "*", 0.3],
    ["M354 118 C364 200 368 280 382 342 C374 262 370 180 362 108 Z", "+", 0.16],
    ["M244 60 C272 130 280 220 266 330 C262 230 256 140 232 72 Z", "*", 0.55],
    ["M102 112 C114 100 148 102 162 122 C156 146 126 156 104 140 Z", "=", 0],
    ["M100 104 C116 92 146 94 160 110 C146 100 118 100 102 112 Z", "+", 0.2],
    ["M122 156 C152 160 174 192 170 232 C152 222 132 198 122 156 Z", "+", 0.08],
    ["M134 230 C144 236 150 248 150 262 C138 256 124 260 110 270 Z", "*", 0.35],
    ["M96 300 C110 302 124 308 132 318 C140 336 150 360 160 384 L178 376 C164 340 152 310 142 294 C128 288 110 290 96 300 Z", "=", 0.05],
    [ARM, "=", 0.3],
    ["M92 384 C114 432 136 488 148 540 L170 540 C156 486 136 430 112 380 Z", "+", 0.22],
    [CABLE, "=", 0.5],
    [GRIP, "=", 0.5],
    ["M44 290 L56 284 L102 367 L92 372 Z", "+", 0.3],
    ["M84 320 C94 302 124 296 146 302 C172 310 184 336 182 362 C180 392 162 410 132 410 L114 404 Z", "=", 0.03],
    [FIST, "=", 0.8],
    ["M78 336 L106 331 L106 341 L78 346 Z", "=", 0.05],
    ["M78 358 L104 353 L104 363 L78 368 Z", "=", 0.05],
    ["M80 378 C96 396 128 402 160 376 L160 404 L80 404 Z", "*", 0.5],
    [MIC, "=", 0.7],
    ["M46 232 a30 30 0 0 1 0 60 a36 36 0 0 0 0 -60 Z", "*", 0.45],
    ["M26 248 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 Z", "=", 1],
  ].map(([d, op, v]) => [new Path2D(d), op, v]);

  const onFigure = (x, y) => FIGURE.some((p) => ctx.isPointInPath(p, x, y));

  function headTone(x, y) {
    if (!onFigure(x, y)) return 0;
    let t = 0.6 - (0.38 * (x - 60)) / 330;
    for (const [p, op, v] of TONES) {
      if (!ctx.isPointInPath(p, x, y)) continue;
      t = op === "*" ? t * v : op === "+" ? t + v : v;
    }
    /* The print runs out of ink toward the bottom edge, so the figure fades instead of being cut. */
    return t - 0.5 * Math.max(0, (y - 400) / 140);
  }

  /* A coarse screen on a 45 degree lattice, run like a worn photocopy: dots wander off the grid,
     ink gain drifts across the sheet, and a few dots drop out in the lights. */
  const hash = (a) => { const n = Math.sin(a) * 43758.5453; return n - Math.floor(n); };
  function screenPath(w, h, cell, tone) {
    const s = cell * Math.SQRT1_2;
    const max = cell * 0.58;
    let d = "";
    for (let i = 0; i <= Math.ceil((w + h) / (2 * s)); i++) {
      for (let j = Math.floor(-w / (2 * s)); j <= Math.ceil(h / (2 * s)); j++) {
        const x = (i - j) * s + (hash(i * 269.5 + j * 183.3) - 0.5) * cell * 0.24;
        const y = (i + j) * s + (hash(i * 419.2 + j * 371.9) - 0.5) * cell * 0.24;
        if (x < 0 || x > w || y < 0 || y > h) continue;
        const base = tone(x, y);
        if (base <= 0) continue;
        const t = clamp(base + (hash(i * 127.1 + j * 311.7) - 0.5) * 0.16, 0, 1);
        if (t < 0.5 && hash(i * 74.7 + j * 246.1) > 0.93) continue;
        const gain = 1 + 0.13 * Math.sin(x / 97 + y / 61) * Math.cos(y / 43 - x / 151);
        const r = max * gain * Math.sqrt(t + 0.35 * t * (1 - t));
        if (r < 0.9) continue;
        d += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
      }
    }
    return d;
  }

  /* Work index */
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const coverSrc = (w) => `../../${w.images[0].src}`;
  const list = $("titles");
  list.innerHTML = works
    .map(
      (w) =>
        `<li><a class="row" href="../../project.html?id=${w.id}" target="_parent">` +
        `<span class="row-title">${w.title}</span>` +
        `<span class="row-meta"><span class="mark"></span>${w.year} · ${cap(w.category)} · ${w.medium}</span>` +
        `<img class="row-cover" src="${coverSrc(w)}" alt=""></a></li>`
    )
    .join("");
  const rows = [...list.querySelectorAll(".row")];
  /* A cover that fails to load leaves its title on black, never a broken image. */
  rows.forEach((row, i) => {
    row.querySelector(".row-cover").addEventListener("error", (e) => {
      e.target.replaceWith(Object.assign(document.createElement("span"), { className: "row-cover cover-miss", textContent: works[i].title, ariaHidden: "true" }));
    }, { once: true });
  });
  if (works.length) {
    const years = works.map((w) => w.year);
    $("work-count").textContent = `${works.length} works, ${Math.min(...years)} to ${Math.max(...years)}.`;
  }

  /* Spotlight */
  const spot = works.find((w) => w.id === "night-shift") || works.find((w) => w.featured);
  const spotSection = $("spotlight");
  const spotArt = $("spot-art");
  const spotPlate = document.querySelector(".spot-plate");
  const pattern = $("screen");
  const screenDot = $("screen-dot");
  const spotImg = $("spot-img");
  const regA = $("reg-a");
  const regB = $("reg-b");
  const spotMiss = $("spot-miss");
  const poster = { w: 2, h: 3 };
  const sheet = { x: 0, y: 0, w: 0, h: 0 };
  let spotSet = false;
  if (spot) {
    const src = coverSrc(spot);
    $("spot-title").textContent = spot.title;
    $("spot-meta").textContent = [cap(spot.category), spot.year, spot.medium, spot.size, spot.client].filter(Boolean).join(" · ");
    $("spot-summary").textContent = spot.summary;
    $("spot-approach").textContent = spot.approach;
    $("spot-link").href = `../../project.html?id=${spot.id}`;
    spotMiss.textContent = spot.title;
    spotArt.setAttribute("aria-label", spot.images[0].alt);
    spotImg.setAttribute("href", src);
    const probe = new Image();
    probe.onload = () => {
      poster.w = probe.naturalWidth;
      poster.h = probe.naturalHeight;
      fit();
    };
    probe.onerror = () => spotSection.classList.add("is-missing");
    probe.src = src;
  }

  /* The whole poster, never cropped. Wide screens hang it full height and centre it with the plate as one sheet,
     the plate running from the poster's top edge to its bottom edge. Narrow screens stack the poster over the plate. */
  function place() {
    const W = spotArt.clientWidth;
    const H = spotArt.clientHeight;
    if (!W || !H) return;
    /* Read the layout the stylesheet applied: during a resize the media query can still report the old width. */
    const wide = getComputedStyle(spotPlate).position === "absolute";
    const m = wide ? 56 : 20;
    const gap = 88;
    const s = Math.min(((wide ? W - 320 - gap : W) - 2 * m) / poster.w, (H - 2 * m) / poster.h);
    if (!(s > 0)) return;
    Object.assign(sheet, { w: poster.w * s, h: poster.h * s });
    sheet.y = (H - sheet.h) / 2;
    if (wide) {
      const plateW = Math.min(480, W - 2 * m - gap - sheet.w);
      const left = (W - plateW - gap - sheet.w) / 2;
      sheet.x = left + plateW + gap;
      Object.assign(spotPlate.style, { left: `${left}px`, top: `${sheet.y}px`, width: `${plateW}px`, height: `${sheet.h}px` });
    } else {
      sheet.x = (W - sheet.w) / 2;
      Object.assign(spotPlate.style, { left: "", top: "", width: "", height: "" });
    }
    spotImg.setAttribute("x", sheet.x);
    spotImg.setAttribute("y", sheet.y);
    spotImg.setAttribute("width", sheet.w);
    spotImg.setAttribute("height", sheet.h);
    const a = spotArt.getBoundingClientRect();
    const st = spotArt.parentElement.getBoundingClientRect();
    Object.assign(spotMiss.style, { left: `${a.left - st.left + sheet.x}px`, top: `${a.top - st.top + sheet.y}px`, width: `${sheet.w}px`, height: `${sheet.h}px` });
  }

  /* Scroll scrubs the screen from a blurred coarse dot to the clear print; the registration marks settle with it. */
  function screen() {
    const box = spotSection.getBoundingClientRect();
    const span = box.height - innerHeight;
    const settled = rm.matches || span <= 0 || spotSection.contains(document.activeElement);
    const p = settled ? 1 : clamp(-box.top / (span * 0.85), 0, 1);
    const cell = 18 - 10 * p;
    pattern.setAttribute("width", cell);
    pattern.setAttribute("height", cell);
    screenDot.setAttribute("cx", cell / 2);
    screenDot.setAttribute("cy", cell / 2);
    screenDot.setAttribute("r", cell * (0.42 + 0.34 * p));
    spotImg.style.filter = p < 1 ? `blur(${4 * (1 - p)}px) brightness(${1 + 1.2 * (1 - p)})` : "";
    const off = 16 * (1 - p);
    const mx = Math.max(16 + off, sheet.x - 24);
    regA.setAttribute("transform", `translate(${mx + off} ${sheet.y + 24 - off * 0.6})`);
    regB.setAttribute("transform", `translate(${mx - off * 0.5} ${sheet.y + sheet.h - 24 + off})`);
    spotSet = p === 1;
    regA.classList.toggle("is-set", spotSet);
    regB.classList.toggle("is-set", spotSet);
  }

  /* The target: one red mark. It parks soft on the mic, aims as the pointer over the art, and locks sharp on the work in view. */
  const LOOK = {
    park: { ring: 1, inner: 0.6, dot: 0.06, rot: 0, cin: 0.3, cout: 1.22, blur: 2.6 },
    aim: { ring: 1, inner: 0.36, dot: 0.06, rot: 0, cin: 0.14, cout: 1.2, blur: 0 },
    lock: { ring: 1.04, inner: 0, dot: 0, rot: 0, cin: 0.86, cout: 1.14, blur: 0 },
  };
  const AIM_R = 22;
  const headSvg = document.querySelector(".head");
  const parkEl = document.querySelector(".park");
  const scopeEl = $("scope");
  const scopeImg = scopeEl.appendChild(new Image());
  scopeImg.alt = "";
  const target = $("target");
  const parts = {
    mark: $("t-mark"), ring: $("t-ring"), inner: $("t-inner"), dot: $("t-dot"), cross: $("t-cross"), crossPath: $("t-cross-path"),
  };
  const state = { zone: null, px: 0, py: 0, row: null };
  const seen = new Set();
  let cur = null;
  let raf = 0;

  const center = (el) => {
    const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 };
  };
  /* The picture inside a contained cover (pinned top left), or the whole box when the cover is missing. */
  function coverAt(el) {
    const b = el.getBoundingClientRect();
    const k = el.naturalWidth ? Math.min(b.width / el.naturalWidth, b.height / el.naturalHeight) : 0;
    const w = k ? el.naturalWidth * k : b.width;
    const h = k ? el.naturalHeight * k : b.height;
    return { x: b.left + w / 2, y: b.top + h / 2, r: 0.42 * Math.min(w, h) };
  }
  /* The clear print's focal point: a fixed spot on the sheet, since the works carry no focal data. */
  function posterAt() {
    const b = spotArt.getBoundingClientRect();
    return { x: b.left + sheet.x + sheet.w * 0.5, y: b.top + sheet.y + sheet.h * 0.42, r: sheet.w * 0.3 };
  }
  function goal() {
    if (state.zone === "art") return { x: state.px, y: state.py, r: center(parkEl).r, ...LOOK.aim };
    if (state.zone === "cover") return { x: state.px, y: state.py, r: AIM_R, ...LOOK.aim };
    if (spotSet) {
      const f = posterAt();
      if (f.y > 0 && f.y < innerHeight) return { ...f, ...LOOK.lock };
    }
    if (seen.has("index")) {
      if (!narrow.matches) return { ...center(scopeEl), ...LOOK.lock };
      if (state.row) return { ...coverAt(state.row.querySelector(".row-cover")), ...LOOK.lock };
    }
    return { ...center(parkEl), ...LOOK.park };
  }

  function draw() {
    const R = cur.r * cur.ring;
    target.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
    parts.mark.style.filter = cur.blur > 0.05 ? `blur(${cur.blur.toFixed(2)}px)` : "";
    parts.ring.setAttribute("r", R);
    parts.inner.setAttribute("r", cur.r * cur.inner);
    parts.dot.setAttribute("r", cur.r * cur.dot);
    const a = R * cur.cin;
    const b = R * cur.cout;
    parts.crossPath.setAttribute("d", `M${-b} 0H${-a}M${a} 0H${b}M0 ${-b}V${-a}M0 ${a}V${b}`);
    parts.cross.setAttribute("transform", `rotate(${cur.rot})`);
  }

  function frame() {
    const g = goal();
    /* A home that has scrolled away is reached at once, so the mark never streaks across the screen to get there. */
    const away = g.y + g.r < 0 || g.y - g.r > innerHeight;
    let moving = false;
    for (const k in g) {
      const delta = g[k] - cur[k];
      if (rm.matches || away || Math.abs(delta) < 0.05) cur[k] = g[k];
      else {
        /* ponytail: per-frame easing, so the lag scales with refresh rate; switch to dt-based easing if 120 Hz feels too tight */
        cur[k] += delta * (k === "x" || k === "y" ? 0.18 : k === "rot" ? 0.3 : 0.16);
        moving = true;
      }
    }
    draw();
    raf = moving ? requestAnimationFrame(frame) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  /* The scope shows the whole cover, inscribed in the circle, or the title when the cover is missing. */
  scopeImg.addEventListener("load", () => {
    const k = 96 / Math.hypot(scopeImg.naturalWidth, scopeImg.naturalHeight);
    scopeImg.style.width = `${scopeImg.naturalWidth * k}%`;
    scopeImg.style.height = `${scopeImg.naturalHeight * k}%`;
  });
  scopeImg.addEventListener("error", () => { scopeEl.dataset.miss = works[rows.indexOf(state.row)].title; });

  function select(row) {
    if (row === state.row) return;
    const pull = state.row && !rm.matches && !narrow.matches;
    state.row = row;
    rows.forEach((r) => r.classList.toggle("is-active", r === row));
    scopeEl.href = row.href;
    delete scopeEl.dataset.miss;
    scopeImg.src = coverSrc(works[rows.indexOf(row)]);
    if (pull) {
      /* Pull: the cover travels from the title into the scope. */
      const s = center(scopeEl);
      const t = row.querySelector(".row-title").getBoundingClientRect();
      const dx = t.left + Math.min(t.width, 240) / 2 - s.x;
      const dy = t.top + t.height / 2 - s.y;
      scopeImg.animate(
        [{ transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
    kick();
  }
  if (rows.length) select(rows[0]);
  list.addEventListener("focusin", (e) => { const row = e.target.closest(".row"); if (row) select(row); });

  function setZone(zone) {
    if (zone === state.zone) return;
    state.zone = zone;
    root.classList.toggle("aim", zone !== null);
  }
  function zoneAt(el, x, y) {
    if (rm.matches || !fp.matches) return null;
    if (el.closest(".scope")) return "cover";
    if (!el.closest(".art")) return null;
    const b = headSvg.getBoundingClientRect();
    return onFigure(((x - b.left) * 420) / b.width, ((y - b.top) * 540) / b.height) ? "art" : null;
  }
  /* A short dwell keeps the cover from switching while the pointer travels from a title to the cover link. */
  let dwell = null;
  let dwellRow = null;
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    state.px = e.clientX;
    state.py = e.clientY;
    const row = e.target.closest(".row");
    if (row !== dwellRow) {
      clearTimeout(dwell);
      dwellRow = row;
      if (row) dwell = setTimeout(() => select(row), 120);
    }
    setZone(zoneAt(e.target, e.clientX, e.clientY));
    kick();
  }, { passive: true });
  root.addEventListener("mouseleave", () => { setZone(null); kick(); });

  /* No cursor to aim: the title crossing the middle of the screen is the active one. The last one stays loaded. */
  const band = new IntersectionObserver((entries) => {
    if (fp.matches) return;
    const hit = entries.find((e) => e.isIntersecting);
    if (hit) select(hit.target);
  }, { rootMargin: "-49.5% 0px -49.5% 0px" });
  rows.forEach((r) => band.observe(r));

  /* Which posters are on screen: the target's home, and whether the pinned email is needed. */
  const sections = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
    root.classList.toggle("pin", !seen.has("top") && !seen.has("contact"));
    kick();
  });
  ["top", "index", "contact"].forEach((id) => sections.observe($(id)));

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      screen();
      kick();
    });
  }
  function fit() {
    place();
    onScroll();
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", fit);
  spotSection.addEventListener("focusin", onScroll);
  spotSection.addEventListener("focusout", onScroll);
  for (const q of [rm, fp, narrow]) q.addEventListener("change", () => { setZone(null); fit(); });

  /* Phones draw the head smaller, so it gets a finer screen to keep enough dots in the face. */
  const printHead = () => $("dots").setAttribute("d", screenPath(420, 540, narrow.matches ? 9 : 12, headTone));
  narrow.addEventListener("change", printHead);
  printHead();
  $("edge-dots").setAttribute("d", screenPath(1600, 110, 12, (x, y) => (0.42 + 0.12 * Math.sin(x / 130 + 1.3)) * (1 - y / 110) ** 1.8));
  fit();
  /* Ink-stamp start: the red plate begins out of register and eases onto the singer. */
  cur = goal();
  if (!rm.matches) { cur.x -= 46; cur.y += 30; }
  draw();
  kick();
})();
