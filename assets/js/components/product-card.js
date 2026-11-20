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

  function heartIcon(filled) {
    if (filled) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-6.7-4.3-9.3-8.1C.7 10.2 1.1 6.8 3.6 5.1 5.7 3.6 8.5 4 10 5.6L12 7.7l2-2.1c1.5-1.6 4.3-2 6.4-.5 2.5 1.7 2.9 5.1 1 7.8C18.7 16.7 12 21 12 21z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12.1 8.1l-.1.1-.1-.1C10.4 6.3 7.8 5.8 6 7.1 4.1 8.4 3.8 10.9 5.2 13c1.2 1.8 4.3 4.5 6.8 6.2 2.5-1.7 5.6-4.4 6.8-6.2 1.4-2.1 1.1-4.6-.8-5.9-1.8-1.3-4.4-.8-5.9 1z"/></svg>';
  }

  function eyeIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  }

  function badgeLabel(badge) {
    if (!badge) return "";
    var map = {
      bestseller: t("badgeBestSeller"),
      new: t("badgeNew"),
      limited: t("badgeLimited"),
      sale: t("badgeSale"),
      out_of_stock: t("outOfStock"),
    };
    return map[badge] || "";
  }

  function addToCart(product) {
    var variant = window.LumenProducts.defaultVariant(product);
    var result = window.LumenCart.add(product.id, 1, variant ? { variantId: variant.id } : null);
    if (result.ok) {
      window.LumenToast.show(window.LumenProducts.displayName(product) + " — " + t("addedToCart"), "success");
      if (window.LumenCartDrawer) window.LumenCartDrawer.open();
    } else {
      window.LumenToast.show(result.error || "Error", "error");
    }
    return result;
  }

  function openQuickView(product) {
    var existing = document.getElementById("product-quick-view");
    if (existing) existing.remove();

    var canBuy = window.LumenProducts.canPurchase(product);
    var href = "product.html?slug=" + attr(product.slug);
    var dialog = document.createElement("dialog");
    dialog.id = "product-quick-view";
    dialog.className = "quick-view";

    dialog.innerHTML =
      '<div class="quick-view-inner">' +
      '<button type="button" class="quick-view-close" data-qv-close aria-label="' +
      attr(t("closeQuickView")) +
      '">&times;</button>' +
      '<div class="quick-view-grid">' +
      '<img src="' +
      attr(product.images[0]) +
      '" alt="' +
      attr(L(product.alt) || window.LumenProducts.displayName(product)) +
      '" width="640" height="640" />' +
      "<div>" +
      "<h2>" +
      esc(window.LumenProducts.cardName(product)) +
      "</h2>" +
      window.LumenProducts.priceBlockHtml(product, esc) +
      "<p>" +
      esc(L(product.shortDescription) || "") +
      "</p>" +
      '<div class="product-card__actions product-card__actions--qv">' +
      (canBuy
        ? '<button class="btn btn--primary product-card__atc" type="button" data-qv-add>' +
          esc(t("addToCart")) +
          "</button>"
        : '<span class="product-card__unavailable">' + esc(t("outOfStock")) + "</span>") +
      '<a class="btn btn--ghost" href="' +
      href +
      '">' +
      esc(t("fullDetails")) +
      "</a></div></div></div></div>";

    document.body.appendChild(dialog);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    function close() {
      if (typeof dialog.close === "function") dialog.close();
      dialog.remove();
    }

    dialog.querySelector("[data-qv-close]").addEventListener("click", close);
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) close();
    });
    var addBtn = dialog.querySelector("[data-qv-add]");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        addToCart(product);
        close();
      });
    }
  }

  function createProductCard(product, options) {
    options = options || {};
    var lazy = options.lazy !== false;
    var article = document.createElement("article");
    article.className = "product-card";
    article.dataset.productId = product.id;

    var href = "product.html?slug=" + attr(product.slug);
    var wishActive = window.LumenWishlist.has(product.id);
    var canBuy = window.LumenProducts.canPurchase(product);
    var badge = product.availability === "out_of_stock" ? "out_of_stock" : product.badge;
    var badgeText = badgeLabel(badge);
    var hoverSrc = product.images[1] || "";
    var oos = product.availability === "out_of_stock";

    if (oos) article.classList.add("is-oos");

    article.innerHTML =
      '<div class="product-card__media-wrap">' +
      '<a class="product-card__media" href="' +
      href +
      '">' +
      '<img class="product-card__img" src="' +
      attr(product.images[0]) +
      '" alt="' +
      attr(L(product.alt) || window.LumenProducts.displayName(product)) +
      '" width="800" height="800" loading="' +
      (lazy ? "lazy" : "eager") +
      '" decoding="async" />' +
      (hoverSrc && hoverSrc !== product.images[0]
        ? '<img class="product-card__img product-card__img--hover" src="' +
          attr(hoverSrc) +
          '" alt="" width="800" height="800" loading="lazy" decoding="async" aria-hidden="true" />'
        : "") +
      "</a>" +
      (badgeText ? '<span class="product-card__badge">' + esc(badgeText) + "</span>" : "") +
      '<div class="product-card__icons">' +
      '<button class="product-card__icon product-card__wish' +
      (wishActive ? " is-active" : "") +
      '" type="button" data-wishlist="' +
      attr(product.id) +
      '" aria-pressed="' +
      (wishActive ? "true" : "false") +
      '" aria-label="' +
      attr(t("wishlist")) +
      '">' +
      heartIcon(wishActive) +
      "</button>" +
      '<button class="product-card__icon product-card__eye" type="button" data-quick-view="' +
      attr(product.id) +
      '" aria-label="' +
      attr(t("quickView")) +
      '">' +
      eyeIcon() +
      "</button></div></div>" +
      '<div class="product-card__body">' +
      '<h3 class="product-card__name"><a href="' +
      href +
      '">' +
      esc(window.LumenProducts.cardName(product)) +
      "</a></h3>" +
      window.LumenProducts.priceBlockHtml(product, esc) +
      '<div class="product-card__actions">' +
      (canBuy
        ? '<button class="btn btn--primary product-card__atc" type="button" data-add-to-cart="' +
          attr(product.id) +
          '">' +
          esc(t("addToCart")) +
          "</button>"
        : '<button class="btn product-card__atc product-card__atc--disabled" type="button" disabled>' +
          esc(t("outOfStock")) +
          "</button>") +
      "</div></div>";

    var addBtn = article.querySelector("[data-add-to-cart]");
    if (addBtn) {
      addBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
      });
    }

    var wishBtn = article.querySelector("[data-wishlist]");
    if (wishBtn) {
      wishBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var result = window.LumenWishlist.toggle(product.id);
        wishBtn.classList.toggle("is-active", result.active);
        wishBtn.setAttribute("aria-pressed", result.active ? "true" : "false");
        wishBtn.innerHTML = heartIcon(result.active);
        window.LumenToast.show(result.active ? t("wishlistAdded") : t("wishlistRemoved"), "info");
        window.LumenLayout.updateWishlistBadge();
        if (window.LumenWishlistDrawer) window.LumenWishlistDrawer.refresh();
      });
    }

    var eyeBtn = article.querySelector("[data-quick-view]");
    if (eyeBtn) {
      eyeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(product);
      });
    }

    return article;
  }

  window.LumenProductCard = { create: createProductCard };
})();
