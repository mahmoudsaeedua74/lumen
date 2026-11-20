(function () {
  var STORAGE_KEY = "lumen_cart_v1";
  var MAX_QTY = 20;

  function emitChange() {
    window.dispatchEvent(new CustomEvent("lumen:cartchange"));
  }

  function readRaw() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeRaw(lines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    emitChange();
  }

  function clampQty(value) {
    var n = parseInt(String(value), 10);
    if (!isFinite(n) || n < 1) return 0;
    return Math.min(MAX_QTY, n);
  }

  function lineKeyOf(line) {
    return [line.id, line.variantId || "", line.note || "", line.wrap || ""].join("::");
  }

  function normalizeLine(line) {
    if (!line || typeof line.id !== "string") return null;
    if (!window.LumenProducts.getById(line.id)) return null;
    var quantity = clampQty(line.quantity);
    if (!quantity) return null;
    var next = {
      id: line.id,
      variantId: line.variantId || "",
      note: line.note || "",
      wrap: line.wrap || "",
      quantity: quantity,
    };
    next.key = lineKeyOf(next);
    return next;
  }

  function getCart() {
    var map = {};
    readRaw().forEach(function (raw) {
      var line = normalizeLine(raw);
      if (!line) return;
      if (!map[line.key]) map[line.key] = line;
      else map[line.key].quantity = clampQty(map[line.key].quantity + line.quantity);
    });
    return Object.keys(map).map(function (key) {
      return map[key];
    });
  }

  function findLine(lines, key) {
    return (
      lines.find(function (line) {
        return line.key === key;
      }) ||
      lines.find(function (line) {
        return line.id === key && !line.variantId && !line.note && !line.wrap;
      }) ||
      null
    );
  }

  window.LumenCart = {
    getCart: getCart,
    getCount: function () {
      return getCart().reduce(function (sum, line) {
        return sum + line.quantity;
      }, 0);
    },
    getItems: function () {
      return getCart()
        .map(function (line) {
          var product = window.LumenProducts.getById(line.id);
          if (!product) return null;
          var variant = line.variantId ? window.LumenProducts.getVariant(product, line.variantId) : null;
          var unitPrice = variant && typeof variant.price === "number" ? variant.price : product.price;
          return {
            product: product,
            variant: variant,
            quantity: line.quantity,
            note: line.note,
            wrap: line.wrap,
            key: line.key,
            unitPrice: unitPrice,
          };
        })
        .filter(Boolean);
    },
    getSubtotal: function () {
      var items = window.LumenCart.getItems();
      var priced = true;
      var total = 0;
      items.forEach(function (item) {
        if (typeof item.unitPrice !== "number") {
          priced = false;
          return;
        }
        total += item.unitPrice * item.quantity;
      });
      return { total: total, priced: priced, itemCount: items.length };
    },
    add: function (productId, quantity, meta) {
      meta = meta || {};
      var product = window.LumenProducts.getById(productId);
      if (!product) return { ok: false, error: "Unknown product." };
      var variant = meta.variantId ? window.LumenProducts.getVariant(product, meta.variantId) : null;
      if (variant) {
        if (!window.LumenProducts.canPurchase(product, variant)) {
          return { ok: false, error: "Product unavailable." };
        }
      } else if (!window.LumenProducts.canPurchase(product)) {
        return { ok: false, error: "Product unavailable." };
      }
      var qty = clampQty(quantity || 1);
      if (!qty) return { ok: false, error: "Invalid quantity." };
      var incoming = normalizeLine({
        id: productId,
        variantId: variant ? variant.id : "",
        note: meta.note || "",
        wrap: meta.wrap || "",
        quantity: qty,
      });
      var lines = getCart();
      var existing = lines.find(function (line) {
        return line.key === incoming.key;
      });
      if (existing) existing.quantity = clampQty(existing.quantity + qty);
      else lines.push(incoming);
      writeRaw(lines);
      return { ok: true, count: window.LumenCart.getCount() };
    },
    setQuantity: function (key, quantity) {
      var lines = getCart();
      var existing = findLine(lines, key);
      if (!existing) return { ok: false, error: "Unknown product." };
      var qty = clampQty(quantity);
      if (!qty) {
        lines = lines.filter(function (line) {
          return line.key !== existing.key;
        });
      } else {
        existing.quantity = qty;
      }
      writeRaw(lines);
      return { ok: true, count: window.LumenCart.getCount() };
    },
    remove: function (key) {
      var lines = getCart();
      var existing = findLine(lines, key);
      writeRaw(
        lines.filter(function (line) {
          return !existing || line.key !== existing.key;
        })
      );
      return { ok: true, count: window.LumenCart.getCount() };
    },
    clear: function () {
      writeRaw([]);
      return { ok: true };
    },
  };
})();
