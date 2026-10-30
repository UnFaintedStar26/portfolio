(() => {
  "use strict";

  const rm = matchMedia("(prefers-reduced-motion: reduce)");
  const fp = matchMedia("(hover: hover) and (pointer: fine)");
  const narrow = matchMedia("(max-width: 640px)");
  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const works = window.WORKS || [];
  const SITE = window.SITE || {};
  const asset = (path) => path;

  /* Site text from content.js. Anything left empty, or missing, hides its element instead of breaking the page. */
  const pick = (path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), SITE);
  function put(el, value) {
    el.hidden = value == null || value === "";
    if (!el.hidden) el.textContent = value;
  }
  document.querySelectorAll("[data-site]").forEach((el) => put(el, pick(el.dataset.site)));

  const name = SITE.name || "";
  document.title = [name, SITE.pageTitle].filter(Boolean).join(". ") || document.title;
  document.querySelector('meta[name="description"]').content = SITE.description || "";
  put($("spot-credit"), name && `Designed by ${name}®`);
  put($("copyright"), name && `© ${new Date().getFullYear()} ${name}®.`);

  const email = SITE.email || "";
  document.querySelectorAll("[data-email]").forEach((a) => {
    a.hidden = !email;
    if (!email) return;
    a.href = `mailto:${email}`;
    const at = email.indexOf("@");
    /* The big address may break before the @ instead of mid-word. */
    if (a.dataset.email === "split" && at > 0) a.replaceChildren(email.slice(0, at), document.createElement("wbr"), email.slice(at));
    else a.textContent = email;
  });

  const social = $("social");
  const links = (SITE.social || []).filter((s) => s && s.label).map((s) => {
    const a = Object.assign(document.createElement("a"), { href: s.url || "#", textContent: s.label });
    /* Off-site profiles leave the viewer frame the site is shown in. */
    if (/^https?:/.test(a.getAttribute("href"))) Object.assign(a, { rel: "me", target: "_parent" });
    return a;
  });
  social.replaceChildren(...links.flatMap((a, i) => (i ? [", ", a] : [a])), links.length ? "." : "");
  social.hidden = !links.length;

  /* Hero banner: shown only once it has loaded, so a missing file leaves the labelled placeholder, never a broken image. */
  const banner = $("banner");
  const bannerImg = $("banner-img");
  const hero = SITE.hero || {};
  bannerImg.alt = hero.alt || "";
  if (hero.focus) bannerImg.style.objectPosition = hero.focus;
  if (hero.image) {
    $("banner-path").textContent = `Add it at site/${hero.image}`;
    const probe = new Image();
    probe.onload = () => {
      bannerImg.src = probe.src;
      banner.classList.add("has-image");
    };
    probe.src = asset(hero.image);
  }

  /* Work index */
  const CATS = window.CATEGORIES || {};
  const kind = (w) => CATS[w.category] || w.category;
  const meta = (w) => `${kind(w)} · ${w.images.length} ${w.images.length === 1 ? "image" : "images"}`;
  const coverSrc = (w) => asset(w.images[0].src);
  const list = $("titles");
  list.innerHTML = works
    .map(
      (w) =>
        `<li><a class="row" href="project.html?id=${w.id}">` +
        `<span class="row-title">${w.title}</span>` +
        `<span class="row-meta"><span class="mark"></span>${meta(w)}</span>` +
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
  const intro = SITE.work && SITE.work.intro;
  $("work-count").textContent = intro || (works.length ? `${works.length} ${works.length === 1 ? "project" : "projects"}.` : "");

  /* Spotlight: one image from one project, shown whole on a stepped grid, turning slowly like a gyroscope. */
  const spotCfg = SITE.spotlight || {};
  const spot = works.find((w) => w.id === spotCfg.workId) || works[0];
  const spotPick = spot && (spot.images[spotCfg.image | 0] || spot.images[0]);
  const spotSection = $("spotlight");
  const spotArt = $("spot-art");
  const spotPlate = document.querySelector(".spot-plate");
  const spotImg = $("spot-img");
  const spotGrid = $("spot-grid");
  const spotMiss = $("spot-miss");
  const poster = { w: 2, h: 3 };
  const sheet = { x: 0, y: 0, w: 0, h: 0 };
  if (spot) {
    $("spot-title").textContent = spot.title;
    $("spot-meta").textContent = meta(spot);
    $("spot-summary").textContent = spot.summary;
    put($("spot-approach"), spot.approach);
    $("spot-link").href = `project.html?id=${spot.id}`;
    spotMiss.textContent = spot.title;
    spotImg.alt = spotPick.alt;
    spotImg.onload = () => {
      poster.w = spotImg.naturalWidth;
      poster.h = spotImg.naturalHeight;
      fit();
    };
    spotImg.onerror = () => spotSection.classList.add("is-missing");
    spotImg.src = asset(spotPick.src);
  } else spotSection.hidden = true;

  /* The gyroscope loops, so it gets a pause control; reduced motion stops it and hides the control. */
  const spotPause = $("spot-pause");
  spotPause.addEventListener("click", () => {
    const paused = spotPause.getAttribute("aria-pressed") !== "true";
    spotPause.setAttribute("aria-pressed", String(paused));
    spotPause.textContent = paused ? "Play motion" : "Pause motion";
    spotSection.classList.toggle("is-paused", paused);
  });

  /* Grid fields: the cursor patch and soft edges live in js/grid.js, shared with the project page. */
  const gridFields = [...document.querySelectorAll(".grid-field")];

  /* Fields with data-fit sit in the gap between two elements of their section: data-fit="y" between data-from's
     bottom and data-to's top (across data-span's width, default data-from), data-fit="x" between data-from's right and
     data-to's left (or the section's inner edge). A gap smaller than a useful patch hides the field, as on phones. */
  const GAP = 28;
  function placeFields() {
    for (const g of gridFields) {
      const mode = g.dataset.fit;
      if (!mode) continue;
      const host = g.parentElement;
      const pick = (sel) => (sel ? host.querySelector(sel) : null);
      const a = pick(g.dataset.from);
      const b = pick(g.dataset.to);
      const box = host.getBoundingClientRect();
      const ra = a && a.getBoundingClientRect();
      const rb = b && b.getBoundingClientRect();
      let x0, x1, y0, y1;
      if (ra && mode === "y" && rb) {
        const s = (pick(g.dataset.span) || a).getBoundingClientRect();
        [x0, x1, y0, y1] = [s.left, s.right, ra.bottom + GAP, rb.top - GAP];
      } else if (ra && mode === "x") {
        const end = rb ? rb.left : box.right - parseFloat(getComputedStyle(host).paddingRight);
        [x0, x1, y0, y1] = [ra.right + GAP, end - GAP, Math.min(ra.top, rb ? rb.top : ra.top), Math.max(ra.bottom, rb ? rb.bottom : ra.bottom)];
      }
      const w = x1 - x0;
      const h = y1 - y0;
      g.hidden = !(w >= 140 && h >= 90);
      if (!g.hidden) Object.assign(g.style, { left: `${x0 - box.left}px`, top: `${y0 - box.top}px`, width: `${w}px`, height: `${h}px` });
    }
  }

  const softenFields = window.softenGridFields;

  /* The whole poster, never cropped. Wide screens hang it full height and centre it with the plate as one sheet,
     the plate running from the poster's top edge to its bottom edge. Narrow screens stack the poster over the plate. */
  function place() {
    const W = spotArt.clientWidth;
    const H = spotArt.clientHeight;
    if (!W || !H) return;
    /* Read the layout the stylesheet applied: during a resize the media query can still report the old width. */
    const wide = getComputedStyle(spotPlate).position === "absolute";
    const m = wide ? 88 : 44;
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
    const px = (v) => `${v}px`;
    Object.assign(spotImg.style, { left: px(sheet.x), top: px(sheet.y), width: px(sheet.w), height: px(sheet.h) });
    /* The grid spills past the poster but never reaches the text column or the stage's edges, so nothing is cut off. */
    const spillL = Math.min(sheet.w * 0.35, wide ? gap - 28 : sheet.x - 10);
    const spillR = Math.min(sheet.w * 0.35, W - sheet.x - sheet.w - 10);
    const spillY = Math.max(0, Math.min(sheet.h * 0.12, sheet.y - 20));
    Object.assign(spotGrid.style, { left: px(sheet.x - spillL), top: px(sheet.y - spillY), width: px(sheet.w + spillL + spillR), height: px(sheet.h + 2 * spillY) });
    const a = spotArt.getBoundingClientRect();
    const st = spotArt.parentElement.getBoundingClientRect();
    Object.assign(spotMiss.style, { left: `${a.left - st.left + sheet.x}px`, top: `${a.top - st.top + sheet.y}px`, width: `${sheet.w}px`, height: `${sheet.h}px` });
  }

  /* The target: one red mark that aims over a cover and locks sharp on the work in view. */
  const LOOK = {
    aim: { ring: 1, inner: 0.36, dot: 0.06, rot: 0, cin: 0.14, cout: 1.2, blur: 0 },
    lock: { ring: 1.04, inner: 0, dot: 0, rot: 0, cin: 0.86, cout: 1.14, blur: 0 },
  };
  const AIM_R = 22;
  const scopeEl = $("scope");
  const layers = [new Image(), new Image()];
  layers.forEach((img) => { img.alt = ""; img.style.opacity = "0"; scopeEl.append(img); });
  const target = $("target");
  const parts = {
    mark: $("t-mark"), ring: $("t-ring"), inner: $("t-inner"), dot: $("t-dot"), cross: $("t-cross"), crossPath: $("t-cross-path"),
  };
  const state = { zone: null, px: 0, py: 0, row: null };
  const seen = new Set();
  let edge = 0;
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
  /* The mark lives with the project list: on the scope (or the active cover on phones), aiming only over the cover.
     It is off screen while the hero shows, so it never meets the header or the pitch. */
  function aimAt() {
    if (state.zone === "cover") return { x: state.px, y: state.py, r: AIM_R, ...LOOK.aim };
    if (!narrow.matches) return { ...center(scopeEl), ...LOOK.lock };
    if (state.row) return { ...coverAt(state.row.querySelector(".row-cover")), ...LOOK.lock };
    return { x: innerWidth / 2, y: innerHeight * 3, r: AIM_R, ...LOOK.lock };
  }
  /* Every pose keeps the whole reticle, cross arms included, at least the page's side padding inside the viewport. */
  function goal() {
    const g = aimAt();
    const reach = g.r * g.ring * Math.max(1, g.cout);
    g.x = clamp(g.x, edge + reach, Math.max(edge + reach, innerWidth - edge - reach));
    return g;
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

  /* The scope crossfades between two stacked covers. Only the newest pick ever shows: a newer pick cancels the
     running fade and drops any cover still decoding, so a fast pointer never queues or stacks animations. */
  let front = 0;
  let latest = 0;
  function showCover(work) {
    const token = ++latest;
    const next = layers[1 - front];
    next.src = coverSrc(work);
    next.decode().then(() => {
      if (token !== latest) return;
      delete scopeEl.dataset.miss;
      const k = 96 / Math.hypot(next.naturalWidth, next.naturalHeight);
      next.style.width = `${next.naturalWidth * k}%`;
      next.style.height = `${next.naturalHeight * k}%`;
      const prev = layers[front];
      front = 1 - front;
      layers.forEach((img) => img.getAnimations().forEach((a) => a.cancel()));
      next.style.opacity = "1";
      prev.style.opacity = "0";
      if (rm.matches) return;
      next.animate([{ opacity: 0, transform: "translateY(3px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "ease-out" });
      prev.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: "ease-out" });
    }, () => {
      if (token === latest) scopeEl.dataset.miss = work.title;
    });
  }

  function select(row) {
    if (row === state.row) return;
    state.row = row;
    rows.forEach((r) => r.classList.toggle("is-active", r === row));
    scopeEl.href = row.href;
    showCover(works[rows.indexOf(row)]);
    kick();
  }
  if (rows.length) select(rows[0]);
  list.addEventListener("focusin", (e) => { const row = e.target.closest(".row"); if (row) select(row); });

  function setZone(zone) {
    if (zone === state.zone) return;
    state.zone = zone;
    root.classList.toggle("aim", zone !== null);
  }
  function zoneAt(el) {
    return !rm.matches && fp.matches && el.closest(".scope") ? "cover" : null;
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
    setZone(zoneAt(e.target));
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
      kick();
    });
  }
  function fit() {
    edge = parseFloat(getComputedStyle($("work")).paddingRight) || 0;
    place();
    placeFields();
    softenFields();
    onScroll();
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", fit);
  for (const q of [rm, fp, narrow]) q.addEventListener("change", () => { setZone(null); fit(); });

  fit();
  /* The pitch is rendered by js/pitch.js after this script, and fonts change text sizes: place the fields again. */
  addEventListener("load", fit);
  document.fonts.ready.then(fit);
  cur = goal();
  draw();
  kick();
})();
