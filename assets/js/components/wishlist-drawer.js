(function () {
  function t(key) {
    return window.LumenI18n.t(key);
  }
  function esc(s) {
    return window.LumenLayout.escapeHtml(s);
  }
  function attr(s) {
    return window.LumenLayout.escapeAttr(s);
  }

  function ensureDrawer() {
    var el = document.getElementById("wishlist-drawer");
    if (el) return el;
    el = document.createElement("div");
    el.id = "wishlist-drawer";
    el.className = "drawer";
    el.setAttribute("hidden", "");
    el.innerHTML =
      '<div class="drawer__backdrop" data-wish-close></div>' +
      '<aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="wish-drawer-title">' +
      '<div class="drawer__head"><h2 id="wish-drawer-title">' +
      esc(t("wishlistPageTitle")) +
      '</h2><button type="button" class="icon-btn" data-wish-close aria-label="' +
      attr(t("close")) +
      '">&times;</button></div>' +
      '<div class="drawer__body" data-wish-body></div></aside>';
    document.body.appendChild(el);
    el.querySelectorAll("[data-wish-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.hasAttribute("hidden")) close();
    });
    return el;
  }

  function render() {
    var el = ensureDrawer();
    var body = el.querySelector("[data-wish-body]");
    var title = el.querySelector("#wish-drawer-title");
    if (title) title.textContent = t("wishlistPageTitle");
    var items = window.LumenWishlist.getItems();
    if (!items.length) {
      body.innerHTML =
        '<div class="drawer-empty"><p>' +
        esc(t("wishlistEmpty")) +
        "</p><p class=\"hint\">" +
        esc(t("wishlistEmptyText")) +
        '</p><a class="btn btn--primary" href="index.html#collection" data-wish-close>' +
        esc(t("shopCollection")) +
        "</a></div>";
      return;
    }
    body.innerHTML = '<div class="drawer-wish-grid" data-wish-grid></div>';
    var grid = body.querySelector("[data-wish-grid]");
    items.forEach(function (product) {
      grid.appendChild(window.LumenProductCard.create(product));
    });
  }

  function open() {
    var el = ensureDrawer();
    render();
    el.removeAttribute("hidden");
    document.body.classList.add("drawer-open");
  }

  function close() {
    var el = document.getElementById("wishlist-drawer");
    if (!el) return;
    el.setAttribute("hidden", "");
    document.body.classList.remove("drawer-open");
  }

  window.LumenWishlistDrawer = { open: open, close: close, refresh: render };
  window.addEventListener("lumen:wishlistchange", function () {
    var el = document.getElementById("wishlist-drawer");
    if (el && !el.hasAttribute("hidden")) render();
  });
})();
