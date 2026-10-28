/* Original procedural scene assets. No paid prompt or external model is loaded. */
(function () {
  'use strict';
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  function metalMaps(random) {
    const size = 512, color = document.createElement('canvas'), relief = document.createElement('canvas');
    color.width = color.height = relief.width = relief.height = size;
    const ctx = color.getContext('2d'), bump = relief.getContext('2d');
    ctx.fillStyle = '#a4a09a'; ctx.fillRect(0, 0, size, size);
    bump.fillStyle = '#808080'; bump.fillRect(0, 0, size, size);
    // Different scale plates, inset seams, rivets and vertical rain streaks.
    for (let row = 0; row < 8; row++) for (let col = 0; col < 4; col++) {
      const x = col * 128, y = row * 64, shade = 142 + Math.floor(random() * 47);
      ctx.fillStyle = `rgb(${shade + 5},${shade + 2},${shade})`; ctx.fillRect(x + 1, y + 1, 125, 61);
      ctx.strokeStyle = '#323940'; ctx.lineWidth = 1.5; ctx.strokeRect(x + .5, y + .5, 127, 63);
      bump.strokeStyle = '#262626'; bump.lineWidth = 2; bump.strokeRect(x, y, 128, 64);
      for (const dx of [5, 122]) for (const dy of [5, 58]) {
        ctx.fillStyle = '#55595b'; ctx.fillRect(x + dx, y + dy, 2, 2);
        bump.fillStyle = '#c2c2c2'; bump.fillRect(x + dx, y + dy, 2, 2);
      }
      if (random() > .74) { ctx.fillStyle = '#655957'; ctx.fillRect(x + 2, y + 2, 7, 59); }
      for (let k = 0; k < 8; k++) {
        const sx = x + random() * 127, length = random() * 57;
        const streak = ctx.createLinearGradient(0, y, 0, y + length + 6);
        streak.addColorStop(0, 'rgba(46,43,40,.22)'); streak.addColorStop(1, 'rgba(46,43,40,0)');
        ctx.fillStyle = streak; ctx.fillRect(sx, y + 2, 1 + random() * 3, length);
      }
    }
    const pixels = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const noise = (random() - .5) * 20;
      pixels.data[i] += noise; pixels.data[i + 1] += noise; pixels.data[i + 2] += noise;
    }
    ctx.putImageData(pixels, 0, 0);
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = random() > .5 ? 'rgba(60,45,34,.21)' : 'rgba(228,211,184,.26)';
      ctx.fillRect(random() * size, random() * size, random() * 4 + .5, random() * 2 + .4);
    }
    const map = new THREE.CanvasTexture(color), bumpMap = new THREE.CanvasTexture(relief);
    map.encoding = THREE.sRGBEncoding;
    map.anisotropy = bumpMap.anisotropy = 4;
    map.wrapS = map.wrapT = bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    return { map, bumpMap };
  }

  function roadTexture() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256;
    const ctx = c.getContext('2d'); ctx.fillStyle = '#373e48'; ctx.fillRect(0, 0, 512, 256);
    for (let x = 0; x < 512; x += 16) {
      ctx.strokeStyle = 'rgba(210,220,220,.035)'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    ctx.strokeStyle = '#a89c82'; ctx.lineWidth = 2;
    for (const y of [12, 244, 126, 130]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
    ctx.strokeStyle = '#abb0ac'; ctx.setLineDash([34, 37]); ctx.lineWidth = 2;
    for (const y of [68, 188]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
    const texture = new THREE.CanvasTexture(c); texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.anisotropy = 4;
    return texture;
  }

  function addArchitecture({ scene, box, tube, materials, random, between }) {
    const maps = metalMaps(random);
    function worldPanels(material) {
      material.onBeforeCompile = shader => {
        const varyings = 'varying vec3 cityPosition; varying vec3 cityNormal;\n';
        shader.vertexShader = varyings + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
          vec4 cp=vec4(transformed,1.); vec3 cn=objectNormal;
          #ifdef USE_INSTANCING
          cp=instanceMatrix*cp;cn=mat3(instanceMatrix)*cn;
          #endif
          cityPosition=(modelMatrix*cp).xyz;cityNormal=normalize(mat3(modelMatrix)*cn);`);
        shader.fragmentShader = varyings + `vec2 cityPanelUv(){vec3 n=abs(cityNormal);return (n.x>n.y&&n.x>n.z?cityPosition.zy:n.y>n.z?cityPosition.xz:cityPosition.xy)*.009;}\n` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', THREE.ShaderChunk.map_fragment.replace(/vUv/g, 'cityPanelUv()'));
        shader.fragmentShader = shader.fragmentShader.replace('#include <bumpmap_pars_fragment>', THREE.ShaderChunk.bumpmap_pars_fragment.replace(/vUv/g, 'cityPanelUv()'));
      };
      material.customProgramCacheKey = () => 'city-world-panels-v1';
    }
    for (const key of ['steel', 'concrete', 'dark', 'rust']) {
      materials[key].map = maps.map; materials[key].bumpMap = maps.bumpMap;
      materials[key].bumpScale = key === 'concrete' ? 1.2 : .65;
      materials[key].roughness = key === 'dark' ? .64 : .83;
      worldPanels(materials[key]);
    }
    materials.steel.color.setHex(0xb6b2ac); materials.concrete.color.setHex(0xa6a49e);
    materials.dark.color.setHex(0x536170); materials.rust.color.setHex(0xb37163);
    materials.edge.color.setHex(0x87939c);
    materials.asphalt = new THREE.MeshStandardMaterial({ color: 0xc1c5c4, map: roadTexture(), roughness: .88, metalness: .1 });
    materials.ivory = new THREE.MeshStandardMaterial({ color: 0xb5bcc4, map: maps.map, bumpMap: maps.bumpMap, bumpScale: .4, metalness: .35, roughness: .72 });
    worldPanels(materials.ivory);
    const roads = [], steam = [], unit = new THREE.Vector3(0, 1, 0);
    const beam = (a, b, width = 3, depth = width, kind = 'edge') => {
      const middle = a.clone().add(b).multiplyScalar(.5), delta = b.clone().sub(a);
      const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(unit, delta.clone().normalize()));
      box(kind, middle.x, middle.y, middle.z, width, delta.length(), depth, euler.x, euler.y, euler.z);
    };
    // Foreground arcology: an irregular structural skeleton rather than a solid slab.
    for (let level = 0; level < 17; level++) {
      const y = -570 + level * 77;
      box(level % 4 === 0 ? 'rust' : 'ivory', -323, y, 277, 212, 13, 19);
      box('black', -323, y - 10, 280, 199, 8, 9);
      for (let bay = 0; bay < 5; bay++) {
        const x = -416 + bay * 45;
        box('edge', x, y + 31, 289, 5, 61, 15);
        if ((bay + level) % 3 === 0) beam(V(x, y + 6, 299), V(x + 36, y + 58, 299), 3.4);
        if ((bay + level) % 2 === 0) {
          box('black', x + 21, y + 29, 290, 28, 34, 6);
          box('gold', x + 21, y + 41, 295, 22, 1.4, 1);
          for (let rib = 0; rib < 4; rib++) box('steel', x + 9 + rib * 8, y + 29, 296, 1, 29, 2);
        }
      }
      if (level % 2 === 0) {
        box('dark', -310, y - 8, 309, 180, 9, 53);
        for (let pole = 0; pole < 13; pole++) box('edge', -394 + pole * 14, y + 2, 336, .8, 14, .8);
        box('edge', -310, y + 9, 336, 181, 1, 1);
        box('amber', -309, y - 3, 336, 174, .8, 1);
      }
    }
    for (let i = 0; i < 12; i++) {
      const x = -417 + i * 17, height = 680 + (i % 4) * 120;
      tube(i % 3 === 0 ? 'rust' : 'edge', x, -100, 305 + (i % 3) * 4, 1.4 + i % 2, height);
      for (let j = 0; j < 8; j++) tube('black', x, -100 - height / 2 + j * height / 7, 305 + (i % 3) * 4, 3.1, 2);
    }
    // Large cantilever service station and exposed underside ribs.
    box('dark', -160, 441, 131, 360, 55, 110);
    box('ivory', -167, 470, 131, 345, 11, 118);
    box('rust', -154, 411, 131, 340, 7, 96);
    for (let rib = 0; rib < 21; rib++) {
      const x = -332 + rib * 17;
      box('edge', x, 430, 131, 3, 42, 114);
      box('black', x, 475, 131, 2, 3, 107);
      if (rib % 2 === 0) box('amber', x, 449, 188, 9, 2, 1);
    }
    for (let n = 0; n < 8; n++) {
      box(n % 3 ? 'steel' : 'rust', -298 + n * 39, 487, 132, 30, 21 + n % 3 * 9, 70);
      for (let slat = 0; slat < 7; slat++) box('black', -298 + n * 39, 489 + n % 3 * 4, 168 + slat * .2, 23, 1, 2);
    }
    for (let leg = 0; leg < 3; leg++) beam(V(-220, 403, 92 + leg * 38), V(-336, 240, 92 + leg * 38), 12, 10, 'steel');
    // Cooling machinery and dog-legged service pipes supply small-scale depth cues.
    for (let level = 0; level < 11; level++) {
      const y = -470 + level * 94, x = -366 + level % 3 * 43;
      tube('dark', x, y, 321, 12, 19, Math.PI / 2);
      tube('black', x, y, 333, 9.5, 2, Math.PI / 2);
      tube('edge', x, y, 336, 2, 4, Math.PI / 2);
      for (let blade = 0; blade < 5; blade++) {
        const angle = blade / 5 * Math.PI * 2;
        box('steel', x + Math.sin(angle) * 5, y + Math.cos(angle) * 5, 335, 3, 8, 1.1, 0, 0, -angle + .4);
      }
      const tankX = -240 - level % 2 * 17;
      tube('ivory', tankX, y + 10, 308, 6, 61);
      for (const dy of [-23, 21]) tube('dark', tankX, y + dy, 308, 7, 2);
      tube('rust', tankX, y + 48, 308, 1.5, 18);
      if (level % 2 === 0) {
        const route = new THREE.CatmullRomCurve3([V(-408, y - 21, 309), V(-408, y + 13, 309), V(-399, y + 22, 309), V(-323, y + 22, 309), V(-315, y + 31, 309), V(-315, y + 58, 309)]);
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(route, 32, 2.4, 7, false), materials.rust));
      }
    }
    for (let i = 0; i < 100; i++) {
      const x = between(-421, -223), y = between(-590, 685), w = between(7, 24), h = between(7, 16);
      box(i % 4 ? 'dark' : 'rust', x, y, 293, w, h, 6);
      for (let slat = 0; slat < 3; slat++) box('edge', x, y - h * .3 + slat * h * .3, 297, w * .8, .7, 1);
    }
    // Steel exoskeletons on the next set of towers, visible as the camera passes.
    for (const [x, z, face, height] of [[-370, -610, -479, 1200], [355, -850, -731, 1400], [-330, -1340, -1204, 1480], [390, -1600, -1458, 1270]]) {
      for (let level = 0; level < 11; level++) {
        const y = -600 + level * height / 11;
        box(level % 5 === 0 ? 'rust' : 'ivory', x, y, face, 188, 8, 10);
        for (const side of [-1, 1]) {
          beam(V(x + side * 88, y, face + 9), V(x - side * 88, y + height / 11, face + 9), 3, 3, 'dark');
          tube('edge', x + side * 96, y + height / 22, face + 7, 2.6, height / 11);
        }
      }
    }

    function road(points, width) {
      const curve = new THREE.CatmullRomCurve3(points.map(p => V(...p))), length = curve.getLength(), steps = 160;
      const vertices = [], normals = [], uv = [], indices = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps, p = curve.getPoint(t), tangent = curve.getTangent(t), side = V(tangent.z, 0, -tangent.x).normalize();
        for (let j = 0; j < 2; j++) {
          const q = p.clone().addScaledVector(side, (j - .5) * width);
          vertices.push(q.x, q.y, q.z); normals.push(0, 1, 0); uv.push(t * length / 155, j);
        }
        if (i < steps) { const n = i * 2; indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3); }
      }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices);
      const surface = new THREE.Mesh(geometry, materials.asphalt); surface.material.side = THREE.DoubleSide; scene.add(surface);
      const border = (offset, height, radius, material) => {
        const pts = [];
        for (let i = 0; i <= 80; i++) { const t = i / 80, p = curve.getPoint(t), tangent = curve.getTangent(t); p.addScaledVector(V(tangent.z, 0, -tangent.x).normalize(), offset); p.y += height; pts.push(p); }
        const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, radius, 5, false), material); scene.add(rail);
      };
      for (const side of [-1, 1]) {
        border(side * width * .5, -4, 4, materials.dark); border(side * width * .5, 5, .8, materials.edge);
        border(side * width * .5, -10, 1.1, materials.gold);
      }
      const count = Math.floor(length / 28);
      for (let i = 1; i < count; i++) {
        const t = i / count, p = curve.getPoint(t), tangent = curve.getTangent(t), side = V(tangent.z, 0, -tangent.x).normalize();
        for (const sign of [-1, 1]) {
          const q = p.clone().addScaledVector(side, sign * width * .49);
          box('edge', q.x, q.y + 1, q.z, .9, 9, .9);
          if (i % 3 === 0) box('amber', q.x, q.y + 5.6, q.z, 2, .9, 2);
          if (i % 2 === 0) { const next = curve.getPoint(Math.min(1, t + 1 / count)); beam(V(q.x, q.y - 29, q.z), next.clone().addScaledVector(side, sign * width * .49).add(V(0, -5, 0)), 2.2, 2.2, 'dark'); }
        }
        if (i % 4 === 0) {
          const support = p.clone().addScaledVector(side, -width * .36);
          beam(p.clone().addScaledVector(side, width * .47).add(V(0, -5, 0)), support.clone().add(V(0, -74, 0)), 5, 5, 'steel');
          box('dark', support.x, support.y - 94, support.z, 7, 98, 12);
        }
      }
      roads.push({ curve, length, width });
    }
    road([[-520, 24, 490], [-140, 23, 380], [176, 27, 120], [205, 32, -130], [-110, 35, -305], [-430, 31, -560], [-160, 22, -1010]], 63);
    road([[-600, -195, -990], [-90, -188, -1280], [180, -183, -1640], [480, -180, -1860], [800, -180, -2380]], 50);

    // Animated low-opacity steam has depth testing so it disappears behind facades.
    const mist = document.createElement('canvas'); mist.width = mist.height = 64;
    const mc = mist.getContext('2d'), gradient = mc.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(210,207,206,.42)'); gradient.addColorStop(.5, 'rgba(180,184,190,.12)'); gradient.addColorStop(1, 'rgba(180,184,190,0)');
    mc.fillStyle = gradient; mc.fillRect(0, 0, 64, 64); const mistTexture = new THREE.CanvasTexture(mist);
    for (const origin of [V(-242, -40, 310), V(-278, 220, 301), V(268, 105, -735), V(-208, 320, -1201)]) {
      for (let i = 0; i < 5; i++) {
        const material = new THREE.SpriteMaterial({ map: mistTexture, transparent: true, opacity: .2, depthWrite: false, color: 0xc4bcbe });
        const sprite = new THREE.Sprite(material); scene.add(sprite); steam.push({ sprite, origin, phase: i / 5 });
      }
    }
    const count = matchMedia('(max-width:700px)').matches ? 28 : 48, dummy = new THREE.Object3D();
    const carBody = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.dark, count);
    const carCabin = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.steel, count);
    const headlights = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.amber, count * 2);
    const taillights = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.red, count * 2);
    for (const mesh of [carBody, carCabin, headlights, taillights]) { mesh.frustumCulled = false; scene.add(mesh); }
    const cars = Array.from({ length: count }, (_, i) => ({ road: roads[i % roads.length], lane: i % 4, offset: random(), speed: between(8, 16), scale: between(.65, 1.1) }));
    function place(mesh, i, position, x, y, z, yaw) {
      dummy.position.copy(position); dummy.rotation.set(0, yaw, 0); dummy.scale.set(x, y, z); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    }
    return {
      update(time) {
        for (let i = 0; i < cars.length; i++) {
          const car = cars[i], direction = car.lane < 2 ? 1 : -1;
          const t = ((car.offset + time * car.speed * direction / car.road.length) % 1 + 1) % 1;
          const tangent = car.road.curve.getTangent(t), side = V(tangent.z, 0, -tangent.x).normalize();
          const p = car.road.curve.getPoint(t).addScaledVector(side, (car.lane - 1.5) * car.road.width * .22), s = car.scale;
          const yaw = Math.atan2(tangent.x * direction, tangent.z * direction); p.y += 2;
          place(carBody, i, p, 3.6 * s, 2.1 * s, 7.5 * s, yaw);
          place(carCabin, i, p.clone().add(V(0, 1.5 * s, 0)), 3 * s, 1.1 * s, 3.8 * s, yaw);
          for (let sign = 0; sign < 2; sign++) {
            const offset = side.clone().multiplyScalar((sign - .5) * 2.5 * s);
            const front = p.clone().add(offset).addScaledVector(tangent, 3.9 * s * direction), back = p.clone().add(offset).addScaledVector(tangent, -3.9 * s * direction);
            place(headlights, i * 2 + sign, front, .75 * s, .55 * s, .4 * s, yaw);
            place(taillights, i * 2 + sign, back, .6 * s, .5 * s, .4 * s, yaw);
          }
        }
        for (const mesh of [carBody, carCabin, headlights, taillights]) mesh.instanceMatrix.needsUpdate = true;
        for (const puff of steam) {
          const life = (time * .055 + puff.phase) % 1;
          puff.sprite.position.copy(puff.origin).add(V(life * 28, life * 86, Math.sin(life * 5) * 9));
          puff.sprite.scale.setScalar(12 + life * 58); puff.sprite.material.opacity = Math.sin(life * Math.PI) * .28;
        }
      }
    };
  }

  function cinematicPass(renderer, scene, camera) {
    const size = new THREE.Vector2(); renderer.getDrawingBufferSize(size);
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { depthBuffer: true }); target.texture.encoding = THREE.sRGBEncoding;
    const bloomA = new THREE.WebGLRenderTarget(Math.ceil(size.x / 4), Math.ceil(size.y / 4), { depthBuffer: false });
    const bloomB = bloomA.clone();
    const stage = new THREE.Scene(), ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const vertexShader = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
    const blur = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: { image: { value: target.texture }, direction: { value: new THREE.Vector2() }, extract: { value: 1 } }, vertexShader, fragmentShader: `
      varying vec2 vUv;uniform sampler2D image;uniform vec2 direction;uniform float extract;
      vec3 fetchColor(vec2 p){vec3 c=texture2D(image,p).rgb;return mix(c,c*smoothstep(.64,.96,max(c.r,max(c.g,c.b))),extract);}
      void main(){vec3 c=fetchColor(vUv)*.227027;c+=(fetchColor(vUv+direction*1.384615)+fetchColor(vUv-direction*1.384615))*.316216;c+=(fetchColor(vUv+direction*3.230769)+fetchColor(vUv-direction*3.230769))*.070270;gl_FragColor=vec4(c,1.);}` });
    const finish = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: { image: { value: target.texture }, bloom: { value: bloomA.texture }, time: { value: 0 }, resolution: { value: size } }, vertexShader, fragmentShader: `
      varying vec2 vUv;uniform sampler2D image;uniform sampler2D bloom;uniform float time;uniform vec2 resolution;
      void main(){vec2 p=vUv;vec3 c=texture2D(image,p).rgb;vec3 glow=texture2D(bloom,p).rgb;c+=glow*.19;
      float vignette=smoothstep(.88,.17,length((p-.5)*vec2(1.05,.85)));c*=mix(.82,1.,vignette);
      c=mix(c,vec3(dot(c,vec3(.2126,.7152,.0722))),.055);float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233))+time)*43758.5453)-.5;
      c+=grain*.005;gl_FragColor=vec4(c,1.);}` });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), finish); stage.add(quad);
    let sceneStats = {};
    return {
      render(time) {
        renderer.setRenderTarget(target); renderer.render(scene, camera);
        sceneStats = { drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
        quad.material = blur; blur.uniforms.image.value = target.texture; blur.uniforms.extract.value = 1;
        blur.uniforms.direction.value.set(1 / bloomA.width, 0); renderer.setRenderTarget(bloomA); renderer.render(stage, ortho);
        blur.uniforms.image.value = bloomA.texture; blur.uniforms.extract.value = 0; blur.uniforms.direction.value.set(0, 1 / bloomA.height);
        renderer.setRenderTarget(bloomB); renderer.render(stage, ortho);
        quad.material = finish; finish.uniforms.bloom.value = bloomB.texture; finish.uniforms.time.value = time;
        renderer.setRenderTarget(null); renderer.render(stage, ortho);
      },
      resize() { renderer.getDrawingBufferSize(size); target.setSize(size.x, size.y); bloomA.setSize(Math.ceil(size.x / 4), Math.ceil(size.y / 4)); bloomB.setSize(bloomA.width, bloomA.height); },
      getStats() { return sceneStats; }
    };
  }
  window.MegacityDetail = { addArchitecture, cinematicPass };
})();
