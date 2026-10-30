/* Shared behavior. Classic script (no modules): pages must work from file://. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var canReveal = !reduceMotion && "IntersectionObserver" in window;

  var WORKS = window.WORKS || [];
  var CATEGORY = window.CATEGORIES || {};
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

  function gridField(kind) {
    return h("span", { "class": "grid-field grid-field--" + kind, "aria-hidden": "true" }, h("span", { "class": "grid-field-lit" }));
  }

  function categoryLabel(work) {
    return h("span", { "class": "label" }, [h("span", { "class": "marker", "aria-hidden": "true" }), CATEGORY[work.category]]);
  }

  function projectHref(work) { return "project.html?id=" + encodeURIComponent(work.id); }

  /* The project's images grouped into rows, as set by work.rows in works.js; images left over sit one per row. */
  function imageRows(work) {
    var sizes = (work.rows || []).slice();
    var rows = [];
    for (var i = 0; i < work.images.length; ) {
      var n = Math.max(1, sizes.shift() | 0);
      rows.push(work.images.slice(i, i + n).map(function (img, k) { return { img: img, n: i + k }; }));
      i += n;
    }
    return rows.map(function (row) {
      return h("div", { "class": "project-row", style: "--cols:" + row.length }, row.map(function (p) {
        var img = h("img", { src: p.img.src, alt: p.img.alt, loading: p.n < 2 ? "eager" : "lazy" });
        /* A very tall page (a full website screenshot) shows at its own width, uncapped, so it stays readable. */
        img.addEventListener("load", function () { if (img.naturalHeight > 2 * img.naturalWidth) img.classList.add("is-long"); });
        return h("figure", { "class": "project-figure" }, [
          h("div", { "class": "project-media" }, img),
          h("figcaption", { "class": "label" }, pad(p.n + 1) + " / " + pad(work.images.length))
        ]);
      }));
    });
  }

  /* ---------- Project detail: project.html?id=<id> ---------- */

  var projectRoot = document.querySelector("[data-project]");
  if (projectRoot) {
    var id = new URLSearchParams(location.search).get("id");
    var at = -1;
    WORKS.forEach(function (w, i) { if (w.id === id) at = i; });

    if (at < 0) {
      /* Unknown or missing id: a quiet "work in progress" page, worded in content.js, linking back into direction A. */
      var wip = (window.SITE && window.SITE.workInProgress) || {};
      var heading = wip.heading || "Work in Progress";
      document.title = heading + " — " + SITE_NAME;
      projectRoot.appendChild(h("article", { "class": "project" }, [
        h("p", {}, h("a", { "class": "back-link label", href: "index.html#work" }, "← All work")),
        h("h1", { "class": "project-title" }, heading),
        h("p", { "class": "project-summary" }, wip.line || "This project is still being put together. Check back soon.")
      ]));
    } else {
      var work = WORKS[at];
      var prev = WORKS[(at - 1 + WORKS.length) % WORKS.length];
      var next = WORKS[(at + 1) % WORKS.length];
      document.title = work.title + " — " + SITE_NAME;
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", work.summary);

      /* Facts the owner hasn't supplied yet are null in works.js and read as a plain "To be added". */
      var fact = function (term, value) {
        return h("div", {}, [h("dt", { "class": "label" }, term), h("dd", {}, value == null ? "To be added" : String(value))]);
      };
      var story = [["Brief", work.brief], ["Approach", work.approach], ["Outcome", work.outcome]]
        .filter(function (s) { return s[1]; })
        .map(function (s) { return h("section", { "class": "project-story" }, [h("h2", {}, s[0]), h("p", {}, s[1])]); });
      if (work.deliverables && work.deliverables.length) {
        story.push(h("section", { "class": "project-story" }, [
          h("h2", {}, "Deliverables"),
          h("ul", { "class": "deliverables" }, work.deliverables.map(function (d) { return h("li", {}, d); }))
        ]));
      }
      var guide = work.styleGuide;
      if (guide) {
        story.push(h("section", { "class": "project-story" }, [
          h("h2", {}, "Style guide"),
          guide.fonts ? h("ul", { "class": "guide-fonts" }, guide.fonts.map(function (f) {
            return h("li", {}, [h("span", { "class": "label" }, f[0]), " " + f[1]]);
          })) : null,
          h("ul", { "class": "guide-colors", "aria-label": "Colors" }, (guide.colors || []).map(function (c) {
            return h("li", {}, [h("span", { "class": "swatch", style: "background:" + c }), c]);
          }))
        ]));
      }

      projectRoot.appendChild(h("article", { "class": "project" }, [
        h("p", {}, h("a", { "class": "back-link label", href: "index.html#work" }, "← All work")),
        h("header", { "class": "project-head" }, [
          gridField("p-head"),
          categoryLabel(work),
          h("h1", { "class": "project-title" }, work.title),
          h("p", { "class": "project-summary" }, work.summary)
        ]),
        h("dl", { "class": "project-facts" }, [
          fact("Client", work.client),
          work.started ? fact(work.dateLabel || "Started", work.started) : fact("Year", work.year),
          fact("Category", CATEGORY[work.category]),
          fact("Role", work.role),
          fact("Images", work.images.length)
        ]),
        story.length ? h("div", { "class": "project-text" }, [gridField("p-text")].concat(story)) : null,
        h("div", { "class": "project-images" }, imageRows(work)),
        h("nav", { "class": "project-pager", "aria-label": "More projects" }, [
          h("a", { href: projectHref(prev), rel: "prev" }, [h("span", { "class": "label" }, "← Previous"), h("span", { "class": "pager-title" }, prev.title)]),
          h("a", { href: projectHref(next), rel: "next" }, [h("span", { "class": "label" }, "Next →"), h("span", { "class": "pager-title" }, next.title)])
        ]),
        h("section", { "class": "project-contact", "aria-labelledby": "project-contact-title" }, [
          gridField("p-contact"),
          h("h2", { id: "project-contact-title" }, "Have a project like this in mind?"),
          h("p", {}, "Tell me about it."),
          h("a", { "class": "button", href: "mailto:" + EMAIL }, "Email " + EMAIL)
        ])
      ]));
    }
    /* Grid fields (js/grid.js): soften once rendered and whenever the page width changes. */
    if (window.softenGridFields) {
      softenGridFields();
      var gridTimer;
      addEventListener("resize", function () { clearTimeout(gridTimer); gridTimer = setTimeout(softenGridFields, 150); });
    }
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
