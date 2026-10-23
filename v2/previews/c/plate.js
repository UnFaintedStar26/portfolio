(() => {
  const works = window.WORKS || [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const SVG = 'http://www.w3.org/2000/svg';
  // The dash starts just past the path start so no zero-length dash (and its round cap) shows before the stroke draws.
  const DRAW = [{ strokeDasharray: '1 2', strokeDashoffset: 1.01 }, { strokeDasharray: '1 2', strokeDashoffset: 0 }];

  // Folio layout by catalogue position: desktop columns, vertical offset (rem), mobile width and side.
  const SLOTS = [
    ['1 / 8', 0, 100, 'start'], ['9 / 13', 7, 70, 'end'],
    ['2 / 6', 0, 78, 'start'], ['7 / 13', 9, 100, 'start'],
    ['1 / 4', 0, 64, 'end'], ['5 / 12', 4, 100, 'start'],
    ['2 / 5', 0, 70, 'start'], ['6 / 9', 10, 76, 'end'], ['10 / 13', 3, 100, 'start'],
    ['1 / 5', 0, 66, 'end'], ['7 / 11', 8, 78, 'start'],
    ['4 / 10', 0, 88, 'end']
  ];

  // Lettered keys for the spotlight, as fractions of the cover image. They point at features of the current
  // placeholder cover; rewrite them with the artwork when it lands. Works without keys show only the particulars.
  const KEYS = {
    'tide-lines': [
      { x: 0.656, y: 0.296, label: 'Outer ring', note: 'One unbroken line, drawn at the size it prints.' },
      { x: 0.57, y: 0.476, label: 'Red pass', note: 'The only second colour, printed last and set in register by eye.' },
      { x: 0.6, y: 0.888, label: 'Lettering', note: 'Title cut along the foot of the plate, outside the image.' }
    ]
  };

  const el = (tag, attrs = {}, ns) => {
    const node = ns ? document.createElementNS(SVG, tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };
  const svgEl = (tag, attrs) => el(tag, attrs, true);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const regMark = c => `<span class="reg ${c}"><svg class="key"><use href="#reg"/></svg><svg class="pass"><use href="#reg"/></svg></span>`;

  const frameMarkup = work => {
    const cover = work.images[0];
    // Eager on purpose: lazy covers grew the page by up to 2400px after load, so jump links landed short.
    return `<img src="../../${cover.src}" alt="${cover.alt}">` +
      `<svg class="plate-mark" aria-hidden="true"><rect width="100%" height="100%" pathLength="1"/></svg>` +
      ['tl', 'tr', 'bl', 'br'].map(regMark).join('');
  };

  /* Plates and the list of plates */
  const folio = document.getElementById('folio');
  const index = document.getElementById('index');
  works.forEach((w, i) => {
    const n = i + 1;
    const [col, mt, mw, side] = SLOTS[i % SLOTS.length];
    // Each plate's second pass drifts by its own amount, like a hand-fed press.
    const dx = (i % 2 ? 1 : -1) * (6 + (i * 3) % 5), dy = ((i >> 1) % 2 ? 1 : -1) * (6 + (i * 7) % 5);
    const li = el('li', { class: 'plate', id: `pl-${n}` });
    li.style.cssText = `--col:${col};--mt:${mt}rem;--mw:${mw}%;--side:${side};--dx:${dx}px;--dy:${dy}px;--rot:${((i % 3) - 1) * 3 || 2}deg`;
    li.innerHTML = `<a href="../../project.html?id=${encodeURIComponent(w.id)}" target="_parent">` +
      `<span class="frame">${frameMarkup(w)}</span>` +
      `<div class="cap"><h3><span class="no">Pl.&nbsp;${n}</span>${w.title}</h3>` +
      `<span class="meta">${cap(w.category)} · ${w.medium} · ${w.year}</span></div></a>`;
    folio.append(li);
    const entry = el('li');
    entry.innerHTML = `<a href="#pl-${n}"><img src="../../${w.images[0].src}" alt=""><span class="ix"><span class="no">Pl.&nbsp;${n}</span> <span class="t">${w.title}</span> <span class="c">${cap(w.category)}</span></span></a>`;
    index.append(entry);
  });
  const plates = [...folio.children];

  // The proof sheet lies open beside the folio; on phones it folds shut so the first plate is one screen away.
  const sheetList = document.getElementById('sheet-list');
  document.querySelector('.sheet__count').textContent = `(${works.length})`;
  const narrow = matchMedia('(max-width: 819px)');
  const fold = () => { sheetList.open = !narrow.matches; };
  fold();
  narrow.addEventListener('change', fold);

  /* Spotlight */
  const spotIndex = Math.max(0, works.findIndex(w => w.featured && w.category === 'illustration'));
  const spot = works[spotIndex];
  const spotPlate = document.querySelector('.spot__plate');
  const keys = (spot && KEYS[spot.id]) || [];
  if (!spot) document.getElementById('spotlight').hidden = true;
  else {
    document.querySelector('.spot__no').textContent = `Pl. ${spotIndex + 1}, under the loupe`;
    document.getElementById('spot-title').textContent = spot.title;
    document.querySelector('.spot__lede').textContent = spot.summary;
    const frame = document.querySelector('.spot__fig .frame');
    frame.innerHTML = frameMarkup(spot);
    document.querySelector('.spot__more a').href = `../../project.html?id=${encodeURIComponent(spot.id)}`;

    const pins = el('span', { class: 'pins', 'aria-hidden': 'true' });
    const list = document.querySelector('.keys');
    keys.forEach((k, i) => {
      const letter = String.fromCharCode(65 + i);
      const pin = el('span', { class: 'pin' });
      pin.style.cssText = `left:${k.x * 100}%;top:${k.y * 100}%`;
      pin.textContent = letter;
      pins.append(pin);
      const li = el('li');
      li.innerHTML = `<span class="k">${letter}</span><div><b>${k.label}</b><p>${k.note}</p></div>`;
      list.append(li);
    });
    if (keys.length) frame.append(pins);
    else list.remove();

    const facts = [
      ['Client', spot.client || 'Self-initiated'],
      ['Brief', spot.brief],
      ['Approach', spot.approach],
      ['Outcome', spot.outcome],
      ['Medium', [spot.medium, spot.size, spot.year].filter(Boolean).join(', ')]
    ].filter(([, v]) => v);
    document.querySelector('.facts').innerHTML = facts.map(([t, v]) => `<div><dt>${t}</dt> <dd>${/[.!?]$/.test(v) ? v : `${v}.`}</dd></div>`).join(' ');
  }

  // Leaders run from each pin to its letter in the key. Stacked layouts (phones) show pins and key without leaders.
  const leaders = document.querySelector('.leaders');
  const drawLeaders = () => {
    leaders.replaceChildren();
    const keyBox = spotPlate.querySelector('.spot__key').getBoundingClientRect();
    const fig = spotPlate.querySelector('.spot__fig').getBoundingClientRect();
    if (keyBox.top >= fig.bottom - 1) return;
    const box = spotPlate.getBoundingClientRect();
    const pins = spotPlate.querySelectorAll('.pin');
    const letters = spotPlate.querySelectorAll('.keys .k');
    pins.forEach((pin, k) => {
      const p = pin.getBoundingClientRect(), l = letters[k].getBoundingClientRect();
      const ax = p.right - box.left, ay = p.top + p.height / 2 - box.top;
      const lx = l.left - box.left - 10, ly = l.top + l.height / 2 - box.top;
      const gx = fig.right - box.left + 18 + k * 10;
      leaders.append(svgEl('path', { d: `M${ax} ${ay}H${gx}V${ly}H${lx}`, pathLength: 1, style: `--i:${k}` }));
    });
  };
  if (keys.length) {
    const ro = new ResizeObserver(drawLeaders);
    ro.observe(spotPlate);
    ro.observe(spotPlate.querySelector('.spot__fig'));
  }

  /* Hero line art: lattice, crest, dome contours, stipple and chain, all generated from the hand-drawn shapes in index.html */
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const A = [330, 38], BL = [40, 540], BR = [620, 540], N = 8;
  const lattice = document.getElementById('lattice');
  for (let k = 1; k < N; k++) {
    const t = k / N;
    for (const [p, q] of [[lerp(A, BL, t), lerp(A, BR, t)], [lerp(BL, BR, t), lerp(BR, A, 1 - t)], [lerp(BL, BR, t), lerp(BL, A, t)]]) {
      lattice.append(svgEl('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }));
    }
  }

  let seed = 7;
  const rand = () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const polyline = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const weight = (node, k) => { node.style.strokeWidth = `calc(var(--sw) * ${k.toFixed(2)})`; return node; };
  // Three joined cubics through ten control points, evaluated at u in [0, 1].
  const bez = (c, u) => {
    const k = Math.min(2, Math.floor(u * 3)), t = u * 3 - k, m = 1 - t, [p0, p1, p2, p3] = c.slice(k * 3, k * 3 + 4);
    return [0, 1].map(i => m * m * m * p0[i] + 3 * m * m * t * p1[i] + 3 * m * t * t * p2[i] + t * t * t * p3[i]);
  };

  // Crest: horsehair between the crest's outer edge and the dome it sits on. Locks sit unevenly, wander a little,
  // are cut at different lengths and fan out where the tail hangs free.
  const OUTER = [[452, 186], [452, 120], [408, 70], [338, 64], [262, 58], [196, 100], [168, 170], [150, 240], [148, 320], [166, 400]];
  const INNER = [[452, 186], [440, 168], [400, 154], [340, 158], [250, 168], [204, 250], [196, 290], [192, 330], [186, 372], [180, 412]];
  const crest = document.getElementById('crest');
  const STRANDS = 15;
  for (let s = 0; s < STRANDS; s++) {
    const t = Math.min(0.96, Math.max(0.04, (s + 0.5 + (rand() - 0.5) * 0.9) / STRANDS));
    const c = OUTER.map((o, j) => lerp(INNER[j], o, t));
    const a = rand() * 0.05, b = 1 - rand() * rand() * 0.3, fan = (rand() - 0.5) * 16, wob = (rand() - 0.5) * 3;
    const pts = [];
    for (let k = 0; k <= 56; k++) {
      const u = a + (b - a) * k / 56, [x, y] = bez(c, u), [x2, y2] = bez(c, Math.min(1, u + 0.004));
      const len = Math.hypot(x2 - x, y2 - y) || 1, off = wob * Math.sin(Math.PI * u) + fan * Math.max(0, (u - 0.7) / 0.3) ** 2;
      pts.push([x - (y2 - y) / len * off, y + (x2 - x) / len * off]);
    }
    crest.append(weight(svgEl('path', { d: polyline(pts) }), 0.28 + rand() * 0.4));
  }

  // Dome: meridians of a forward-tilted hemisphere, from the crown under the crest to the rim at its equator, clipped to
  // the bowl in index.html. [half-width, longitude, light]: they crowd where the bowl turns away, and in the shadowed
  // back they thin and break into dots before the rim, the way a burin lifts off the plate.
  const meridians = document.getElementById('meridians');
  const EQ = [300, 482], HALF = 332, TILT = 8 * Math.PI / 180;
  [[-108, 14, 0.15], [-108, 30, 0.25], [-108, 46, 0.35], [-108, 62, 0.45], [-108, 78, 0.55], [0, 90, 0.7], [200, 76, 0.85], [200, 60, 1], [200, 44, 1], [200, 28, 1]].forEach(([r, deg, light]) => {
    const w = r * Math.cos(deg * Math.PI / 180), pts = [];
    for (let k = 0; k <= 32; k++) {
      const th = Math.PI / 2 * k / 32, lx = w * Math.sin(th), ly = -HALF * Math.cos(th);
      pts.push([EQ[0] + lx * Math.cos(TILT) - ly * Math.sin(TILT), EQ[1] + lx * Math.sin(TILT) + ly * Math.cos(TILT)]);
    }
    const line = weight(svgEl('path', { d: polyline(pts), pathLength: 1 }), 0.2 + 0.4 * light);
    if (light < 0.6) line.style.strokeDasharray = `${(0.5 + 0.5 * light).toFixed(2)} .02 .03 .02 .018 .02 .008 1`;
    meridians.append(line);
  });

  const ctx = document.createElement('canvas').getContext('2d');
  const art = document.querySelector('.hero__art');
  const ghost = art.querySelector('.ghost');
  const sample = (path, step) => {
    const out = [];
    for (let s = 0, L = path.getTotalLength(); s < L; s += step) { const p = path.getPointAtLength(s); out.push([p.x, p.y]); }
    return out;
  };
  const nearest = (pts, x, y) => Math.sqrt(pts.reduce((m, p) => Math.min(m, (p[0] - x) ** 2 + (p[1] - y) ** 2), Infinity));
  // Stipple: white dots on the black mass. Light rises along each patch's shade vector; dot size and density follow it.
  // A patch runs right up to a drawn line, and dissolves into the black wherever its edge lies inside the mass.
  const drawn = [...art.querySelectorAll('.silhouette path, #helm > path')].flatMap(p => sample(p, 3));
  const FEATHER = 18;
  const stipples = [...art.querySelectorAll('.stipple-src path')].map(src => {
    const shape = new Path2D(src.getAttribute('d'));
    const loose = sample(src, 2.5).filter(([x, y]) => nearest(drawn, x, y) > 4);
    const [sx, sy] = src.dataset.shade.split(',').map(Number);
    const b = src.getBBox();
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const reach = Math.abs(sx) * b.width / 2 + Math.abs(sy) * b.height / 2 || 1;
    const step = 3.4;
    let d = '';
    for (let y = b.y, row = 0; y <= b.y + b.height; y += step * 0.866, row++) {
      for (let x = b.x + (row % 2) * step / 2; x <= b.x + b.width; x += step) {
        const px = x + (rand() - 0.5) * step * 0.6, py = y + (rand() - 0.5) * step * 0.6;
        if (!ctx.isPointInPath(shape, px, py)) continue;
        const light = Math.min(1, Math.max(0, 0.5 + ((px - cx) * sx + (py - cy) * sy) / (2 * reach)));
        const fade = loose.length ? Math.min(1, nearest(loose, px, py) / FEATHER) : 1;
        if (rand() > (0.15 + 0.85 * light) * fade * (2 - fade)) continue;
        const r = +(0.3 + 1.25 * light * light).toFixed(2);
        d += `M${(px - r).toFixed(1)} ${py.toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
      }
    }
    const g = svgEl('path', { class: 'stipple', d });
    ghost.before(g);
    return g;
  });

  // Chain: links laid at a fixed pitch along the hand-drawn routes, alternating face-on and edge-on.
  // Back routes pass behind the shaft: the chain is lashed twice round it, pulled off the plate at one end and hanging at the other.
  const PITCH = 9;
  const chainLinks = [];
  let carry = 0;
  art.querySelectorAll('.chain-src path').forEach(route => {
    const L = route.getTotalLength(), layer = art.querySelector(`.chain-${route.dataset.layer}`);
    let s = carry;
    for (; s <= L; s += PITCH) {
      const p = route.getPointAtLength(s), q = route.getPointAtLength(Math.min(L, s + 1)), o = route.getPointAtLength(Math.max(0, s - 1));
      const href = chainLinks.length % 2 ? '#link-edge' : '#link-face';
      const angle = Math.atan2(q.y - o.y, q.x - o.x) * 180 / Math.PI;
      chainLinks.push(layer.appendChild(svgEl('use', { href, transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})` })));
    }
    carry = s - L;
  });

  /* Load choreography: the plate is engraved in order, then the red second pass drops into register */
  const heroPlate = document.querySelector('.hero__plate');
  if (!reduce) {
    const run = (node, frames, delay, duration, opts) => node.animate(frames, { delay, duration, easing: EASE, fill: 'backwards', ...opts });
    const strokes = node => { node.setAttribute('pathLength', 1); return node; };
    [...lattice.children].forEach((l, i) => run(strokes(l), DRAW, i * 22, 700));
    run(strokes(art.querySelector('.tri')), DRAW, 0, 1100);
    run(art.querySelector('.incircle'), [{ opacity: 0 }, { opacity: 1 }], 700, 900);
    run(heroPlate.querySelector('.plate-mark rect'), DRAW, 200, 1200);
    art.querySelectorAll('.spear > path').forEach((p, i) => run(strokes(p), DRAW, 250 + i * 60, 900));
    chainLinks.forEach((l, i) => run(l, [{ opacity: 0 }, { opacity: 1 }], 1000 + i * 24, 260));
    run(art.querySelector('.silhouette'), [{ opacity: 0 }, { opacity: 1 }], 500, 700);
    // Outline first, then the contours that model the dome, then the crest's hair.
    const lines = [...art.querySelectorAll('#helm > path'), ...meridians.children, ...crest.children];
    lines.forEach((p, i) => run(strokes(p), DRAW, 650 + i * 26, 950));
    art.querySelectorAll('#helm circle').forEach(c => run(c, [{ opacity: 0 }, { opacity: 1 }], 1500, 500));
    stipples.forEach((g, i) => run(g, [{ opacity: 0 }, { opacity: 1 }], 1500 + i * 110, 700));

    const off = 'translate(11px, -8px) rotate(-1.4deg)';
    ghost.animate([
      { opacity: 0, transform: off },
      { opacity: 1, transform: off, offset: 0.08 },
      { opacity: 1, transform: off, offset: 0.62, easing: EASE },
      { opacity: 1, transform: 'none', offset: 0.86 },
      { opacity: 0, transform: 'none' }
    ], { delay: 250, duration: 3200, fill: 'both' });
    heroPlate.querySelectorAll('.pass').forEach((p, k) => {
      const sx = k % 2 ? 1 : -1, sy = k < 2 ? -1 : 1;
      run(p, [{ transform: `translate(${sx * 8}px, ${sy * 7}px) rotate(${sx * 4}deg)` }, { transform: 'none' }], 2230, 800);
    });

    // Plate frames draw as they enter the viewport.
    const pending = new Map();
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, k) => {
        const anim = pending.get(e.target);
        anim.effect.updateTiming({ delay: k * 110 });
        anim.play();
        io.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    plates.forEach(li => {
      const anim = li.querySelector('.plate-mark rect').animate(DRAW, { duration: 1000, easing: EASE, fill: 'backwards' });
      anim.pause();
      pending.set(li, anim);
      io.observe(li);
    });
  }

  // Touch screens have no hover: the plate scrolled to the middle of the screen comes into register.
  if (matchMedia('(hover: none)').matches) {
    const centre = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('in-register', e.isIntersecting)),
      { rootMargin: '-45% 0px -45% 0px' });
    plates.forEach(li => centre.observe(li));
  }

  /* Construction rays: frame the hero plate while it is on screen, swing to the hovered or focused plate, fade out otherwise */
  const rays = document.querySelector('.rays');
  const lineEls = [...rays.querySelectorAll('.ray')];
  const holes = document.getElementById('ray-holes');
  const texts = [...document.querySelectorAll('h1, h2, p, .logo__sub, .cap, .index, .keys, .facts, .hero__nav, .to-contact')];
  const nav = document.querySelector('.hero__nav');
  const colophon = document.getElementById('colophon');
  const toContact = document.querySelector('.to-contact');
  let hovered = null, focused = null, queued = false;
  const update = () => {
    queued = false;
    const W = innerWidth, H = innerHeight;
    toContact.classList.toggle('is-away', nav.getBoundingClientRect().bottom > 0 || colophon.getBoundingClientRect().top < H);
    const active = hovered || focused;
    const hero = heroPlate.getBoundingClientRect();
    const r = active ? active.querySelector('.frame').getBoundingClientRect() : hero.bottom > 0 && hero.top < H ? hero : null;
    if (!r) { rays.classList.add('is-idle'); return; }
    const origins = [[0, 0], [W, 0], [W, H], [0, H]];
    const targets = [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]];
    lineEls.forEach((ray, k) => {
      const [ox, oy] = origins[k], [tx, ty] = targets[k];
      let a = Math.atan2(ty - oy, tx - ox) * 180 / Math.PI;
      if (ox > 0 && a < 0) a += 360; // keep right-hand origins in one continuous range so they never spin the long way
      ray.style.transform = `translate(${ox}px, ${oy}px) rotate(${a}deg) scaleX(${Math.hypot(tx - ox, ty - oy)})`;
    });
    holes.replaceChildren(...texts.map(t => t.getBoundingClientRect())
      .filter(b => b.width && b.bottom > 0 && b.top < H)
      .map(b => svgEl('rect', { x: b.left - 10, y: b.top - 8, width: b.width + 20, height: b.height + 16 })));
    // Fading in: aim first with transitions off, so the rays appear in place instead of sweeping from a stale aim.
    if (rays.classList.contains('is-idle')) { rays.getBoundingClientRect(); rays.classList.remove('is-idle'); }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  plates.forEach(li => {
    li.addEventListener('pointerenter', () => { hovered = li; queue(); });
    li.addEventListener('pointerleave', () => { hovered = null; queue(); });
    li.addEventListener('focusin', () => { focused = li; queue(); });
    li.addEventListener('focusout', () => { focused = null; queue(); });
  });
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  queue();
})();
