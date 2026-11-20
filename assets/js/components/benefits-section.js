(function () {
  var BENEFITS = [
    {
      id: "fast-delivery",
      titleKey: "benefitDeliveryTitle",
      textKey: "benefitDeliveryText",
      icon: "assets/icons/lumen-fast-delivery.svg",
      optical: 1,
    },
    {
      id: "easy-shopping",
      titleKey: "benefitShopTitle",
      textKey: "benefitShopText",
      icon: "assets/icons/lumen-easy-shopping.svg",
      optical: 1,
    },
    {
      id: "premium-packaging",
      titleKey: "benefitPackTitle",
      textKey: "benefitPackText",
      icon: "assets/icons/lumen-premium-packaging.svg",
      optical: 1,
    },
    {
      id: "signature-fragrances",
      titleKey: "benefitScentTitle",
      textKey: "benefitScentText",
      icon: "assets/icons/lumen-signature-fragrances.svg",
      optical: 1.08,
    },
  ];

  function t(key) {
    return window.LumenI18n.t(key);
  }

  function esc(s) {
    return window.LumenLayout.escapeHtml(s);
  }

  function attr(s) {
    return window.LumenLayout.escapeAttr(s);
  }

  function sanitizeInlineSvg(markup) {
    return String(markup)
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<title[\s\S]*?<\/title>/gi, "")
      .replace(/<desc[\s\S]*?<\/desc>/gi, "")
      .replace(/\srole="img"/gi, "")
      .replace(/\saria-labelledby="[^"]*"/gi, "");
  }

  function prepareSvgElement(svg, optical) {
    if (!svg) return;
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.classList.add("benefit-item__svg");
    if (optical && optical !== 1) {
      svg.style.transform = "scale(" + optical + ")";
    }
  }

  function mountIcon(host, src, optical) {
    host.setAttribute("aria-hidden", "true");

    function fallbackObject() {
      host.innerHTML =
        '<object class="benefit-item__object" data="' +
        attr(src) +
        '" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>';
    }

    if (!window.fetch) {
      fallbackObject();
      return;
    }

    fetch(src, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("SVG missing");
        return res.text();
      })
      .then(function (markup) {
        host.innerHTML = sanitizeInlineSvg(markup);
        prepareSvgElement(host.querySelector("svg"), optical);
      })
      .catch(function () {
        fallbackObject();
      });
  }

  function render(root) {
    if (!root) return;

    root.classList.add("benefits-grid");
    root.innerHTML = BENEFITS.map(function (item) {
      return (
        '<article class="benefit-item" data-benefit="' +
        attr(item.id) +
        '">' +
        '<div class="benefit-item__icon" data-benefit-icon></div>' +
        "<h3>" +
        esc(t(item.titleKey)) +
        "</h3>" +
        "<p>" +
        esc(t(item.textKey)) +
        "</p></article>"
      );
    }).join("");

    root.querySelectorAll("[data-benefit]").forEach(function (article, index) {
      var item = BENEFITS[index];
      var iconHost = article.querySelector("[data-benefit-icon]");
      if (item && iconHost) mountIcon(iconHost, item.icon, item.optical);
    });
  }

  window.LumenBenefitsSection = {
    items: BENEFITS,
    mount: render,
  };
})();
