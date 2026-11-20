(function () {
  var region = null;

  function ensureRegion() {
    if (region) return region;
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
    return region;
  }

  window.LumenToast = {
    show: function (message, type) {
      type = type || "info";
      var host = ensureRegion();
      var el = document.createElement("div");
      el.className = "toast toast--" + type;
      el.setAttribute("role", "status");
      el.textContent = message;
      host.appendChild(el);
      requestAnimationFrame(function () {
        el.classList.add("is-visible");
      });
      setTimeout(function () {
        el.classList.remove("is-visible");
        setTimeout(function () {
          el.remove();
        }, 280);
      }, 3200);
    },
  };
})();
