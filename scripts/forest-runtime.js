// Runs inside the authored Sylva renderer. Keep its hero and living moss shaders.
var forestSun, forest, guide, guideHalo, guideLight, guideMotes=[], grove=[], insects=[], travel=0, forestReady=false, forestFloor=0;
function trailX(z){return Math.sin(z/2400)*W*0.16;}
function forestTexture(){
  var c=document.createElement('canvas');c.width=128;c.height=512;
  var ctx=c.getContext('2d');ctx.fillStyle='#403e2b';ctx.fillRect(0,0,128,512);
  for(var i=0;i<1600;i++){var v=20+Math.random()*55;ctx.strokeStyle='rgba('+v+','+(v+5)+','+Math.floor(v*.65)+',.65)';ctx.lineWidth=1+Math.random()*3;ctx.beginPath();var x=Math.random()*128,y=Math.random()*512;ctx.moveTo(x,y);ctx.bezierCurveTo(x+7,y+20,x-6,y+40,x+2,y+70);ctx.stroke();}
  var tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(3,4);return tex;
}
function initGrove(){
  forest=new THREE.Group();scene.add(forest);forestFloor=-H*.68;
  var ambient=new THREE.HemisphereLight(0xb8d2ac,0x26321b,.95);forest.add(ambient);
  var sun=new THREE.DirectionalLight(0xffebbd,1.35);sun.position.set(-1600,2600,900);forest.add(sun);forestSun=sun;scene.add(sun.target);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-2200;sun.shadow.camera.right=2200;sun.shadow.camera.top=2200;sun.shadow.camera.bottom=-2200;sun.shadow.camera.near=10;sun.shadow.camera.far=6500;sun.shadow.bias=-.001;
  var bark=new THREE.MeshStandardMaterial({color:0x77765a,map:forestTexture(),roughness:1});
  var lc=document.createElement('canvas');lc.width=128;lc.height=256;var lctx=lc.getContext('2d');
  var grad=lctx.createLinearGradient(0,0,128,0);grad.addColorStop(0,'#18351b');grad.addColorStop(.5,'#719645');grad.addColorStop(1,'#264d22');lctx.fillStyle=grad;lctx.beginPath();lctx.moveTo(64,0);lctx.bezierCurveTo(150,90,120,195,64,256);lctx.bezierCurveTo(5,190,-15,90,64,0);lctx.fill();lctx.strokeStyle='#a4b16b';lctx.lineWidth=1.4;lctx.beginPath();lctx.moveTo(64,5);lctx.lineTo(64,248);lctx.stroke();lctx.strokeStyle='#92a56280';for(var v=25;v<235;v+=22){lctx.beginPath();lctx.moveTo(64,v+20);lctx.lineTo(20,v-10);lctx.moveTo(64,v+20);lctx.lineTo(108,v-10);lctx.stroke();}
  var leafTexture=new THREE.CanvasTexture(lc);
  var leafMat=new THREE.MeshStandardMaterial({map:leafTexture,alphaTest:.45,roughness:.9,side:THREE.DoubleSide,color:0x8ba16a});
  var rockMat=new THREE.MeshStandardMaterial({color:0x24351b,map:forestTexture(),roughness:1,bumpMap:forestTexture(),bumpScale:6});
  var groundGeo=new THREE.PlaneGeometry(14000,18000,70,100);groundGeo.rotateX(-Math.PI/2);
  var pos=groundGeo.attributes.position;
  for(var g=0;g<pos.count;g++){var gx=pos.getX(g),gz=pos.getZ(g)-6000;pos.setY(g,Math.sin(gx*.009)*Math.cos(gz*.006)*22+Math.sin(gx*.003+gz*.002)*30);}
  groundGeo.computeVertexNormals();
  var gc=document.createElement('canvas');gc.width=gc.height=1024;var gctx=gc.getContext('2d'),img=gctx.createImageData(1024,1024);
  for(var py=0;py<1024;py++)for(var px=0;px<1024;px++){var wx=(px/1024-.5)*14000,wz=(py/1024-.5)*18000-6000,edge=Math.abs(wx-trailX(wz)),path=Math.max(0,1-edge/280),grain=Math.random(),patches=(Math.sin(wx*.012)*Math.sin(wz*.008)+1)*.5,idx=(py*1024+px)*4;img.data[idx]=25+patches*20+grain*20+path*25;img.data[idx+1]=40+patches*28+grain*23+path*8;img.data[idx+2]=15+patches*10+grain*12+path*15;img.data[idx+3]=255;}gctx.putImageData(img,0,0);
  var groundTexture=new THREE.CanvasTexture(gc);var groundMat=new THREE.MeshStandardMaterial({map:groundTexture,roughness:1,bumpMap:groundTexture,bumpScale:12,color:0x9b9c7b});
  var ground=new THREE.Mesh(groundGeo,groundMat);ground.position.set(0,forestFloor,-6000);ground.receiveShadow=true;forest.add(ground);
  var cylinder=new THREE.CylinderGeometry(.65,1,1,9,5), rockGeo=new THREE.IcosahedronGeometry(1,2);
  var leaves=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,2),leafMat,8000), matrix=new THREE.Object3D(), li=0;
  for(var i=0;i<90;i++){
    var z=800-i*140,side=i%2?1:-1,tx=trailX(z)+side*(W*.68+Math.random()*1700),height=H*(2.4+Math.random()*2),radius=30+Math.random()*65;
    var trunk=new THREE.Mesh(cylinder,bark);trunk.position.set(tx,forestFloor+height/2,z);trunk.scale.set(radius,height,radius);trunk.rotation.z=side*(.02+Math.random()*.06);trunk.castShadow=true;trunk.receiveShadow=true;forest.add(trunk);
    for(var j=0;j<3;j++){
      var limb=new THREE.Mesh(cylinder,bark);limb.position.set(tx-side*140,forestFloor+height*(.55+j*.13),z);limb.scale.set(radius*.35,430,radius*.35);limb.rotation.z=side*.95;limb.castShadow=true;forest.add(limb);
    }
    for(var j=0;j<80 && li<8000;j++){
      matrix.position.set(tx+(Math.random()-.5)*1000,forestFloor+height*(.63+Math.random()*.35),z+(Math.random()-.5)*850);
      matrix.scale.set(35+Math.random()*55,35+Math.random()*65,1);matrix.rotation.set(-Math.PI*.25+Math.random(),Math.random()*6,Math.random()*3);matrix.updateMatrix();leaves.setMatrixAt(li++,matrix.matrix);
    }
    var rock=new THREE.Mesh(rockGeo,rockMat);rock.position.set(trailX(z)+side*(W*.40+Math.random()*400),forestFloor+20,z);rock.scale.set(80+Math.random()*100,45+Math.random()*70,90+Math.random()*80);forest.add(rock);
  }
  leaves.count=li;leaves.castShadow=true;forest.add(leaves);
  var understory=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,2),leafMat,6500);
  for(var f=0;f<6500;f++){var fz=1200-Math.random()*13000,fx=trailX(fz)+(Math.random()<.5?-1:1)*(190+Math.random()*2000);matrix.position.set(fx,forestFloor+25+Math.random()*60,fz);matrix.scale.set(12+Math.random()*30,25+Math.random()*65,1);matrix.rotation.set(-.6+Math.random(),Math.random()*6,Math.random()-.5);matrix.updateMatrix();understory.setMatrixAt(f,matrix.matrix);}forest.add(understory);

  // Grounded moss arches, always upright; never a repeated upside-down ceiling.
  for(var n=0;n<5;n++){
    var root=nearGroup.clone(true),brush={value:new THREE.Vector3(9999,9999,9999)};
    root.traverse(function(o){if(o.material&&o.material.uniforms){var original=o.material;o.material=original.clone();o.material.uniforms=Object.assign({},original.uniforms,{uMouse:brush,uFog:{value:.15}});}});
    forest.add(root);grove.push({root:root,brush:brush,index:n});
  }
  // Recognisable dragonflies: segmented abdomen, compound eyes, four veined wings.
  var insectGeo=new THREE.SphereGeometry(1,12,8);
  function part(group,color,x,y,z,sx,sy,sz){var m=new THREE.Mesh(insectGeo,new THREE.MeshStandardMaterial({color:color,roughness:.45}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);group.add(m);return m;}
  var wingCanvas=document.createElement('canvas');wingCanvas.width=256;wingCanvas.height=64;var cx=wingCanvas.getContext('2d');cx.clearRect(0,0,256,64);cx.fillStyle='rgba(210,232,218,.5)';cx.beginPath();cx.ellipse(128,32,125,28,0,0,Math.PI*2);cx.fill();cx.strokeStyle='rgba(65,93,75,.65)';cx.lineWidth=1;for(var q=0;q<15;q++){cx.beginPath();cx.moveTo(0,32);cx.lineTo(q*18,4+q%3*10);cx.lineTo(q*18+16,55);cx.stroke();}var wingTex=new THREE.CanvasTexture(wingCanvas);
  var wingMat=new THREE.MeshBasicMaterial({map:wingTex,transparent:true,side:THREE.DoubleSide,depthWrite:false});
  for(var b=0;b<4;b++){
    var bug=new THREE.Group(),wings=[];
    for(var a=0;a<9;a++)part(bug,a%2?0x254e42:0x509f8c,0,0,8+a*3,2.6-a*.19,2.2-a*.15,2);
    part(bug,0x486b42,0,0,3,4,3,6);part(bug,0x233b2c,0,0,-4,3,3,3);
    part(bug,0x6bb6a5,-2.5,1,-5,2.2,2.2,2);part(bug,0x6bb6a5,2.5,1,-5,2.2,2.2,2);
    for(var w=0;w<4;w++){var pivot=new THREE.Group(),wing=new THREE.Mesh(new THREE.PlaneGeometry(27,8),wingMat);wing.rotation.x=-Math.PI/2;wing.position.x=(w%2?1:-1)*14;pivot.position.z=w<2?1:8;pivot.add(wing);bug.add(pivot);wings.push(pivot);}
    forest.add(bug);insects.push({group:bug,wings:wings,seed:b*2.4});
  }
  // A ladybird on the near moss, with a split red shell and black spots.
  var lady=new THREE.Group();part(lady,0x171b12,0,0,0,8,3,11);part(lady,0xb82b18,0,2,1,8,5,9);part(lady,0x171b12,0,1,-9,5,3,4);
  for(var sp=0;sp<6;sp++)part(lady,0x161b12,(sp%2?1:-1)*4,6,Math.floor(sp/2)*5-4,1.7,.6,1.7);
  for(var leg=0;leg<6;leg++){var l=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,9,4),new THREE.MeshBasicMaterial({color:0x202416}));l.position.set(leg%2?8:-8,-1,Math.floor(leg/2)*5-5);l.rotation.z=leg%2?1:-1;lady.add(l);}forest.add(lady);insects.push({group:lady,seed:4,lady:true});
  // One warm light leads the visitor through the trail and gathers fireflies.
  guide=new THREE.Group();
  var glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
  var gg=glowCanvas.getContext('2d'),gradient=gg.createRadialGradient(64,64,1,64,64,64);
  gradient.addColorStop(0,'rgba(255,252,193,1)');gradient.addColorStop(.16,'rgba(255,216,116,.7)');gradient.addColorStop(.45,'rgba(239,197,96,.22)');gradient.addColorStop(1,'rgba(239,197,96,0)');
  gg.fillStyle=gradient;gg.fillRect(0,0,128,128);
  var glowTexture=new THREE.CanvasTexture(glowCanvas);
  var glowMaterial=new THREE.SpriteMaterial({map:glowTexture,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
  guideHalo=new THREE.Sprite(glowMaterial);guideHalo.scale.set(260,260,1);guide.add(guideHalo);
  var core=new THREE.Mesh(new THREE.SphereGeometry(9,16,12),new THREE.MeshBasicMaterial({color:0xffe8ad}));guide.add(core);
  guideLight=new THREE.PointLight(0xffd782,1.2,850,2);guide.add(guideLight);
  for(var spark=0;spark<18;spark++){var mote=new THREE.Sprite(glowMaterial.clone());mote.scale.set(30,30,1);guide.add(mote);guideMotes.push(mote);}
  forest.add(guide);
  forestReady=true;
}
function updateGrove(dt){
  if(!forestReady)initGrove();
  var desired=Math.max(0,Math.min(1,window.__studioDepth||0));travel+=(desired-travel)*(REDUCED?1:1-Math.exp(-dt*4));
  var point=window.__studioPointer;if(point){pointer.x=point.x;pointer.y=point.y;ndc.x=point.x;ndc.y=-point.y;}
  var journey=travel*8000,blend=Math.min(1,travel*16),pz=DIST-journey;
  camera.position.set(trailX(-journey)*blend-smooth.x*W*.055,Math.sin(travel*12)*H*.025,pz);
  forestSun.position.set(trailX(-journey)-1600,2600,pz+900);forestSun.target.position.set(trailX(-journey),forestFloor,pz-1000);
  forestSun.intensity=1.05+Math.max(0,Math.min(1,(travel-.55)*3))*.95;
  camera.lookAt(trailX(-journey-1100)*blend+smooth.x*W*.20,-H*.07-smooth.y*H*.13,pz-DIST);
  forest.visible=travel>.003;journeyNear.visible=journeyFar.visible=false;
  nearGroup.visible=travel<.23;farGroup.visible=travel<.25;
  document.querySelector('.hero').style.backgroundColor='#263b2b';
  if(!scene.fog)scene.fog=new THREE.FogExp2(0x435440,0);scene.fog.density=(.00027-Math.max(0,travel-.6)*.0002)*blend;
  for(var i=0;i<grove.length;i++){
    var item=grove[i],r=item.root,z=-900-i*1700,side=i%2?1:-1;
    r.scale.copy(nearGroup.scale).multiplyScalar(1.1);
    r.position.set(trailX(z)+side*W*.78,forestFloor-H*.5,z);r.rotation.set(0,side*.45,0);
    var ahead=pz-z;r.visible=ahead>-650&&ahead<4000;
    if(r.visible&&!REDUCED&&ndc.x<2){r.updateMatrixWorld(true);raycaster.setFromCamera(ndc,camera);var plane=new THREE.Plane(new THREE.Vector3(0,0,1),-z);if(raycaster.ray.intersectPlane(plane,tmpLocal)){r.worldToLocal(tmpLocal);item.brush.value.lerp(tmpLocal,.2);}}
  }
  var t=uTime.value;
  guide.visible=travel>.035&&travel<.84;
  if(guide.visible){
    var phase=Math.max(0,Math.min(1,travel*1.5));
    guide.position.set(trailX(-journey-1200)+Math.sin(t*.6)*W*.13,-H*.10+Math.sin(t*1.4)*H*.10,pz-1150);
    guideHalo.material.opacity=.66+Math.sin(t*2)*.12;
    guideLight.intensity=.7+phase*.9;
    for(var m=0;m<guideMotes.length;m++){
      var a=m*2.399+Math.sin(t*.5+m)*.45,rad=65+(m%5)*28;
      guideMotes[m].position.set(Math.sin(a+t*.35)*rad,Math.cos(a*.7+t*.48)*rad*.65,Math.sin(a*1.7)*70);
      guideMotes[m].material.opacity=.28+Math.sin(t*2+m)*.16;
    }
  }
  insects.forEach(function(b,i){var s=b.seed;b.group.visible=travel>.015;b.group.scale.setScalar(b.lady?1.6:1.5);
    if(b.lady){b.group.position.set(trailX(-1800)+W*.4,forestFloor+100,-1800);b.group.rotation.y=Math.sin(t*.2)*.3;return;}
    b.group.position.set(trailX(-journey)+Math.sin(t*.19+s)*W*.38,-H*.1+Math.sin(t*.3+s)*H*.23,pz-650-i*320+Math.cos(t*.25+s)*140);
    b.group.rotation.set(.08,Math.sin(t*.19+s)*.8,Math.sin(t*.3+s)*.12);b.wings.forEach(function(w,k){w.rotation.z=REDUCED?0:Math.sin(t*65+s)*(k%2?1:-1)*.28;});
  });
  shadowMesh.visible=glowMesh.visible=travel<.12;
}
