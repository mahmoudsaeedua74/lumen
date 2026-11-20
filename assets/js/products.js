(function () {
  var M = {
    banners: {
      collectionSilk: "assets/imgi_27_1195b562-f178-41c9-a93f-22452ee592ae.jpg",
      mirageSilk: "assets/imgi_28_16df32de-54b4-4cb4-974d-a401446c9c37.jpg",
    },
    lifestyle: {
      stoneCandle: "assets/imgi_29_f7689b78-c846-4c0b-9102-5ef9c35f218f.jpg",
      unboxing: "assets/imgi_30_bb4acae1-24e4-47d4-a686-e61aeef75f77.jpg",
    },
    products: {
      essence: {
        hero: "assets/products/essence-bg.jpg",
        lifestyle: "assets/products/essence-lifestyle.jpg",
        thumb: "assets/products/essence-bg.jpg",
      },
      mirage: {
        hero: "assets/products/mirage-bg.jpg",
        lifestyle: "assets/products/mirage-lifestyle.jpg",
        thumb: "assets/products/mirage-bg.jpg",
      },
      serene: {
        hero: "assets/products/serene-bg.jpg",
        lifestyle: "assets/products/serene-lifestyle.jpg",
        thumb: "assets/products/serene-bg.jpg",
      },
      glow: {
        hero: "assets/products/glow-bg.jpg",
        lifestyle: "assets/products/glow-lifestyle.jpg",
        thumb: "assets/products/glow-bg.jpg",
      },
    },
  };

  var PRODUCTS = [
    {
      id: "lumen-essence",
      slug: "essence",
      name: "Essence",
      brand: "LUMEN",
      sku: "L-ESS",
      category: "eau-de-parfum",
      concentration: { ar: "أو دو بارفان", en: "Eau de Parfum" },
      size: { ar: "80 مل / 2.7 أونصة", en: "80 ml / 2.7 fl oz" },
      price: 165,
      compareAt: 300,
      currency: "SAR",
      availability: "in_stock",
      shortDescription: {
        ar: "عطر توقيع مضيء — افتتاحية حمضيات مشرقة تنتقل إلى زهور ناعمة وعنبر دافئ.",
        en: "A radiant signature scent — bright citrus opening into soft florals and warm amber.",
      },
      description: {
        ar: "Essence هو قلب مجموعة لومين المضيء. زجاجة زجاج شفافة بغطاء أسود منحوت تحتضن أو دو بارفان ذهبي يفتح بإشراق ويستقر بمسار دافئ وأنيق. مناسب للأناقة اليومية وحضور المساء.",
        en: "Essence is the luminous heart of the LUMEN collection. A clear glass bottle with a sculpted black cap holds a golden eau de parfum that opens bright and settles into a warm, polished trail. Ideal for everyday elegance and evening presence alike.",
      },
      images: [M.products.essence.hero, M.products.essence.lifestyle],
      badge: null,
      alt: {
        ar: "زجاجة عطر لومين Essence مع تنسيق حمضيات وزهور",
        en: "LUMEN Essence eau de parfum bottle with citrus and floral styling",
      },
      notes: {
        status: "published",
        top: { ar: ["حمضيات", "زهر البرتقال"], en: ["Citrus", "Orange blossom"] },
        heart: { ar: ["ورد", "زهور ناعمة"], en: ["Rose", "Soft florals"] },
        base: { ar: ["عنبر", "أخشاب دافئة"], en: ["Amber", "Warm woods"] },
      },
      details: {
        ar: ["أو دو بارفان · 80 مل", "زجاجة زجاج شفافة بغطاء أسود", "ثبات مناسب لليل والنهار"],
        en: ["Eau de Parfum · 80 ml", "Clear glass bottle with black cap", "Long-lasting evening & day wear"],
      },
      tags: ["signature", "citrus-floral"],
      featured: true,
    },
    {
      id: "lumen-mirage",
      slug: "mirage",
      name: "Mirage",
      brand: "LUMEN",
      sku: "L-MIR",
      category: "eau-de-parfum",
      concentration: { ar: "أو دو بارفان", en: "Eau de Parfum" },
      size: { ar: "80 مل / 2.7 أونصة", en: "80 ml / 2.7 fl oz" },
      price: 165,
      compareAt: 300,
      currency: "SAR",
      availability: "in_stock",
      shortDescription: {
        ar: "سراب دافئ استوائي — جوز هند كريمي وفانيلا ناعمة وعنبر ذهبي.",
        en: "A warm tropical illusion — creamy coconut, soft vanilla, and golden amber.",
      },
      description: {
        ar: "Mirage يلف البشرة بدفء مشمس. جوز الهند الكريمي والفانيلا يذوبان في راتنج العنبر لمسار ناعم وغامر. يُقدَّم بالزجاجة الأسطوانية المميزة من لومين مع غطاء أسود لامع.",
        en: "Mirage wraps the skin in a sunlit warmth. Creamy coconut and vanilla melt into amber resin for a smooth, enveloping trail. Presented in the signature LUMEN cylindrical bottle with a glossy black cap.",
      },
      images: [M.products.mirage.hero, M.products.mirage.lifestyle],
      badge: null,
      alt: {
        ar: "زجاجة عطر لومين Mirage مع تنسيق جوز هند وفانيلا",
        en: "LUMEN Mirage eau de parfum bottle with coconut and vanilla styling",
      },
      notes: {
        status: "published",
        top: { ar: ["جوز هند", "هيل"], en: ["Coconut", "Cardamom"] },
        heart: { ar: ["فانيلا", "كريمة ناعمة"], en: ["Vanilla", "Soft cream"] },
        base: { ar: ["عنبر", "راتنج"], en: ["Amber", "Resin"] },
      },
      details: {
        ar: ["أو دو بارفان · 80 مل", "طابع دافئ غورماند وعنبري", "الزجاجة الأسطوانية المميزة"],
        en: ["Eau de Parfum · 80 ml", "Warm gourmand-amber character", "Signature cylindrical bottle"],
      },
      tags: ["warm", "satin"],
      featured: true,
    },
    {
      id: "lumen-serene",
      slug: "serene",
      name: "Serene",
      brand: "LUMEN",
      sku: "L-SER",
      category: "eau-de-parfum",
      concentration: { ar: "أو دو بارفان", en: "Eau de Parfum" },
      size: { ar: "80 مل / 2.7 أونصة", en: "80 ml / 2.7 fl oz" },
      price: 165,
      compareAt: 300,
      currency: "SAR",
      availability: "in_stock",
      shortDescription: {
        ar: "هدوء بعسل دافئ — توت أحمر وعسل ناعم وفانيلا مريحة.",
        en: "A calm honeyed glow — red berries, soft honey, and comforting vanilla.",
      },
      description: {
        ar: "Serene مصمم للثقة الهادئة. إشراقة التوت تلتقي بدفء العسل وقاعدة فانيلا ناعمة — حميمي وأنيق وسهل الارتداء من الصباح حتى الليل.",
        en: "Serene is composed for quiet confidence. Berry brightness meets honeyed warmth and a soft vanilla base — intimate, polished, and easy to wear from morning through night.",
      },
      images: [M.products.serene.hero, M.products.serene.lifestyle],
      badge: null,
      alt: {
        ar: "زجاجة عطر لومين Serene مع تنسيق عسل وتوت",
        en: "LUMEN Serene eau de parfum bottle with honey and berry styling",
      },
      notes: {
        status: "published",
        top: { ar: ["توت أحمر", "فاكهة ناعمة"], en: ["Red berries", "Soft fruit"] },
        heart: { ar: ["عسل", "دفء زهري"], en: ["Honey", "Floral warmth"] },
        base: { ar: ["فانيلا", "عنبر"], en: ["Vanilla", "Amber"] },
      },
      details: {
        ar: ["أو دو بارفان · 80 مل", "طابع عسلي وتوتي", "تغليف لومين جاهز للإهداء"],
        en: ["Eau de Parfum · 80 ml", "Honeyed & berry-forward profile", "Gift-ready LUMEN packaging"],
      },
      tags: ["honeyed", "calm"],
      featured: true,
    },
    {
      id: "lumen-glow",
      slug: "glow",
      name: "Glow",
      brand: "LUMEN",
      sku: "L-GLW",
      category: "eau-de-parfum",
      concentration: { ar: "أو دو بارفان", en: "Eau de Parfum" },
      size: { ar: "80 مل / 2.7 أونصة", en: "80 ml / 2.7 fl oz" },
      price: 165,
      compareAt: 300,
      currency: "SAR",
      availability: "in_stock",
      shortDescription: {
        ar: "جرأة بالأسود المطفي — كمثرى عصيرية وإشراقة توت العليق وأخشاب نظيفة.",
        en: "Bold in matte black — juicy pear, raspberry brightness, and clean woods.",
      },
      description: {
        ar: "Glow هي زجاجة البيان في المجموعة: أسود مطفي مع طباعة بيضاء حادة. في الداخل تركيبة فاكهية خشبية مضيئة تبدو عصرية وحادة وبصمة لومين واضحة.",
        en: "Glow is the statement bottle of the collection: opaque matte black with crisp white typography. Inside, a luminous fruity-woody composition that feels modern, sharp, and unmistakably LUMEN.",
      },
      images: [M.products.glow.hero, M.products.glow.lifestyle],
      badge: null,
      alt: {
        ar: "زجاجة عطر لومين Glow السوداء المطفاة مع تنسيق كمثرى وتوت",
        en: "LUMEN Glow matte black eau de parfum bottle with pear and berry styling",
      },
      notes: {
        status: "published",
        top: { ar: ["كمثرى", "فاكهة مشرقة"], en: ["Pear", "Bright fruit"] },
        heart: { ar: ["توت العليق", "زهور ناعمة"], en: ["Raspberry", "Soft florals"] },
        base: { ar: ["أرز", "أخشاب نظيفة"], en: ["Cedar", "Clean woods"] },
      },
      details: {
        ar: ["أو دو بارفان · 80 مل", "زجاجة بيان سوداء مطفية", "مسار فاكهي خشبي عصري"],
        en: ["Eau de Parfum · 80 ml", "Matte black statement bottle", "Modern fruity-woody trail"],
      },
      tags: ["matte-black", "bold"],
      featured: true,
    },
  ];

  var CARE = {
    lead: {
      ar: "رشة قصيرة تكفي. الاستخدام الخفيف يحافظ على أثر العطر وعلى الزجاجة.",
      en: "A short spray is enough. A light hand keeps the trail clean and the bottle intact.",
    },
    points: {
      ar: [
        "يُحفظ بعيدًا عن الشمس المباشرة والحرارة",
        "يُرش على النبض من مسافة قريبة، بعيدًا عن العين والحرير",
        "الزجاجة المفتوحة لا تُرجع لأسباب صحية",
      ],
      en: [
        "Keep it away from direct sun and heat",
        "Spray the pulse points from a short distance, away from eyes and silk",
        "Opened bottles are not returnable, for hygiene",
      ],
    },
  };

  var BLURB = {
    "lumen-essence": {
      ar: "80 مل هو الحجم اليومي. 50 مل للسفر، و100 مل لمن يريد أثرًا أطول أو هدية.",
      en: "80 ml is the everyday size. 50 ml travels light, and 100 ml is for a longer trail or a gift.",
    },
    "lumen-mirage": {
      ar: "يظهر دافئًا على الجلد. ابدأ برشة واحدة، ثم زِد إن احتجت أثرًا أقرب.",
      en: "It wears warm on skin. Start with one spray, then add another if you want it closer.",
    },
    "lumen-serene": {
      ar: "مناسب للصباح والمساء الهادئ. الحجم الأصغر للسفر، والأكبر للإهداء.",
      en: "Suited to morning and a quiet evening. The smaller size travels; the larger one is for gifting.",
    },
    "lumen-glow": {
      ar: "رشة على المعصم والرقبة تكفي. الأسود المطفي هو شكل الزجاجة الأساسي.",
      en: "A spray on the wrist and neck is enough. Matte black is the primary bottle.",
    },
  };

  var WRAP_VALUES = [
    { id: "none", label: { ar: "بدون إضافة", en: "No extra packaging" } },
    { id: "ivory", label: { ar: "صندوق عاجي", en: "Ivory box" } },
    { id: "champagne", label: { ar: "صندوق شمبانيا", en: "Champagne box" } },
    { id: "ribbon", label: { ar: "شريط حرير", en: "Silk ribbon" } },
    { id: "card", label: { ar: "بطاقة إهداء", en: "Gift card" } },
    { id: "pouch", label: { ar: "كيس قماشي", en: "Cloth pouch" } },
    { id: "velvet", label: { ar: "صندوق مخمل — نفد", en: "Velvet box — sold out" }, available: false },
  ];

  function mediaFor(product) {
    return (product.images || []).map(function (src) {
      return { type: "image", src: src };
    });
  }

  PRODUCTS.forEach(function (product) {
    product.media = mediaFor(product);
    product.reviews = Array.isArray(product.reviews) ? product.reviews : [];
    product.questions = Array.isArray(product.questions) ? product.questions : [];
    product.blurb = BLURB[product.id] || null;
    product.care = CARE;
    product.specs = [
      { label: { ar: "الدار", en: "House" }, value: { ar: product.brand, en: product.brand } },
      { label: { ar: "التركيز", en: "Concentration" }, value: product.concentration },
      { label: { ar: "الحجم", en: "Size" }, value: product.size },
      { label: { ar: "الفئة", en: "Family" }, value: { ar: "أو دو بارفان", en: "Eau de Parfum" } },
    ];
    // Single real SKU — do not invent multi-option inventory.
    product.options = [];
    product.variants = [
      {
        id: "default",
        options: {},
        price: product.price,
        compareAt: typeof product.compareAt === "number" ? product.compareAt : null,
        available: product.availability === "in_stock",
        image: product.images[0] || null,
      },
    ];
  });

  function variantList(product) {
    return (product && product.variants) || [];
  }

  function optionList(product) {
    return (product && product.options) || [];
  }

  function findOption(product, optionId) {
    return (
      optionList(product).find(function (option) {
        return option.id === optionId;
      }) || null
    );
  }

  function findValue(product, optionId, valueId) {
    var option = findOption(product, optionId);
    if (!option || !option.values) return null;
    return (
      option.values.find(function (value) {
        return value.id === valueId;
      }) || null
    );
  }

  window.LUMEN_MANIFEST = M;
  window.LUMEN_PRODUCTS = PRODUCTS;

  window.LumenProducts = {
    all: function () {
      return PRODUCTS.slice();
    },
    getById: function (id) {
      return (
        PRODUCTS.find(function (p) {
          return p.id === id;
        }) || null
      );
    },
    getBySlug: function (slug) {
      return (
        PRODUCTS.find(function (p) {
          return p.slug === slug;
        }) || null
      );
    },
    featured: function () {
      return PRODUCTS.filter(function (p) {
        return p.featured;
      });
    },
    related: function (productId, limit) {
      limit = limit || 3;
      return PRODUCTS.filter(function (p) {
        return p.id !== productId;
      }).slice(0, limit);
    },
    displayName: function (product) {
      return product.brand + " " + product.name;
    },
    cardName: function (product) {
      return product && product.name ? String(product.name).toUpperCase() : "";
    },
    formatPrice: function (product) {
      var price = typeof product === "number" ? product : product && product.price;
      if (typeof price !== "number" || isNaN(price)) return null;
      var lang = window.LumenI18n ? window.LumenI18n.getLang() : "ar";
      var amount = price.toLocaleString(lang === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return lang === "ar" ? amount + " ريال" : "SAR " + amount;
    },
    compareAt: function (product) {
      var compare = product && product.compareAt;
      if (typeof compare !== "number" || isNaN(compare)) return null;
      var price = product.price;
      if (typeof price === "number" && compare > price) return compare;
      return null;
    },
    discountPercent: function (product) {
      var compare = window.LumenProducts.compareAt(product);
      if (!compare) return null;
      return Math.round(((compare - product.price) / compare) * 100);
    },
    priceBlockHtml: function (product, escFn) {
      var esc = escFn || function (s) {
        return String(s);
      };
      var current = window.LumenProducts.formatPrice(product);
      if (!current) {
        return (
          '<div class="product-card__pricing"><p class="product-card__price">' +
          esc(window.LumenI18n.t("priceOnRequest")) +
          "</p></div>"
        );
      }
      var compare = window.LumenProducts.compareAt(product);
      var html = '<div class="product-card__pricing">';
      html += '<span class="product-card__price">' + esc(current) + "</span>";
      if (compare) {
        html +=
          ' <s class="product-card__was">' +
          esc(window.LumenProducts.formatPrice(compare)) +
          "</s>";
      }
      html += "</div>";
      return html;
    },
    availabilityLabel: function (availability) {
      var t = window.LumenI18n.t;
      if (availability === "in_stock") return t("inStock");
      if (availability === "out_of_stock") return t("outOfStock");
      if (availability === "coming_soon") return t("comingSoon");
      return t("availableRequest");
    },
    noteList: function (notesField) {
      return window.LumenI18n.localized(notesField) || [];
    },
    canPurchase: function (product, variant) {
      if (!window.LUMEN_SITE.purchasingEnabled || !product) return false;
      if (variant) return variant.available !== false;
      if (variantList(product).length) {
        return variantList(product).some(function (item) {
          return item.available !== false;
        });
      }
      return product.availability !== "out_of_stock" && product.availability !== "coming_soon";
    },
    media: function (product) {
      var items = (product && product.media) || [];
      if (items.length) return items.slice();
      return (product.images || []).map(function (src) {
        return { type: "image", src: src };
      });
    },
    defaultVariant: function (product) {
      var list = variantList(product);
      return (
        list.find(function (item) {
          return item.available !== false;
        }) ||
        list[0] ||
        null
      );
    },
    getVariant: function (product, variantId) {
      return (
        variantList(product).find(function (item) {
          return item.id === variantId;
        }) || null
      );
    },
    selectionOf: function (variant) {
      var selection = {};
      if (!variant || !variant.options) return selection;
      Object.keys(variant.options).forEach(function (key) {
        selection[key] = variant.options[key];
      });
      return selection;
    },
    variantBySelection: function (product, selection) {
      return (
        variantList(product).find(function (variant) {
          return Object.keys(variant.options).every(function (key) {
            return selection[key] === variant.options[key];
          });
        }) || null
      );
    },
    optionValueLabel: function (product, optionId, valueId) {
      var value = findValue(product, optionId, valueId);
      return value ? window.LumenI18n.localized(value.label) : "";
    },
    variantLabel: function (product, variant) {
      if (!variant) return "";
      return optionList(product)
        .filter(function (option) {
          return variant.options && variant.options[option.id];
        })
        .map(function (option) {
          var value = findValue(product, option.id, variant.options[option.id]);
          return value ? window.LumenI18n.localized(value.label) : "";
        })
        .filter(Boolean)
        .join(" · ");
    },
    optionState: function (product, optionId, valueId, selection) {
      var related = variantList(product).filter(function (variant) {
        return variant.options[optionId] === valueId;
      });
      var globallyOut = !related.length || related.every(function (variant) {
        return variant.available === false;
      });
      var combo = related.filter(function (variant) {
        return Object.keys(selection).every(function (key) {
          return key === optionId || variant.options[key] === selection[key];
        });
      });
      var comboOut = !combo.length || combo.every(function (variant) {
        return variant.available === false;
      });
      var selected = selection[optionId] === valueId;
      if (selected && globallyOut) return "selected unavailable";
      if (selected && comboOut) return "selected disabled";
      if (selected) return "selected";
      if (globallyOut) return "unavailable";
      if (comboOut) return "disabled";
      return "normal";
    },
  };
})();

