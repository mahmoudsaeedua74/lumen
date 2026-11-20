window.LUMEN_SITE = {
  brand: "LUMEN",
  currency: "SAR",
  productionOrigin: null,

  contact: {
    email: "hello@lumenfragrances.com",
    phone: "+966 11 000 0000",
    address: {
      ar: "الرياض، المملكة العربية السعودية",
      en: "Riyadh, Saudi Arabia",
    },
    hours: {
      ar: "الأحد – الخميس، 10:00 – 18:00",
      en: "Sunday – Thursday, 10:00 – 18:00",
    },
    whatsapp: null,
  },

  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    twitter: null,
  },

  /**
   * Tabby promotional banner.
   * Keep disabled until merchant activation is confirmed.
   */
  tabbyEnabled: false,
  tabby: {
    logo: "assets/imgi_19_tabby2.svg",
  },

  /**
   * Saudi storefront prices include VAT unless the merchant says otherwise.
   * The product page shows the tax line only when this is true.
   */
  pricesIncludeTax: true,

  /**
   * Testimonials:
   * - showDemoTestimonials: true only for local design preview.
   *   Set to false before public launch.
   * - testimonials: approved authentic reviews (isDemo:false, status:"published").
   *   Or add them in assets/js/data/testimonials.js → approved[].
   * Demo reviews never show stars or verified badges as authentic.
   */
  showDemoTestimonials: true,
  testimonials: [],

  checkout: {
    enabled: false,
    checkoutUrl: null,
  },

  purchasingEnabled: true,
  showPricesWhenConfigured: true,
};

window.LUMEN_ASSETS = {
  logo: "assets/imgi_26_3337ebf5-b4f8-4314-b9e4-059569000fa6.png",
  logoSmall: "assets/imgi_1_3337ebf5-b4f8-4314-b9e4-059569000fa6.png",
  heroDesktop: "assets/lumen-banner-desktop.png",
  heroMobile: "assets/lumen-banner-mobile.png",
};
