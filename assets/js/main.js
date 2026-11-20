(function () {
  document.documentElement.classList.add("js");
  window.LumenI18n.applyDocumentLang();

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.dataset.page || "";
    window.LumenLayout.mountChrome({ active: page });
    window.LumenNav.initNavigation();
    window.LumenNav.initSmoothAnchors();
    window.LumenNav.initScrollReveal();
    window.LumenHomepage.init();
    window.LumenProductPage.init();
  });
})();
