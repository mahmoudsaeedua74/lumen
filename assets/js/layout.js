(function () {
  var SITE = window.LUMEN_SITE;
  var ASSETS = window.LUMEN_ASSETS;

  function t(key) {
    return window.LumenI18n.t(key);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function currentPage() {
    var file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!file || file === "/") return "index.html";
    return file;
  }

  function isHome() {
    var page = currentPage();
    return page === "index.html" || page === "";
  }

  function navItems() {
    var homePrefix = isHome() ? "" : "index.html";
    return [
      { href: homePrefix ? "index.html" : "index.html", label: t("navHome"), key: "home" },
      { href: homePrefix + "#collection", label: t("navShop"), key: "shop" },
      { href: homePrefix + "#benefits", label: t("navAbout"), key: "about" },
      {
        href: SITE.contact.email ? "mailto:" + SITE.contact.email : homePrefix + "#footer",
        label: t("navContact"),
        key: "contact",
        external: !!SITE.contact.email,
      },
    ];
  }

  function iconGlobe() {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  }

  function iconHeart() {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M12.1 8.2l-.1.1-.1-.1C10.5 6.5 8 6 6.2 7.3 4.4 8.5 4.1 10.8 5.4 12.8c1.1 1.7 4 4.2 6.6 5.9 2.6-1.7 5.5-4.2 6.6-5.9 1.3-2 .9-4.3-.9-5.5-1.8-1.3-4.3-.8-5.6 1z"/></svg>';
  }

  function iconBag() {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M6 8h12l-1 11H7L6 8z"/><path fill="none" stroke="currentColor" stroke-width="1.5" d="M9 8V7a3 3 0 0 1 6 0v1"/><path fill="none" stroke="currentColor" stroke-width="1.5" d="M9 12h6"/></svg>';
  }

  function updateCartBadge() {
    var count = window.LumenCart.getCount();
    document.querySelectorAll("[data-cart-badge]").forEach(function (badge) {
      if (count > 0) {
        badge.hidden = false;
        badge.textContent = String(count);
      } else {
        badge.hidden = true;
        badge.textContent = "0";
      }
    });
  }

  function updateWishlistBadge() {
    var count = window.LumenWishlist.getCount();
    document.querySelectorAll("[data-wishlist-badge]").forEach(function (badge) {
      if (count > 0) {
        badge.hidden = false;
        badge.textContent = String(count);
      } else {
        badge.hidden = true;
        badge.textContent = "0";
      }
    });
  }

  function mountChrome(options) {
    options = options || {};
    var active = options.active;
    var announcement = document.querySelector("[data-announcement]");
    if (announcement) {
      announcement.hidden = false;
      var textEl = announcement.querySelector("[data-announcement-text]");
      if (textEl) textEl.textContent = t("announcement");
    }

    var header = document.querySelector("[data-site-header]");
    if (header) {
      var links = navItems()
        .map(function (item) {
          var on = active ? active === item.key : false;
          if (!active && item.key === "home" && isHome() && !window.location.hash) on = true;
          if (!active && item.key === "shop" && currentPage() === "product.html") on = true;
          if (active === "product" && item.key === "shop") on = true;
          return (
            '<a class="nav-link' +
            (on ? " is-active" : "") +
            '" href="' +
            escapeAttr(item.href) +
            '"' +
            (on ? ' aria-current="page"' : "") +
            ">" +
            escapeHtml(item.label) +
            "</a>"
          );
        })
        .join("");

      var lang = window.LumenI18n.getLang();

      header.innerHTML =
        '<div class="header-inner">' +
        '<div class="header-start">' +
        '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-menu-toggle>' +
        '<span class="menu-toggle-bars" aria-hidden="true"></span>' +
        '<span class="visually-hidden">' +
        escapeHtml(t("menu")) +
        "</span></button>" +
        '<nav class="nav-desktop" aria-label="Primary">' +
        links +
        "</nav></div>" +
        '<a class="brand" href="index.html" aria-label="' +
        escapeAttr(SITE.brand) +
        '">' +
        '<img class="brand-logo" src="' +
        ASSETS.logo +
        '" width="160" height="42" alt="' +
        escapeAttr(SITE.brand) +
        '" /></a>' +
        '<div class="header-end">' +
        '<div class="lang-menu" data-lang-menu>' +
        '<button class="icon-btn" type="button" data-lang-toggle aria-expanded="false" aria-haspopup="listbox" aria-label="' +
        escapeAttr(t("langSwitchAria")) +
        '">' +
        iconGlobe() +
        "</button>" +
        '<ul class="lang-dropdown" role="listbox" hidden data-lang-dropdown>' +
        '<li role="option" aria-selected="' +
        (lang === "ar" ? "true" : "false") +
        '"><button type="button" data-set-lang="ar">العربية</button></li>' +
        '<li role="option" aria-selected="' +
        (lang === "en" ? "true" : "false") +
        '"><button type="button" data-set-lang="en">English</button></li>' +
        "</ul></div>" +
        '<button class="icon-btn header-wishlist" type="button" data-open-wishlist aria-label="' +
        escapeAttr(t("wishlistAria")) +
        '">' +
        iconHeart() +
        '<span class="count-badge" data-wishlist-badge hidden>0</span></button>' +
        '<button class="icon-btn" type="button" data-open-cart aria-label="' +
        escapeAttr(t("cartAria")) +
        '">' +
        iconBag() +
        '<span class="count-badge" data-cart-badge hidden>0</span></button>' +
        "</div></div>" +
        '<nav id="mobile-nav" class="nav-mobile" aria-label="Mobile" hidden data-mobile-nav>' +
        links +
        '<button type="button" class="nav-link nav-link--btn" data-open-wishlist>' +
        escapeHtml(t("wishlist")) +
        '</button><button type="button" class="nav-link nav-link--btn" data-open-cart>' +
        escapeHtml(t("navCart")) +
        "</button></nav>";

      header.querySelectorAll("[data-open-cart]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (window.LumenCartDrawer) window.LumenCartDrawer.open();
        });
      });
      header.querySelectorAll("[data-open-wishlist]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (window.LumenWishlistDrawer) window.LumenWishlistDrawer.open();
        });
      });
    }

    var footer = document.querySelector("[data-site-footer]");
    if (footer) {
      var email = SITE.contact.email;
      var address =
        SITE.contact.address && typeof SITE.contact.address === "object"
          ? window.LumenI18n.localized(SITE.contact.address)
          : SITE.contact.address;
      footer.innerHTML =
        '<div class="footer-compact" id="footer">' +
        '<a class="brand" href="index.html"><img src="' +
        ASSETS.logo +
        '" width="140" height="37" alt="' +
        escapeAttr(SITE.brand) +
        '" /></a>' +
        "<p>" +
        escapeHtml(t("brandTagline")) +
        "</p>" +
        '<div class="footer-compact__links">' +
        '<a href="index.html#collection">' +
        escapeHtml(t("navShop")) +
        "</a>" +
        '<a href="index.html#benefits">' +
        escapeHtml(t("navAbout")) +
        "</a>" +
        (email ? '<a href="mailto:' + escapeAttr(email) + '">' + escapeHtml(email) + "</a>" : "") +
        (SITE.social.instagram
          ? '<a href="' + escapeAttr(SITE.social.instagram) + '" target="_blank" rel="noopener noreferrer">Instagram</a>'
          : "") +
        "</div>" +
        (address ? '<p class="hint">' + escapeHtml(address) + "</p>" : "") +
        '<p class="footer-bottom-line">&copy; <span data-year></span> ' +
        escapeHtml(SITE.brand) +
        ". " +
        escapeHtml(t("rights")) +
        "</p></div>";
      var year = footer.querySelector("[data-year]");
      if (year) year.textContent = String(new Date().getFullYear());
    }

    window.LumenI18n.apply(document);
    updateCartBadge();
    updateWishlistBadge();
  }

  window.LumenLayout = {
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    mountChrome: mountChrome,
    updateCartBadge: updateCartBadge,
    updateWishlistBadge: updateWishlistBadge,
  };

  window.addEventListener("lumen:cartchange", updateCartBadge);
  window.addEventListener("lumen:wishlistchange", updateWishlistBadge);
})();
