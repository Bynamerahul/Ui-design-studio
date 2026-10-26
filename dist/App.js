import React, { useEffect, useRef, useState } from 'react';
import { SylvaHero } from '@designcodeio/threeui';
const products = [{
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
function ProductArtwork({
  product
}) {
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
  const journeyRef = useRef(null);
  const journeyPathRef = useRef(null);
  const shown = filter === 'All' ? products : products.filter(p => p.type === filter);
  useEffect(() => {
    const iframe = document.querySelector('.shader-frame iframe');
    const main = document.getElementById('collection');
    if (!iframe || !main) return;
    let scheduled = false;
    function publishScroll() {
      scheduled = false;
      const fade = Math.max(0, Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
      const rect = main.getBoundingClientRect();
      const depth = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
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
    const path = journeyPathRef.current;
    const section = journeyRef.current;
    if (!path || !section) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    function updateJourney() {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewport * 0.58 - rect.top) / Math.max(1, rect.height - viewport * 0.3)));
      path.style.strokeDashoffset = String(length * (1 - progress));
    }
    const observer = new ResizeObserver(updateJourney);
    observer.observe(section);
    window.addEventListener('scroll', updateJourney, {
      passive: true
    });
    window.addEventListener('resize', updateJourney);
    updateJourney();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateJourney);
      window.removeEventListener('resize', updateJourney);
    };
  }, [filter]);
  useEffect(() => {
    function onMessage(event) {
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
        setSelected(products.find(product => product.name === 'Forma'));
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
  }, /*#__PURE__*/React.createElement("section", {
    className: "world-intro",
    "aria-label": "Enter the design grove"
  }, /*#__PURE__*/React.createElement("div", {
    className: "world-intro__top"
  }, /*#__PURE__*/React.createElement("span", null, "UI DESIGN STUDIO / THE WORLD"), /*#__PURE__*/React.createElement("span", null, "01 — 09")), /*#__PURE__*/React.createElement("div", {
    className: "world-intro__copy"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "STEP BEYOND THE HERO"), /*#__PURE__*/React.createElement("h2", null, "Follow the ideas", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "deeper.")), /*#__PURE__*/React.createElement("p", null, "A growing world of interfaces. Keep scrolling as the branches make way for each design.")), /*#__PURE__*/React.createElement("span", {
    className: "world-intro__cue"
  }, "SCROLL TO WANDER ", /*#__PURE__*/React.createElement("span", null, "↓"))), /*#__PURE__*/React.createElement("section", {
    className: "collection-wrap",
    "aria-labelledby": "collection-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-rule"
  }, /*#__PURE__*/React.createElement("span", null, "UI DESIGN STUDIO"), /*#__PURE__*/React.createElement("span", null, "THE COLLECTION / 2026")), /*#__PURE__*/React.createElement("div", {
    className: "collection-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "SELECTED INTERFACES"), /*#__PURE__*/React.createElement("h1", {
    id: "collection-title"
  }, "Designs for", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "what comes next."))), /*#__PURE__*/React.createElement("p", null, "Explore UI designs one by one. Scroll through layered portfolio cards, preview the motion, and discover the first three $10 concepts.")), /*#__PURE__*/React.createElement("div", {
    className: "filters",
    role: "group",
    "aria-label": "Filter UI designs"
  }, ['All', 'Website', 'Mobile', 'Dashboard'].map(type => /*#__PURE__*/React.createElement("button", {
    key: type,
    type: "button",
    className: filter === type ? 'active' : '',
    "aria-pressed": filter === type,
    onClick: () => setFilter(type)
  }, type, type === 'All' && /*#__PURE__*/React.createElement("span", null, "09")))), /*#__PURE__*/React.createElement("div", {
    className: "journey",
    ref: journeyRef
  }, /*#__PURE__*/React.createElement("svg", {
    className: "journey-line",
    viewBox: "0 0 120 1000",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    className: "journey-track",
    d: "M 55 0 C 105 180 15 310 65 500 S 15 820 70 1000"
  }), /*#__PURE__*/React.createElement("path", {
    ref: journeyPathRef,
    className: "journey-progress",
    d: "M 55 0 C 105 180 15 310 65 500 S 15 820 70 1000"
  })), /*#__PURE__*/React.createElement("div", {
    className: "products"
  }, shown.map((product, index) => /*#__PURE__*/React.createElement("button", {
    className: "product",
    type: "button",
    key: product.name,
    style: {
      '--stack-top': `${20 + index * 9}px`,
      zIndex: index + 1
    },
    onClick: () => {
      setCheckoutMessage(false);
      setSelected(product);
    },
    "aria-label": `Preview ${product.name}`
  }, /*#__PURE__*/React.createElement(ProductArtwork, {
    product: product
  }), /*#__PURE__*/React.createElement("div", {
    className: "product-label"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, String(index + 1).padStart(2, '0'), " / ", product.type.toUpperCase(), " / ", product.status || 'CONCEPT PREVIEW'), /*#__PURE__*/React.createElement("strong", null, product.name), /*#__PURE__*/React.createElement("p", null, product.tag), /*#__PURE__*/React.createElement("b", {
    className: "product-price"
  }, product.price ? `$${product.price}` : 'Coming soon')), /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "↗")))))), /*#__PURE__*/React.createElement("p", {
    className: "catalog-note"
  }, "The first three designs are priced at $10 each. Checkout and private prompt delivery will open after payment setup. Other cards are concept previews.")), /*#__PURE__*/React.createElement("section", {
    className: "closing",
    id: "about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "closing-inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "UI DESIGN STUDIO"), /*#__PURE__*/React.createElement("h2", null, "A better beginning", /*#__PURE__*/React.createElement("br", null), "for your next idea."), /*#__PURE__*/React.createElement("p", null, "Original UI designs are on their way. Explore the collection now and check back for the first release."), /*#__PURE__*/React.createElement("a", {
    href: "#collection"
  }, "Explore the collection ", /*#__PURE__*/React.createElement("span", null, "↗"))))), /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("span", null, "© UI Design Studio"), /*#__PURE__*/React.createElement("a", {
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
  }, "The visual preview is public. The implementation prompt stays private until a verified purchase can unlock it."), selected.demo && /*#__PURE__*/React.createElement("a", {
    className: "live-preview-link",
    href: selected.demo,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Open live motion preview ↗"), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("strong", null, "$10"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCheckoutMessage(true)
  }, "Purchase for $10 ↗")), /*#__PURE__*/React.createElement("button", {
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