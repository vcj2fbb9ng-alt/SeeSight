/* SeeSight marketing site — progressive enhancement only.
   Every "Book a demo" is a real link to Cal.com, so the site works without JS. */
(function () {
  "use strict";

  var CAL_URL = "https://cal.com/seesight/30min";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.classList.add("js");

  /* ---------- Sticky nav ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (mobileMenu) mobileMenu.inert = !open;
  }
  if (toggle && mobileMenu) {
    mobileMenu.inert = true;
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920 && document.body.classList.contains("menu-open")) setMenu(false);
    });
  }

  /* ---------- Book a demo popup ---------- */
  var modal = null;
  function buildModal() {
    modal = document.createElement("dialog");
    modal.className = "modal";
    modal.setAttribute("aria-labelledby", "demo-title");
    modal.innerHTML =
      '<div class="modal-inner">' +
        '<div class="modal-head">' +
          "<div>" +
            '<h2 id="demo-title">Book a demo</h2>' +
            "<p>A 30-minute call with the SeeSight team. Pick a time that suits you.</p>" +
          "</div>" +
          '<button type="button" class="modal-close" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          "</button>" +
        "</div>" +
        '<div class="modal-body">' +
          '<div class="modal-loading">Loading calendar…</div>' +
        "</div>" +
        '<div class="modal-foot">' +
          "<span>Calendar not loading? " +
            '<a href="' + CAL_URL + '" target="_blank" rel="noopener">Open it in a new tab</a></span>' +
          '<span>Or email <a href="mailto:info@seesight.net">info@seesight.net</a></span>' +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);

    modal.querySelector(".modal-close").addEventListener("click", function () { modal.close(); });
    // Click on the backdrop closes the popup.
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
    modal.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
    });
  }

  function openDemo(trigger) {
    if (typeof HTMLDialogElement !== "function") return false;
    if (!modal) buildModal();
    var body = modal.querySelector(".modal-body");
    if (window.SEESIGHT_NO_EMBED) {
      // Hosts that forbid embedding other sites (e.g. a preview viewer) get a booking card instead.
      if (!body.querySelector(".modal-fallback")) {
        body.innerHTML =
          '<div class="modal-fallback">' +
            '<span class="eyebrow">30-minute demo</span>' +
            "<h3>Pick a time that suits you</h3>" +
            "<p>We'll walk you through SeeSight for travelers, accountants and your company, and answer your questions.</p>" +
            '<a class="btn btn-lg" href="' + CAL_URL + '" target="_blank" rel="noopener">Choose a time</a>' +
          "</div>";
        modal.querySelector(".modal-foot span").remove();
      }
    } else if (!body.querySelector("iframe")) {
      // The iframe is only created on first open, so pages stay fast.
      var frame = document.createElement("iframe");
      frame.src = CAL_URL + "?embed=true&layout=month_view";
      frame.title = "Book a 30-minute SeeSight demo (Cal.com)";
      frame.loading = "eager";
      frame.allow = "payment";
      frame.addEventListener("load", function () {
        var l = body.querySelector(".modal-loading");
        if (l) l.remove();
      });
      body.appendChild(frame);
    }
    modal._trigger = trigger;
    modal.showModal();
    document.documentElement.style.overflow = "hidden";
    if (document.body.classList.contains("menu-open")) setMenu(false);
    return true;
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-demo]");
    if (!t) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let users open in a new tab
    if (openDemo(t)) e.preventDefault();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .flow, [data-count]");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-in");
        if (el.hasAttribute("data-count")) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var duration = 1100;
    var start = null;
    // Small targets look better counting from a higher "spin" value down to the real one.
    var from = target <= 4 ? 9 : 0;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = String(target);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Role tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var list = root.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var ind = root.querySelector(".tab-ind");

    function moveIndicator(tab) {
      if (!ind) return;
      ind.style.width = tab.offsetWidth + "px";
      ind.style.transform = "translateX(" + tab.offsetLeft + "px)";
    }

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (!panel) return;
        if (on) {
          panel.hidden = false;
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
        } else {
          panel.hidden = true;
        }
      });
      moveIndicator(tab);
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });

    var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    moveIndicator(current);
    window.addEventListener("resize", function () {
      moveIndicator(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0]);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveIndicator(current); });
    if (list) list.classList.add("is-ready");
  });

  /* ---------- FAQ accordions (smooth open/close on top of <details>) ---------- */
  document.querySelectorAll(".faq details").forEach(function (d) {
    var summary = d.querySelector("summary");
    var body = d.querySelector(".faq-body");
    if (!summary || !body || !body.animate) return;
    summary.addEventListener("click", function (e) {
      if (reduceMotion.matches) return;
      e.preventDefault();
      if (d.open) {
        var h = body.offsetHeight;
        var a = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "ease" });
        a.onfinish = function () { d.open = false; };
      } else {
        d.open = true;
        var full = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: full + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
      }
    });
  });

  /* ---------- Rules demo (Accountants page): reorder, first match wins ---------- */
  document.querySelectorAll("[data-rules]").forEach(function (root) {
    var list = root.querySelector(".rules-list");
    var result = root.querySelector("[data-rules-result]");
    var status = root.querySelector("[data-rules-status]");
    // The sample expense the demo checks against.
    var expense = { category: "Hotel", perNight: 280 };

    function render() {
      var items = Array.prototype.slice.call(list.children);
      var matched = null;
      items.forEach(function (li, i) {
        li.querySelector(".pos").textContent = String(i + 1);
        li.querySelector('[data-move="up"]').disabled = i === 0;
        li.querySelector('[data-move="down"]').disabled = i === items.length - 1;
        var cat = li.getAttribute("data-category");
        var isMatch = !matched && (cat === expense.category || cat === "*");
        li.classList.toggle("is-match", isMatch);
        if (isMatch) matched = li;
      });
      if (matched && result) {
        var limit = parseInt(matched.getAttribute("data-limit"), 10);
        var name = matched.querySelector("b").textContent;
        var over = expense.perNight > limit;
        result.innerHTML = "Rule <b>" + (items.indexOf(matched) + 1) + "</b> applies (" + name + "): " +
          (over ? "<b>flagged</b>, above the limit." : "<b>within the limit</b>.");
      }
    }

    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-move]");
      if (!btn || btn.disabled) return;
      var li = btn.closest("li");
      var dir = btn.getAttribute("data-move");
      if (dir === "up" && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (dir === "down" && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
      render();
      var same = li.querySelector('[data-move="' + dir + '"]');
      (same && !same.disabled ? same : li.querySelector("[data-move]:not(:disabled)")).focus();
      if (status) status.textContent = li.querySelector("b").textContent + " moved to position " + (Array.prototype.indexOf.call(list.children, li) + 1) + ".";
    });

    render();
  });
})();
