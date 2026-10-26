// Retone only the page copy and attach store navigation to the verified authored document.
// The scene renderer, shaders, styles, controls, and asset paths remain from ThreeUI.
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
  replaceOnce('<p class="label">Our Ethos</p>', '<p class="label">Our Approach</p>');
  replaceOnce('<h2>Let the wild lead.</h2>', '<h2>Let ideas grow.</h2>');
  replaceOnce('aria-label="Read about Sylva"', 'aria-label="Read about UI Design Studio"');
  replaceOnce('<span><i style="--d:360ms">the living world</i></span>', '<span><i style="--d:360ms">better UI design</i></span>');
  replaceOnce('We restore wild places through patient design, native planting, and a deeper kind of stewardship.', 'Explore crafted UI designs for websites, apps, and dashboards — made to spark your next idea.');
  replaceOnce('<span class="lbl">Explore the work</span>', '<span class="lbl">Browse the designs</span>');
  replaceOnce('aria-label="Play the film"', 'aria-label="Preview a featured design"');
  replaceOnce('<dt>Canopy restored</dt><dd>282 ha</dd>', '<dt>UI concepts</dt><dd>09 to explore</dd>');
  replaceOnce('<dt>Native species</dt><dd>43 mapped</dd>', '<dt>Design paths</dt><dd>03 categories</dd>');
  replaceOnce('<p class="label">Field Note 07</p>', '<p class="label">Featured Concept</p>');
  replaceOnce('<h2>After the Rain</h2>', '<h2>Forma Portfolio</h2>');
  replaceOnce('aria-label="Open field note: After the Rain"', 'aria-label="Preview Forma Portfolio"');
  replaceOnce('href="#">Discover<span class="track"></span>', 'href="#">Browse designs<span class="track"></span>');

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
  document.querySelector('.knob--about').addEventListener('click', function () { send('about'); });
  document.querySelector('.liquid-button--explore').addEventListener('click', function () { send('collection'); });
  document.querySelector('.liquid-button--play').addEventListener('click', function () { send('preview'); });
  document.querySelector('.card--stove .knob').addEventListener('click', function () { send('preview'); });
  document.querySelector('.scroll').addEventListener('click', function (event) { event.preventDefault(); send('collection'); });
  window.addEventListener('message', function (event) {
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
  return html;
}
