(function () {
  function attr(s) {
    return window.LumenLayout.escapeAttr(s);
  }
  function esc(s) {
    return window.LumenLayout.escapeHtml(s);
  }
  function t(key) {
    return window.LumenI18n.t(key);
  }

  function normalize(media) {
    var items = (media || [])
      .map(function (item) {
        if (typeof item === "string") return { type: "image", src: item };
        if (!item || !item.src && !item.poster) return null;
        return {
          type: item.type === "video" ? "video" : "image",
          src: item.src || "",
          poster: item.poster || item.src || "",
        };
      })
      .filter(Boolean);
    var images = items.filter(function (item) {
      return item.type !== "video";
    });
    var videos = items.filter(function (item) {
      return item.type === "video";
    });
    return images.concat(videos);
  }

  function mount(root, media, alt, options) {
    options = options || {};
    if (!root) return { setFeatured: function () {} };
    var items = normalize(media);
    var tag = options.tag || "";
    if (!items.length) return { setFeatured: function () {} };
    var index = 0;
    var featured = "";
    var swiped = false;

    function mainItem() {
      var item = items[index];
      if (featured && items.every(function (entry) { return entry.src !== featured; })) {
        return { type: "image", src: featured, poster: featured };
      }
      return item;
    }

    function render() {
      var item = mainItem();
      var many = items.length > 1;
      var mainInner = "";
      if (item.type === "video" && item.src) {
        mainInner =
          '<video class="pdp-gallery__video" controls playsinline preload="metadata" poster="' +
          attr(item.poster) +
          '" src="' +
          attr(item.src) +
          '"></video>';
      } else {
        mainInner =
          '<button type="button" class="pdp-gallery__zoom" data-lightbox aria-label="' +
          attr(t("zoomImage")) +
          '"><img data-gallery-main src="' +
          attr(item.src || item.poster) +
          '" alt="' +
          attr(alt) +
          '" width="900" height="900" fetchpriority="high" /></button>';
      }

      root.innerHTML =
        '<div class="pdp-gallery">' +
        '<div class="pdp-gallery__stage">' +
        (tag ? '<span class="pdp-gallery__tag">' + esc(tag) + "</span>" : "") +
        '<div class="pdp-gallery__main" data-gallery-main-wrap>' +
        mainInner +
        "</div>" +
        (many
          ? '<div class="pdp-gallery__dots">' +
            items
              .map(function (entry, i) {
                return (
                  '<button type="button" class="pdp-dot' +
                  (i === index ? " is-active" : "") +
                  '" data-gallery-index="' +
                  i +
                  '" aria-label="' +
                  attr((entry.type === "video" ? t("playVideo") : t("showImage")) + " " + (i + 1)) +
                  '" aria-current="' +
                  (i === index ? "true" : "false") +
                  '"></button>'
                );
              })
              .join("") +
            "</div>"
          : "") +
        "</div></div>";

      root.querySelectorAll("[data-gallery-index]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          featured = "";
          index = Number(btn.getAttribute("data-gallery-index"));
          render();
        });
      });

      var mainWrap = root.querySelector("[data-gallery-main-wrap]");
      bindSwipe(mainWrap);
      bindZoom(mainWrap);
      var zoom = root.querySelector("[data-lightbox]");
      if (zoom) {
        zoom.addEventListener("click", function () {
          if (swiped) {
            swiped = false;
            return;
          }
          openLightbox(items, index, alt);
        });
      }
    }

    function bindSwipe(mainWrap) {
      if (!mainWrap || items.length < 2) return;
      var startX = null;
      mainWrap.addEventListener(
        "touchstart",
        function (e) {
          startX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      mainWrap.addEventListener(
        "touchend",
        function (e) {
          if (startX == null) return;
          var dx = e.changedTouches[0].clientX - startX;
          startX = null;
          if (Math.abs(dx) < 40) return;
          var rtl = document.documentElement.getAttribute("dir") === "rtl";
          var forward = rtl ? dx > 0 : dx < 0;
          featured = "";
          swiped = true;
          index = forward ? Math.min(items.length - 1, index + 1) : Math.max(0, index - 1);
          render();
        },
        { passive: true }
      );
    }

    function bindZoom(mainWrap) {
      var img = mainWrap && mainWrap.querySelector("[data-gallery-main]");
      if (!img) return;
      var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || reduce) return;
      img.addEventListener("mousemove", function (e) {
        var rect = img.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = x + "% " + y + "%";
        img.style.transform = "scale(1.8)";
      });
      img.addEventListener("mouseleave", function () {
        img.style.transform = "";
        img.style.transformOrigin = "";
      });
    }

    render();

    return {
      setFeatured: function (src) {
        featured = src || "";
        if (featured) {
          var found = items.findIndex(function (entry) {
            return entry.src === featured;
          });
          if (found >= 0) index = found;
        }
        render();
      },
    };
  }

  function openLightbox(items, startIndex, alt) {
    var index = startIndex;
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    function paint() {
      var item = items[index];
      var visual =
        item.type === "video" && item.src
          ? '<video controls playsinline poster="' +
            attr(item.poster) +
            '" src="' +
            attr(item.src) +
            '"></video>'
          : '<img src="' + attr(item.src || item.poster) + '" alt="' + attr(alt) + '" />';
      overlay.innerHTML =
        '<button type="button" class="lightbox__close" data-close aria-label="' +
        attr(t("close")) +
        '">&times;</button>' +
        '<button type="button" class="lightbox__nav lightbox__prev" data-prev aria-label="' +
        attr(t("prevImage")) +
        '">‹</button>' +
        visual +
        '<button type="button" class="lightbox__nav lightbox__next" data-next aria-label="' +
        attr(t("nextImage")) +
        '">›</button>' +
        '<p class="lightbox__count" dir="ltr">' +
        esc(String(index + 1) + " / " + items.length) +
        "</p>";
      overlay.querySelector("[data-close]").addEventListener("click", close);
      overlay.querySelector("[data-prev]").addEventListener("click", function () {
        index = (index - 1 + items.length) % items.length;
        paint();
      });
      overlay.querySelector("[data-next]").addEventListener("click", function () {
        index = (index + 1) % items.length;
        paint();
      });
      overlay.querySelector("[data-close]").focus();
    }

    function close() {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") {
        index = (index - 1 + items.length) % items.length;
        paint();
      }
      if (e.key === "ArrowRight") {
        index = (index + 1) % items.length;
        paint();
      }
    }

    paint();
    document.body.appendChild(overlay);
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
  }

  window.LumenProductGallery = { mount: mount };
})();
