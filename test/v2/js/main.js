/* Shared behavior. Classic script (no modules): pages must work from file://. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var canReveal = !reduceMotion && "IntersectionObserver" in window;

  var WORKS = window.WORKS || [];
  var CATEGORY = { branding: "Branding", poster: "Poster", illustration: "Illustration" };
  var SITE_NAME = "Your Name";
  var EMAIL = "hello@yourname.com";

  /* Tiny element builder: h("a", { href: "#" }, [children or text]). */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    [].concat(children || []).forEach(function (c) {
      if (c != null) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function categoryLabel(work) {
    return h("span", { "class": "label" }, [h("span", { "class": "marker", "aria-hidden": "true" }), CATEGORY[work.category]]);
  }

  function projectHref(work) { return "project.html?id=" + encodeURIComponent(work.id); }

  /* ---------- Home (featured) and Work (all): uniform cards ---------- */

  function card(work, index) {
    var cover = work.images[0];
    return h("li", { "class": "card", "data-cat": work.category }, [
      h("a", { "class": "card-link", href: projectHref(work) }, [
        h("div", { "class": "card-media" }, [
          h("img", { src: cover.src, alt: cover.alt, loading: index < 4 ? "eager" : "lazy" })
        ]),
        h("h3", { "class": "card-title" }, work.title),
        h("div", { "class": "card-meta" }, [categoryLabel(work), h("span", { "class": "label" }, String(work.year))])
      ])
    ]);
  }

  document.querySelectorAll("[data-works]").forEach(function (list) {
    var works = list.getAttribute("data-works") === "featured"
      ? WORKS.filter(function (w) { return w.featured; })
      : WORKS;
    works.forEach(function (w, i) { list.appendChild(card(w, i)); });
  });

  /* Work filter: real buttons with aria-pressed, state kept in ?cat= so views can be shared. */
  var filter = document.querySelector("[data-filter]");
  if (filter) {
    var buttons = filter.querySelectorAll("button");
    var count = document.querySelector("[data-filter-count]");
    var cards = document.querySelectorAll("[data-works='all'] .card");

    var apply = function (cat, updateUrl) {
      if (!CATEGORY[cat]) cat = "";
      var shown = 0;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === cat)); });
      cards.forEach(function (c) {
        var match = !cat || c.getAttribute("data-cat") === cat;
        c.hidden = !match;
        if (match) shown++;
      });
      if (count) count.textContent = "Showing " + shown + " of " + cards.length + " works";
      if (updateUrl) {
        var url = new URL(location.href);
        if (cat) url.searchParams.set("cat", cat); else url.searchParams.delete("cat");
        history.replaceState(null, "", url.href);
      }
    };

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-cat"), true); });
    });
    apply(new URLSearchParams(location.search).get("cat") || "", false);
  }

  /* ---------- Project detail: project.html?id=<id> ---------- */

  var projectRoot = document.querySelector("[data-project]");
  if (projectRoot) {
    var id = new URLSearchParams(location.search).get("id");
    var at = -1;
    WORKS.forEach(function (w, i) { if (w.id === id) at = i; });

    if (at < 0) {
      document.title = "Project not found — " + SITE_NAME;
      projectRoot.appendChild(h("div", { "class": "page-head not-found" }, [
        h("p", { "class": "label" }, "Error"),
        h("h1", {}, "Project not found"),
        h("p", {}, "There is no project at this address. It may have been renamed or removed."),
        h("p", {}, h("a", { "class": "button", href: "work.html" }, "See all work"))
      ]));
    } else {
      var work = WORKS[at];
      var prev = WORKS[(at - 1 + WORKS.length) % WORKS.length];
      var next = WORKS[(at + 1) % WORKS.length];
      document.title = work.title + " — " + SITE_NAME;
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", work.summary);

      var fact = function (term, value) {
        return h("div", {}, [h("dt", { "class": "label" }, term), h("dd", {}, value == null ? "—" : String(value))]);
      };
      var story = [["Brief", work.brief], ["Approach", work.approach], ["Outcome", work.outcome]]
        .filter(function (s) { return s[1]; })
        .map(function (s) { return h("section", { "class": "project-story" }, [h("h2", {}, s[0]), h("p", {}, s[1])]); });
      if (work.category === "branding" && work.deliverables.length) {
        story.push(h("section", { "class": "project-story" }, [
          h("h2", {}, "Deliverables"),
          h("ul", { "class": "deliverables" }, work.deliverables.map(function (d) { return h("li", {}, d); }))
        ]));
      }

      projectRoot.appendChild(h("article", { "class": "project" }, [
        h("p", {}, h("a", { "class": "back-link label", href: "work.html" }, "← All work")),
        h("header", { "class": "project-head" }, [
          categoryLabel(work),
          h("h1", { "class": "project-title" }, work.title),
          h("p", { "class": "project-summary" }, work.summary)
        ]),
        h("dl", { "class": "project-facts" }, [
          fact("Client", work.client),
          fact("Year", work.year),
          fact("Category", CATEGORY[work.category]),
          fact("Medium", work.medium),
          fact("Size", work.size)
        ]),
        story.length ? h("div", { "class": "project-text" }, story) : null,
        h("div", { "class": "project-images" }, work.images.map(function (img, i) {
          return h("figure", { "class": "project-figure" }, [
            h("div", { "class": "project-media" }, h("img", { src: img.src, alt: img.alt, loading: i < 2 ? "eager" : "lazy" })),
            h("figcaption", { "class": "label" }, pad(i + 1) + " / " + pad(work.images.length))
          ]);
        })),
        h("nav", { "class": "project-pager", "aria-label": "More projects" }, [
          h("a", { href: projectHref(prev), rel: "prev" }, [h("span", { "class": "label" }, "← Previous"), h("span", { "class": "pager-title" }, prev.title)]),
          h("a", { href: projectHref(next), rel: "next" }, [h("span", { "class": "label" }, "Next →"), h("span", { "class": "pager-title" }, next.title)])
        ]),
        h("section", { "class": "project-contact", "aria-labelledby": "project-contact-title" }, [
          h("h2", { id: "project-contact-title" }, "Have a project like this in mind?"),
          h("p", {}, "I take on branding, poster and illustration work. Tell me about yours."),
          h("a", { "class": "button", href: "mailto:" + EMAIL }, "Email " + EMAIL)
        ])
      ]));
    }
  }

  /* ---------- Gallery: poster wall of every image, with a <dialog> lightbox ---------- */

  var wall = document.querySelector("[data-wall]");
  var lightbox = document.querySelector("[data-lightbox]");
  if (wall && lightbox) {
    var pieces = [];
    WORKS.forEach(function (w) {
      w.images.forEach(function (img, i) { pieces.push({ work: w, img: img, n: i + 1, of: w.images.length }); });
    });

    pieces.forEach(function (p, i) {
      wall.appendChild(h("li", {}, h("button", {
        type: "button",
        "class": "wall-tile card-link",
        "data-index": String(i),
        "aria-label": "Open " + p.work.title + ", image " + p.n + " of " + p.of,
        "aria-haspopup": "dialog"
      }, h("div", { "class": "card-media" }, h("img", { src: p.img.src, alt: p.img.alt, loading: i < 12 ? "eager" : "lazy" })))));
    });
    var countEl = document.querySelector("[data-wall-count]");
    if (countEl) countEl.textContent = pieces.length + " pieces from " + WORKS.length + " projects";

    var lbImg = lightbox.querySelector("[data-lb-img]");
    var lbTitle = lightbox.querySelector("[data-lb-title]");
    var lbMeta = lightbox.querySelector("[data-lb-meta]");
    var lbLink = lightbox.querySelector("[data-lb-link]");
    var lbCount = lightbox.querySelector("[data-lb-count]");
    var current = 0;
    var opener = null;

    var show = function (i) {
      current = (i + pieces.length) % pieces.length;
      var p = pieces[current];
      lbImg.src = p.img.src;
      lbImg.alt = p.img.alt;
      lbTitle.textContent = p.work.title;
      lbMeta.textContent = CATEGORY[p.work.category] + " · " + p.work.year + " · image " + p.n + " of " + p.of;
      lbLink.href = projectHref(p.work);
      lbCount.textContent = pad(current + 1) + " / " + pad(pieces.length);
    };

    wall.addEventListener("click", function (e) {
      var tile = e.target.closest(".wall-tile");
      if (!tile) return;
      opener = tile;
      show(Number(tile.getAttribute("data-index")));
      lightbox.showModal();
    });
    lightbox.querySelector("[data-lb-prev]").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector("[data-lb-next]").addEventListener("click", function () { show(current + 1); });
    lightbox.querySelector("[data-lb-close]").addEventListener("click", function () { lightbox.close(); });
    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    });
    /* Esc closes natively (cancel -> close). Either way, focus goes back to the tile that opened it. */
    lightbox.addEventListener("close", function () {
      if (opener) opener.focus();
    });
  }

  /* ---------- Reveal: halftone/grain to clear, once, as artwork scrolls into view ---------- */

  if (canReveal) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-revealed");
        observer.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
    document.querySelectorAll(".card-media, .project-media").forEach(function (m) {
      m.classList.add("reveal");
      observer.observe(m);
    });
  }

  /* ---------- Crosshair cursor: fine pointers only, off with reduced motion. Locks on over artwork. ---------- */

  if (finePointer && !reduceMotion) {
    var cross = h("div", { "class": "crosshair", "aria-hidden": "true" });
    cross.innerHTML = '<svg viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<circle cx="20" cy="20" r="11"/><path d="M20 2v12M20 26v12M2 20h12M26 20h12"/></g></svg>';
    document.body.appendChild(cross);
    root.classList.add("has-crosshair");

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      cross.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
      cross.classList.add("is-visible");
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      cross.classList.toggle("is-locked", !!(e.target.closest && e.target.closest(".card-media, .project-media")));
    });
    root.addEventListener("pointerleave", function () {
      cross.classList.remove("is-visible");
    });
  }
})();
