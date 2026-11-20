# LUMEN — Luxury Perfume Storefront

Static HTML, CSS, and Vanilla JavaScript storefront for **LUMEN**. No frameworks, no build step, no backend.

## Run locally

Open `index.html` in the browser, or use a local server:

```bash
# From this project folder
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Export homepage PDF (client presentation)

One-time setup:

```bash
npm install
npx playwright install chromium
```

Export (repeat anytime):

```bash
npm run export:homepage
```

Outputs (no site changes):

- `exports/LUMEN-Homepage-Desktop.png`
- `exports/LUMEN-Homepage-Desktop.pdf`
- `exports/LUMEN-Homepage-Desktop-continuous.pdf` (single full-height page — use this if the primary PDF splits sections)

Optional: point at an already running server with `LUMEN_EXPORT_URL=http://127.0.0.1:8080 npm run export:homepage`.

## Pages (exactly two templates)

| Page | File |
|------|------|
| Homepage | `index.html` |
| Product details | `product.html?slug=essence` |

Product slugs: `essence`, `mirage`, `serene`, `glow`.

Shopping uses product cards + the product page. Cart and wishlist open as side drawers (localStorage). Collection / story nav anchors scroll on the homepage.

## Homepage structure

1. Announcement + header (approved)
2. Responsive hero banners (desktop / mobile images preserved)
3. LUMEN product collection (4 cards)
4. Tabby banner (only when `tabbyEnabled` is true)
5. Store benefits
6. Customer testimonials (hidden until approved data exists)
7. Compact footer

## Configuration

Edit `assets/js/config.js`:

- Contact email / phone / address
- Social links
- `tabbyEnabled` — keep `false` until Tabby is merchant-activated
- `testimonials` — approved reviews only; empty hides the section
- `checkout.enabled` / `checkoutUrl` — only when a real checkout exists
- `purchasingEnabled`

Edit products and prices in `assets/js/products.js`. Do not invent prices or badges.

## Cart & wishlist

- Cart: `localStorage` key `lumen_cart_v1`
- Wishlist: `localStorage` key `lumen_wishlist_v1`
- Drawers update header badges; no fictional checkout success

## Design tokens

- Orange `#F78B1F`
- Ivory `#FAF6ED` / `#FFF9ED`
- Champagne `#E9D9BC`
- Text `#24201C`
- Dark `#171717`

Typography: Cormorant (display) + Montserrat (body), with Arabic-capable fallbacks.

## Architecture

```text
index.html
product.html
assets/
  css/          base, components, layout, homepage, product, responsive
  js/
    config.js, products.js, i18n.js, cart.js, wishlist.js, toast.js
    layout.js, navigation.js, main.js
    components/ product-card, cart-drawer, wishlist-drawer, product-gallery
    pages/      homepage.js, product-page.js
  images/       preserved product & brand assets
```

## Language

Arabic (RTL) is the default. Use the header globe control to switch to English (LTR). Preference persists in `localStorage`.
