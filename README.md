# UI Design Studio

Storefront preview with the exact ThreeUI Sylva Living Green hero, followed by a scroll-driven 3D forest journey. A local Three.js scene grows repeated mossy branches and moves the camera forward through them as visitors scroll. The collection continues in the same green world with a scroll-drawn SVG line, three $10 design listings, and six illustrative UI concepts. Cards stack as the visitor scrolls. The Real Magic Ticker has a standalone GSAP ScrollTrigger motion preview at `/previews/real-magic.html`.

The three design prompts are saved privately outside this public repository. The public site includes visual previews and a motion demo. Purchase and prompt copying require a payment provider, a server-side verified purchase record, and private prompt delivery; none are active yet. The checkout button explains this status instead of claiming a sale. Public visuals and client-side animation code can still be captured by visitors, so the site does not claim that previews are copy-proof.

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
