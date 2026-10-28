import React, { useEffect, useState } from 'react';
import { SylvaHero } from '@designcodeio/threeui';
const products = [{
  name: 'Megacity Odyssey',
  type: 'Website',
  tag: 'Cinematic 3D city · four chapters of scroll exploration',
  color: '#292f42',
  ink: '#ffddc3',
  shape: 'city',
  price: 200,
  status: 'Premium release',
  demo: '/previews/megacity-odyssey.html',
  image: '/catalog/megacity-odyssey.png'
}, {
  name: 'Tubes Cursor',
  type: 'Website',
  tag: 'Interactive 3D background',
  color: '#10131c',
  ink: '#edf2ff',
  shape: 'tubes',
  price: 10,
  status: 'First release',
  demo: '/previews/tubes-cursor.html'
}, {
  name: 'Stacking Cards',
  type: 'Website',
  tag: 'Scroll layered portfolio cards',
  color: '#d7e0d4',
  ink: '#2a4632',
  shape: 'stack',
  price: 10,
  status: 'New design'
}, {
  name: 'Real Magic Ticker',
  type: 'Website',
  tag: 'Continuous horizontal text story',
  color: '#9f1c2b',
  ink: '#fff7eb',
  shape: 'ticker',
  price: 10,
  status: 'New design',
  demo: '/previews/real-magic.html'
}, {
  name: 'Glass Folder Cards',
  type: 'Website',
  tag: 'Frosted interactive file folders',
  color: '#d9d9e2',
  ink: '#232839',
  shape: 'glass',
  price: 10,
  status: 'New design',
  demo: '/previews/glass-folder-cards.html'
}, {
  name: 'Perspective Tunnel Hero',
  type: 'Website',
  tag: 'Scroll through a spatial image corridor',
  color: '#17132b',
  ink: '#f2eaff',
  shape: 'tunnel',
  price: 10,
  status: 'New design',
  demo: '/previews/perspective-tunnel-hero.html'
}, {
  name: 'Forma',
  type: 'Website',
  tag: 'Editorial portfolio',
  color: '#d7d0c3',
  ink: '#3d4239',
  shape: 'circle'
}, {
  name: 'Pulse',
  type: 'Mobile',
  tag: 'Wellness app',
  color: '#d9b9ad',
  ink: '#523d3d',
  shape: 'arch'
}, {
  name: 'North',
  type: 'Dashboard',
  tag: 'Analytics workspace',
  color: '#b7ccd0',
  ink: '#28434b',
  shape: 'bars'
}, {
  name: 'Atelier',
  type: 'Website',
  tag: 'Creative studio',
  color: '#c4cbb5',
  ink: '#394534',
  shape: 'circle'
}, {
  name: 'Flora',
  type: 'Mobile',
  tag: 'Commerce app',
  color: '#decaa7',
  ink: '#524531',
  shape: 'arch'
}, {
  name: 'Axis',
  type: 'Dashboard',
  tag: 'Project workspace',
  color: '#c8c6d7',
  ink: '#3a3a50',
  shape: 'bars'
}];
function productImage(product) {
  return product.image || `/catalog/${product.name.toLowerCase().replaceAll(' ', '-')}.svg`;
}
function ProductArtwork({
  product
}) {
  if (['glass', 'tunnel', 'city'].includes(product.shape)) return /*#__PURE__*/React.createElement("div", {
    className: "product-preview poster-preview",
    role: "img",
    "aria-label": `Preview illustration of ${product.name}`
  }, /*#__PURE__*/React.createElement("img", {
    src: productImage(product),
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "preview-watermark"
  }, "PREVIEW · UI DESIGN STUDIO"));
  if (product.shape === 'stack') return /*#__PURE__*/React.createElement("div", {
    className: "product-preview stack-preview",
    role: "img",
    "aria-label": "Preview illustration of layered portfolio cards"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-sheet stack-sheet-back"
  }, "03 ", /*#__PURE__*/React.createElement("span", null, "THE NEXT IDEA")), /*#__PURE__*/React.createElement("div", {
    className: "stack-sheet stack-sheet-middle"
  }, "02 ", /*#__PURE__*/React.createElement("span", null, "THE PROCESS")), /*#__PURE__*/React.createElement("div", {
    className: "stack-sheet stack-sheet-front"
  }, /*#__PURE__*/React.createElement("small", null, "PORTFOLIO / INTERACTION"), /*#__PURE__*/React.createElement("strong", null, "Stacking", /*#__PURE__*/React.createElement("br", null), "Cards", /*#__PURE__*/React.createElement("span", null, ".")), /*#__PURE__*/React.createElement("em", null, "SCROLL TO REVEAL ↗")), /*#__PURE__*/React.createElement("span", {
    className: "preview-watermark"
  }, "PREVIEW · UI DESIGN STUDIO"));
  if (product.shape === 'ticker') return /*#__PURE__*/React.createElement("div", {
    className: "product-preview ticker-preview",
    role: "img",
    "aria-label": "Preview illustration of a continuous horizontal typography animation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ticker-preview-ribbon"
  }, /*#__PURE__*/React.createElement("span", null, "In every bottle,"), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 90 65",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 50 Q40 -10 85 32"
  })), /*#__PURE__*/React.createElement("strong", null, "Real Magic"), /*#__PURE__*/React.createElement("span", null, "brings us Together")), /*#__PURE__*/React.createElement("span", {
    className: "preview-watermark"
  }, "PREVIEW · UI DESIGN STUDIO"));
  if (product.shape === 'tubes') return /*#__PURE__*/React.createElement("div", {
    className: "product-preview tubes-preview",
    role: "img",
    "aria-label": "Preview illustration of colorful interactive tubes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tube tube-one"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tube tube-two"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tube tube-three"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tubes-copy"
  }, /*#__PURE__*/React.createElement("small", null, "INTERACTIVE BACKGROUND / 001"), /*#__PURE__*/React.createElement("strong", null, "TUBES", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "CURSOR")), /*#__PURE__*/React.createElement("span", null, "Move. Explore. Create.")), /*#__PURE__*/React.createElement("span", {
    className: "preview-watermark"
  }, "PREVIEW · UI DESIGN STUDIO"));
  return /*#__PURE__*/React.createElement("div", {
    className: `product-preview ${product.shape}`,
    style: {
      '--card-bg': product.color,
      '--card-ink': product.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview-window"
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview-top"
  }, /*#__PURE__*/React.createElement("span", null, "● ● ●"), /*#__PURE__*/React.createElement("b", null, product.name.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "preview-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview-rail"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "preview-body"
  }, /*#__PURE__*/React.createElement("small", null, product.tag), /*#__PURE__*/React.createElement("strong", null, product.name, /*#__PURE__*/React.createElement("span", null, ".")), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("div", {
    className: "preview-object"
  })))), /*#__PURE__*/React.createElement("span", {
    className: "preview-watermark"
  }, "PREVIEW · UI DESIGN STUDIO"));
}
export function Scene() {
  return /*#__PURE__*/React.createElement("div", {
    className: "shader-frame"
  }, /*#__PURE__*/React.createElement(SylvaHero, {
    variant: "living-green",
    headingFont: "lexend",
    bodyFont: "lexend",
    headingWeight: "300",
    bodyWeight: "300",
    primaryColor: "#ffffff",
    headingSize: 63,
    bodySize: 16.5,
    headingLetterSpacing: -0.006
  }));
}
export default function App() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(false);
  const shown = filter === 'All' ? products : products.filter(p => p.type === filter);
  useEffect(() => {
    if (location.hash === '#design-trail') requestAnimationFrame(() => document.getElementById('design-trail')?.scrollIntoView({
      behavior: 'instant'
    }));
  }, []);
  useEffect(() => {
    let context, water;
    const start = () => {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        const buffer = context.createBuffer(1, context.sampleRate * 5, context.sampleRate);
        const samples = buffer.getChannelData(0);
        let previous = 0;
        for (let i = 0; i < samples.length; i++) {
          previous = (previous + (Math.random() * 2 - 1) * .025) / 1.025;
          samples[i] = previous * 3;
        }
        water = context.createBufferSource();
        water.buffer = buffer;
        water.loop = true;
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 340;
        const gain = context.createGain();
        gain.gain.value = .035;
        water.connect(filter).connect(gain).connect(context.destination);
        water.start();
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
    };
    const onMessage = event => {
      if (event.origin === location.origin && event.data?.source === 'ui-design-studio-ambience') start();
    };
    const visibility = () => {
      if (document.hidden) context?.suspend();else if (context) context.resume().catch(() => {});
    };
    window.addEventListener('pointerdown', start);
    window.addEventListener('keydown', start);
    window.addEventListener('message', onMessage);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      water?.stop();
      context?.close();
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
      window.removeEventListener('message', onMessage);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    const iframe = document.querySelector('.shader-frame iframe');
    const main = document.getElementById('collection');
    if (!iframe || !main) return;
    let scheduled = false;
    function publishScroll() {
      scheduled = false;
      const fade = Math.max(0, Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
      const hud = document.querySelector('.forest-hud');
      if (hud) {
        const clearingTop = document.getElementById('design-trail')?.getBoundingClientRect().top ?? Infinity;
        const entrance = Math.max(0, Math.min(1, (fade - .85) / .15));
        const exit = Math.max(0, Math.min(1, (clearingTop - 90) / 150));
        hud.style.opacity = String(entrance * exit);
        hud.inert = entrance * exit < .1;
      }
      const rect = main.getBoundingClientRect();
      // Finish the descent before the collection; then drift gently behind the stack.
      const diveHeight = document.getElementById('design-trail').getBoundingClientRect().top - rect.top;
      const passed = Math.max(0, -rect.top);
      const depth = passed < diveHeight ? passed / Math.max(1, diveHeight) * .72 : .72 + Math.min(.28, (passed - diveHeight) / Math.max(1, rect.height - diveHeight) * .28);
      iframe.contentWindow?.postMessage({
        source: 'ui-design-studio-scroll',
        fade,
        depth
      }, window.location.origin);
    }
    function scheduleScroll() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(publishScroll);
    }
    iframe.addEventListener('load', publishScroll);
    window.addEventListener('scroll', scheduleScroll, {
      passive: true
    });
    window.addEventListener('resize', scheduleScroll);
    publishScroll();
    return () => {
      iframe.removeEventListener('load', publishScroll);
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', scheduleScroll);
    };
  }, []);
  useEffect(() => {
    let queued = false,
      point = {
        x: 0,
        y: 0
      };
    function move(event) {
      point = {
        x: event.clientX / innerWidth * 2 - 1,
        y: event.clientY / innerHeight * 2 - 1
      };
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        document.querySelector('.shader-frame iframe')?.contentWindow?.postMessage({
          source: 'ui-design-studio-pointer',
          ...point
        }, location.origin);
        document.documentElement.style.setProperty('--look-x', `${point.x * 10}px`);
        document.documentElement.style.setProperty('--look-y', `${point.y * 6}px`);
      });
    }
    window.addEventListener('pointermove', move, {
      passive: true
    });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useEffect(() => {
    function onMessage(event) {
      if (event.origin === window.location.origin && event.data?.source === 'ui-design-studio-wheel') {
        window.scrollBy({
          top: Number(event.data.delta) || 0,
          behavior: 'instant'
        });
        return;
      }
      if (event.origin !== window.location.origin || event.data?.source !== 'ui-design-studio-hero') return;
      const {
        action,
        type
      } = event.data;
      if (action === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      if (action === 'about') {
        document.getElementById('about')?.scrollIntoView({
          behavior: 'smooth'
        });
        return;
      }
      if (action === 'preview') {
        setCheckoutMessage(false);
        setSelected(products.find(product => product.name === type) || products.find(product => product.name === 'Megacity Odyssey'));
        return;
      }
      if (action === 'collection') {
        setFilter(type && ['Website', 'Mobile', 'Dashboard'].includes(type) ? type : 'All');
        document.getElementById('collection')?.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  useEffect(() => {
    if (!selected) return;
    document.querySelector('.modal-close')?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') setSelected(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement("div", {
    className: "hero-spacer",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("main", {
    id: "collection"
  }, /*#__PURE__*/React.createElement("div", {
    className: "forest-hud"
  }, /*#__PURE__*/React.createElement("span", null, "UI DESIGN STUDIO"), /*#__PURE__*/React.createElement("span", null, "SCROLL TO DIVE · MOVE TO LOOK"), /*#__PURE__*/React.createElement("a", {
    href: "#design-trail"
  }, "Discover designs ↗")), /*#__PURE__*/React.createElement("section", {
    className: "forest-breath",
    "aria-label": "Beneath the surface"
  }, /*#__PURE__*/React.createElement("p", null, "A little deeper.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "A different world.")), /*#__PURE__*/React.createElement("span", null, "Drift through the moss. Follow the current.")), /*#__PURE__*/React.createElement("section", {
    className: "forest-walk",
    "aria-label": "A journey beneath the surface"
  }, /*#__PURE__*/React.createElement("div", {
    className: "forest-chapter forest-chapter--first"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chapter-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chapter-index"
  }, "01 / BENEATH THE SURFACE"), /*#__PURE__*/React.createElement("h2", null, "Let the light", /*#__PURE__*/React.createElement("br", null), "guide you."), /*#__PURE__*/React.createElement("p", null, "Sunlight slips through the water. Move your cursor and look between the moss-covered arches."), /*#__PURE__*/React.createElement("span", {
    className: "chapter-cue"
  }, "SCROLL TO DESCEND ↓"))), /*#__PURE__*/React.createElement("div", {
    className: "forest-chapter forest-chapter--second"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chapter-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chapter-index"
  }, "02 / IN THE CURRENT"), /*#__PURE__*/React.createElement("h2", null, "Everything", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "moves slowly.")), /*#__PURE__*/React.createElement("p", null, "Fronds sway. Fish pass quietly. Brush the moss as the current carries you further."), /*#__PURE__*/React.createElement("span", {
    className: "chapter-cue"
  }, "LOOK AROUND · DRIFT DEEPER ↓"))), /*#__PURE__*/React.createElement("div", {
    className: "forest-chapter forest-chapter--third"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chapter-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chapter-index"
  }, "03 / THE DISCOVERY"), /*#__PURE__*/React.createElement("h2", null, "Ideas, waiting", /*#__PURE__*/React.createElement("br", null), "to surface."), /*#__PURE__*/React.createElement("p", null, "A collection of interfaces, found along the way. Choose one and make it yours."), /*#__PURE__*/React.createElement("a", {
    href: "#design-trail",
    className: "chapter-cue"
  }, "EXPLORE THE COLLECTION ↗")))), /*#__PURE__*/React.createElement("section", {
    className: "clearing-catalog",
    id: "design-trail",
    "aria-label": "Design collection"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clearing-heading"
  }, /*#__PURE__*/React.createElement("span", null, "THE COLLECTION / ", String(shown.length).padStart(2, '0'), " DISCOVERIES"), /*#__PURE__*/React.createElement("h2", null, "Bring something", /*#__PURE__*/React.createElement("br", null), "to the surface."), /*#__PURE__*/React.createElement("p", null, "Scroll through the collection. Select a design for a closer look.")), /*#__PURE__*/React.createElement("div", {
    className: "design-stack",
    "aria-label": "Designs in a scrolling card stack"
  }, shown.map((p, i) => /*#__PURE__*/React.createElement("article", {
    className: "design-stack__item",
    key: p.name,
    style: {
      '--stack-offset': `${Math.min(i, 4) * 7}px`,
      zIndex: i + 1
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `stack-product ${p.shape === 'city' ? 'stack-product--premium' : ''}`,
    "aria-label": `Preview ${p.name}${p.price ? ` · $${p.price}` : ''}`,
    onClick: () => {
      setCheckoutMessage(false);
      setSelected(p);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "stack-product__top"
  }, /*#__PURE__*/React.createElement("span", null, String(i + 1).padStart(2, '0'), " / ", p.shape === 'city' ? 'PREMIUM EXPERIENCE' : p.type.toUpperCase()), /*#__PURE__*/React.createElement("span", null, p.price ? `$${p.price}` : 'CONCEPT PREVIEW', " ↗")), /*#__PURE__*/React.createElement("img", {
    className: "stack-product__image",
    src: productImage(p),
    alt: `${p.name} design preview`,
    loading: "lazy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "stack-product__foot"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, p.name), /*#__PURE__*/React.createElement("small", null, p.tag)), /*#__PURE__*/React.createElement("span", {
    className: "stack-product__cta"
  }, "Explore design ↗"))))))), /*#__PURE__*/React.createElement("section", {
    className: "forest-end",
    id: "about"
  }, /*#__PURE__*/React.createElement("p", null, "Good ideas have depth."), /*#__PURE__*/React.createElement("a", {
    href: "#design-trail"
  }, "Explore again ↗"))), /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("span", null, "© UI Design Studio"), /*#__PURE__*/React.createElement("a", {
    href: "#collection"
  }, "Back to collection ↑")), selected && /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    role: "presentation",
    onMouseDown: event => {
      if (event.target === event.currentTarget) setSelected(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "modal-title"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    type: "button",
    "aria-label": "Close details",
    onClick: () => setSelected(null)
  }, "×"), /*#__PURE__*/React.createElement(ProductArtwork, {
    product: selected
  }), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, selected.price ? 'DESIGN PREVIEW' : 'CONCEPT PREVIEW'), /*#__PURE__*/React.createElement("h2", {
    id: "modal-title"
  }, selected.name), /*#__PURE__*/React.createElement("p", null, selected.tag, " · ", selected.type, " UI design."), selected.price ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "preview-disclaimer"
  }, "The visual preview is public. The implementation prompt stays private until a verified purchase can unlock it."), selected.shape === 'city' && /*#__PURE__*/React.createElement("p", {
    className: "premium-includes"
  }, "Four scroll chapters · Curved road traffic · Detailed architecture · Drag to look · View world mode"), selected.demo && /*#__PURE__*/React.createElement("a", {
    className: "live-preview-link",
    href: selected.demo,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Open live motion preview ↗"), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("strong", null, "$", selected.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCheckoutMessage(true)
  }, "Purchase for $", selected.price, " ↗")), /*#__PURE__*/React.createElement("button", {
    className: "copy-locked",
    type: "button",
    onClick: () => setCheckoutMessage(true)
  }, "🔒 Copy prompt after purchase"), checkoutMessage && /*#__PURE__*/React.createElement("p", {
    className: "checkout-message",
    role: "status"
  }, "Checkout is not active yet. A verified payment service is required before we can safely deliver the private prompt.")) : /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("span", null, "This design is a concept preview."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSelected(null);
      document.getElementById('collection')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, "View more designs")))));
}