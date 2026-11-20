(function () {
  function t(key) {
    return window.LumenI18n.t(key);
  }
  function L(v) {
    return window.LumenI18n.localized(v);
  }
  function esc(s) {
    return window.LumenLayout.escapeHtml(s);
  }
  function attr(s) {
    return window.LumenLayout.escapeAttr(s);
  }

  function ensureDrawer() {
    var el = document.getElementById("cart-drawer");
    if (el) return el;
    el = document.createElement("div");
    el.id = "cart-drawer";
    el.className = "drawer";
    el.setAttribute("hidden", "");
    el.innerHTML =
      '<div class="drawer__backdrop" data-drawer-close></div>' +
      '<aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">' +
      '<div class="drawer__head"><h2 id="cart-drawer-title">' +
      esc(t("navCart")) +
      '</h2><button type="button" class="icon-btn" data-drawer-close aria-label="' +
      attr(t("close")) +
      '">&times;</button></div>' +
      '<div class="drawer__body" data-cart-body></div>' +
      '<div class="drawer__foot" data-cart-foot></div></aside>';
    document.body.appendChild(el);

    el.querySelectorAll("[data-drawer-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.hasAttribute("hidden")) close();
    });
    return el;
  }

  function render() {
    var el = ensureDrawer();
    var body = el.querySelector("[data-cart-body]");
    var foot = el.querySelector("[data-cart-foot]");
    var title = el.querySelector("#cart-drawer-title");
    if (title) title.textContent = t("navCart");

    var items = window.LumenCart.getItems();
    var sub = window.LumenCart.getSubtotal();

    if (!items.length) {
      body.innerHTML =
        '<div class="drawer-empty"><p>' +
        esc(t("cartEmptyTitle")) +
        "</p><p class=\"hint\">" +
        esc(t("cartEmptyText")) +
        '</p><a class="btn btn--primary" href="index.html#collection" data-drawer-close>' +
        esc(t("shopCollection")) +
        "</a></div>";
      foot.innerHTML = "";
      return;
    }

    body.innerHTML = items
      .map(function (item) {
        var p = item.product;
        var price = window.LumenProducts.formatPrice(item.unitPrice);
        var image = (item.variant && item.variant.image) || p.images[0];
        var detail = item.variant ? window.LumenProducts.variantLabel(p, item.variant) : L(p.size);
        if (item.wrap) {
          var wrapLabel = window.LumenProducts.optionValueLabel(p, "wrap", item.wrap);
          if (wrapLabel) detail += " · " + wrapLabel;
        }
        if (item.note) detail += " · " + item.note;
        return (
          '<article class="drawer-line" data-line="' +
          attr(item.key) +
          '"><a href="product.html?slug=' +
          attr(p.slug) +
          '"><img src="' +
          attr(image) +
          '" alt="' +
          attr(L(p.alt)) +
          '" width="72" height="72" loading="lazy" /></a>' +
          '<div class="drawer-line__info"><h3><a href="product.html?slug=' +
          attr(p.slug) +
          '">' +
          esc(window.LumenProducts.displayName(p)) +
          "</a></h3><p>" +
          esc(detail) +
          '</p><p class="price">' +
          esc(price || t("priceOnRequest")) +
          '</p><div class="drawer-line__row"><div class="qty">' +
          '<button type="button" data-dec aria-label="' +
          attr(t("decreaseQty")) +
          '">−</button>' +
          '<input type="number" min="1" max="20" value="' +
          item.quantity +
          '" data-qty />' +
          '<button type="button" data-inc aria-label="' +
          attr(t("increaseQty")) +
          '">+</button></div>' +
          '<button type="button" class="btn btn--text" data-remove>' +
          esc(t("remove")) +
          "</button></div></div></article>"
        );
      })
      .join("");

    foot.innerHTML =
      '<p class="summary-row"><span>' +
      esc(t("subtotal")) +
      "</span><strong>" +
      esc((sub.priced ? window.LumenProducts.formatPrice(sub.total) : null) || t("priceOnRequest")) +
      "</strong></p>" +
      '<p class="hint">' +
      esc(t("checkoutSoon")) +
      "</p>" +
      (window.LUMEN_SITE.contact.email
        ? '<a class="btn btn--primary btn--lg" href="mailto:' +
          attr(window.LUMEN_SITE.contact.email) +
          '">' +
          esc(t("contactToComplete")) +
          "</a>"
        : "");

    body.querySelectorAll(".drawer-line").forEach(function (line) {
      var id = line.getAttribute("data-line");
      var input = line.querySelector("[data-qty]");
      line.querySelector("[data-dec]").addEventListener("click", function () {
        window.LumenCart.setQuantity(id, Math.max(1, Number(input.value) - 1));
        render();
      });
      line.querySelector("[data-inc]").addEventListener("click", function () {
        window.LumenCart.setQuantity(id, Math.min(20, Number(input.value) + 1));
        render();
      });
      input.addEventListener("change", function () {
        window.LumenCart.setQuantity(id, input.value);
        render();
      });
      line.querySelector("[data-remove]").addEventListener("click", function () {
        window.LumenCart.remove(id);
        window.LumenToast.show(t("removedFromCart"), "info");
        render();
      });
    });
  }

  function open() {
    var el = ensureDrawer();
    render();
    el.removeAttribute("hidden");
    document.body.classList.add("drawer-open");
  }

  function close() {
    var el = document.getElementById("cart-drawer");
    if (!el) return;
    el.setAttribute("hidden", "");
    document.body.classList.remove("drawer-open");
  }

  window.LumenCartDrawer = { open: open, close: close, refresh: render };
  window.addEventListener("lumen:cartchange", function () {
    var el = document.getElementById("cart-drawer");
    if (el && !el.hasAttribute("hidden")) render();
  });
})();
