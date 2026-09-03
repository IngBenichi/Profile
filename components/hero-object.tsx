"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero object: a solid icosphere displaced by animated 3D simplex noise,
 * shaded with a two-tone normal gradient and a fresnel rim in the system green.
 * No textures, no HDRI — "lit monolith" look on a tiny byte budget.
 * Ported from the v2 redesign proposal.
 */
export default function HeroObject({ isMobile = false }: { isMobile?: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let disposed = false;
    let raf = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the CSS glow behind the canvas stands in
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:relative;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const uniforms = {
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color(0x63d7a2) },
      uDeep: { value: new THREE.Color(0x1a4c3a) },
      uWarm: { value: new THREE.Color(0xe7b27c) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const vert = /* glsl */ `
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      uniform float uTime; uniform vec2 uMouse;
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
        i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
        vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
        return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
      void main(){
        vec3 pos=position;
        float n=snoise(normal*1.5+vec3(uTime*0.18));
        float n2=snoise(normal*3.4-vec3(uTime*0.12))*0.35;
        float d=n+n2;
        vNoise=d;
        pos+=normal*d*0.24;
        pos.xy+=uMouse*0.12;
        vNormal=normalize(normalMatrix*normal);
        vec4 mv=modelViewMatrix*vec4(pos,1.0);
        vView=normalize(-mv.xyz);
        gl_Position=projectionMatrix*mv;
      }`;

    const frag = /* glsl */ `
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      uniform vec3 uAccent; uniform vec3 uDeep; uniform vec3 uWarm;
      void main(){
        float grad=clamp(vNormal.y*0.5+0.5,0.0,1.0);
        vec3 base=mix(uDeep,uAccent,pow(grad,1.5))*0.82;
        base=mix(base,uWarm,smoothstep(0.4,0.95,vNoise)*0.22);
        float fres=pow(1.0-max(dot(vNormal,vView),0.0),2.6);
        vec3 col=base+fres*uAccent*0.8;
        col+=vNoise*0.04;
        gl_FragColor=vec4(col,0.86);
      }`;

    const geo = new THREE.IcosahedronGeometry(1.15, isMobile ? 4 : 5);
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let tmx = 0;
    let tmy = 0;
    const onMove = (e: MouseEvent) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const pointerFine = window.matchMedia?.("(hover: hover)").matches && !isMobile;
    if (pointerFine) window.addEventListener("mousemove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver((en) => (visible = en[0].isIntersecting), { threshold: 0.01 });
    io.observe(host);

    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (disposed || !visible || document.hidden) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      uniforms.uMouse.value.x += (tmx - uniforms.uMouse.value.x) * 0.04;
      uniforms.uMouse.value.y += (tmy - uniforms.uMouse.value.y) * 0.04;
      mesh.rotation.y = t * 0.12 + uniforms.uMouse.value.x * 0.5;
      mesh.rotation.x = uniforms.uMouse.value.y * 0.35;
      camera.position.x += (tmx * 0.4 - camera.position.x) * 0.03;
      camera.position.y += (tmy * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    if (reduce) {
      uniforms.uTime.value = 2;
      renderer.render(scene, camera);
    } else {
      loop();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (pointerFine) window.removeEventListener("mousemove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [isMobile]);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-hidden />;
}
