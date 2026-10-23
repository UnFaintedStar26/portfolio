(() => {
  const works = window.WORKS || [];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const src = (img) => "../../" + img.src;
  const catNo = (w) => `YN-${String(works.indexOf(w) + 1).padStart(3, "0")}`;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const whenSeen = (el, fn, rootMargin) => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { rootMargin });
    io.observe(el);
  };
  const KINDS = [
    { key: "branding", divider: "Branding", label: "branding" },
    { key: "poster", divider: "Posters", label: "poster" },
    { key: "illustration", divider: "Illustration", label: "illustration" },
  ];

  // The crate: one bin per kind, a divider card at its start, sleeves standing spine-out.
  // Each bin has exactly one sleeve pulled out (its cover up, the record sliding out), and that
  // sleeve is the bin's one Tab stop; arrow keys move along the bin.
  const crate = document.getElementById("crate");
  crate.innerHTML = KINDS.map((kind, k) => {
    const recs = works.filter((w) => w.category === kind.key);
    return `
      <section class="bin" aria-labelledby="bin-${kind.key}">
        <h3 class="divider" id="bin-${kind.key}"><span>${kind.divider}</span> <span class="divider-n">${recs.length}</span></h3>
        <ul class="row">${recs.map((w, i) => `
          <li class="rec t${(i + k) % 4}${i === 0 ? " is-out" : ""}" style="--j:${(i * 7 + k * 3) % 4};--i:${i}">
            <a href="../../project.html?id=${encodeURIComponent(w.id)}" target="_parent"${i === 0 ? "" : ' tabindex="-1"'} aria-label="${esc(w.title)}, ${w.year}, ${kind.label}">
              <span class="spine"><span class="spine-t">${esc(w.title)}</span><span class="spine-y">${w.year}</span></span>
              <span class="cover">
                <svg class="disc" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><use class="spin" href="#disc" width="200" height="200"/><use href="#sheen" width="200" height="200"/></svg>
                <span class="sleeve"><img src="${esc(src(w.images[0]))}" alt="" width="800" height="800"></span>
              </span>
              <span class="cap" aria-hidden="true"><span class="cap-t">${esc(w.title)}</span><span class="cap-m">${w.year}, ${kind.label}</span><span class="cap-o">Open</span></span>
            </a>
          </li>`).join("")}
        </ul>
        <div class="wall" aria-hidden="true"></div>
      </section>`;
  }).join("");
  document.getElementById("work-count").textContent = works.length;

  const pull = (rec) => {
    if (!rec || rec.classList.contains("is-out")) return;
    const out = rec.parentElement.querySelector(".is-out");
    out?.classList.remove("is-out");
    out?.querySelector("a").setAttribute("tabindex", "-1");
    rec.classList.add("is-out");
    rec.querySelector("a").removeAttribute("tabindex");
  };
  // Mouse pulls on hover, keyboard on focus. A touch tap on a sleeve still in the bin pulls it;
  // the next tap opens it.
  let tapPulls = false;
  crate.addEventListener("pointerover", (e) => { if (e.pointerType === "mouse") pull(e.target.closest(".rec")); });
  crate.addEventListener("pointerdown", (e) => {
    const rec = e.target.closest(".rec");
    tapPulls = e.pointerType !== "mouse" && !!rec && !rec.classList.contains("is-out");
  });
  crate.addEventListener("click", (e) => {
    if (!tapPulls) return;
    tapPulls = false;
    e.preventDefault();
    pull(e.target.closest(".rec"));
  });
  crate.addEventListener("focusin", (e) => pull(e.target.closest(".rec")));
  crate.addEventListener("keydown", (e) => {
    const rec = e.target.closest(".rec");
    const next = rec && { ArrowRight: rec.nextElementSibling, ArrowLeft: rec.previousElementSibling }[e.key];
    if (!next) return;
    e.preventDefault();
    next.querySelector("a").focus();
  });

  // The spotlight: the featured work with the most to show, as a gatefold sleeve. The cover opens
  // on its hinge to the liner notes, the record slides out of the inside pocket, and the back
  // carries the rest of the images and the deliverables as a tracklist.
  const s = works.find((w) => w.featured && w.images.length >= 3 && w.deliverables.length) || works[0];
  const gf = document.getElementById("gatefold");
  if (s) {
    const cat = catNo(s);
    const [front, inside = front, ...rest] = s.images;
    const half = Math.ceil(s.deliverables.length / 2);
    const sides = [["A", s.deliverables.slice(0, half)], ["B", s.deliverables.slice(half)]].filter(([, t]) => t.length);
    const credits = [["Client", s.client || "Self-initiated"], ["Medium", s.medium], ["Size", s.size], ["Year", s.year]].filter((r) => r[1]);
    const img = (i) => `<img src="${esc(src(i))}" alt="${esc(i.alt)}">`;
    gf.innerHTML = `
      <div class="gf-head">
        <h2 id="spot-h">${esc(s.title)}</h2>
        <p class="gf-cat">${cat}. ${esc(s.medium)}, ${s.year}.</p>
        <p class="gf-sum">${esc(s.summary)}</p>
      </div>
      <div class="gf-spine" aria-hidden="true"><span class="spine-t">${esc(s.title)}</span><span class="spine-y">${cat}</span></div>
      <div class="gf-in">
        <div class="gf-pocket" aria-hidden="true">
          <i class="gf-inner"></i>
          <svg class="gf-disc" viewBox="0 0 200 200" focusable="false">
            <g class="gf-spin">
              <use href="#disc" width="200" height="200"/>
              <circle cx="100" cy="100" r="34" fill="#CE3029"/>
              <path id="gf-arc" fill="none" d="M73 100a27 27 0 0 1 54 0"/>
              <text class="gf-label"><textPath href="#gf-arc" startOffset="50%" text-anchor="middle">${esc(s.title)}</textPath></text>
              <text class="gf-label" x="100" y="121" text-anchor="middle">${s.year}</text>
              <circle cx="100" cy="100" r="3.5" fill="#191919"/>
            </g>
            <use href="#sheen" width="200" height="200"/>
          </svg>
        </div>
        <figure class="gf-face gf-inside">${img(inside)}</figure>
      </div>
      <div class="gf-cover" id="gf-cover">
        <figure class="gf-face gf-front">${img(front)}</figure>
        <div class="gf-face gf-notes">
          <p class="gf-notes-t" aria-hidden="true">${esc(s.title)}</p>
          <p><b>Brief.</b> ${esc(s.brief)}</p>
          <p><b>Approach.</b> ${esc(s.approach)}</p>
          <p><b>Outcome.</b> ${esc(s.outcome)}</p>
        </div>
      </div>
      <p class="gf-actions">
        <button class="gf-toggle" type="button" aria-expanded="false" aria-controls="gf-cover"><span class="l-open">Open the sleeve</span><span class="l-close">Close the sleeve</span><span class="l-pull">Pull the record</span><span class="l-back">Slide it back</span></button>
        <a class="more" href="../../project.html?id=${encodeURIComponent(s.id)}" target="_parent">Open the full project</a>
      </p>
      <div class="gf-back">
        ${rest.length ? `<div class="gf-strip">${rest.map(img).join("")}</div>` : ""}
        <div class="gf-sides">${sides.map(([side, tracks]) => `
          <div><p class="gf-side">Side ${side}</p><ol>${tracks.map((t, i) => `<li><span class="gf-tn">${side}${i + 1}</span>${esc(t)}</li>`).join("")}</ol></div>`).join("")}
        </div>
        <dl class="credits">${credits.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="gf-press">Pressed in City, Country. ${cat}.</p>
      </div>`;
    const btn = gf.querySelector(".gf-toggle");
    let touched = false;
    btn.addEventListener("click", () => {
      touched = true;
      btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true"));
    });
    whenSeen(gf.querySelector(".gf-in"), () => { if (!touched) btn.setAttribute("aria-expanded", "true"); }, "0px 0px -60% 0px");
  }

  // The last record: tucked in its sleeve until the back cover scrolls in, then it slides out once.
  const lp = document.querySelector(".lp");
  if (!still.matches && lp.getBoundingClientRect().top > innerHeight) {
    lp.classList.add("is-in");
    whenSeen(lp, () => lp.classList.remove("is-in"), "0px 0px -15% 0px");
  }

  // Scrollspy: a section is current once its top passes the reading line, which sits where
  // an index jump lands a heading. Each leader fills with progress through its section.
  const links = [...document.querySelectorAll(".ix")];
  const sections = links.map((a) => document.querySelector(a.hash));
  let spyQueued = false;
  const spy = () => {
    spyQueued = false;
    const line = innerHeight * 0.3;
    const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    const rects = sections.map((el) => el.getBoundingClientRect());
    let current = -1;
    rects.forEach((r, i) => { if (r.top <= line) current = i; });
    if (atEnd) current = links.length - 1;
    rects.forEach((r, i) => {
      const p = atEnd || i < current ? 1 : Math.min(1, Math.max(0, (line - r.top) / r.height));
      links[i].style.setProperty("--p", p.toFixed(3));
      if (i === current) links[i].setAttribute("aria-current", "location");
      else links[i].removeAttribute("aria-current");
    });
  };
  const queueSpy = () => { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } };
  addEventListener("scroll", queueSpy, { passive: true });
  addEventListener("resize", queueSpy);
  spy();

  // Crease light: every fold catches light in a pool around the pointer.
  const lightOk = matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");
  const creases = [...document.querySelectorAll(".crease")];
  let px = -9999, py = -9999, lightQueued = false;
  const light = () => {
    lightQueued = false;
    const rects = creases.map((c) => c.getBoundingClientRect());
    rects.forEach((r, i) => {
      creases[i].style.setProperty("--lx", `${px - r.left}px`);
      creases[i].style.setProperty("--ly", `${py - r.top}px`);
    });
  };
  const queueLight = () => { if (!lightQueued) { lightQueued = true; requestAnimationFrame(light); } };
  const onMove = (e) => { px = e.clientX; py = e.clientY; queueLight(); };
  const onLeave = () => { px = py = -9999; queueLight(); };
  const wire = () => {
    const on = lightOk.matches;
    const method = on ? addEventListener : removeEventListener;
    method("pointermove", onMove, { passive: true });
    method("scroll", queueLight, { passive: true });
    document.documentElement[on ? "addEventListener" : "removeEventListener"]("pointerleave", onLeave);
    if (!on) onLeave();
  };
  lightOk.addEventListener("change", wire);
  wire();
})();
