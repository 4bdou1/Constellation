'use client';

import type React from 'react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

// Lightweight material — no blur loop, just opacity + simple tint
const createMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map:     { value: null },
      opacity: { value: 1.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        vec4 c = texture2D(map, vUv);
        gl_FragColor = vec4(c.rgb, c.a * opacity);
      }
    `,
  });

function VideoPlane({
  texture,
  position,
  scale,
  material,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
}) {
  useEffect(() => {
    if (material && texture) material.uniforms.map.value = texture;
  }, [material, texture]);

  return (
    <mesh position={position} scale={scale} material={material}>
      {/* Low-poly plane — 4×4 is plenty for a flat video quad */}
      <planeGeometry args={[1, 1, 4, 4]} />
    </mesh>
  );
}

function GalleryScene({ textures }: { textures: THREE.Texture[] }) {
  const totalImages = textures.length;
  const depthRange = DEFAULT_DEPTH_RANGE;
  const VISIBLE = 10;

  // All animation state stored in refs — zero React re-renders per frame
  const velocityRef = useRef(0);
  const lastFrameRef = useRef(0);

  const materials = useMemo(
    () => Array.from({ length: VISIBLE }, () => createMaterial()),
    [],
  );

  const spatialPositions = useMemo(
    () =>
      Array.from({ length: VISIBLE }, (_, i) => {
        const hAngle = (i * 2.618) % (Math.PI * 2);
        const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
        const hRadius = 1.5 + (i % 3) * 1.4;
        const vRadius = ((i + 1) % 4) * 0.8;
        const rawX = (Math.sin(hAngle) * hRadius * MAX_HORIZONTAL_OFFSET) / 3;
        // Guarantee minimum horizontal offset so nothing appears centred up close
        const x = rawX >= 0 ? Math.max(2.2, rawX) : Math.min(-2.2, rawX);
        return {
          x,
          y: (Math.cos(vAngle) * vRadius * MAX_VERTICAL_OFFSET) / 4,
        };
      }),
    [],
  );

  const planesData = useRef<PlaneData[]>(
    Array.from({ length: VISIBLE }, (_, i) => ({
      index: i,
      z: ((depthRange / VISIBLE) * i) % depthRange,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    })),
  );

  // Mesh refs so we can update positions without re-rendering
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(VISIBLE).fill(null));

  useFrame((state, delta) => {
    // Cap at ~24 fps to reduce GPU pressure alongside video decode
    const now = state.clock.elapsedTime;
    if (now - lastFrameRef.current < 1 / 24) return;
    lastFrameRef.current = now;
    // Ease velocity toward target — pure ref mutation, no setState
    velocityRef.current += (0.07 - velocityRef.current) * 0.04;
    const vel = velocityRef.current;
    const imageAdvance = totalImages > 0 ? VISIBLE % totalImages || totalImages : 0;
    const halfRange = depthRange / 2;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + vel * delta * 10;
      let wrapsForward = 0, wrapsBackward = 0;

      if (newZ >= depthRange) {
        wrapsForward = Math.floor(newZ / depthRange);
        newZ -= depthRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / depthRange);
        newZ += depthRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0)
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const s = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((s % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % depthRange) + depthRange) % depthRange;

      const norm = plane.z / depthRange;

      // Opacity fade — start fading out at 55% so planes are gone before they loom large
      let opacity = 1;
      if (norm < 0.05) opacity = 0;
      else if (norm < 0.20) opacity = (norm - 0.05) / 0.15;
      else if (norm > 0.72) opacity = 0;
      else if (norm > 0.55) opacity = 1 - (norm - 0.55) / 0.17;
      opacity = Math.max(0, Math.min(1, opacity));

      const mat = materials[i];
      if (mat?.uniforms) mat.uniforms.opacity.value = opacity;

      // Move mesh directly via ref — no React involved
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.z = plane.z - halfRange;
        // Update texture if it changed
        const tex = textures[plane.imageIndex];
        if (tex && mat.uniforms.map.value !== tex) mat.uniforms.map.value = tex;
      }
    });
  });

  if (textures.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = textures[plane.imageIndex];
        const material = materials[i];
        if (!texture || !material) return null;
        const worldZ = plane.z - depthRange / 2;
        const scale: [number, number, number] = [0.7, 1.25, 1];
        return (
          <mesh
            key={i}
            ref={(el) => { meshRefs.current[i] = el; }}
            position={[spatialPositions[i]?.x ?? 0, spatialPositions[i]?.y ?? 0, worldZ]}
            scale={scale}
            material={material}
          >
            <planeGeometry args={[1, 1, 4, 4]} />
          </mesh>
        );
      })}
    </>
  );
}

interface InfiniteVideoGalleryProps {
  videos: string[];
  className?: string;
  style?: React.CSSProperties;
}

export default function InfiniteVideoGallery({
  videos,
  className = 'h-full w-full',
  style,
}: InfiniteVideoGalleryProps) {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const videoEls = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (videos.length === 0) return;

    // Cap at 3 concurrent video streams to avoid decode pressure
    const active = videos.slice(0, 3);
    const els: HTMLVideoElement[] = [];
    const txts: THREE.Texture[] = [];

    active.forEach((src) => {
      const v = document.createElement('video');
      v.src = src;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      // Defer play slightly so main video gets priority
      setTimeout(() => v.play().catch(() => {}), 800);

      // Restart only on stall — no aggressive heartbeat
      v.addEventListener('stalled', () => { setTimeout(() => v.play().catch(() => {}), 300); });
      els.push(v);

      const t = new THREE.VideoTexture(v);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      txts.push(t);
    });

    videoEls.current = els;
    setTextures(txts);

    return () => {
      els.forEach((v) => { v.pause(); v.src = ''; });
      txts.forEach((t) => t.dispose());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.join(',')]);

  return (
    <div className={className} style={style}>
      {textures.length > 0 && (
        <Canvas
          camera={{ position: [0, 0, 0], fov: 55 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
          frameloop="always"
        >
          <GalleryScene textures={textures} />
        </Canvas>
      )}
    </div>
  );
}
