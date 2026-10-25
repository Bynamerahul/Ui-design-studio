# UI Design Studio

## Sound effect

The optional interface click is [Soft Interface Click by Universfield](https://pixabay.com/sound-effects/film-special-effects-soft-interface-click-126517/), downloaded from Pixabay under the [Pixabay Content License](https://pixabay.com/service/license-summary/). Sound starts off and can be toggled on by visitors. The audio file is included only as part of this website experience.

Sample storefront with the exact ThreeUI Sylva Living Green hero and six illustrative UI concepts.

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
