// The authored moss remains the landscape. This extension adds water, not a forest.
var ocean, oceanReady=false, oceanTravel=0, oceanRoots=[], seaFronds, oceanFloor, seaFloorMaterial;
var oceanFish=[], oceanJellies=[], oceanBubbles, oceanBubbleData=[], oceanLight;
var oceanTime={value:0}, oceanCamera={value:0};
function oceanPath(z){return Math.sin(z/2500)*W*.12;}
function initUnderwater(){
  ocean=new THREE.Group();scene.add(ocean);
  // Keep the canvas transparent: the authored glass card sits behind the moss.
  scene.background=null;
  scene.fog=new THREE.FogExp2(0x082d38,.00022);
  renderer.shadowMap.enabled=false;
  ocean.add(new THREE.HemisphereLight(0x99ded8,0x06272d,1.1));
  oceanLight=new THREE.DirectionalLight(0xbaf4df,1.2);oceanLight.position.set(-700,1800,1000);ocean.add(oceanLight);ocean.add(oceanLight.target);
  [nearGroup,farGroup].forEach(function(root){root.traverse(function(o){if(o.material&&o.material.uniforms){var u=o.material.uniforms;if(u.uHazeCol)u.uHazeCol.value.set(0x1a5754);if(u.uHaze)u.uHaze.value=.12;}});});
  // A continuous seabed. Animated caustics are lit into the sand, with depth haze.
  seaFloorMaterial=new THREE.ShaderMaterial({uniforms:{uTime:oceanTime},vertexShader:`
    varying vec2 vWorld;varying float vDepth;
    void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xz;vec4 mv=viewMatrix*world;vDepth=-mv.z;gl_Position=projectionMatrix*mv;}
  `,fragmentShader:`
    uniform float uTime;varying vec2 vWorld;varying float vDepth;
    float noise(vec2 p){return sin(p.x*.83+sin(p.y*.79))*sin(p.y*.65+cos(p.x*.46));}
    void main(){vec2 p=vWorld*.009;float caustic=0.;
      for(int i=0;i<3;i++){float f=float(i);vec2 q=p*(1.+f*.31)+vec2(uTime*.12,-uTime*.09)*(f*.2+1.);float n=sin(q.x+sin(q.y+uTime*.2))*.5+sin(q.y+cos(q.x-uTime*.14))*.5;caustic+=pow(max(0.,1.-abs(n)),16.)*.19;}
      float grain=noise(vWorld*.027)*.025+noise(vWorld*.004)*.04;
      vec3 sand=vec3(.12,.24,.22)+grain+vec3(.12,.23,.19)*caustic;
      float fog=1.-exp(-vDepth*vDepth*.00000009);gl_FragColor=vec4(mix(sand,vec3(.031,.176,.22),clamp(fog,0.,1.)),1.);
    }`});
  var floorGeometry=new THREE.PlaneGeometry(18000,24000,45,70);floorGeometry.rotateX(-Math.PI/2);
  var floorPositions=floorGeometry.attributes.position;
  for(var i=0;i<floorPositions.count;i++){var x=floorPositions.getX(i),z=floorPositions.getZ(i);floorPositions.setY(i,Math.sin(x*.003+z*.002)*35+Math.sin(z*.008)*9);}
  floorGeometry.computeVertexNormals();oceanFloor=new THREE.Mesh(floorGeometry,seaFloorMaterial);oceanFloor.position.set(0,-H*.78,-10000);ocean.add(oceanFloor);
  // Swaying ribbon fronds, distributed as underwater meadows rather than tree trunks.
  var frondGeometry=new THREE.PlaneGeometry(1,1,1,9);frondGeometry.translate(0,.5,0);
  var frondMaterial=new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{uTime:oceanTime},vertexShader:`
    uniform float uTime;varying vec2 vUv;varying float vDepth;
    void main(){vUv=uv;vec3 p=position;vec4 base=instanceMatrix*vec4(0.,0.,0.,1.);float phase=base.x*.007+base.z*.003;
      p.x+=sin(uTime*.7+phase+p.y*2.)*p.y*p.y*1.2;
      vec4 mv=modelViewMatrix*instanceMatrix*vec4(p,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}
  `,fragmentShader:`
    varying vec2 vUv;varying float vDepth;
    void main(){float width=sin(vUv.y*3.14159)*.47+.015;if(abs(vUv.x-.5)>width)discard;
      vec3 col=mix(vec3(.03,.16,.15),vec3(.10,.35,.25),vUv.y);col+=pow(1.-abs(vUv.x-.5)*2.,10.)*.035;
      float fog=1.-exp(-vDepth*vDepth*.00000010);gl_FragColor=vec4(mix(col,vec3(.031,.176,.22),fog),1.);}
  `});
  var count=NARROW.matches?650:1200;seaFronds=new THREE.InstancedMesh(frondGeometry,frondMaterial,count);var transform=new THREE.Object3D();
  for(var f=0;f<count;f++){var z=900-Math.random()*16000,side=f%2?1:-1;transform.position.set(oceanPath(z)+side*(W*.38+Math.random()*W*1.8),-H*.78+Math.random()*22,z);transform.scale.set(10+Math.random()*24,100+Math.random()*320,1);transform.rotation.set(0,Math.random()*Math.PI,.28*(Math.random()-.5));transform.updateMatrix();seaFronds.setMatrixAt(f,transform.matrix);}ocean.add(seaFronds);
  // Reuse the exact moss geometry and shaders through the whole submerged valley.
  for(var r=0;r<10;r++){
    var root=(r%3===1?farGroup:nearGroup).clone(true),brush={value:new THREE.Vector3(9999,9999,9999)},alpha={value:1};
    root.traverse(function(object){if(object.material&&object.material.uniforms){var original=object.material;object.material=original.clone();object.material.uniforms=Object.assign({},original.uniforms,{uMouse:brush,uAlpha:alpha,uHazeCol:{value:new THREE.Color(0x16484b)},uHaze:{value:.2},uFog:{value:.12}});object.material.transparent=true;}});
    ocean.add(root);oceanRoots.push({root:root,brush:brush,alpha:alpha,z:-1000-r*1450,index:r});
  }
  // Silver fish with a flattened body, tail, dorsal fin, and small eyes.
  var bodyGeo=new THREE.SphereGeometry(1,14,9),tailGeo=new THREE.BufferGeometry();
  tailGeo.setAttribute('position',new THREE.Float32BufferAttribute([-1,0,0,-2,.7,0,-2,-.7,0],3));tailGeo.computeVertexNormals();
  var finGeo=new THREE.BufferGeometry();finGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.3,.2,0,.4,.2,0,-.15,.8,0],3));finGeo.computeVertexNormals();
  for(var k=0;k<(NARROW.matches?9:16);k++){
    var fish=new THREE.Group(),silver=new THREE.MeshStandardMaterial({color:k%5===0?0x477f79:0x376971,metalness:.25,roughness:.5});
    var body=new THREE.Mesh(bodyGeo,silver);body.scale.set(24,9,6);fish.add(body);
    var tail=new THREE.Mesh(tailGeo,new THREE.MeshStandardMaterial({color:0x4f8a85,side:THREE.DoubleSide,roughness:.6}));tail.scale.setScalar(18);fish.add(tail);
    var fin=new THREE.Mesh(finGeo,silver);fin.scale.setScalar(20);fish.add(fin);
    var eyeMaterial=new THREE.MeshBasicMaterial({color:0x06252c});
    [-1,1].forEach(function(side){var eye=new THREE.Mesh(bodyGeo,eyeMaterial);eye.scale.set(1.6,1.6,.8);eye.position.set(16,2,side*5);fish.add(eye);});
    fish.scale.setScalar(.35+Math.random()*.4);ocean.add(fish);oceanFish.push({group:fish,tail:tail,seed:k*1.71,school:k<8});
  }
  // Two translucent jellyfish drift in the middle distance, with soft tentacles.
  var jellyMaterial=new THREE.MeshPhongMaterial({color:0x91e8d4,emissive:0x1d5c61,transparent:true,opacity:.25,side:THREE.DoubleSide,shininess:70,depthWrite:false});
  for(var j=0;j<2;j++){
    var jelly=new THREE.Group();var dome=new THREE.Mesh(new THREE.SphereGeometry(27,24,14,0,Math.PI*2,0,Math.PI*.53),jellyMaterial);jelly.add(dome);
    var rim=new THREE.Mesh(new THREE.TorusGeometry(26,1,6,40),new THREE.MeshBasicMaterial({color:0x8ce2d4,transparent:true,opacity:.35,depthWrite:false}));rim.rotation.x=Math.PI/2;jelly.add(rim);
    var tentacles=[];for(var a=0;a<7;a++){var points=new Float32Array(15*3),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(points,3));var tentacle=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0x8fd9d3,transparent:true,opacity:.27,depthWrite:false}));jelly.add(tentacle);tentacles.push(tentacle);}
    ocean.add(jelly);oceanJellies.push({group:jelly,dome:dome,tentacles:tentacles,seed:j*3.2});
  }
  // Bubbles have a transparent centre and a lit rim, not opaque flying shapes.
  var bubbleCount=NARROW.matches?55:100,bubblePositions=new Float32Array(bubbleCount*3),bubbleSizes=new Float32Array(bubbleCount);
  for(var b=0;b<bubbleCount;b++){oceanBubbleData.push({x:(Math.random()-.5)*2.4,y:Math.random()*2-1,z:Math.random()*2500,speed:15+Math.random()*32,seed:Math.random()*6});bubbleSizes[b]=3+Math.random()*10;}
  var bubbleGeometry=new THREE.BufferGeometry();bubbleGeometry.setAttribute('position',new THREE.BufferAttribute(bubblePositions,3));bubbleGeometry.setAttribute('size',new THREE.BufferAttribute(bubbleSizes,1));
  oceanBubbles=new THREE.Points(bubbleGeometry,new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},vertexShader:`attribute float size;varying float vDepth;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_PointSize=clamp(size*700./max(100.,-mv.z),2.,19.);gl_Position=projectionMatrix*mv;}`,fragmentShader:`varying float vDepth;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);if(d>.48)discard;float rim=smoothstep(.29,.43,d)*(1.-smoothstep(.43,.49,d));float shine=exp(-dot(p-vec2(-.16,.19),p-vec2(-.16,.19))*180.);float a=(rim*.3+shine*.5)*exp(-vDepth*.00035);gl_FragColor=vec4(.65,.92,.91,a);}`}));
  oceanBubbles.frustumCulled=false;scene.add(oceanBubbles);
  shadowMesh.visible=glowMesh.visible=false;
  oceanReady=true;
}
function updateUnderwater(dt){
  if(!oceanReady)initUnderwater();
  var desired=Math.max(0,Math.min(1,window.__studioDepth||0));oceanTravel+=(desired-oceanTravel)*(REDUCED?1:1-Math.exp(-dt*3));
  var point=window.__studioPointer;if(point){pointer.x=point.x;pointer.y=point.y;ndc.x=point.x;ndc.y=-point.y;}
  var t=uTime.value,journey=oceanTravel*11200,pz=DIST-journey,blend=Math.min(1,oceanTravel*7);
  oceanTime.value=t;var drift=REDUCED?0:Math.sin(t*.22)*H*.008;
  camera.position.set(oceanPath(-journey)*blend-smooth.x*W*.045,drift-Math.sin(oceanTravel*Math.PI)*H*.10,pz);
  camera.lookAt(oceanPath(-journey-900)*blend+smooth.x*W*.12,-H*.035-smooth.y*H*.10,pz-DIST);
  oceanLight.position.set(camera.position.x-700,H*2,pz+300);oceanLight.target.position.set(camera.position.x,-H*.7,pz-1500);
  nearGroup.visible=oceanTravel<.095;farGroup.visible=oceanTravel<.12;journeyNear.visible=journeyFar.visible=false;
  nearGroup.userData.uni.uAlpha.value=1-Math.max(0,Math.min(1,(oceanTravel-.035)/.06));
  farGroup.userData.uni.uAlpha.value=1-Math.max(0,Math.min(1,(oceanTravel-.06)/.06));
  ocean.visible=true;shadowMesh.visible=glowMesh.visible=false;
  seaFronds.visible=oceanFloor.visible=oceanTravel>.006;
  scene.fog.density=.00018+oceanTravel*.000035;
  for(var r=0;r<oceanRoots.length;r++){
    var item=oceanRoots[r],root=item.root,side=r%2?1:-1,ahead=pz-item.z;
    root.scale.copy(nearGroup.scale).multiplyScalar(r%3===1?1.25:1.5);
    root.position.set(oceanPath(item.z)+side*W*(r%3===1?.95:.72),-H*.25,item.z);
    root.rotation.set(0,side*.24,side*.12+Math.sin(t*.16+r)*.008);
    root.visible=oceanTravel>.012&&ahead>550&&ahead<4600;
    item.alpha.value=Math.min(1,Math.max(0,(4600-ahead)/1800),Math.max(0,(ahead-550)/700))*Math.min(1,Math.max(0,(oceanTravel-.012)/.035));
    if(root.visible&&!REDUCED&&ndc.x<2){root.updateMatrixWorld(true);raycaster.setFromCamera(ndc,camera);var plane=new THREE.Plane(new THREE.Vector3(0,0,1),-item.z);if(raycaster.ray.intersectPlane(plane,tmpLocal)){root.worldToLocal(tmpLocal);item.brush.value.lerp(tmpLocal,.17);}}
  }
  oceanFish.forEach(function(f,i){var s=f.seed,school=f.school,rate=school?.13:.08;var x=Math.sin(t*rate+s)*(school?W*.65:W*1.1);f.group.position.set(camera.position.x+x,(school?H*.32:-H*.13)+Math.sin(t*.21+s)*(school?H*.07:H*.22),pz-(school?2000+i*46:1200+(i%5)*340));var direction=Math.cos(t*rate+s);f.group.rotation.y=direction>0?0:Math.PI;f.group.rotation.z=Math.sin(t*.3+s)*.08;f.tail.rotation.y=REDUCED?0:Math.sin(t*7+s)*.38;});
  oceanJellies.forEach(function(j,i){var s=j.seed;j.group.position.set(camera.position.x+(i?1:-1)*W*.58+Math.sin(t*.075+s)*W*.12,-H*.07+Math.sin(t*.15+s)*H*.12,pz-1800-i*650);j.group.scale.setScalar(.9+Math.sin(t*1.5+s)*.05);j.dome.scale.y=.85+Math.sin(t*1.5+s)*.12;j.tentacles.forEach(function(line,k){var p=line.geometry.attributes.position;for(var n=0;n<p.count;n++){var fraction=n/(p.count-1),angle=k/7*Math.PI*2;p.setXYZ(n,Math.cos(angle)*18+Math.sin(t*.7+fraction*3+k)*fraction*17,-fraction*(70+k%3*13),Math.sin(angle)*18+Math.cos(t*.6+fraction*2+k)*fraction*12);}p.needsUpdate=true;});});
  var positions=oceanBubbles.geometry.attributes.position;
  oceanBubbleData.forEach(function(b,i){var y=((b.y*H+t*b.speed)%(H*2)+H*2)%(H*2)-H;positions.setXYZ(i,camera.position.x+b.x*W+Math.sin(t*.23+b.seed)*24,y,pz-250-b.z);});positions.needsUpdate=true;
}
