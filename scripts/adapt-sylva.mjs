// Retone only the page copy and attach store navigation to the verified authored document.
// The scene renderer, shaders, styles, controls, and asset paths remain from ThreeUI.
import { extendUnderwater } from './underwater-extension.mjs';
export function adaptSylva(source) {
  let html = source;
  function replaceOnce(before, after) {
    if (html.split(before).length !== 2) throw new Error(`Sylva copy anchor changed: ${before.slice(0, 60)}`);
    html = html.replace(before, after);
  }
  replaceOnce('<title>Sylva — Into the living world</title>', '<title>UI Design Studio — Designs that feel alive</title>');
  replaceOnce('Restoring wild places through patient design, native planting, and a deeper kind of stewardship.', 'Explore crafted UI designs for websites, apps, and dashboards.');
  replaceOnce('aria-label="Sylva — home"', 'aria-label="UI Design Studio — home"');
  replaceOnce('<span>Grove</span>', '<span>Designs</span>');
  replaceOnce('<span>Habitats</span>', '<span>Websites</span>');
  replaceOnce('<span>Journal</span>', '<span>Apps</span>');
  replaceOnce('<span>Enter</span>', '<span>Explore</span>');
  replaceOnce('aria-hidden="true">SYLVA</div>', 'aria-hidden="true">STUDIO</div>');
  replaceOnce('<p class="label">Our Ethos</p>', '<p class="label">Premium release · $200</p>');
  replaceOnce('<h2>Let the wild lead.</h2>', '<h2>Megacity<br>Odyssey</h2>');
  replaceOnce('aria-label="Read about Sylva"', 'aria-label="Preview Megacity Odyssey — $200"');
  replaceOnce('src="inner-green-assets/card-ethos.jpg" alt="A cushion of moss grown over lichen-crusted stones"', 'src="/catalog/megacity-odyssey.png" alt="A detailed industrial megacity with elevated bridges at sunset"');
  replaceOnce('<article class="card card--about mask"', '<article role="button" tabindex="0" aria-label="Preview Megacity Odyssey — $200" class="card card--about mask"');
  replaceOnce('<span><i style="--d:360ms">the living world</i></span>', '<span><i style="--d:360ms">better UI design</i></span>');
  replaceOnce('We restore wild places through patient design, native planting, and a deeper kind of stewardship.', 'Explore crafted UI designs for websites, apps, and dashboards — made to spark your next idea.');
  replaceOnce('<span class="lbl">Explore the work</span>', '<span class="lbl">Browse the designs</span>');
  replaceOnce('aria-label="Play the film"', 'aria-label="Preview Megacity Odyssey — $200"');
  replaceOnce('<dt>Canopy restored</dt><dd>282 ha</dd>', '<dt>UI concepts</dt><dd>12 to explore</dd>');
  replaceOnce('<dt>Native species</dt><dd>43 mapped</dd>', '<dt>Design paths</dt><dd>03 categories</dd>');
  replaceOnce('<p class="label">Field Note 07</p>', '<p class="label">Latest design · $10</p>');
  replaceOnce('<h2>After the Rain</h2>', '<h2>Perspective<br>Tunnel Hero</h2>');
  replaceOnce('aria-label="Open field note: After the Rain"', 'aria-label="Preview Perspective Tunnel Hero — $10" tabindex="-1" aria-hidden="true"');
  replaceOnce('src="inner-green-assets/card-ecostove.jpg" alt="Moss-covered boulders in a misty grove"', 'src="/catalog/perspective-tunnel-hero-hero.svg" alt="Purple spatial image cards arranged around the Into the Ether headline"');
  replaceOnce('<article class="card card--stove mask"', '<article role="button" tabindex="0" aria-label="Preview Perspective Tunnel Hero — $10" class="card card--stove mask"');
  replaceOnce('href="#">Discover<span class="track"></span>', 'href="#">Browse designs<span class="track"></span>');
  replaceOnce('    if (!small) bf = buildButterfly(nearGroup, nearLimbs, nearGroup.userData.uni);', '    // Underwater scene uses fish and jellyfish instead of the landing butterfly.');

  // The authored canvas stays mounted through the whole page. The parent
  // supplies scroll depth while the first-screen controls fade away.
  replaceOnce('  var nearGroup, farGroup, motes, shadowMesh, glowMesh;', '  var nearGroup, farGroup, journeyNear, journeyFar, motes, shadowMesh, glowMesh;');
  replaceOnce('    scene.add(farGroup);\n\n    buildAmbient();', '    scene.add(farGroup);\n\n    journeyNear = nearGroup.clone(true);\n    journeyFar = farGroup.clone(true);\n    journeyNear.visible = journeyFar.visible = false;\n    scene.add(journeyNear);\n    scene.add(journeyFar);\n\n    buildAmbient();');
  replaceOnce(
    '    place(nearGroup, A, 0.732, 0.06, 0);\n    place(farGroup,  F, 0.410, 0.32, F.z);',
    '    place(nearGroup, A, 0.732, 0.06, 0);\n    place(farGroup,  F, 0.410, 0.32, F.z);\n    journeyNear.position.copy(nearGroup.position).add(new THREE.Vector3(W * 0.42, H * 0.08, -680));\n    journeyFar.position.copy(farGroup.position).add(new THREE.Vector3(-W * 0.30, H * 0.10, -1200));'
  );
  replaceOnce(
    '    camera.position.x = -smooth.x * 26;\n    camera.position.y =  smooth.y * 16;\n    camera.lookAt(camera.position.x * 0.42, camera.position.y * 0.42, 0);',
    '    var depth = Math.max(0, Math.min(1, window.__studioDepth || 0));\n    camera.position.z += ((DIST - depth * 650) - camera.position.z) * 0.045;\n    camera.position.x = -smooth.x * 26 + depth * W * 0.065;\n    camera.position.y =  smooth.y * 16 - depth * H * 0.035;\n    camera.lookAt(camera.position.x * 0.42, camera.position.y * 0.42, -depth * 150);\n    journeyNear.visible = depth > 0.02;\n    journeyFar.visible = depth > 0.25;\n    journeyNear.scale.copy(nearGroup.scale).multiplyScalar(0.93 * Math.min(1, Math.max(0, (depth - 0.02) * 4)));\n    journeyFar.scale.copy(farGroup.scale).multiplyScalar(Math.min(1, Math.max(0, (depth - 0.25) * 3)));'
  );

  const storeActions = `<script>
(function () {
  window.addEventListener('pointerdown', function() {
    window.parent.postMessage({source:'ui-design-studio-ambience'},location.origin);
  });
  var touchY = null;
  window.addEventListener('touchstart', function(event) { touchY=event.touches[0]?.clientY; }, {passive:true});
  window.addEventListener('touchmove', function(event) {
    if(touchY == null || event.touches.length !== 1) return;
    var next=event.touches[0].clientY;
    event.preventDefault();
    window.parent.postMessage({source:'ui-design-studio-wheel',delta:touchY-next},location.origin);
    touchY=next;
  }, {passive:false});
  window.addEventListener('wheel', function(event) {
    event.preventDefault();
    window.parent.postMessage({source:'ui-design-studio-wheel',delta:event.deltaY},location.origin);
  }, {passive:false});
  window.addEventListener('pointermove', function(event) {
    window.__studioPointer = {x:event.clientX / innerWidth * 2 - 1,y:event.clientY / innerHeight * 2 - 1};
  }, {passive:true});
  function send(action, type) {
    window.parent.postMessage({ source: 'ui-design-studio-hero', action: action, type: type || null }, window.location.origin);
  }
  var dock = document.querySelectorAll('[data-dock]');
  var actions = [
    ['home'], ['collection'], ['collection', 'Website'], ['collection', 'Mobile'], ['collection']
  ];
  for (var i = 0; i < dock.length; i++) (function (item, instruction) {
    item.addEventListener('click', function () { send(instruction[0], instruction[1]); });
  })(dock[i], actions[i]);
  function connectProduct(selector, name) {
    var card=document.querySelector(selector);
    card.addEventListener('click', function() {send('preview',name);});
    card.addEventListener('keydown', function(event) {if(event.key==='Enter'||event.key===' '){event.preventDefault();send('preview',name);}});
  }
  connectProduct('.card--about','Megacity Odyssey');
  connectProduct('.card--stove','Perspective Tunnel Hero');
  document.querySelector('.knob--about').addEventListener('click', function () { send('preview','Megacity Odyssey'); });
  document.querySelectorAll('.knob svg').forEach(function(svg){svg.innerHTML='<path d="M7 17 17 7M7 7h10v10"/>';});
  document.querySelector('.liquid-button--explore').addEventListener('click', function () { send('collection'); });
  document.querySelector('.liquid-button--play').addEventListener('click', function () { send('preview','Megacity Odyssey'); });
  document.querySelector('.scroll').addEventListener('click', function (event) { event.preventDefault(); send('collection'); });
  window.addEventListener('message', function (event) {
    if (event.origin === window.location.origin && event.data?.source === 'ui-design-studio-pointer') {
      window.__studioPointer = event.data;
      return;
    }
    if (event.origin !== window.location.origin || event.data?.source !== 'ui-design-studio-scroll') return;
    var fade = Math.max(0, Math.min(1, Number(event.data.fade) || 0));
    window.__studioDepth = Math.max(0, Math.min(1, Number(event.data.depth) || 0));
    var stage = document.getElementById('stage');
    var dockWrap = document.querySelector('.dock-wrap');
    stage.style.opacity = String(1 - fade);
    dockWrap.style.opacity = String(1 - fade);
    stage.style.pointerEvents = fade > 0.8 ? 'none' : '';
    dockWrap.style.pointerEvents = fade > 0.8 ? 'none' : '';
  });
})();
</script>`;
  replaceOnce('</body>', `${storeActions}\n</body>`);
  html=html.replace('</head>',`<style>
html,body{overflow:hidden!important;height:100%!important;background:#082d38!important}
.hero{height:100svh!important;min-height:0!important;background:radial-gradient(ellipse at 35% -20%,#16545a 0,#082d38 48%,#05242f 100%)!important}
.hero::after{display:none!important}
.card{cursor:pointer}
.card:focus-visible{outline:2px solid #b9eadb;outline-offset:6px}
.card--about h2{width:calc(185 * var(--u));font-size:calc(25 * var(--u));line-height:calc(27 * var(--u))}
.card--stove h2{font-size:calc(25 * var(--u));line-height:calc(27 * var(--u))}
.card .label{font-size:calc(13 * var(--u));letter-spacing:calc(.3 * var(--u))}
.card--stove .knob{pointer-events:none}
.card .portal-media{inset:0}
.card .portal-media img{transform:none;filter:none}
.card:hover .portal-media img{transform:scale(1.04);filter:none}
@media(max-width:900px){.card--about h2{width:calc(400 * var(--u));font-size:calc(32 * var(--u));line-height:calc(35 * var(--u))}.card--stove h2{font-size:calc(32 * var(--u));line-height:calc(35 * var(--u))}}
.water-light{position:absolute;inset:-15% -25%;z-index:4;pointer-events:none;opacity:.14;mix-blend-mode:screen;background:conic-gradient(from 155deg at 34% -10%,transparent 0deg,#b3f9e9 18deg,transparent 22deg,#a5efe42b 28deg,transparent 31deg,#d5fff22e 36deg,transparent 41deg);filter:blur(14px);transform-origin:34% 0%;animation:water-light-drift 18s ease-in-out infinite alternate}
.water-vignette{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse at 48% 35%,transparent 32%,#031c2c80 100%);box-shadow:inset 0 0 100px #021b2a44}
@keyframes water-light-drift{from{transform:rotate(-5deg) scaleX(1)}to{transform:rotate(5deg) scaleX(1.15)}}
@media(prefers-reduced-motion:reduce){.water-light{animation:none}}
</style></head>`);
  html=html.replace('<canvas id="scene"></canvas>','<canvas id="scene"></canvas><div class="water-light" aria-hidden="true"></div><div class="water-vignette" aria-hidden="true"></div>');
  return extendUnderwater(html);
}
