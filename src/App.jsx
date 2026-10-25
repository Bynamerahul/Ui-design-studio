import React, { useEffect, useState } from 'react';
import { SylvaHero } from '@designcodeio/threeui';

const products = [
  { name: 'Forma', type: 'Website', tag: 'Editorial portfolio', color: '#d7d0c3', ink: '#3d4239', shape: 'circle' },
  { name: 'Pulse', type: 'Mobile', tag: 'Wellness app', color: '#d9b9ad', ink: '#523d3d', shape: 'arch' },
  { name: 'North', type: 'Dashboard', tag: 'Analytics workspace', color: '#b7ccd0', ink: '#28434b', shape: 'bars' },
  { name: 'Atelier', type: 'Website', tag: 'Creative studio', color: '#c4cbb5', ink: '#394534', shape: 'circle' },
  { name: 'Flora', type: 'Mobile', tag: 'Commerce app', color: '#decaa7', ink: '#524531', shape: 'arch' },
  { name: 'Axis', type: 'Dashboard', tag: 'Project workspace', color: '#c8c6d7', ink: '#3a3a50', shape: 'bars' },
];

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
  const shown = filter === 'All' ? products : products.filter((p) => p.type === filter);

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin || event.data?.source !== 'ui-design-studio-hero') return;
      const { action, type } = event.data;
      if (action === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (action === 'about') { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); return; }
      if (action === 'preview') { setSelected(products[0]); return; }
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
        <section className="collection-wrap" aria-labelledby="collection-title">
          <div className="section-rule"><span>UI DESIGN STUDIO</span><span>THE COLLECTION / 2026</span></div>
          <div className="collection-heading">
            <div><p className="eyebrow">SELECTED INTERFACES</p><h1 id="collection-title">Designs for<br /><em>what comes next.</em></h1></div>
            <p>Explore considered interface concepts for websites, apps, and dashboards. This sample catalog shows the direction of the store while the first purchasable designs are prepared.</p>
          </div>
          <div className="filters" role="group" aria-label="Filter UI designs">
            {['All', 'Website', 'Mobile', 'Dashboard'].map((type) => <button key={type} type="button" className={filter === type ? 'active' : ''} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type}{type === 'All' && <span>06</span>}</button>)}
          </div>
          <div className="products">
            {shown.map((product) => <button className="product" type="button" key={product.name} onClick={() => setSelected(product)} aria-label={`View ${product.name} details`}>
              <div className={`product-preview ${product.shape}`} style={{ '--card-bg': product.color, '--card-ink': product.ink }}>
                <div className="preview-window"><div className="preview-top"><span>● ● ●</span><b>{product.name.toUpperCase()}</b></div><div className="preview-layout"><div className="preview-rail"><i /><i /><i /></div><div className="preview-body"><small>{product.tag}</small><strong>{product.name}<span>.</span></strong><i /><i /><div className="preview-object" /></div></div></div>
              </div>
              <div className="product-label"><div><span>{product.type.toUpperCase()} / SAMPLE CONCEPT</span><strong>{product.name}</strong></div><span className="arrow">↗</span></div>
            </button>)}
          </div>
          <p className="catalog-note">Sample concepts only. Product files, pricing, licenses, payment, and downloads will be added before sales open.</p>
        </section>
        <section className="closing" id="about"><div className="closing-inner"><span className="eyebrow">UI DESIGN STUDIO</span><h2>A better beginning<br />for your next idea.</h2><p>Original UI designs are on their way. Explore the collection now and check back for the first release.</p><a href="#collection">Explore the collection <span>↗</span></a></div></section>
      </main>
      <footer><span>© UI Design Studio</span><a href="#collection">Back to collection ↑</a></footer>
      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelected(null)}>×</button>
          <div className={`product-preview ${selected.shape}`} style={{ '--card-bg': selected.color, '--card-ink': selected.ink }}>
            <div className="preview-window"><div className="preview-top"><span>● ● ●</span><b>{selected.name.toUpperCase()}</b></div><div className="preview-layout"><div className="preview-rail"><i /><i /><i /></div><div className="preview-body"><small>{selected.tag}</small><strong>{selected.name}<span>.</span></strong><i /><i /><div className="preview-object" /></div></div></div>
          </div>
          <p className="eyebrow">SAMPLE DESIGN CONCEPT</p><h2 id="modal-title">{selected.name}</h2>
          <p>{selected.tag} · {selected.type} UI concept.</p>
          <div className="modal-foot"><span>Files and pricing are being prepared.</span><button type="button" onClick={() => { setSelected(null); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>View more designs</button></div>
        </div>
      </div>}
    </>
  );
}
