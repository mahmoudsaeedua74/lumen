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

  function isRtl() {
    return document.documentElement.getAttribute("dir") === "rtl";
  }

  function getVisibleReviews() {
    var site = window.LUMEN_SITE || {};
    var data = window.LUMEN_TESTIMONIALS_DATA || { demo: [], approved: [] };
    var fromConfig = Array.isArray(site.testimonials) ? site.testimonials : [];
    var approved = (data.approved || []).concat(fromConfig).filter(function (item) {
      return item && item.status === "published" && !item.isDemo;
    });

    if (approved.length) return approved;

    if (site.showDemoTestimonials) {
      return (data.demo || []).filter(function (item) {
        return item && item.isDemo;
      });
    }

    return [];
  }

  function canShowStars(item) {
    return (
      !item.isDemo &&
      item.status === "published" &&
      typeof item.rating === "number" &&
      item.rating > 0
    );
  }

  function starsMarkup(rating) {
    var full = Math.max(0, Math.min(5, Math.round(rating)));
    var out = "";
    for (var i = 0; i < 5; i++) {
      out +=
        '<span class="testimonial-card__star' +
        (i < full ? " is-on" : "") +
        '" aria-hidden="true">★</span>';
    }
    return (
      '<p class="testimonial-card__stars" aria-label="' +
      attr(String(full) + "/5") +
      '">' +
      out +
      "</p>"
    );
  }

  function cardMarkup(item, demoMode) {
    var text = L(item.text) || "";
    return (
      '<article class="testimonial-card" data-testimonial-id="' +
      attr(item.id) +
      '"' +
      (demoMode ? ' data-demo="true"' : "") +
      ">" +
      '<div class="testimonial-card__inner">' +
      (canShowStars(item) ? starsMarkup(item.rating) : "") +
      '<p class="testimonial-card__text">' +
      esc(text) +
      "</p>" +
      '<p class="testimonial-card__name">' +
      esc(item.name) +
      (item.verified && !item.isDemo
        ? ' <span class="testimonial-card__verified">' + esc(t("verifiedPurchase")) + "</span>"
        : "") +
      "</p></div></article>"
    );
  }

  function updateNavState(track, prevBtn, nextBtn) {
    if (!track || !prevBtn || !nextBtn) return;
    var maxScroll = track.scrollWidth - track.clientWidth;
    var slides = track.querySelectorAll(".testimonials__slide");
    if (maxScroll <= 8 || slides.length <= 1) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    var trackRect = track.getBoundingClientRect();
    var first = slides[0].getBoundingClientRect();
    var last = slides[slides.length - 1].getBoundingClientRect();
    var rtl = isRtl();
    var atStart = rtl
      ? Math.abs(first.right - trackRect.right) < 14
      : Math.abs(first.left - trackRect.left) < 14;
    var atEnd = rtl
      ? Math.abs(last.left - trackRect.left) < 14
      : Math.abs(last.right - trackRect.right) < 14;

    prevBtn.hidden = false;
    nextBtn.hidden = false;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  function scrollByCard(track, direction) {
    var card = track.querySelector(".testimonial-card");
    if (!card) return;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 24;
    var amount = card.getBoundingClientRect().width + gap;
    var rtl = isRtl();
    // direction: 1 = next, -1 = previous (reading order)
    var delta = amount * direction * (rtl ? -1 : 1);
    track.scrollBy({ left: delta, behavior: "smooth" });
  }

  function bindCarousel(section) {
    var track = section.querySelector("[data-testimonials-track]");
    var prevBtn = section.querySelector("[data-testimonials-prev]");
    var nextBtn = section.querySelector("[data-testimonials-next]");
    if (!track) return;

    function refresh() {
      updateNavState(track, prevBtn, nextBtn);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollByCard(track, -1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollByCard(track, 1);
      });
    }

    track.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);

    // Touch swipe is native via overflow scroll + scroll-snap
    section.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard(track, isRtl() ? 1 : -1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard(track, isRtl() ? -1 : 1);
      }
    });

    requestAnimationFrame(refresh);
    setTimeout(refresh, 120);
  }

  function mount(section) {
    if (!section) return;

    var reviews = getVisibleReviews();
    if (!reviews.length) {
      section.hidden = true;
      section.innerHTML = "";
      return;
    }

    var demoMode = reviews.every(function (r) {
      return !!r.isDemo;
    });

    section.hidden = false;
    section.innerHTML =
      '<div class="container container--shop testimonials">' +
      '<header class="testimonials__head">' +
      "<h2>" +
      esc(t("testimonialsTitle")) +
      "</h2>" +
      "</header>" +
      '<div class="testimonials__viewport">' +
      '<div class="testimonials__track" data-testimonials-track tabindex="0" role="list">' +
      reviews
        .map(function (item) {
          return '<div role="listitem" class="testimonials__slide">' + cardMarkup(item, demoMode) + "</div>";
        })
        .join("") +
      "</div>" +
      '<button type="button" class="testimonials__nav testimonials__nav--prev" data-testimonials-prev aria-label="' +
      attr(t("prevReview")) +
      '"><span aria-hidden="true">‹</span></button>' +
      '<button type="button" class="testimonials__nav testimonials__nav--next" data-testimonials-next aria-label="' +
      attr(t("nextReview")) +
      '"><span aria-hidden="true">›</span></button>' +
      "</div></div>";

    bindCarousel(section);
  }

  window.LumenTestimonialsSection = {
    mount: mount,
    getVisibleReviews: getVisibleReviews,
  };
})();
