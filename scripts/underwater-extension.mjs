import { readFileSync } from 'node:fs';
export function extendUnderwater(html) {
  const runtime=readFileSync(new URL('./underwater-runtime.js',import.meta.url),'utf8');
  html=html.replace('  var frames = 0;',runtime+'\n  var frames = 0;');
  const start=html.indexOf('    var depth = Math.max(0, Math.min(1, window.__studioDepth');
  const end=html.indexOf('\n    if (!REDUCED) {',start);
  if(start<0||end<0) throw new Error('Underwater camera anchor missing');
  return html.slice(0,start)+'    updateUnderwater(dt);\n'+html.slice(end);
}
