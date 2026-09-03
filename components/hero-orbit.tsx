"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type OrbitNodeKey = "backend" | "cloud" | "devops" | "security" | "ai" | "apis";

type Props = {
  /** Map of node key -> label DOM element to position in screen space. */
  labelEls: Partial<Record<OrbitNodeKey, HTMLElement | null>>;
  isMobile: boolean;
};

/**
 * Rotating wireframe "system" for the hero: an icosahedron core, three rings
 * and orbiting domain nodes whose labels are projected back into screen space.
 * Ported from the Portfolio.dc.html design proposal.
 */
export default function HeroOrbit({ labelEls, isMobile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelElsRef = useRef(labelEls);
  labelElsRef.current = labelEls;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let disposed = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    group.add(
      new THREE.LineSegments(
        new THREE.WireframeGeometry(coreGeo),
        new THREE.LineBasicMaterial({ color: 0xf2f2f0, transparent: true, opacity: 0.5 }),
      ),
    );
    group.add(
      new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0x0a0b0d, transparent: true, opacity: 0.6 })),
    );

    const ringColors = [0x7fe0a0, 0x7fb0ff, 0x7fe8f2];
    const rings = ringColors.map((c, i) => {
      const geo = new THREE.TorusGeometry(2.05 + i * 0.4, 0.007, 8, 128);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.45 }));
      m.rotation.x = Math.PI / 2 + i * 0.55;
      m.rotation.y = i * 0.7;
      group.add(m);
      return m;
    });

    const nodeDefs: { ring: number; t: number; color: number; key: OrbitNodeKey }[] = [
      { ring: 0, t: 0.05, color: 0x7fe0a0, key: "backend" },
      { ring: 1, t: 0.3, color: 0x7fb0ff, key: "cloud" },
      { ring: 2, t: 0.6, color: 0x7fe8f2, key: "devops" },
      { ring: 0, t: 0.55, color: 0xff9a86, key: "security" },
      { ring: 1, t: 0.8, color: 0xd6adff, key: "ai" },
      { ring: 2, t: 0.15, color: 0xf2f2f0, key: "apis" },
    ];
    const nodeMeshes = nodeDefs.map((d) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        new THREE.MeshBasicMaterial({ color: d.color }),
      );
      group.add(mesh);
      return { mesh, ring: rings[d.ring], t: d.t, key: d.key };
    });

    const particleCount = isMobile ? 350 : 900;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.018,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseY = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    const setSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / (h || 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.05 });
    io.observe(container);

    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (disposed || document.hidden || !visible) return;
      const elapsed = clock.getElapsedTime();
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      group.rotation.y = elapsed * 0.08 + targetX * 0.4;
      group.rotation.x = targetY * 0.25;
      camera.position.x = targetX * 0.6;
      camera.position.y = -targetY * 0.4;
      camera.lookAt(0, 0, 0);
      rings.forEach((m, i) => (m.rotation.z += 0.0015 * (i + 1)));
      points.rotation.y += 0.0006;
      nodeMeshes.forEach((n) => {
        n.t += 0.00055;
        const radius = (n.ring.geometry as THREE.TorusGeometry).parameters.radius;
        const a = n.t * Math.PI * 2;
        tmp.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
        tmp.applyEuler(n.ring.rotation);
        n.mesh.position.copy(tmp);
        const el = labelElsRef.current[n.key];
        if (el) {
          const v = n.mesh.position.clone().project(camera);
          const w = container.clientWidth;
          const h = container.clientHeight;
          const x = (v.x * 0.5 + 0.5) * w;
          const y = (-v.y * 0.5 + 0.5) * h;
          el.style.transform = `translate3d(${x + 10}px, ${y - 6}px, 0)`;
          const inTextZone = x > w * 0.2 && x < w * 0.8 && y > h * 0.24 && y < h * 0.86;
          el.style.opacity = v.z < 1 && !inTextZone ? "1" : "0";
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      io.disconnect();
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      coreGeo.dispose();
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}
