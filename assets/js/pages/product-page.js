(function () {
  var CHIP_LIMIT = 6;

  function t(key, vars) {
    return window.LumenI18n.t(key, vars);
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

  function iconShare() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5M19 5l-8.5 8.5M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';
  }
  function iconHeart(on) {
    if (on) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 20.5s-6.4-4.1-8.8-7.7C1.4 10.2 1.8 7 4.2 5.4c2-1.4 4.6-1 6 0.6l1.8 1.8 1.8-1.8c1.4-1.6 4-2 6-.6 2.4 1.6 2.8 4.8 1 7.4-2.4 3.6-8.8 7.7-8.8 7.7z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M12.2 8.2l-.2.2-.2-.2C10.3 6.5 7.8 6 6.1 7.2 4.3 8.5 4 10.8 5.3 12.8c1.1 1.7 4.1 4.3 6.5 5.9 2.4-1.6 5.4-4.2 6.5-5.9 1.3-2 .9-4.3-.8-5.6-1.7-1.2-4.2-.7-5.3 1z"/></svg>';
  }
  function iconBag() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M6.5 8.5h11l-.8 11h-9.4l-.8-11z"/><path fill="none" stroke="currentColor" stroke-width="1.7" d="M9 8.5V7.2a3 3 0 0 1 6 0v1.3"/></svg>';
  }
  function iconCart() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M4 6h2.2l1.6 9.2h9.7l1.7-6.2H8"/><circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none"/><circle cx="17" cy="19" r="1.2" fill="currentColor" stroke="none"/></svg>';
  }
  function iconWa() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.2A8.8 8.8 0 1 0 12 3.2zm4.9 12.3c-.2.6-1.2 1.1-1.7 1.1-.4.1-.9.2-3-.7-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2 0 .3-.1.5l-.3.4c-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 1.9 1.1.9 2 1.1 2.3 1.3.2.1.4.1.5-.1l.4-.5c.1-.2.3-.1.5-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.3.1.3 0 .8-.2 1.2z"/></svg>';
  }

  function moneyNumber(amount) {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function moneyText(amount) {
    if (typeof amount !== "number" || isNaN(amount)) return null;
    var lang = window.LumenI18n.getLang();
    return lang === "ar" ? moneyNumber(amount) + " ريال" : "SAR " + moneyNumber(amount);
  }

  function moneyHtml(amount) {
    var text = moneyText(amount);
    if (!text) return esc(t("priceOnRequest"));
    var lang = window.LumenI18n.getLang();
    if (lang !== "ar") return esc(text);
    return '<bdi dir="ltr">' + esc(moneyNumber(amount)) + "</bdi> ريال";
  }

  function getSlug() {
    return new URLSearchParams(window.location.search).get("slug") || "";
  }

  function pageUrl() {
    return window.location.href;
  }

  function stateClass(state) {
    var classes = [];
    if (state.indexOf("selected") === 0) classes.push("is-selected");
    if (state.indexOf("unavailable") !== -1) classes.push("is-unavailable");
    if (state.indexOf("disabled") !== -1) classes.push("is-disabled");
    return classes.join(" ");
  }

  function priceBlock(variant) {
    var price = variant && typeof variant.price === "number" ? variant.price : null;
    var compare = variant && typeof variant.compareAt === "number" && variant.compareAt > price ? variant.compareAt : null;
    var html = '<p class="pdp-price__current">' + moneyHtml(price) + "</p>";
    if (compare) {
      html += '<p class="pdp-price__compare"><s>' + moneyHtml(compare) + "</s></p>";
    }
    return html;
  }

  function stars(value) {
    var full = Math.max(0, Math.min(5, Math.round(value || 0)));
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
  }

  function reviewsHtml(product) {
    var reviews = product.reviews || [];
    if (!reviews.length) {
      return (
        '<div class="reviews-empty"><p class="reviews-empty__title">' +
        esc(t("reviewsEmpty")) +
        "</p><p>" +
        esc(t("reviewsEmptyText")) +
        '</p><p class="hint">' +
        esc(t("questionsEmpty")) +
        "</p></div>"
      );
    }
    var sum = reviews.reduce(function (total, review) {
      return total + (Number(review.rating) || 0);
    }, 0);
    var average = sum / reviews.length;
    var counts = [0, 0, 0, 0, 0];
    reviews.forEach(function (review) {
      var bucket = Math.max(1, Math.min(5, Math.round(review.rating || 0)));
      counts[bucket - 1] += 1;
    });
    var bars = [5, 4, 3, 2, 1]
      .map(function (score) {
        var count = counts[score - 1];
        var width = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
        return (
          '<div class="reviews-bar"><span>' +
          score +
          '</span><span class="reviews-bar__track"><span style="width:' +
          width +
          '%"></span></span><span>' +
          count +
          "</span></div>"
        );
      })
      .join("");
    var cards = reviews
      .map(function (review) {
        return (
          '<article class="review-card"><header><strong>' +
          esc(review.author || "") +
          '</strong><span class="pdp-rating__stars" aria-hidden="true">' +
          stars(review.rating) +
          "</span></header><p>" +
          esc(L(review.text)) +
          "</p>" +
          (review.photo
            ? '<img src="' + attr(review.photo) + '" alt="" width="96" height="96" loading="lazy" />'
            : "") +
          "</article>"
        );
      })
      .join("");
    return (
      '<div class="reviews-summary"><p class="reviews-summary__score">' +
      esc(average.toFixed(1)) +
      '</p><p class="pdp-rating__stars" aria-label="' +
      attr(t("reviewStars", { n: average.toFixed(1) })) +
      '">' +
      stars(average) +
      "</p><p>" +
      esc(t("reviewCount", { n: reviews.length })) +
      '</p></div><div class="reviews-bars">' +
      bars +
      '</div><div class="review-list">' +
      cards +
      '</div><p class="hint">' +
      esc((product.questions || []).length ? "" : t("questionsEmpty")) +
      "</p>"
    );
  }

  function pointsHtml(list) {
    var items = L(list);
    if (!Array.isArray(items) || !items.length) return "";
    return (
      '<ul class="pdp-points">' +
      items
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function foldHtml(product) {
    var details = L(product.details) || [];
    if (!Array.isArray(details)) details = [];
    var notes = product.notes && product.notes.status === "published" ? product.notes : null;
    var specs = product.specs || [];
    var care = product.care || {};
    var description =
      "<p>" +
      esc(L(product.shortDescription)) +
      "</p><p>" +
      esc(L(product.description)) +
      "</p>" +
      (product.blurb ? "<p>" + esc(L(product.blurb)) + "</p>" : "") +
      pointsHtml(details.length ? { ar: details, en: details } : null);
    if (L(product.details) && Array.isArray(L(product.details))) {
      description =
        "<p>" +
        esc(L(product.shortDescription)) +
        "</p><p>" +
        esc(L(product.description)) +
        "</p>" +
        (product.blurb ? "<p>" + esc(L(product.blurb)) + "</p>" : "") +
        '<ul class="pdp-points">' +
        L(product.details)
          .map(function (item) {
            return "<li>" + esc(item) + "</li>";
          })
          .join("") +
        "</ul>";
    }
    if (notes) {
      description +=
        '<ul class="notes-list"><li><span>' +
        esc(t("top")) +
        "</span><strong>" +
        esc(window.LumenProducts.noteList(notes.top).join(" · ")) +
        "</strong></li><li><span>" +
        esc(t("heart")) +
        "</span><strong>" +
        esc(window.LumenProducts.noteList(notes.heart).join(" · ")) +
        "</strong></li><li><span>" +
        esc(t("base")) +
        "</span><strong>" +
        esc(window.LumenProducts.noteList(notes.base).join(" · ")) +
        "</strong></li></ul>";
    }
    var specRows = specs
      .map(function (row) {
        return "<tr><th scope=\"row\">" + esc(L(row.label)) + "</th><td>" + esc(L(row.value)) + "</td></tr>";
      })
      .join("");
    var careHtml =
      "<p>" +
      esc(L(care.lead)) +
      "</p>" +
      pointsHtml(care.points);

    return (
      '<section class="pdp-fold" data-fold>' +
      '<div class="pdp-fold__tabs" role="tablist" data-fold-tabs aria-label="' +
      attr(t("description")) +
      '"></div>' +
      sectionHtml("description", t("description"), description, true) +
      sectionHtml("specs", t("specsTitle"), '<table class="spec-table"><tbody>' + specRows + "</tbody></table>", false) +
      sectionHtml("care", t("careTitle"), careHtml, false) +
      sectionHtml("reviews", t("reviewsTitle"), '<div id="reviews">' + reviewsHtml(product) + "</div>", false) +
      "</section>"
    );
  }

  function sectionHtml(id, label, body, open) {
    return (
      '<section class="pdp-fold__section' +
      (open ? " is-open is-active" : "") +
      '" data-fold-id="' +
      attr(id) +
      '"><h2 class="pdp-fold__heading"><button type="button" class="pdp-fold__summary" aria-expanded="' +
      (open ? "true" : "false") +
      '">' +
      esc(label) +
      '</button></h2><div class="pdp-fold__panel" role="tabpanel">' +
      body +
      "</div></section>"
    );
  }

  function optionButtons(product, option, selection) {
    var useSelect = option.type === "select" || (option.type === "chips" && option.values.length > CHIP_LIMIT);
    if (option.type === "text") {
      return (
        '<label class="pdp-field"><span>' +
        esc(L(option.name)) +
        '</span><input type="text" data-engrave maxlength="' +
        attr(String(option.maxLength || 24)) +
        '" placeholder="' +
        attr(L(option.placeholder)) +
        '" /></label>'
      );
    }
    if (useSelect) {
      return (
        '<label class="pdp-field"><span>' +
        esc(L(option.name)) +
        '</span><select data-extra="' +
        attr(option.id) +
        '">' +
        option.values
          .map(function (value) {
            var disabled = value.available === false;
            return (
              '<option value="' +
              attr(value.id) +
              '"' +
              (disabled ? " disabled" : "") +
              ">" +
              esc(L(value.label)) +
              "</option>"
            );
          })
          .join("") +
        "</select></label>"
      );
    }
    var isColor = option.type === "color";
    var buttons = option.values
      .map(function (value) {
        var state = window.LumenProducts.optionState(product, option.id, value.id, selection);
        var label = L(value.label);
        if (isColor) {
          return (
            '<button type="button" class="swatch ' +
            stateClass(state) +
            '" style="--swatch:' +
            attr(value.color || "#ccc") +
            '" data-option="' +
            attr(option.id) +
            '" data-option-value="' +
            attr(value.id) +
            '" aria-pressed="' +
            (state.indexOf("selected") === 0 ? "true" : "false") +
            '" aria-label="' +
            attr(label) +
            '"><span class="visually-hidden">' +
            esc(label) +
            "</span></button>"
          );
        }
        return (
          '<button type="button" class="chip ' +
          stateClass(state) +
          '" data-option="' +
          attr(option.id) +
          '" data-option-value="' +
          attr(value.id) +
          '" aria-pressed="' +
          (state.indexOf("selected") === 0 ? "true" : "false") +
          '">' +
          esc(label) +
          "</button>"
        );
      })
      .join("");
    var selectedLabel = isColor
      ? '<strong data-selected-for="' + attr(option.id) + '">' + esc(window.LumenProducts.optionValueLabel(product, option.id, selection[option.id])) + "</strong>"
      : "";
    var guide = option.guide
      ? '<button type="button" class="pdp-guide" data-size-guide>' + esc(t("sizeGuide")) + "</button>"
      : "";
    return (
      '<fieldset class="pdp-option"><legend><span>' +
      esc(L(option.name)) +
      "</span>" +
      selectedLabel +
      guide +
      '</legend><div class="' +
      (isColor ? "swatches" : "chips") +
      '">' +
      buttons +
      "</div></fieldset>"
    );
  }

  function copyLink() {
    var url = pageUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () {
          window.LumenToast.show(t("linkCopied"), "success");
        },
        function () {
          window.prompt(t("copyLink"), url);
        }
      );
      return;
    }
    window.prompt(t("copyLink"), url);
  }

  function openSizeGuide() {
    var existing = document.getElementById("size-guide");
    if (existing) existing.remove();
    var dialog = document.createElement("div");
    dialog.id = "size-guide";
    dialog.className = "sheet";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "size-guide-title");
    dialog.innerHTML =
      '<div class="sheet__panel"><button type="button" class="sheet__close" data-close aria-label="' +
      attr(t("close")) +
      '">&times;</button><h2 id="size-guide-title">' +
      esc(t("sizeGuideTitle")) +
      "</h2><ul class=\"pdp-points\"><li>" +
      esc(t("size50")) +
      "</li><li>" +
      esc(t("size80")) +
      "</li><li>" +
      esc(t("size100")) +
      "</li></ul></div>";
    function close() {
      dialog.remove();
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) close();
    });
    document.body.appendChild(dialog);
    document.addEventListener("keydown", onKey);
    dialog.querySelector("[data-close]").focus();
  }

  function bindFold(scope) {
    var tabs = scope.querySelector("[data-fold-tabs]");
    var sections = Array.prototype.slice.call(scope.querySelectorAll("[data-fold-id]"));
    if (!tabs || !sections.length) return;

    function desktop() {
      return window.matchMedia("(min-width: 1025px)").matches;
    }

    function activate(id, toggle) {
      var wide = desktop();
      sections.forEach(function (section) {
        var on = section.getAttribute("data-fold-id") === id;
        var summary = section.querySelector(".pdp-fold__summary");
        if (wide) {
          section.classList.toggle("is-active", on);
          section.classList.toggle("is-open", on);
          if (summary) summary.setAttribute("aria-expanded", on ? "true" : "false");
          return;
        }
        if (!on) return;
        var next = toggle ? !section.classList.contains("is-open") : true;
        section.classList.toggle("is-open", next);
        section.classList.toggle("is-active", next);
        if (summary) summary.setAttribute("aria-expanded", next ? "true" : "false");
      });
      tabs.querySelectorAll("[role='tab']").forEach(function (tab) {
        var on = tab.getAttribute("data-fold-tab") === id;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
      });
    }

    sections.forEach(function (section) {
      var id = section.getAttribute("data-fold-id");
      var summary = section.querySelector(".pdp-fold__summary");
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "pdp-fold__tab";
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-fold-tab", id);
      tab.textContent = summary ? summary.textContent : id;
      tab.addEventListener("click", function () {
        activate(id, false);
      });
      tabs.appendChild(tab);
      if (summary) {
        summary.addEventListener("click", function () {
          if (desktop()) activate(id, false);
          else activate(id, true);
        });
      }
    });

    tabs.addEventListener("keydown", function (e) {
      var keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (keys.indexOf(e.key) === -1) return;
      var list = Array.prototype.slice.call(tabs.querySelectorAll("[role='tab']"));
      var current = list.findIndex(function (tab) {
        return tab.getAttribute("aria-selected") === "true";
      });
      if (current < 0) current = 0;
      var next = current;
      if (e.key === "Home") next = 0;
      else if (e.key === "End") next = list.length - 1;
      else if (e.key === "ArrowLeft") next = (current - 1 + list.length) % list.length;
      else next = (current + 1) % list.length;
      e.preventDefault();
      list[next].click();
      list[next].focus();
    });

    activate("description", false);
    return {
      open: function (id) {
        activate(id, false);
        var section = scope.querySelector('[data-fold-id="' + id + '"]');
        if (!desktop() && section) section.classList.add("is-open");
      },
    };
  }

  function initProductPage() {
    var root = document.querySelector("[data-product-page]");
    if (!root) return;

    var product = window.LumenProducts.getBySlug(getSlug());
    var sticky = document.querySelector("[data-sticky-atc]");
    if (!product) {
      if (sticky) sticky.hidden = true;
      root.innerHTML =
        '<div class="empty-state"><h1>' +
        esc(t("notFoundTitle")) +
        "</h1><p>" +
        esc(t("notFoundText")) +
        '</p><a class="btn btn--primary" href="index.html#collection">' +
        esc(t("backToShop")) +
        "</a></div>";
      return;
    }

    document.title = window.LumenProducts.displayName(product) + " | LUMEN";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", L(product.shortDescription));

    var selection = window.LumenProducts.selectionOf(window.LumenProducts.defaultVariant(product));
    var wishActive = window.LumenWishlist.has(product.id);
    var tabbyLogo = (window.LUMEN_SITE.tabby && window.LUMEN_SITE.tabby.logo) || "assets/imgi_19_tabby2.svg";
    var waText = encodeURIComponent(window.LumenProducts.displayName(product) + "\n" + pageUrl());

    root.innerHTML =
      '<div class="pdp">' +
      '<div class="pdp__gallery" data-gallery-root></div>' +
      '<div class="pdp__info">' +
      '<div class="pdp-head"><h1>' +
      esc(window.LumenProducts.displayName(product)) +
      '</h1><div class="pdp-head__icons">' +
      '<button class="pdp-icon" type="button" data-pdp-share aria-label="' +
      attr(t("share")) +
      '">' +
      iconShare() +
      '</button><button class="pdp-icon" type="button" data-pdp-wish aria-pressed="' +
      (wishActive ? "true" : "false") +
      '" aria-label="' +
      attr(t("wishlist")) +
      '">' +
      iconHeart(wishActive) +
      "</button></div></div>" +
      '<p class="pdp-lead">' +
      esc(L(product.shortDescription)) +
      '</p><div class="pdp-price" data-price aria-live="polite"></div>' +
      '<p class="availability" data-availability hidden></p>' +
      '<div class="pdp-options" data-options>' +
      (product.options || [])
        .map(function (option) {
          return optionButtons(product, option, selection);
        })
        .join("") +
      "</div>" +
      '<div class="pdp-buybox" data-pdp-purchase>' +
      '<div class="pdp-qtyline"><span class="pdp-qtyline__label">' +
      esc(t("qty")) +
      '</span><div class="pdp-stepper"><button type="button" data-qty-dec aria-label="' +
      attr(t("decreaseQty")) +
      '">−</button><input type="number" min="1" max="20" value="1" data-qty-input aria-label="' +
      attr(t("qty")) +
      '" /><button type="button" data-qty-inc aria-label="' +
      attr(t("increaseQty")) +
      '">+</button></div></div>' +
      '<div class="pdp-actions">' +
      '<button class="pdp-btn pdp-btn--buy" type="button" data-pdp-buy><span>' +
      esc(t("buyNow")) +
      "</span>" +
      iconCart() +
      '</button><button class="pdp-btn pdp-btn--cart" type="button" data-pdp-add><span data-add-label>' +
      esc(t("addToBasket")) +
      "</span>" +
      iconBag() +
      "</button></div></div>" +
      '<div class="pdp-tabby"><p>' +
      esc(t("tabbySplit")) +
      ' <button type="button" data-tabby-more>' +
      esc(t("tabbyMore")) +
      "</button></p>" +
      '<img src="' +
      attr(tabbyLogo) +
      '" alt="tabby" width="92" height="36" />' +
      '<p class="pdp-tabby__note" data-tabby-note hidden>' +
      esc(t("tabbyDisclaimer")) +
      "</p></div>" +
      '<p class="pdp-sku"><span>' +
      esc(t("productCode")) +
      "</span> : " +
      esc(product.sku || product.id) +
      "</p></div></div>" +
      '<a class="pdp-wa" data-whatsapp target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=' +
      waText +
      '" aria-label="' +
      attr(t("shareWhatsapp")) +
      '">' +
      iconWa() +
      "</a>" +
      '<section class="pdp__below">' +
      foldHtml(product) +
      '<div class="pdp__related"><p class="eyebrow">' +
      esc(t("relatedEyebrow")) +
      "</p><h2>" +
      esc(t("relatedTitle")) +
      '</h2><div class="product-grid product-grid--related" data-related></div></div></section>';

    var gallery = window.LumenProductGallery.mount(
      root.querySelector("[data-gallery-root]"),
      window.LumenProducts.media(product),
      L(product.alt) || window.LumenProducts.displayName(product),
      { tag: L(product.concentration) }
    );
    var fold = bindFold(root);

    var qtyInput = root.querySelector("[data-qty-input]");
    function clamp() {
      var v = parseInt(qtyInput.value, 10);
      if (!isFinite(v) || v < 1) v = 1;
      if (v > 20) v = 20;
      qtyInput.value = String(v);
      return v;
    }
    root.querySelector("[data-qty-dec]").addEventListener("click", function () {
      qtyInput.value = String(Math.max(1, clamp() - 1));
    });
    root.querySelector("[data-qty-inc]").addEventListener("click", function () {
      qtyInput.value = String(Math.min(20, clamp() + 1));
    });
    qtyInput.addEventListener("change", clamp);

    function currentVariant() {
      return window.LumenProducts.variantBySelection(product, selection);
    }

    function lineMeta() {
      var variant = currentVariant();
      var noteInput = root.querySelector("[data-engrave]");
      var wrapInput = root.querySelector("[data-extra='wrap']");
      return {
        variantId: variant ? variant.id : "",
        note: noteInput ? noteInput.value.trim() : "",
        wrap: wrapInput ? wrapInput.value : "",
      };
    }

    function addToCart(openDrawer) {
      var variant = currentVariant();
      if (!variant || !window.LumenProducts.canPurchase(product, variant)) {
        window.LumenToast.show(t("soldOutCombo"), "info");
        return { ok: false };
      }
      var result = window.LumenCart.add(product.id, clamp(), lineMeta());
      if (result.ok) {
        window.LumenToast.show(window.LumenProducts.displayName(product) + " — " + t("addedToCart"), "success");
        if (openDrawer !== false && window.LumenCartDrawer) window.LumenCartDrawer.open();
      }
      return result;
    }

    var shownImage = "";

    function paint() {
      var variant = currentVariant();
      var purchasable = !!(variant && window.LumenProducts.canPurchase(product, variant));
      var priceEl = root.querySelector("[data-price]");
      if (priceEl) priceEl.innerHTML = priceBlock(variant);
      var availability = root.querySelector("[data-availability]");
      if (availability) {
        availability.hidden = purchasable;
        availability.textContent = t("soldOutCombo");
        availability.setAttribute("data-state", purchasable ? "in" : "out");
      }
      root.querySelectorAll("[data-option-value]").forEach(function (button) {
        var optionId = button.getAttribute("data-option");
        var valueId = button.getAttribute("data-option-value");
        var state = window.LumenProducts.optionState(product, optionId, valueId, selection);
        button.classList.remove("is-selected", "is-unavailable", "is-disabled");
        stateClass(state)
          .split(" ")
          .filter(Boolean)
          .forEach(function (name) {
            button.classList.add(name);
          });
        button.setAttribute("aria-pressed", state.indexOf("selected") === 0 ? "true" : "false");
      });
      root.querySelectorAll("[data-selected-for]").forEach(function (node) {
        var optionId = node.getAttribute("data-selected-for");
        node.textContent = window.LumenProducts.optionValueLabel(product, optionId, selection[optionId]);
      });
      var addLabel = root.querySelector("[data-add-label]");
      if (addLabel) addLabel.textContent = purchasable ? t("addToBasket") : t("soldOutCombo");
      var addBtn = root.querySelector("[data-pdp-add]");
      if (addBtn) addBtn.disabled = !purchasable;
      var stickyAdd = sticky && sticky.querySelector("[data-sticky-add]");
      if (stickyAdd) {
        stickyAdd.disabled = !purchasable;
        stickyAdd.textContent = purchasable ? t("addToBasket") : t("soldOutCombo");
      }
      var buy = root.querySelector("[data-pdp-buy]");
      if (buy) buy.disabled = !purchasable;
      if (sticky) {
        var stickyPrice = sticky.querySelector("[data-sticky-price]");
        if (stickyPrice) stickyPrice.textContent = moneyText(variant && variant.price) || t("priceOnRequest");
      }
      var nextImage = variant && variant.image ? variant.image : "";
      if (gallery && nextImage && nextImage !== shownImage) {
        shownImage = nextImage;
        gallery.setFeatured(nextImage);
      }
    }

    root.addEventListener("click", function (e) {
      var choice = e.target.closest("[data-option-value]");
      if (choice && root.contains(choice)) {
        selection[choice.getAttribute("data-option")] = choice.getAttribute("data-option-value");
        paint();
        return;
      }
      if (e.target.closest("[data-size-guide]")) {
        openSizeGuide();
      }
    });

    root.querySelector("[data-pdp-add]").addEventListener("click", function () {
      addToCart(true);
    });
    root.querySelector("[data-pdp-buy]").addEventListener("click", function () {
      var result = addToCart(false);
      if (!result.ok) return;
      var checkout = window.LUMEN_SITE.checkout || {};
      if (checkout.enabled && checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
        return;
      }
      if (window.LumenCartDrawer) window.LumenCartDrawer.open();
    });

    var wish = root.querySelector("[data-pdp-wish]");
    if (wish) {
      wish.addEventListener("click", function () {
        var result = window.LumenWishlist.toggle(product.id);
        wish.setAttribute("aria-pressed", result.active ? "true" : "false");
        wish.innerHTML = iconHeart(result.active);
        window.LumenToast.show(result.active ? t("wishlistAdded") : t("wishlistRemoved"), "info");
        window.LumenLayout.updateWishlistBadge();
      });
    }

    var shareBtn = root.querySelector("[data-pdp-share]");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        if (navigator.share) {
          navigator.share({ title: window.LumenProducts.displayName(product), url: pageUrl() }).catch(function () {});
          return;
        }
        copyLink();
      });
    }
    var tabbyMore = root.querySelector("[data-tabby-more]");
    if (tabbyMore) {
      tabbyMore.addEventListener("click", function () {
        var note = root.querySelector("[data-tabby-note]");
        if (note) note.hidden = !note.hidden;
      });
    }

    var ratingLink = root.querySelector("[data-rating-link]");
    if (ratingLink) {
      ratingLink.addEventListener("click", function (e) {
        e.preventDefault();
        if (fold) fold.open("reviews");
        var target = document.getElementById("reviews");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    var related = root.querySelector("[data-related]");
    if (related) {
      window.LumenProducts.related(product.id).forEach(function (item) {
        related.appendChild(window.LumenProductCard.create(item));
      });
    }

    initStickyBar();
    paint();

    function initStickyBar() {
      if (!sticky) return;
      var trigger = root.querySelector("[data-pdp-purchase]");
      var button = sticky.querySelector("[data-sticky-add]");
      if (button) {
        button.addEventListener("click", function () {
          addToCart(true);
        });
      }
      if (!trigger) {
        sticky.hidden = true;
        return;
      }
      function updateSticky() {
        sticky.hidden = trigger.getBoundingClientRect().bottom >= 0;
      }
      updateSticky();
      window.addEventListener("scroll", updateSticky, { passive: true });
      window.addEventListener("resize", updateSticky);
    }
  }

  window.LumenProductPage = { init: initProductPage };
})();
