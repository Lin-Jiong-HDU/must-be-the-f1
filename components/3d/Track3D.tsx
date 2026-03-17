'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface TrackData {
  name: string;
  id: string;
  points: { x: number; y: number; z: number }[];
}

interface TrackLineProps {
  trackData: TrackData;
  color?: string;
}

function TrackLine({ trackData, color = '#E10600' }: TrackLineProps) {
  const groupRef = useRef<THREE.Group>(null);

  const scale = 2.5;
  const points = useMemo(() => {
    return trackData.points.map(p => new THREE.Vector3(p.x * scale, 0, p.y * scale));
  }, [trackData.points]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={6} opacity={0.15} transparent />
      <Line points={points} color={color} lineWidth={3} opacity={0.4} transparent />
      <Line points={points} color={color} lineWidth={1.5} opacity={1} />
    </group>
  );
}

interface Track3DProps {
  trackId?: string;
  className?: string;
  onClick?: () => void;
}

const trackDataMap: Record<string, () => Promise<{ default: TrackData }>> = {
  monaco: () => import('@/content/data/tracks/monaco.json').then(m => ({ default: m as TrackData })),
  japan: () => import('@/content/data/tracks/japan.json').then(m => ({ default: m as TrackData })),
  bahrain: () => import('@/content/data/tracks/bahrain.json').then(m => ({ default: m as TrackData })),
  'saudi-arabia': () => import('@/content/data/tracks/saudi-arabia.json').then(m => ({ default: m as TrackData })),
  miami: () => import('@/content/data/tracks/miami.json').then(m => ({ default: m as TrackData })),
  canada: () => import('@/content/data/tracks/canada.json').then(m => ({ default: m as TrackData })),
  spain: () => import('@/content/data/tracks/spain.json').then(m => ({ default: m as TrackData })),
  austria: () => import('@/content/data/tracks/austria.json').then(m => ({ default: m as TrackData })),
  'great-britain': () => import('@/content/data/tracks/great-britain.json').then(m => ({ default: m as TrackData })),
  belgium: () => import('@/content/data/tracks/belgium.json').then(m => ({ default: m as TrackData })),
  hungary: () => import('@/content/data/tracks/hungary.json').then(m => ({ default: m as TrackData })),
  netherlands: () => import('@/content/data/tracks/netherlands.json').then(m => ({ default: m as TrackData })),
  italy: () => import('@/content/data/tracks/italy.json').then(m => ({ default: m as TrackData })),
  madrid: () => import('@/content/data/tracks/madrid.json').then(m => ({ default: m as TrackData })),
  azerbaijan: () => import('@/content/data/tracks/azerbaijan.json').then(m => ({ default: m as TrackData })),
  singapore: () => import('@/content/data/tracks/singapore.json').then(m => ({ default: m as TrackData })),
  austin: () => import('@/content/data/tracks/austin.json').then(m => ({ default: m as TrackData })),
  mexico: () => import('@/content/data/tracks/mexico.json').then(m => ({ default: m as TrackData })),
  brazil: () => import('@/content/data/tracks/brazil.json').then(m => ({ default: m as TrackData })),
  'las-vegas': () => import('@/content/data/tracks/las-vegas.json').then(m => ({ default: m as TrackData })),
  qatar: () => import('@/content/data/tracks/qatar.json').then(m => ({ default: m as TrackData })),
  'abu-dhabi': () => import('@/content/data/tracks/abu-dhabi.json').then(m => ({ default: m as TrackData })),
};

export function Track3D({ trackId = 'monaco', className = '', onClick }: Track3DProps) {
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = trackDataMap[trackId];
    if (loader) {
      loader()
        .then(m => setTrackData(m.default))
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  }, [trackId]);

  if (error || !trackData) {
    return (
      <div className={`flex items-center justify-center bg-bg-elevated rounded-lg ${className}`}>
        <span className="text-text-muted text-sm">
          {error ? '赛道数据加载失败' : '加载中...'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-bg-elevated rounded-lg overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [0, 1.2, 0.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <TrackLine trackData={trackData} />
      </Canvas>

      {/* 悬停提示 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-bg-dark/40">
        <span className="text-text-primary text-sm font-medium px-4 py-2 bg-bg-elevated/80 rounded-full">
          点击查看详情
        </span>
      </div>
    </div>
  );
}

export default Track3D;
