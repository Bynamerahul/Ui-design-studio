import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, resolve, sep, extname } from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.woff2':'font/woff2'};
createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{const body=await readFile(file===root?join(root,'index.html'):file);res.writeHead(200,{'content-type':types[extname(file)]??'application/octet-stream'}).end(body)}
  catch{res.writeHead(404).end('Not found')}
}).listen(8765,'127.0.0.1',()=>console.log('http://127.0.0.1:8765/'));
