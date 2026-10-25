import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { resolve, join, dirname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { transformSync } from '@babel/core';
import { adaptSylva } from './adapt-sylva.mjs';

const root=resolve('.');
const dist=resolve(root,'dist');
if (!dist.startsWith(root+sep)) throw new Error('Output must be inside this project');
if (existsSync(dist)) rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});
const pkg=resolve(root,'node_modules/@designcodeio/threeui/lib-dist');
const checks={
  'inner-green-3d.html':'69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197',
  'inner-green-assets/three.min.js':'8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271',
  'inner-green-assets/card-ecostove.jpg':'70ce084084902bc502f00c366405b661ecdff90dee95d363b36a6e146829e433',
  'inner-green-assets/card-ethos.jpg':'337627390f499b3ae272cec9e2f83c817694a82f42e1aa10a7b26a2c7d679dff',
  'inner-green-assets/lexend-latin.woff2':'1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46',
};
for(const [relative,expected] of Object.entries(checks)){
  const from=join(pkg,'assets/landing-pages',relative);
  const bytes=readFileSync(from);
  const actual=createHash('sha256').update(bytes).digest('hex');
  if(actual!==expected)throw new Error(`ThreeUI source hash mismatch: ${relative}`);
  const to=join(dist,'landing-pages',relative);
  mkdirSync(dirname(to),{recursive:true});
  writeFileSync(to,relative==='inner-green-3d.html'?adaptSylva(bytes.toString('utf8')):bytes);
}
mkdirSync(join(dist,'vendor'),{recursive:true});
for(const name of ['LandingPages.js','pageTypography.js','pageRecipes.js']){
  cpSync(join(pkg,'shaders/landing-pages',name),join(dist,'vendor',name),{recursive:true});
}
cpSync(join(pkg,'style.css'),join(dist,'threeui.css'));
cpSync(join(root,'src/style.css'),join(dist,'styles.css'));
const transformed=transformSync(readFileSync(join(root,'src/App.jsx'),'utf8'),{filename:'App.jsx',configFile:false,babelrc:false,presets:[['@babel/preset-react',{runtime:'classic'}]]});
writeFileSync(join(dist,'App.js'),transformed.code);
writeFileSync(join(dist,'main.js'),`import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.js';\ncreateRoot(document.getElementById('root')).render(React.createElement(App));\n`);
writeFileSync(join(dist,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#383b34"><meta name="description" content="UI Design Studio — explore distinctive UI concepts."><title>UI Design Studio — Explore the collection</title><link rel="stylesheet" href="/threeui.css"><link rel="stylesheet" href="/styles.css"><script type="importmap">{"imports":{"react":"https://esm.sh/react@19.2.0","react/jsx-runtime":"https://esm.sh/react@19.2.0/jsx-runtime","react-dom/client":"https://esm.sh/react-dom@19.2.0/client?external=react","@designcodeio/threeui":"/vendor/LandingPages.js"}}</script></head><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>`);
console.log('Built dist with verified Sylva assets');
