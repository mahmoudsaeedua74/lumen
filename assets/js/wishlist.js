(function () {
  var STORAGE_KEY = "lumen_wishlist_v1";

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(function (id) { return typeof id === "string"; }) : [];
    } catch (e) {
      return [];
    }
  }

  function write(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("lumen:wishlistchange"));
  }

  function getAll() {
    return read().filter(function (id) {
      return !!window.LumenProducts.getById(id);
    });
  }

  function has(id) {
    return getAll().indexOf(id) !== -1;
  }

  function toggle(id) {
    if (!window.LumenProducts.getById(id)) return { ok: false, active: false };
    var ids = getAll();
    var idx = ids.indexOf(id);
    if (idx === -1) {
      ids.push(id);
      write(ids);
      return { ok: true, active: true };
    }
    ids.splice(idx, 1);
    write(ids);
    return { ok: true, active: false };
  }

  function getCount() {
    return getAll().length;
  }

  function getItems() {
    return getAll()
      .map(function (id) {
        return window.LumenProducts.getById(id);
      })
      .filter(Boolean);
  }

  window.LumenWishlist = {
    getAll: getAll,
    has: has,
    toggle: toggle,
    getCount: getCount,
    getItems: getItems,
  };
})();
