# UI Design Studio

Storefront preview with the exact ThreeUI Sylva Living Green hero, a scroll-drawn SVG journey line, one $10 design listing, and six illustrative UI concepts.

The first design's full prompt is saved privately outside this public repository. The public site includes only a visual preview. Purchase and prompt copying require a payment provider, a server-side verified purchase record, and private prompt delivery; none are active yet. The checkout button explains this status instead of claiming a sale. Public visuals can still be captured by visitors, so the site does not claim that previews are copy-proof.

## Build

```sh
npm ci
npm run build
```

Serve the generated `dist/` directory from any static host. The build copies ThreeUI's authored HTML, local Three.js runtime, two card images, and Lexend font from the pinned `@designcodeio/threeui@1.2.0` package. It checks all five SHA-256 hashes before writing output. The JSX source uses the configured `<SylvaHero />` props in `src/App.jsx`. After verification, `scripts/adapt-sylva.mjs` changes only the storefront copy and connects the existing controls to the catalog; the authored scene renderer remains intact.

## Sales status

The catalog is a visual sample. Checkout is disabled until real UI design files, previews, prices, licenses, and a payment platform are available. No purchase or download flow is represented as live.

## Hosting

GitHub holds the source. Deploy the generated `dist/` to a host suitable for a commercial storefront. GitHub Pages is not intended for ecommerce sites under GitHub's Pages limits.
