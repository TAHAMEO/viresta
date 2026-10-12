/* Viresta site script. No dependencies. */
(function () {
  "use strict";

  /* ---------- Editable business data (used by the pricing page) ---------- */
  var MIN_ORDER = 750;
  var EMAIL_TO = "hello@viresta.com";

  var SYSTEMS = [
    { id: "voice", name: "Voice AI agent", note: "Per agent", price: 200 },
    { id: "convo", name: "Conversation agent", note: "Per agent", price: 180 },
    { id: "chat", name: "Live chat", note: "Per setup", price: 150 },
    { id: "widget", name: "Chat widget", note: "Per setup", price: 70 },
    { id: "wa", name: "WhatsApp automation", note: "Per automation", price: 20 },
    { id: "inbox", name: "Unified inbox", note: "Per setup", price: 120 },
    { id: "pipe", name: "Pipeline opportunities", note: "Per setup", price: 50 },
    { id: "cal", name: "Booking calendar", note: "Per setup, with reminders and confirmation", price: 50 },
    { id: "follow", name: "Follow-up workflow", note: "Per workflow", price: 80 },
    { id: "email", name: "Email automation", note: "Per automation", price: 30 },
    { id: "sms", name: "SMS automation", note: "Per automation", price: 30 },
    { id: "missed", name: "Missed-call text back", note: "Per setup", price: 90 },
    { id: "nurt", name: "Nurture", note: "Per setup", price: 120 },
    { id: "rep", name: "Review and reputation", note: "Per setup", price: 250 },
    { id: "dash", name: "Customized dashboard", note: "Per dashboard", price: 150 },
    { id: "lp", name: "Landing page", note: "Per page, with lead capture", price: 150 },
    { id: "web", name: "Website", note: "Per website, scope set in your proposal", price: 250 },
    { id: "forms", name: "Forms / surveys", note: "Per setup", price: 70 },
    { id: "leads", name: "Lead ads sync", note: "Per setup", price: 100 },
    { id: "qr", name: "QR code and Twilio", note: "Per setup", price: 30 }
  ];
  var CONTENT = [
    { id: "pod", name: "Podcast / long-form edit", note: "Per episode, up to 60 min", price: 100 },
    { id: "vlog", name: "Vlog editing", note: "Per vlog", price: 70 },
    { id: "sform", name: "Short-form video", note: "Per standalone video", price: 50 },
    { id: "short", name: "Reel / Short", note: "Per reel or short, with captions", price: 10 },
    { id: "hook", name: "Hook", note: "Per custom hook", price: 20 },
    { id: "thumb", name: "Thumbnail", note: "Per thumbnail", price: 5 }
  ];
  var SOCIAL = [
    { id: "smstrat", name: "Strategy and content plan", note: "Goals, themes and a content calendar", price: 150 },
    { id: "smpost", name: "Design / carousel", note: "Per design, built to your brand", price: 15 },
    { id: "smreel", name: "Reel / short-form edit", note: "Per video for your social channels", price: 10 },
    { id: "smcap", name: "Hooks for social posts", note: "Per hook, written for the platform", price: 20 },
    { id: "smsched", name: "Content scheduling", note: "Per task or batch", price: 10 }
  ];
  var SOCIAL_CFG = {
    platformPerMonth: 150,
    platforms: ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn"],
    frequencies: [
      { id: "3", label: "3 posts / week", mult: 1 },
      { id: "5", label: "5 posts / week", mult: 1.5 },
      { id: "7", label: "7 posts / week", mult: 2 }
    ]
  };
  var ADDONS = [
    { name: "Extra long-form / podcast edit", price: 100 },
    { name: "Extra reel / short", price: 10 },
    { name: "Extra thumbnail", price: 5 },
    { name: "Extra hook", price: 20 },
    { name: "Extra carousel design", price: 15 },
    { name: "Additional landing page", price: 150 },
    { name: "Additional follow-up workflow", price: 80 },
    { name: "Strategy and content plan", price: 150 }
  ];

  /* ---------- Helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(n) { return "$" + n.toLocaleString("en-US"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error(e); } }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  var hasIO = "IntersectionObserver" in window;

  /* ---------- Header + mobile menu ---------- */
  safe(function () {
    var header = $(".site-header"), btn = $(".nav-toggle");
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    if (!btn) return;
    function setOpen(open) {
      document.body.classList.toggle("nav-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    btn.addEventListener("click", function () { setOpen(!document.body.classList.contains("nav-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 900) setOpen(false); });
  });

  /* ---------- Reveal on scroll, steps, and pausing off-screen animations ---------- */
  safe(function () {
    var reveals = $$(".reveal"), steps = $$("[data-steps]");
    if (!hasIO) { reveals.concat(steps).forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.concat(steps).forEach(function (el) { io.observe(el); });

    var animated = $$(".flow, .illo, .svc-illo, .recipe, .deco, .cta-band, .monogram, .marquee");
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("paused", !e.isIntersecting); });
    });
    animated.forEach(function (el) { pio.observe(el); });
  });

  /* ---------- Footer year, copy email ---------- */
  safe(function () {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-copy");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(v).then(function () { toast("Email copied"); }, function () { toast(v); });
        } else { toast(v); }
      });
    });
  });

  /* ---------- Pricing: add-ons ---------- */
  safe(function () {
    var box = $("#addons"); if (!box) return;
    box.innerHTML = ADDONS.map(function (a) {
      return '<div class="addon reveal in"><span>' + esc(a.name) + "</span><b>" + money(a.price) + "</b></div>";
    }).join("");
  });

  /* ---------- Pricing: custom package builder ---------- */
  safe(function () {
    if (!$("#builder")) return;
    var qty = {};                       // id -> quantity
    var sm = { plat: {}, freq: "3" };   // social media management
    var ALL = {};
    SYSTEMS.concat(CONTENT, SOCIAL).forEach(function (i) { ALL[i.id] = i; qty[i.id] = 0; });

    function renderList(key, items) {
      var box = $('[data-list="' + key + '"]');
      box.innerHTML = items.map(function (i) {
        return '<div class="b-item" data-id="' + i.id + '">' +
          '<span class="nm">' + esc(i.name) + "</span>" +
          '<span class="nt">' + esc(i.note) + "</span>" +
          '<span class="pr">' + money(i.price) + "</span>" +
          '<div class="qty"><button type="button" data-step="-1" aria-label="Remove one ' + esc(i.name) + '">&minus;</button>' +
          '<output aria-live="polite" aria-label="' + esc(i.name) + ' quantity">0</output>' +
          '<button type="button" data-step="1" aria-label="Add one ' + esc(i.name) + '">+</button></div></div>';
      }).join("");
    }
    renderList("systems", SYSTEMS);
    renderList("content", CONTENT);
    renderList("social", SOCIAL);

    $("#sm-platforms").innerHTML = SOCIAL_CFG.platforms.map(function (p) {
      return '<label class="chip"><input type="checkbox" value="' + esc(p) + '"><span>' + esc(p) + "</span></label>";
    }).join("");
    $("#sm-freq").innerHTML = SOCIAL_CFG.frequencies.map(function (f) {
      return '<option value="' + f.id + '">' + esc(f.label) + "</option>";
    }).join("");

    function smLine() {
      var plats = SOCIAL_CFG.platforms.filter(function (p) { return sm.plat[p]; });
      if (!plats.length) return null;
      var f = SOCIAL_CFG.frequencies.filter(function (x) { return x.id === sm.freq; })[0];
      var total = Math.round(SOCIAL_CFG.platformPerMonth * plats.length * f.mult);
      return { name: "Social media management (" + plats.join(", ") + ", " + f.label + ")", total: total, monthly: true };
    }

    function lines() {
      var out = [];
      Object.keys(qty).forEach(function (id) {
        if (qty[id] > 0) out.push({ name: ALL[id].name + (qty[id] > 1 ? " × " + qty[id] : ""), total: ALL[id].price * qty[id] });
      });
      var s = smLine(); if (s) out.push(s);
      return out;
    }

    function update() {
      $$(".b-item").forEach(function (el) {
        var n = qty[el.getAttribute("data-id")];
        el.querySelector("output").textContent = n;
        el.classList.toggle("is-on", n > 0);
      });
      var ls = lines(), total = ls.reduce(function (a, l) { return a + l.total; }, 0);
      $("#sum-list").innerHTML = ls.map(function (l) {
        return "<li><span>" + esc(l.name) + "</span><span>" + money(l.total) + (l.monthly ? "/mo" : "") + "</span></li>";
      }).join("");
      $("#sum-empty").hidden = ls.length > 0;
      $("#sum-total").textContent = money(total);
      $("#sum-meter").style.width = Math.min(100, (total / MIN_ORDER) * 100) + "%";
      var ok = total >= MIN_ORDER, send = $("#sum-send");
      $("#sum-note").textContent = ok ? "Your selection meets the $750 minimum." :
        (total ? "Add " + money(MIN_ORDER - total) + " more to reach the $750 minimum." : "Custom orders start at $750.");
      send.setAttribute("aria-disabled", String(!ok));
      send.style.opacity = ok ? "" : ".5";
      if (ok) {
        var text = ls.map(function (l) { return "- " + l.name + ": " + money(l.total) + (l.monthly ? " per month" : ""); }).join("\n") +
          "\nTotal: " + money(total);
        send.href = "contact.html?build=" + encodeURIComponent(text);
      } else {
        send.href = "contact.html";
      }
    }

    $("#builder").addEventListener("click", function (e) {
      var b = e.target.closest("[data-step]"); if (!b) return;
      var id = b.closest(".b-item").getAttribute("data-id");
      qty[id] = Math.max(0, Math.min(99, qty[id] + Number(b.getAttribute("data-step"))));
      update();
    });
    $("#sm-platforms").addEventListener("change", function (e) { sm.plat[e.target.value] = e.target.checked; update(); });
    $("#sm-freq").addEventListener("change", function (e) { sm.freq = e.target.value; update(); });
    $("#sum-clear").addEventListener("click", function () {
      Object.keys(qty).forEach(function (k) { qty[k] = 0; });
      sm.plat = {}; $$("#sm-platforms input").forEach(function (i) { i.checked = false; });
      update();
    });
    $("#sum-send").addEventListener("click", function (e) {
      if (this.getAttribute("aria-disabled") === "true") { e.preventDefault(); toast("Custom orders start at $750"); }
    });

    // Accessible tabs
    var tabs = $$(".b-tab");
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        $("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
      });
    });

    update();
  });

  /* ---------- Contact form (opens the visitor's email app; no server needed) ---------- */
  safe(function () {
    var form = $("#contact-form"); if (!form) return;
    var params = new URLSearchParams(window.location.search);
    var msg = $("#c-msg"), interest = $("#c-int");
    if (params.get("package")) {
      interest.value = "A monthly package";
      msg.value = "I'm interested in the " + params.get("package") + " package.";
    } else if (params.get("build")) {
      interest.value = "A custom package";
      msg.value = "My custom package:\n" + params.get("build");
    }

    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    function setErr(id, text) {
      var input = $("#" + id), err = $("#e-" + id);
      err.textContent = text || "";
      if (text) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#c-name").value.trim(), email = $("#c-email").value.trim();
      setErr("c-name", name ? "" : "Please enter your name.");
      setErr("c-email", EMAIL.test(email) ? "" : "Please enter a valid email address.");
      if (!name || !EMAIL.test(email)) { (name ? $("#c-email") : $("#c-name")).focus(); return; }

      var body = [
        "Name: " + name,
        "Email: " + email,
        "Business: " + ($("#c-biz").value.trim() || "-"),
        "Preferred time: " + $("#c-time").value,
        "Interested in: " + interest.value,
        "",
        msg.value.trim()
      ].join("\n");
      window.location.href = "mailto:" + EMAIL_TO +
        "?subject=" + encodeURIComponent("Strategy call request from " + name) +
        "&body=" + encodeURIComponent(body);
      toast("Opening your email app…");
    });
  });
})();
