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
