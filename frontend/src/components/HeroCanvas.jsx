import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.clientWidth, h = canvas.clientHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lights
    scene.add(new THREE.AmbientLight(0x7c5cfc, 0.4));
    const pl1 = new THREE.PointLight(0xc8ff00, 4, 20);
    pl1.position.set(3, 3, 3); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x00d4ff, 3, 20);
    pl2.position.set(-4, -2, 2); scene.add(pl2);
    const pl3 = new THREE.PointLight(0x7c5cfc, 2, 15);
    pl3.position.set(0, -4, 1); scene.add(pl3);

    // Central icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const ico = new THREE.Mesh(icoGeo, new THREE.MeshStandardMaterial({
      color: 0x0e0e18, metalness: 0.95, roughness: 0.05,
    }));
    scene.add(ico);
    const wire = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({
      color: 0x7c5cfc, wireframe: true, transparent: true, opacity: 0.22,
    }));
    wire.scale.setScalar(1.012); scene.add(wire);

    // Particles
    const N = 200;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 2.6 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xc8ff00, size: 0.022, transparent: true, opacity: 0.65, sizeAttenuation: true,
    }));
    scene.add(particles);

    // Rings
    const ringCfg = [
      { r: 2.2, tube: 0.008, color: 0xc8ff00, op: 0.45, rx: 0.4, ry: 0 },
      { r: 2.9, tube: 0.005, color: 0x00d4ff, op: 0.3,  rx: 1.2, ry: 0.5 },
      { r: 3.5, tube: 0.004, color: 0x7c5cfc, op: 0.25, rx: 0.8, ry: 1.1 },
    ];
    const rings = ringCfg.map(({ r, tube, color, op, rx, ry }) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 8, 120),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op })
      );
      m.rotation.x = rx; m.rotation.y = ry;
      scene.add(m); return m;
    });

    // Orbiting orbs
    const orbCfg = [
      { color: 0xc8ff00, orbit: 2.2, speed: 0.5, size: 0.065, phase: 0 },
      { color: 0x00d4ff, orbit: 2.9, speed: 0.3, size: 0.05, phase: 2.1 },
      { color: 0x7c5cfc, orbit: 3.5, speed: 0.18, size: 0.04, phase: 4.2 },
    ];
    const orbs = orbCfg.map(({ color, orbit, speed, size, phase }) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(size, 10, 10),
        new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: 0.05, emissive: color, emissiveIntensity: 0.7 })
      );
      scene.add(m); return { mesh: m, orbit, speed, phase };
    });

    // Mouse
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMM = (e) => { mouse.tx = (e.clientX / innerWidth - 0.5) * 2; mouse.ty = -(e.clientY / innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", onMM);

    // Resize
    const onResize = () => {
      const nw = canvas.clientWidth, nh = canvas.clientHeight;
      renderer.setSize(nw, nh, false);
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Scroll parallax
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll);

    let raf, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.008;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ico.rotation.x = mouse.y * 0.35 + t * 0.1;
      ico.rotation.y = mouse.x * 0.35 + t * 0.14;
      wire.rotation.copy(ico.rotation);

      scene.position.y = -scrollY * 0.0025;

      particles.rotation.y = t * 0.025 + mouse.x * 0.15;
      particles.rotation.x = t * 0.018 + mouse.y * 0.08;

      rings[0].rotation.z = t * 0.07 + mouse.x * 0.15;
      rings[1].rotation.z = -t * 0.05;
      rings[1].rotation.x = 1.2 + mouse.y * 0.08;
      rings[2].rotation.y = t * 0.035;

      pl1.position.x = Math.sin(t * 0.45) * 4 + mouse.x;
      pl1.position.y = Math.cos(t * 0.3) * 3 + mouse.y;
      pl2.position.x = Math.cos(t * 0.38) * 4;
      pl2.position.y = Math.sin(t * 0.55) * 3;

      orbs.forEach(({ mesh, orbit, speed, phase }) => {
        const a = t * speed + phase;
        mesh.position.x = Math.cos(a) * orbit;
        mesh.position.z = Math.sin(a) * orbit;
        mesh.position.y = Math.sin(a * 0.5) * orbit * 0.25;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}