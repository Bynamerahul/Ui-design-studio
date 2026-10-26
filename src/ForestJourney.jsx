import React, { useEffect, useRef } from 'react';

export default function ForestJourney() {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    import('three').then((THREE) => {
      if (disposed || !frameRef.current || !canvasRef.current) return;

      const host = frameRef.current;
      const canvas = canvasRef.current;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const small = window.matchMedia('(max-width: 700px)').matches;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.7));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      renderer.setClearColor(0x27342a, 1);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x27342a);
      scene.fog = new THREE.FogExp2(0x29372b, 0.026);
      const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 90);
      const ambient = new THREE.HemisphereLight(0xe5edd7, 0x172117, 1.45);
      scene.add(ambient);
      const light = new THREE.PointLight(0xdde9ca, 1.9, 32);
      light.position.set(-2, 6, 8);
      scene.add(light);
      const fill = new THREE.PointLight(0x769a74, 1.3, 28);
      fill.position.set(6, -1, -14);
      scene.add(fill);

      let seed = 4137;
      const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const bark = new THREE.MeshBasicMaterial({ color: 0x243323, toneMapped: false });
      const moss = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      const flower = new THREE.MeshBasicMaterial({ color: 0xedf0d4, toneMapped: false });
      const clumpGeometry = new THREE.SphereGeometry(1, 6, 4);
      const flowerGeometry = new THREE.SphereGeometry(1, 6, 5);
      const dummy = new THREE.Object3D();
      const tint = new THREE.Color();

      function grow(points, radius, count) {
        const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'centripetal', 0.5);
        const limb = new THREE.Mesh(new THREE.TubeGeometry(curve, 52, radius, 9, false), bark);
        scene.add(limb);
        const clumps = new THREE.InstancedMesh(clumpGeometry, moss, count);
        const blossoms = new THREE.InstancedMesh(flowerGeometry, flower, Math.max(8, Math.floor(count * 0.055)));
        const normal = new THREE.Vector3();
        let bloomCount = 0;
        for (let i = 0; i < count; i++) {
          const t = (i + random()) / count;
          const point = curve.getPoint(t);
          const tangent = curve.getTangent(t);
          const axis = new THREE.Vector3(0, 0, 1);
          if (Math.abs(tangent.dot(axis)) > 0.9) axis.set(0, 1, 0);
          normal.crossVectors(tangent, axis).normalize();
          const angle = random() * Math.PI * 2;
          normal.applyAxisAngle(tangent, angle);
          dummy.position.copy(point).addScaledVector(normal, radius * (0.85 + random() * 0.25));
          const size = radius * (0.16 + random() * 0.24);
          dummy.scale.set(size * 1.45, size * (0.48 + random() * 0.48), size * 1.35);
          dummy.rotation.set(random(), random() * Math.PI, random());
          dummy.updateMatrix();
          clumps.setMatrixAt(i, dummy.matrix);
          tint.setHSL(0.22 + random() * 0.07, 0.38 + random() * 0.24, 0.16 + random() * 0.13);
          clumps.setColorAt(i, tint);
          if (random() < 0.055 && bloomCount < blossoms.count) {
            dummy.position.addScaledVector(normal, radius * 0.25);
            const flowerSize = 0.035 + random() * 0.045;
            dummy.scale.setScalar(flowerSize);
            dummy.updateMatrix();
            blossoms.setMatrixAt(bloomCount++, dummy.matrix);
          }
        }
        blossoms.count = bloomCount;
        clumps.instanceMatrix.needsUpdate = true;
        blossoms.instanceMatrix.needsUpdate = true;
        scene.add(clumps, blossoms);
      }

      const span = small ? 4.2 : 6.7;
      const arches = small ? 11 : 14;
      for (let i = 0; i < arches; i++) {
        const z = -9 - i * 8;
        const sway = (random() - 0.5) * 1.9;
        const height = 3.1 + random() * 2.0;
        const radius = 0.42 + random() * 0.33;
        grow([
          [-span * 1.45 + sway, -5.8, z + 2.8],
          [-span * 0.95 + sway, -0.8, z + 1.5],
          [-span * 0.62 + sway, height * 0.76, z],
          [-span * 0.10 + sway, height, z - 0.5],
          [span * 0.62 + sway, height * 0.8, z - 1.2],
          [span * 1.45 + sway, -5.8, z - 2],
        ], radius, small ? 900 : 1900);
        if (i % 2 === 0) {
          grow([
            [span * 1.05 + sway, -1.8, z + 1],
            [span * 0.72 + sway, 1.2, z - 1],
            [span * 0.38 + sway, 2.3, z - 3.2],
            [span * 0.18 + sway, 3.8, z - 5.4],
          ], radius * 0.39, small ? 280 : 500);
        }
      }

      const pollenCount = small ? 420 : 850;
      const pollenPositions = new Float32Array(pollenCount * 3);
      for (let i = 0; i < pollenCount; i++) {
        pollenPositions[i * 3] = (random() - 0.5) * span * 2.4;
        pollenPositions[i * 3 + 1] = (random() - 0.5) * 12;
        pollenPositions[i * 3 + 2] = 5 - random() * 125;
      }
      const pollenGeometry = new THREE.BufferGeometry();
      pollenGeometry.setAttribute('position', new THREE.BufferAttribute(pollenPositions, 3));
      const pollen = new THREE.Points(pollenGeometry, new THREE.PointsMaterial({ color: 0xe3eaca, size: 0.055, transparent: true, opacity: 0.6, depthWrite: false }));
      scene.add(pollen);

      const maxTravel = 100;
      let target = 0;
      let progress = 0;
      let raf = 0;
      let active = true;
      function resize() {
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
      function scroll() {
        const main = document.querySelector('main');
        if (!main) return;
        const rect = main.getBoundingClientRect();
        target = THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height - window.innerHeight), 0, 1);
      }
      function tick() {
        if (!active) return;
        progress += (target - progress) * (reduced.matches ? 1 : 0.045);
        camera.position.set(Math.sin(progress * 7) * 0.9, Math.sin(progress * 9) * 0.4, 7 - progress * maxTravel);
        camera.lookAt(Math.sin(progress * 7.4) * 0.45, 0.2 + Math.sin(progress * 5) * 0.35, camera.position.z - 12);
        light.position.z = camera.position.z - 2;
        if (!reduced.matches) pollen.rotation.y += 0.000035;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('resize', resize);
      resize();
      scroll();
      tick();

      cleanup = () => {
        active = false;
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        window.removeEventListener('scroll', scroll);
        window.removeEventListener('resize', resize);
        scene.traverse((object) => object.geometry?.dispose?.());
        bark.dispose(); moss.dispose(); flower.dispose();
        pollen.material.dispose();
        renderer.dispose();
      };
    }).catch((error) => console.error('Forest journey could not start', error));

    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="world-stage" ref={frameRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
