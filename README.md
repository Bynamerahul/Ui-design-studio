# UI Design Studio

An underwater UI design storefront built around the verified ThreeUI Sylva Living Green source. Scroll moves through a submerged moss scene with fish, jellyfish, bubbles, lighting and pointer-controlled camera movement. The latest designs appear in the hero and the collection uses vertical sticky stacking cards with modal previews.

The catalog contains Megacity Odyssey ($200), five $10 interaction designs, and six illustrative concepts marked as coming soon. Megacity Odyssey is an original stylized Three.js city with four scroll chapters, aerial traffic and pointer parallax. It is a procedural web preview, not a photorealistic recreation of the reference video.

## Build and preview

```sh
npm ci
npm run build
npm run preview
```

The build writes the static site to dist/. It verifies the pinned ThreeUI HTML, local Three.js runtime, card images and Lexend font before adapting the authored source for the storefront. Publish dist/ to a suitable static website host.

## Sales status

Checkout and paid prompt delivery are not live. Purchase controls explain that payment setup is pending. A payment provider, server-verified purchases and authenticated private prompt delivery are required before accepting sales. Prompts remain in ignored local private/ storage and are excluded from the public build and repository. Public preview visuals and browser code can be captured; no copy-proof protection is claimed.

## Previews

- /previews/megacity-odyssey.html
- /previews/tubes-cursor.html
- /previews/real-magic.html
- /previews/glass-folder-cards.html
- /previews/perspective-tunnel-hero.html

The catalog also includes an inline stacking-cards preview.

Megacity detail revision adds world-scaled weathered metal panels, a cantilever station, cooling machinery, curved elevated roads with vehicle traffic, steam, directional soft shadows, a lightweight bloom pass, drag/keyboard look controls and a story visibility toggle. The store thumbnail is captured from the actual live scene.
