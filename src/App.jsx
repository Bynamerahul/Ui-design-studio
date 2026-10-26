import React, { useEffect, useRef, useState } from 'react';
import { SylvaHero } from '@designcodeio/threeui';
import ForestJourney from './ForestJourney.js';

const products = [
  { name: 'Tubes Cursor', type: 'Website', tag: 'Interactive 3D background', color: '#10131c', ink: '#edf2ff', shape: 'tubes', price: 10, status: 'First release', demo: '/previews/tubes-cursor.html' },
  { name: 'Stacking Cards', type: 'Website', tag: 'Scroll layered portfolio cards', color: '#d7e0d4', ink: '#2a4632', shape: 'stack', price: 10, status: 'New design' },
  { name: 'Real Magic Ticker', type: 'Website', tag: 'Continuous horizontal text story', color: '#9f1c2b', ink: '#fff7eb', shape: 'ticker', price: 10, status: 'New design', demo: '/previews/real-magic.html' },
  { name: 'Forma', type: 'Website', tag: 'Editorial portfolio', color: '#d7d0c3', ink: '#3d4239', shape: 'circle' },
  { name: 'Pulse', type: 'Mobile', tag: 'Wellness app', color: '#d9b9ad', ink: '#523d3d', shape: 'arch' },
  { name: 'North', type: 'Dashboard', tag: 'Analytics workspace', color: '#b7ccd0', ink: '#28434b', shape: 'bars' },
  { name: 'Atelier', type: 'Website', tag: 'Creative studio', color: '#c4cbb5', ink: '#394534', shape: 'circle' },
  { name: 'Flora', type: 'Mobile', tag: 'Commerce app', color: '#decaa7', ink: '#524531', shape: 'arch' },
  { name: 'Axis', type: 'Dashboard', tag: 'Project workspace', color: '#c8c6d7', ink: '#3a3a50', shape: 'bars' },
];

function ProductArtwork({ product }) {
  if (product.shape === 'stack') return (
    <div className="product-preview stack-preview" role="img" aria-label="Preview illustration of layered portfolio cards">
      <div className="stack-sheet stack-sheet-back">03 <span>THE NEXT IDEA</span></div>
      <div className="stack-sheet stack-sheet-middle">02 <span>THE PROCESS</span></div>
      <div className="stack-sheet stack-sheet-front"><small>PORTFOLIO / INTERACTION</small><strong>Stacking<br />Cards<span>.</span></strong><em>SCROLL TO REVEAL ↗</em></div>
      <span className="preview-watermark">PREVIEW · UI DESIGN STUDIO</span>
    </div>
  );
  if (product.shape === 'ticker') return (
    <div className="product-preview ticker-preview" role="img" aria-label="Preview illustration of a continuous horizontal typography animation">
      <div className="ticker-preview-ribbon"><span>In every bottle,</span><svg viewBox="0 0 90 65" aria-hidden="true"><path d="M4 50 Q40 -10 85 32" /></svg><strong>Real Magic</strong><span>brings us Together</span></div>
      <span className="preview-watermark">PREVIEW · UI DESIGN STUDIO</span>
    </div>
  );
  if (product.shape === 'tubes') return (
    <div className="product-preview tubes-preview" role="img" aria-label="Preview illustration of colorful interactive tubes">
      <div className="tube tube-one" /><div className="tube tube-two" /><div className="tube tube-three" />
      <div className="tubes-copy"><small>INTERACTIVE BACKGROUND / 001</small><strong>TUBES<br /><em>CURSOR</em></strong><span>Move. Explore. Create.</span></div>
      <span className="preview-watermark">PREVIEW · UI DESIGN STUDIO</span>
    </div>
  );
  return (
    <div className={`product-preview ${product.shape}`} style={{ '--card-bg': product.color, '--card-ink': product.ink }}>
      <div className="preview-window"><div className="preview-top"><span>● ● ●</span><b>{product.name.toUpperCase()}</b></div><div className="preview-layout"><div className="preview-rail"><i /><i /><i /></div><div className="preview-body"><small>{product.tag}</small><strong>{product.name}<span>.</span></strong><i /><i /><div className="preview-object" /></div></div></div>
      <span className="preview-watermark">PREVIEW · UI DESIGN STUDIO</span>
    </div>
  );
}

export function Scene() {
  return (
    <div className="shader-frame">
      <SylvaHero
        variant="living-green"
        headingFont="lexend"
        bodyFont="lexend"
        headingWeight="300"
        bodyWeight="300"
        primaryColor="#ffffff"
        headingSize={63}
        bodySize={16.5}
        headingLetterSpacing={-0.006}
      />
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(false);
  const journeyRef = useRef(null);
  const journeyPathRef = useRef(null);
  const shown = filter === 'All' ? products : products.filter((p) => p.type === filter);

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
    window.addEventListener('scroll', updateJourney, { passive: true });
    window.addEventListener('resize', updateJourney);
    updateJourney();
    return () => { observer.disconnect(); window.removeEventListener('scroll', updateJourney); window.removeEventListener('resize', updateJourney); };
  }, [filter]);

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin || event.data?.source !== 'ui-design-studio-hero') return;
      const { action, type } = event.data;
      if (action === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (action === 'about') { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); return; }
      if (action === 'preview') { setCheckoutMessage(false); setSelected(products.find((product) => product.name === 'Forma')); return; }
      if (action === 'collection') {
        setFilter(type && ['Website', 'Mobile', 'Dashboard'].includes(type) ? type : 'All');
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.querySelector('.modal-close')?.focus();
    function onKeyDown(event) { if (event.key === 'Escape') setSelected(null); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  return (
    <>
      <Scene />
      <main id="collection">
        <ForestJourney />
        <section className="world-intro" aria-label="Enter the design grove">
          <div className="world-intro__top"><span>UI DESIGN STUDIO / THE WORLD</span><span>01 — 09</span></div>
          <div className="world-intro__copy"><p className="eyebrow">STEP BEYOND THE HERO</p><h2>Follow the ideas<br /><em>deeper.</em></h2><p>A growing world of interfaces. Keep scrolling as the branches make way for each design.</p></div>
          <span className="world-intro__cue">SCROLL TO WANDER <span>↓</span></span>
        </section>
        <section className="collection-wrap" aria-labelledby="collection-title">
          <div className="section-rule"><span>UI DESIGN STUDIO</span><span>THE COLLECTION / 2026</span></div>
          <div className="collection-heading">
            <div><p className="eyebrow">SELECTED INTERFACES</p><h1 id="collection-title">Designs for<br /><em>what comes next.</em></h1></div>
            <p>Explore UI designs one by one. Scroll through layered portfolio cards, preview the motion, and discover the first three $10 concepts.</p>
          </div>
          <div className="filters" role="group" aria-label="Filter UI designs">
            {['All', 'Website', 'Mobile', 'Dashboard'].map((type) => <button key={type} type="button" className={filter === type ? 'active' : ''} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type}{type === 'All' && <span>09</span>}</button>)}
          </div>
          <div className="journey" ref={journeyRef}>
            <svg className="journey-line" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true"><path className="journey-track" d="M 55 0 C 105 180 15 310 65 500 S 15 820 70 1000" /><path ref={journeyPathRef} className="journey-progress" d="M 55 0 C 105 180 15 310 65 500 S 15 820 70 1000" /></svg>
            <div className="products">
            {shown.map((product, index) => <button className="product" type="button" key={product.name} style={{ '--stack-top': `${20 + index * 9}px`, zIndex: index + 1 }} onClick={() => { setCheckoutMessage(false); setSelected(product); }} aria-label={`Preview ${product.name}`}>
              <ProductArtwork product={product} />
              <div className="product-label"><div><span>{String(index + 1).padStart(2, '0')} / {product.type.toUpperCase()} / {product.status || 'CONCEPT PREVIEW'}</span><strong>{product.name}</strong><p>{product.tag}</p><b className="product-price">{product.price ? `$${product.price}` : 'Coming soon'}</b></div><span className="arrow">↗</span></div>
            </button>)}
            </div>
          </div>
          <p className="catalog-note">The first three designs are priced at $10 each. Checkout and private prompt delivery will open after payment setup. Other cards are concept previews.</p>
        </section>
        <section className="closing" id="about"><div className="closing-inner"><span className="eyebrow">UI DESIGN STUDIO</span><h2>A better beginning<br />for your next idea.</h2><p>Original UI designs are on their way. Explore the collection now and check back for the first release.</p><a href="#collection">Explore the collection <span>↗</span></a></div></section>
      </main>
      <footer><span>© UI Design Studio</span><a href="#collection">Back to collection ↑</a></footer>
      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelected(null)}>×</button>
          <ProductArtwork product={selected} />
          <p className="eyebrow">{selected.price ? 'DESIGN PREVIEW' : 'CONCEPT PREVIEW'}</p><h2 id="modal-title">{selected.name}</h2>
          <p>{selected.tag} · {selected.type} UI design.</p>
          {selected.price ? <><p className="preview-disclaimer">The visual preview is public. The implementation prompt stays private until a verified purchase can unlock it.</p>{selected.demo && <a className="live-preview-link" href={selected.demo} target="_blank" rel="noopener noreferrer">Open live motion preview ↗</a>}<div className="modal-foot"><strong>$10</strong><button type="button" onClick={() => setCheckoutMessage(true)}>Purchase for $10 ↗</button></div><button className="copy-locked" type="button" onClick={() => setCheckoutMessage(true)}>🔒 Copy prompt after purchase</button>{checkoutMessage && <p className="checkout-message" role="status">Checkout is not active yet. A verified payment service is required before we can safely deliver the private prompt.</p>}</> : <div className="modal-foot"><span>This design is a concept preview.</span><button type="button" onClick={() => { setSelected(null); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>View more designs</button></div>}
        </div>
      </div>}
    </>
  );
}
