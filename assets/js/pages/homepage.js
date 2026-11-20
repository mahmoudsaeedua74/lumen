(function () {
  function t(key) {
    return window.LumenI18n.t(key);
  }
  function esc(s) {
    return window.LumenLayout.escapeHtml(s);
  }

  function renderCollection() {
    var grid = document.querySelector("[data-collection-grid]");
    if (!grid) return;
    grid.innerHTML = "";
    window.LumenProducts.all().forEach(function (product, index) {
      grid.appendChild(window.LumenProductCard.create(product, { lazy: index > 1 }));
    });
  }

  function renderTabby() {
    var root = document.querySelector("[data-tabby-banner]");
    if (!root) return;
    if (!window.LUMEN_SITE.tabbyEnabled) {
      root.hidden = true;
      root.innerHTML = "";
      return;
    }
    root.hidden = false;
    var logo = (window.LUMEN_SITE.tabby && window.LUMEN_SITE.tabby.logo) || "assets/imgi_19_tabby2.svg";
    root.innerHTML =
      '<div class="tabby-banner__inner">' +
      '<div class="tabby-banner__copy">' +
      '<p class="eyebrow">' +
      esc(t("tabbyEyebrow")) +
      "</p>" +
      "<h2>" +
      esc(t("tabbyTitle")) +
      "</h2>" +
      "<p>" +
      esc(t("tabbyText")) +
      "</p>" +
      '<p class="hint">' +
      esc(t("tabbyDisclaimer")) +
      "</p></div>" +
      '<div class="tabby-banner__brand"><img src="' +
      logo +
      '" alt="Tabby" width="180" height="70" loading="lazy" /></div></div>';
  }

  function renderBenefits() {
    if (window.LumenBenefitsSection) {
      window.LumenBenefitsSection.mount(document.querySelector("[data-benefits]"));
    }
  }

  function renderTestimonials() {
    if (window.LumenTestimonialsSection) {
      window.LumenTestimonialsSection.mount(document.querySelector("[data-testimonials-section]"));
    }
  }

  window.LumenHomepage = {
    init: function () {
      renderCollection();
      renderTabby();
      renderBenefits();
      renderTestimonials();
    },
  };
})();
