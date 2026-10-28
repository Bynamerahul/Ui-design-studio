import { readFileSync } from 'node:fs';
export function extendJungle(html) {
  const runtime=readFileSync(new URL('./forest-runtime.js',import.meta.url),'utf8');
  html=html.replace('  var frames = 0;',runtime+'\n  var frames = 0;');
  const start=html.indexOf('    var depth = Math.max(0, Math.min(1, window.__studioDepth');
  const end=html.indexOf('\n    if (!REDUCED) {',start);
  if(start<0||end<0) throw new Error('Forest camera anchor missing');
  return html.slice(0,start)+'    updateGrove(dt);\n'+html.slice(end);
}
