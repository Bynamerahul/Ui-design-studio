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
  replaceOnce('<dt>Canopy restored</dt><dd>282 ha</dd>', '<dt>UI concepts</dt><dd>06 to explore</dd>');
  replaceOnce('<dt>Native species</dt><dd>43 mapped</dd>', '<dt>Design paths</dt><dd>03 categories</dd>');
  replaceOnce('<p class="label">Field Note 07</p>', '<p class="label">Featured Concept</p>');
  replaceOnce('<h2>After the Rain</h2>', '<h2>Forma Portfolio</h2>');
  replaceOnce('aria-label="Open field note: After the Rain"', 'aria-label="Preview Forma Portfolio"');
  replaceOnce('href="#">Discover<span class="track"></span>', 'href="#">Browse designs<span class="track"></span>');

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
})();
</script>`;
  replaceOnce('</body>', `${storeActions}\n</body>`);
  return html;
}
