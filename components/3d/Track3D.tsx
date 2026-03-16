'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
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

  // 转换为 Three.js 使用的坐标格式 - 赛道在 XZ 平面（水平面）
  // 放大2.5倍以适应容器
  const scale = 2.5;
  const points = useMemo(() => {
    return trackData.points.map(p => new THREE.Vector3(p.x * scale, 0, p.y * scale));
  }, [trackData.points]);

  // 绕 Y 轴旋转
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 外发光 */}
      <Line
        points={points}
        color={color}
        lineWidth={6}
        opacity={0.15}
        transparent
      />
      {/* 中层发光 */}
      <Line
        points={points}
        color={color}
        lineWidth={3}
        opacity={0.4}
        transparent
      />
      {/* 主线条 */}
      <Line
        points={points}
        color={color}
        lineWidth={1.5}
        opacity={1}
      />
    </group>
  );
}

interface Track3DProps {
  trackId?: string;
  className?: string;
}

// 赛道数据映射
const trackDataMap: Record<string, () => Promise<{ default: TrackData }>> = {
  monaco: () => import('@/content/data/tracks/monaco.json').then(m => ({ default: m as TrackData })),
};

export function Track3D({ trackId = 'monaco', className = '' }: Track3DProps) {
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
    <div className={`bg-bg-elevated rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 1.2, 0.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <TrackLine trackData={trackData} />
      </Canvas>
    </div>
  );
}

export default Track3D;
