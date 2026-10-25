import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SylvaHero } from '@designcodeio/threeui';
const products = [{
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
  const [soundEnabled, setSoundEnabled] = useState(() => window.localStorage.getItem('ui-design-studio-sound') === 'on');
  const soundRef = useRef(null);
  const shown = filter === 'All' ? products : products.filter(p => p.type === filter);
  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    if (!soundRef.current) soundRef.current = new Audio('/sounds/interface-click.mp3');
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
    soundRef.current.volume = 0.32;
    soundRef.current.play().catch(() => {});
  }, [soundEnabled]);
  useEffect(() => {
    window.localStorage.setItem('ui-design-studio-sound', soundEnabled ? 'on' : 'off');
  }, [soundEnabled]);
  useEffect(() => {
    function onPointerDown(event) {
      if (event.target.closest('button:not(.sound-toggle), a')) playClick();
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [playClick]);
  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin || event.data?.source !== 'ui-design-studio-hero') return;
      const {
        action,
        type
      } = event.data;
      if (action === 'sound') {
        playClick();
        return;
      }
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
        setSelected(products[0]);
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
  }, [playClick]);
  useEffect(() => {
    if (!selected) return;
    document.querySelector('.modal-close')?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') setSelected(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement("button", {
    className: "sound-toggle",
    type: "button",
    "aria-label": soundEnabled ? 'Mute sound effects' : 'Enable sound effects',
    "aria-pressed": soundEnabled,
    onClick: () => setSoundEnabled(enabled => !enabled)
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, soundEnabled ? '♪' : '♪̸'), /*#__PURE__*/React.createElement("span", null, "Sound ", soundEnabled ? 'on' : 'off')), /*#__PURE__*/React.createElement("main", {
    id: "collection"
  }, /*#__PURE__*/React.createElement("section", {
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
  }, "Designs for", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "what comes next."))), /*#__PURE__*/React.createElement("p", null, "Explore considered interface concepts for websites, apps, and dashboards. This sample catalog shows the direction of the store while the first purchasable designs are prepared.")), /*#__PURE__*/React.createElement("div", {
    className: "filters",
    role: "group",
    "aria-label": "Filter UI designs"
  }, ['All', 'Website', 'Mobile', 'Dashboard'].map(type => /*#__PURE__*/React.createElement("button", {
    key: type,
    type: "button",
    className: filter === type ? 'active' : '',
    "aria-pressed": filter === type,
    onClick: () => setFilter(type)
  }, type, type === 'All' && /*#__PURE__*/React.createElement("span", null, "06")))), /*#__PURE__*/React.createElement("div", {
    className: "products"
  }, shown.map(product => /*#__PURE__*/React.createElement("button", {
    className: "product",
    type: "button",
    key: product.name,
    onClick: () => setSelected(product),
    "aria-label": `View ${product.name} details`
  }, /*#__PURE__*/React.createElement("div", {
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
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "product-label"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, product.type.toUpperCase(), " / SAMPLE CONCEPT"), /*#__PURE__*/React.createElement("strong", null, product.name)), /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "↗"))))), /*#__PURE__*/React.createElement("p", {
    className: "catalog-note"
  }, "Sample concepts only. Product files, pricing, licenses, payment, and downloads will be added before sales open.")), /*#__PURE__*/React.createElement("section", {
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
  }, "×"), /*#__PURE__*/React.createElement("div", {
    className: `product-preview ${selected.shape}`,
    style: {
      '--card-bg': selected.color,
      '--card-ink': selected.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview-window"
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview-top"
  }, /*#__PURE__*/React.createElement("span", null, "● ● ●"), /*#__PURE__*/React.createElement("b", null, selected.name.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "preview-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview-rail"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "preview-body"
  }, /*#__PURE__*/React.createElement("small", null, selected.tag), /*#__PURE__*/React.createElement("strong", null, selected.name, /*#__PURE__*/React.createElement("span", null, ".")), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("div", {
    className: "preview-object"
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "SAMPLE DESIGN CONCEPT"), /*#__PURE__*/React.createElement("h2", {
    id: "modal-title"
  }, selected.name), /*#__PURE__*/React.createElement("p", null, selected.tag, " · ", selected.type, " UI concept."), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("span", null, "Files and pricing are being prepared."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSelected(null);
      document.getElementById('collection')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, "View more designs")))));
}