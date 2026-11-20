/**
 * LUMEN testimonials data.
 *
 * DEMO reviews are fictional design samples for local preview only.
 * Set LUMEN_SITE.showDemoTestimonials = false before public launch,
 * and add approved reviews with isDemo: false, status: "published".
 */
(function () {
  var DEMO_TESTIMONIALS = [
    {
      id: "demo-noura",
      name: "نورة العتيبي",
      text: {
        ar: "جربت عطر Essence من لومين، ريحته ناعمة وراقية مرّة، والتغليف يفتح النفس! من العطور اللي أحب أستخدمها كل يوم.",
        en: "I tried LUMEN Essence — soft, refined, and beautifully packaged. One of the fragrances I love wearing every day.",
      },
      rating: null,
      productSlug: "essence",
      locale: "ar",
      status: "demo",
      verified: false,
      isDemo: true,
    },
    {
      id: "demo-abdullah",
      name: "عبدالله القحطاني",
      text: {
        ar: "طلبت عطر Glow وعجبني شكله وتفاصيله، خصوصًا تصميم العلبة. تجربة مرتبة وإن شاء الله أجرب باقي المجموعة.",
        en: "I ordered Glow and loved the look and details — especially the box. A polished experience; looking forward to trying the rest of the collection.",
      },
      rating: null,
      productSlug: "glow",
      locale: "ar",
      status: "demo",
      verified: false,
      isDemo: true,
    },
    {
      id: "demo-reem",
      name: "ريم الشهري",
      text: {
        ar: "عطر Mirage ريحته جميلة وذوق، وحبيت اهتمامهم بالتفاصيل والتغليف. بصراحة مناسب جدًا كهدية.",
        en: "Mirage smells beautiful and tasteful. I loved the attention to detail and packaging — genuinely gift-ready.",
      },
      rating: null,
      productSlug: "mirage",
      locale: "ar",
      status: "demo",
      verified: false,
      isDemo: true,
    },
  ];

  /**
   * Approved authentic reviews only.
   * Add real customer reviews here (or via LUMEN_SITE.testimonials).
   * Example shape:
   * {
   *   id: "rev-001",
   *   name: "…",
   *   text: { ar: "…", en: "…" },
   *   rating: 5,
   *   productSlug: "essence",
   *   locale: "ar",
   *   status: "published",
   *   verified: true,
   *   isDemo: false
   * }
   */
  var APPROVED_TESTIMONIALS = [];

  window.LUMEN_TESTIMONIALS_DATA = {
    demo: DEMO_TESTIMONIALS,
    approved: APPROVED_TESTIMONIALS,
  };
})();
