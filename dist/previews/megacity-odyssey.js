(function(){
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const capture=new URLSearchParams(location.search).has('capture');
  if(capture)document.body.classList.add('capture');
  let seed=817;
  function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
  const between=(a,b)=>a+(b-a)*rand();
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas:document.getElementById('city'),antialias:true,powerPreference:'high-performance'});}
  catch(error){document.getElementById('opening').dataset.ready='true';document.getElementById('fallback').hidden=false;return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.15:1.5));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.06;
  renderer.shadowMap.enabled=innerWidth>=700;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0xb1a5bc,.00027);
  const camera=new THREE.PerspectiveCamera(innerWidth<700?63:55,innerWidth/innerHeight,1,10000);
  scene.add(new THREE.HemisphereLight(0xf4ccd0,0x303c59,.48));
  const sunset=new THREE.DirectionalLight(0xffc19b,2.35);sunset.position.set(1600,1400,900);scene.add(sunset,sunset.target);
  sunset.castShadow=innerWidth>=700;sunset.shadow.mapSize.set(2048,2048);
  Object.assign(sunset.shadow.camera,{left:-900,right:900,top:900,bottom:-900,near:100,far:4600});
  sunset.shadow.bias=-.00035;sunset.shadow.normalBias=1.8;
  const coolFill=new THREE.DirectionalLight(0x8cabdc,.65);coolFill.position.set(-500,600,1500);scene.add(coolFill);

  const sky=new THREE.Mesh(new THREE.SphereGeometry(8500,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:'varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec3 vDirection;
    void main(){float h=normalize(vDirection).y;vec3 top=vec3(.28,.30,.43),middle=vec3(.76,.52,.59),horizon=vec3(.98,.64,.47),deep=vec3(.18,.23,.34);vec3 col=mix(deep,horizon,smoothstep(-.35,.015,h));col=mix(col,middle,smoothstep(.005,.18,h));col=mix(col,top,smoothstep(.16,.75,h));float cloud=sin(vDirection.x*.0009+sin(vDirection.z*.0007))*sin(vDirection.z*.0005);col+=cloud*.022*smoothstep(.04,.4,h);gl_FragColor=vec4(col,1.);}` }));
  scene.add(sky);
  function glowTexture(){let c=document.createElement('canvas');c.width=c.height=128;let x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,226,164,1)');g.addColorStop(.42,'rgba(255,182,122,1)');g.addColorStop(.48,'rgba(255,167,113,.3)');g.addColorStop(1,'rgba(255,153,110,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
  const sun=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),transparent:true,depthWrite:false,fog:false}));sun.position.set(1550,460,-5100);sun.scale.set(850,850,1);scene.add(sun);

  function panelTexture(){let c=document.createElement('canvas');c.width=256;c.height=512;let x=c.getContext('2d');x.fillStyle='#a6a6a8';x.fillRect(0,0,256,512);for(let j=0;j<32;j++)for(let i=0;i<12;i++){let v=Math.floor(between(112,160));x.fillStyle=`rgb(${v},${v+2},${v+5})`;x.fillRect(i*22+1,j*17+1,20,15);if(rand()>.55){x.fillStyle='rgba(40,45,56,.3)';x.fillRect(i*22+3,j*17+4,14,3);}}for(let i=0;i<100;i++){x.fillStyle='rgba(32,42,53,.08)';x.fillRect(rand()*256,rand()*512,between(1,4),between(10,110));}const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
  const plating=panelTexture();
  const materials={
    steel:new THREE.MeshStandardMaterial({color:0x7a8592,map:plating,roughness:.87,metalness:.25}),
    concrete:new THREE.MeshStandardMaterial({color:0x7b8492,map:plating,roughness:.96}),
    dark:new THREE.MeshStandardMaterial({color:0x374452,map:plating,roughness:.8,metalness:.35}),
    edge:new THREE.MeshStandardMaterial({color:0x65727f,roughness:.6,metalness:.45}),
    rust:new THREE.MeshStandardMaterial({color:0x965a54,map:plating,roughness:.96}),
    black:new THREE.MeshStandardMaterial({color:0x182432,roughness:.8}),
    amber:new THREE.MeshBasicMaterial({color:0xffc389}),
    gold:new THREE.MeshBasicMaterial({color:0xd98f64}),
    blue:new THREE.MeshBasicMaterial({color:0x84b4ce}),
    red:new THREE.MeshBasicMaterial({color:0xe17469})
  };
  const boxes={},tubes={};
  function box(kind,x,y,z,w,h,d,rx=0,ry=0,rz=0){(boxes[kind]||(boxes[kind]=[])).push([x,y,z,w,h,d,rx,ry,rz]);}
  function tube(kind,x,y,z,r,h,rx=0,rz=0){(tubes[kind]||(tubes[kind]=[])).push([x,y,z,r,h,r,rx,0,rz]);}
  function lightKind(){let n=rand();return n<.12?'blue':n<.55?'gold':'amber';}
  const floor=-720;
  function building(x,z,w,d,h,detail=1,kind='steel'){
    const y=floor+h/2,roof=floor+h;
    box(kind,x,y,z,w,h,d);
    box('edge',x,roof+3,z,w+6,6,d+7);
    // Setbacks, roof equipment, and vertical service strips break each silhouette.
    if(h>500){box('dark',x+w*.12,roof+25,z-d*.08,w*.7,45,d*.65);box(kind,x-w*.13,roof+57,z-d*.09,w*.41,22,d*.4);}
    for(let j=0;j<3;j++){let xx=x-w*.4+j*w*.4;box('dark',xx,y,z+d/2+1,2,h,2);}
    const step=detail>1?11:17,cols=Math.floor((w-12)/step),rows=Math.floor((h-18)/step);
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      let n=rand();if(n>.36)continue;
      const yy=floor+10+row*step,xx=x-w/2+8+col*step;
      box(n<.16?lightKind():'black',xx,yy,z+d/2+.65,detail>1?3.5:2.5,detail>1?2.4:1.9,.65);
    }
    const side=x<0?1:-1,sideCols=Math.floor(d/step);
    for(let row=0;row<rows;row++)for(let col=0;col<sideCols;col++){
      let n=rand();if(n>.27)continue;
      box(n<.12?lightKind():'black',x+side*(w/2+.7),floor+10+row*step,z-d/2+7+col*step,.7,2.3,3.3);
    }
    for(let v=0;v<3;v++){let xx=x+between(-w*.3,w*.3),zz=z+between(-d*.3,d*.3);box('black',xx,roof+75,zz,1.5,100+rand()*60,1.5);box('red',xx,roof+135,zz,2,2,2);}
    if(detail>1){
      for(let k=0;k<9;k++){
        const yy=floor+130+k*(h-220)/9,depth=d*.65+rand()*35,px=x+side*(w/2+33);
        box('dark',px,yy,z+20,86,8,depth);box('edge',px,yy+5,z+20,88,2,depth+2);
        for(let p=0;p<6;p++){let pz=z+20-depth/2+p*depth/5;box('edge',px+side*43,yy+13,pz,1,19,1);}
        box('edge',px+side*43,yy+23,z+20,1,1,depth);
        box('edge',x+side*(w/2+17),yy-24,z+depth*.15,3,65,4,0,0,-side*.63);
        box('edge',x+side*(w/2+17),yy-24,z-depth*.27,3,65,4,0,0,-side*.63);
        box('amber',px+side*43,yy+3,z+20,1.1,1.2,depth*.8);
        for(let e=0;e<3;e++)box('steel',px+between(-22,22),yy+14,z+between(-depth*.25,depth*.25),between(7,17),between(10,18),between(8,17));
      }
      for(let p=0;p<7;p++){
        let px=x+side*(w/2+5+p%2*3),pz=z-d*.45+p*d*.13,ph=h*between(.7,.95);
        tube(p%3?'edge':'rust',px,floor+ph/2,pz,1.8+rand()*1.5,ph);
        for(let collar=0;collar<11;collar++)tube('black',px,floor+collar*ph/11,pz,4,3);
      }
      for(let p=0;p<6;p++){let yy=floor+150+p*h*.13;box('edge',x,yy,z+d/2+2,w,3,4);}
      for(let p=0;p<23;p++){
        const px=x+between(-w*.35,w*.35),py=floor+between(90,h-70),pw=between(15,38),ph=between(15,32);
        box(p%5===0?'rust':'dark',px,py,z+d/2+5,pw,ph,8);
        for(let slat=0;slat<4;slat++)box('edge',px,py-ph*.32+slat*ph*.21,z+d/2+10,pw*.78,1.1,2);
        if(p%3===0){tube('rust',px+pw*.6,py,z+d/2+7,1.5,ph*2);box('gold',px-pw*.4,py-ph*.3,z+d/2+10,2,2,1);}
      }
    }
  }
  // The closest industrial wall is composed from real geometry, including its balconies and pipes.
  building(-320,120,205,300,1550,2,'concrete');
  building(610,-260,170,210,1230,2,'dark');
  building(-370,-610,230,245,1280,2,'steel');
  building(355,-850,175,230,1450,2,'concrete');
  building(-330,-1340,215,260,1550,2,'rust');
  building(390,-1600,205,270,1290,2,'steel');
  building(-410,-2180,230,250,1500,2,'concrete');
  building(430,-2420,200,270,1700,2,'dark');
  // A distant skyline has several generations of towers and layered setbacks.
  for(let i=0;i<105;i++){
    const z=-550-rand()*6200,side=i%2?1:-1,x=side*(500+rand()*1700),w=between(60,175),d=between(65,180),h=between(550,1900);
    building(x,z,w,d,h,0,['steel','concrete','dark'][i%3]);
  }
  building(40,-2920,145,190,1970,1,'steel');
  building(-100,-3900,150,210,2270,1,'dark');
  building(300,-4900,190,230,2500,1,'concrete');
  // Stacked lower districts keep the valley detailed all the way down.
  for(let i=0;i<95;i++){let z=between(-6000,300),x=(i%2?1:-1)*between(210,1700);box(i%3?'dark':'steel',x,floor+between(10,90),z,between(40,150),between(25,120),between(50,160));}
  for(let i=0;i<260;i++){
    let z=between(-7300,-3300),x=between(-1600,1700),w=between(45,105),d=between(50,120),h=between(160,650),base=-1250;
    box(i%3?'dark':'steel',x,base+h/2,z,w,h,d);
    for(let j=0;j<25;j++)if(rand()>.4)box(lightKind(),x+between(-w*.42,w*.42),base+between(20,h-10),z+d/2+.8,2.5,2,.8);
  }
  // Facade machinery: vents, projecting service rooms, cooling stacks and duct runs.
  for(let row=0;row<15;row++){
    let y=-520+row*78;
    box('dark',-295+row%3*12,y,278,35,24,13);
    for(let slat=0;slat<5;slat++)box('edge',-295+row%3*12,y-8+slat*4,285,29,1,2);
    box('edge',-402,y+14,278,17,33,12);
    tube('edge',-398,y+44,283,3,35);
    box('rust',-249,y-12,277,26,45,7);
  }
  for(let row=0;row<11;row++){
    let y=-400+row*104;
    box('dark',308,y,-8,24,28,17);box('edge',308,y+17,-5,26,4,20);
    box('steel',286,y,-70,32,7,90);
  }

  function bridge(z,y,width=900,depth=35){
    box('dark',0,y,z,width,13,depth);box('edge',0,y+9,z,width,3,depth+4);
    for(let side of [-1,1]){
      box('edge',0,y+26,z+side*depth/2,width,2,2);
      box('edge',0,y-30,z+side*depth/2,width,4,3);
      for(let x=-width/2;x<width/2;x+=35){box('edge',x,y+19,z+side*depth/2,1.4,18,1.4);box('steel',x,y-14,z+side*depth/2,2,40,3,0,0,x%70===0?.6:-.6);}
      for(let x=-width/2+8;x<width/2;x+=42)box('amber',x,y+12,z+side*(depth/2+.6),4,1.4,1.2);
    }
    for(let x=-width/2;x<width/2;x+=95)box('black',x,y-55,z,5,80,8);
  }
  bridge(-1140,405,980,38);bridge(-3100,40,1700,45);bridge(-3800,320,1800,40);
  const cityDetail=window.MegacityDetail.addArchitecture({scene,box,tube,materials,random:rand,between});
  // Suspended service cables, rather than textures on an empty wall.
  const cableMaterial=new THREE.LineBasicMaterial({color:0x313a49});
  for(let k=0;k<8;k++){
    const points=[];let z=-200-k*470,y=350-k%3*120;
    for(let i=0;i<25;i++){let x=-350+i*30;points.push(new THREE.Vector3(x,y-Math.sin(i/24*Math.PI)*70,z));}
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),cableMaterial));
  }
  const dummy=new THREE.Object3D(),unitBox=new THREE.BoxGeometry(1,1,1),unitTube=new THREE.CylinderGeometry(1,1,1,10);
  function makeBatches(data,geometry){for(let [kind,list] of Object.entries(data)){let mesh=new THREE.InstancedMesh(geometry,materials[kind],list.length);const lit=!['amber','gold','blue','red'].includes(kind);for(let i=0;i<list.length;i++){let v=list[i];dummy.position.set(v[0],v[1],v[2]);dummy.scale.set(v[3],v[4],v[5]);dummy.rotation.set(v[6],v[7],v[8]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);if(lit){const tone=.78+.22*((Math.sin(v[0]*12.98+v[1]*.023+v[2]*78.23)*43758.5)%1+1)/2;mesh.setColorAt(i,new THREE.Color(tone,tone*.99,tone*.98));}}mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=lit&&['steel','concrete','dark','rust','ivory'].includes(kind);mesh.receiveShadow=lit;scene.add(mesh);}}
  makeBatches(boxes,unitBox);makeBatches(tubes,unitTube);

  const banners=[];
  function banner(x,y,z,width,height,rotation=0){
    const c=document.createElement('canvas');c.width=128;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#934f4d';ctx.fillRect(0,0,128,512);ctx.strokeStyle='#e1b4a2';ctx.lineWidth=5;ctx.beginPath();ctx.arc(64,150,29,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#e1b4a2';ctx.fillRect(42,140,44,8);ctx.fillRect(60,120,8,59);ctx.font='bold 15px Arial';ctx.textAlign='center';ctx.fillText('07',64,230);for(let i=0;i<1100;i++){ctx.fillStyle=rand()>.5?'rgba(34,39,49,.07)':'rgba(238,194,159,.08)';ctx.fillRect(rand()*128,rand()*512,between(1,6),between(1,20));}
    const texture=new THREE.CanvasTexture(c);texture.encoding=THREE.sRGBEncoding;const geo=new THREE.PlaneGeometry(width,height,4,18),mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:texture,roughness:1,side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;scene.add(mesh);banners.push({mesh,base:geo.attributes.position.array.slice(),phase:rand()*5});
  }
  banner(-360,295,272,63,410);banner(-214,75,150,45,290,Math.PI/2);banner(298,190,-730,58,370,Math.PI/2);banner(-291,360,-1199,48,330);
  function sign(text,x,y,z,w,h,rotation=0){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#202c3a';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#bc8871';ctx.lineWidth=3;ctx.strokeRect(4,4,504,120);ctx.fillStyle='#ffcf9b';ctx.font='500 40px monospace';ctx.textAlign='center';ctx.fillText(text,256,77);const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;scene.add(mesh);}
  sign('TRANSIT / 07',-320,105,274,112,28);sign('ORBITAL',-213,-175,180,80,20,Math.PI/2);sign('NORTH PORT',274,225,-740,95,24,-Math.PI/2);sign('SKYLINE',-330,115,-1208,110,27);

  // Air traffic uses instanced bodies, wings and lights: dozens of independent vehicles, three draw calls.
  const trafficCount=innerWidth<700?38:62,trafficData=[];
  const trafficBody=new THREE.InstancedMesh(new THREE.SphereGeometry(1,9,6),new THREE.MeshStandardMaterial({color:0x53687b,metalness:.6,roughness:.4}),trafficCount);
  const trafficWing=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,5),materials.edge,trafficCount);
  const trafficCabin=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,5),new THREE.MeshStandardMaterial({color:0x182c3e,metalness:.6,roughness:.23}),trafficCount);
  const trafficLights=new THREE.InstancedMesh(unitBox,materials.amber,trafficCount);
  for(let i=0;i<trafficCount;i++)trafficData.push({x:between(-1500,1500),y:between(-250,600),z:between(-5100,400),speed:between(12,34)*(i%2?1:-1),scale:between(.55,1.5),phase:rand()*7});
  scene.add(trafficBody,trafficWing,trafficCabin,trafficLights);
  for(const mesh of [trafficBody,trafficWing,trafficCabin,trafficLights])mesh.frustumCulled=false;
  const carrier=new THREE.Group();const carrierMaterial=new THREE.MeshStandardMaterial({color:0x59657c,metalness:.6,roughness:.5});
  const hull=new THREE.Mesh(new THREE.SphereGeometry(1,20,10),carrierMaterial);hull.scale.set(110,18,32);carrier.add(hull);
  const deck=new THREE.Mesh(new THREE.BoxGeometry(135,12,55),materials.dark);deck.position.y=-14;carrier.add(deck);
  for(let side of [-1,1]){let engine=new THREE.Mesh(new THREE.CylinderGeometry(8,8,95,10),carrierMaterial);engine.rotation.z=Math.PI/2;engine.position.set(-20,-13,side*42);carrier.add(engine);let light=new THREE.Mesh(new THREE.BoxGeometry(7,2,2),materials.gold);light.position.set(-66,-13,side*42);carrier.add(light);}
  carrier.position.set(420,680,-2570);scene.add(carrier);

  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(165,255,760),new THREE.Vector3(145,170,220),new THREE.Vector3(45,106,-380),new THREE.Vector3(-45,160,-1140),new THREE.Vector3(100,325,-1930)]);
  const sightline=new THREE.CatmullRomCurve3([new THREE.Vector3(-130,118,-650),new THREE.Vector3(-100,75,-1120),new THREE.Vector3(50,110,-1700),new THREE.Vector3(70,240,-2600),new THREE.Vector3(70,420,-3550)]);
  const pointer={x:0,y:0},look={x:0,y:0},drag={active:false,x:0,yaw:0,shownYaw:0};let raw=0,smooth=0,frame=0,last=performance.now(),averageFrame=.016;
  const progressBar=document.getElementById('progress'),sector=document.getElementById('sector'),altitude=document.getElementById('altitude'),chapterLinks=[...document.querySelectorAll('.chapter-nav a')];
  const names=['THE ARRIVAL','THE VERTICAL CITY','THE CROSSING','THE HORIZON'];
  function onScroll(){raw=capture?clamp(Number(new URLSearchParams(location.search).get('pose'))||0):clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));}
  addEventListener('scroll',onScroll,{passive:true});onScroll();if(capture)smooth=raw;
  addEventListener('pointermove',event=>{pointer.x=event.clientX/innerWidth*2-1;pointer.y=event.clientY/innerHeight*2-1;},{passive:true});
  const canvas=document.getElementById('city');
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag.active=true;drag.x=e.clientX;canvas.setPointerCapture(e.pointerId);canvas.classList.add('is-dragging');});
  canvas.addEventListener('pointermove',e=>{if(drag.active&&!reduced){drag.yaw=clamp(drag.yaw-(e.clientX-drag.x)*.0025,-1.05,1.05);drag.x=e.clientX;}});
  function endDrag(){drag.active=false;canvas.classList.remove('is-dragging');}
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
  canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();if(!reduced)drag.yaw=clamp(drag.yaw+(e.key==='ArrowLeft'?.1:-.1),-1.05,1.05);}});
  const cinema=window.MegacityDetail.cinematicPass(renderer,scene,camera);
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?63:55;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.15:1.5));renderer.setSize(innerWidth,innerHeight);cinema.resize();onScroll();});
  const modeButton=document.getElementById('scene-mode');
  function setWorldMode(active){document.body.classList.toggle('scene-only',active);modeButton.setAttribute('aria-pressed',String(active));modeButton.innerHTML=active?'Return to story <span>↙</span>':'View world <span>↗</span>';}
  modeButton.addEventListener('click',()=>setWorldMode(!document.body.classList.contains('scene-only')));
  addEventListener('keydown',e=>{if(e.key==='Escape'){setWorldMode(false);drag.yaw=0;}});
  addEventListener('pointerout',e=>{if(!e.relatedTarget){pointer.x=0;pointer.y=0;}});
  function instance(mesh,index,x,y,z,sx,sy,sz,rotation=0){dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(0,rotation,0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);}
  function render(now){
    const actualDelta=Math.max(.001,(now-last)/1000),dt=Math.min(actualDelta,.05),time=reduced?0:capture?18:now*.001;last=now;averageFrame=averageFrame*.97+actualDelta*.03;
    smooth=clamp(smooth+(raw-smooth)*(reduced?1:1-Math.exp(-dt*5)));look.x+=(pointer.x-look.x)*(1-Math.exp(-dt*3));look.y+=(pointer.y-look.y)*(1-Math.exp(-dt*3));
    const position=path.getPoint(smooth),target=sightline.getPoint(smooth);camera.position.copy(position);if(innerWidth<700){camera.position.z+=200;camera.position.x-=20;target.x-=10;}if(!reduced&&!capture){camera.position.x+=look.x*15;camera.position.y-=look.y*8;target.x+=look.x*70;target.y-=look.y*42;drag.shownYaw+=(drag.yaw-drag.shownYaw)*(1-Math.exp(-dt*6));const direction=target.clone().sub(camera.position).applyAxisAngle(new THREE.Vector3(0,1,0),drag.shownYaw);target.copy(camera.position).add(direction);}camera.lookAt(target);sky.position.copy(camera.position);
    sunset.position.copy(position).add(new THREE.Vector3(1600,1400,900));sunset.target.position.copy(position).add(new THREE.Vector3(-80,-100,-700));
    cityDetail.update(time);
    for(let i=0;i<trafficData.length;i++){const v=trafficData[i],x=((v.x+time*v.speed+1800)%3600+3600)%3600-1800,y=v.y+Math.sin(time*.3+v.phase)*5,s=v.scale,rotation=v.speed>0?0:Math.PI;instance(trafficBody,i,x,y,v.z,9*s,1.7*s,2.8*s,rotation);instance(trafficWing,i,x-2*s,y-.6*s,v.z,3.5*s,.45*s,7*s,rotation);instance(trafficCabin,i,x+(v.speed>0?1.5:-1.5)*s,y+1.1*s,v.z,3.2*s,1.2*s,2*s,rotation);instance(trafficLights,i,x+(v.speed>0?-8:8)*s,y-.5*s,v.z,1.2*s,.6*s,2*s);}
    trafficBody.instanceMatrix.needsUpdate=trafficWing.instanceMatrix.needsUpdate=trafficCabin.instanceMatrix.needsUpdate=trafficLights.instanceMatrix.needsUpdate=true;
    carrier.position.x=420+Math.sin(time*.04)*180;carrier.position.y=680+Math.sin(time*.2)*3;
    for(let b of banners){let p=b.mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const bx=b.base[i*3],by=b.base[i*3+1],fraction=.5-by/(b.mesh.geometry.parameters.height);p.setZ(i,Math.sin(time*.6+by*.026+b.phase)*fraction*4+Math.sin(bx*.08+time*.5)*fraction*2);}p.needsUpdate=true;}
    if(frame%5===0){const active=Math.min(3,Math.floor(smooth*4));sector.textContent=`SECTOR 0${active+1} / ${names[active]}`;progressBar.style.width=`${smooth*100}%`;altitude.textContent=`ALT ${Math.round((position.y+720)*1.3)} M`;chapterLinks.forEach((link,i)=>link.setAttribute('aria-current',String(i===active)));}
    cinema.render(time);if(++frame===3){document.getElementById('opening').dataset.ready='true';document.body.dataset.ready='true';}if(frame%90===0){document.body.dataset.renderStats=JSON.stringify({...cinema.getStats(),fps:Math.round(1/averageFrame)});document.body.dataset.cameraYaw=drag.shownYaw.toFixed(3);}requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
