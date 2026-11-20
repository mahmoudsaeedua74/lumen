(function () {
  function closeLangMenu(menu) {
    if (!menu) return;
    var toggle = menu.querySelector("[data-lang-toggle]");
    var dropdown = menu.querySelector("[data-lang-dropdown]");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (dropdown) dropdown.hidden = true;
  }

  function initLanguageMenu() {
    var menu = document.querySelector("[data-lang-menu]");
    if (!menu) return;

    var toggle = menu.querySelector("[data-lang-toggle]");
    var dropdown = menu.querySelector("[data-lang-dropdown]");
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      dropdown.hidden = open;
    });

    dropdown.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var lang = btn.getAttribute("data-set-lang");
        if (lang === "ar" || lang === "en") {
          window.LumenI18n.setLang(lang);
          window.location.reload();
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target)) closeLangMenu(menu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLangMenu(menu);
        toggle.focus();
      }
    });
  }

  function initNavigation() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        mobileNav.hidden = open;
        document.body.classList.toggle("nav-open", !open);
      });

      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          toggle.setAttribute("aria-expanded", "false");
          mobileNav.hidden = true;
          document.body.classList.remove("nav-open");
        });
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          toggle.setAttribute("aria-expanded", "false");
          mobileNav.hidden = true;
          document.body.classList.remove("nav-open");
          toggle.focus();
        }
      });
    }

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    initLanguageMenu();
  }

  function initScrollReveal() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  window.LumenNav = {
    initNavigation: initNavigation,
    initScrollReveal: initScrollReveal,
    initSmoothAnchors: initSmoothAnchors,
  };
})();
