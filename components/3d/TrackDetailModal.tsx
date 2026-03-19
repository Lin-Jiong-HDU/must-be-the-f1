'use client';

import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import tracksData from '@/content/data/tracks.json';

interface TrackData {
  name: string;
  id: string;
  points: { x: number | null; y: number | null; z: number | null }[];
}

interface TrackLineProps {
  trackData: TrackData;
  color?: string;
}

function TrackLine({ trackData, color = '#E10600' }: TrackLineProps) {
  const groupRef = useRef<THREE.Group>(null);

  const scale = 2.5;
  const points = useMemo(() => {
    return trackData.points
      .filter(p => p.x !== null && p.y !== null)
      .map(p => new THREE.Vector3(p.x! * scale, 0, p.y! * scale));
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

// 需要单独导入 useRef
import { useRef } from 'react';

interface TrackDetailModalProps {
  trackId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackDetailModal({ trackId, isOpen, onClose }: TrackDetailModalProps) {
  const [trackPoints, setTrackPoints] = useState<TrackData | null>(null);

  const trackInfo = (tracksData as Record<string, typeof tracksData.monaco>)[trackId];

  useEffect(() => {
    if (isOpen) {
      import(`@/content/data/tracks/${trackId}.json`)
        .then(m => setTrackPoints(m as TrackData))
        .catch(() => setTrackPoints(null));
    }
  }, [trackId, isOpen]);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg-dark/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-bg-elevated/80 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 3D 赛道 */}
      <div className="flex-1 relative" onClick={e => e.stopPropagation()}>
        {trackPoints && (
          <Canvas
            camera={{ position: [0, 1.2, 0.8], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.8} />
            <TrackLine trackData={trackPoints} />
          </Canvas>
        )}
      </div>

      {/* 底部赛道信息 */}
      {trackInfo && (
        <div
          className="bg-gradient-to-t from-bg-dark via-bg-dark/90 to-transparent pt-16 pb-8 px-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="max-w-3xl mx-auto">
            {/* 标题 */}
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-2"
                style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}>
              {trackInfo.name}
            </h2>
            <p className="text-text-muted text-sm mb-6">
              {trackInfo.location}, {trackInfo.country}
            </p>

            {/* 数据网格 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-bg-elevated/50 rounded-lg p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">单圈长度</p>
                <p className="text-xl font-semibold text-text-primary">{trackInfo.length} <span className="text-sm text-text-secondary">km</span></p>
              </div>
              <div className="bg-bg-elevated/50 rounded-lg p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">比赛圈数</p>
                <p className="text-xl font-semibold text-text-primary">{trackInfo.laps} <span className="text-sm text-text-secondary">laps</span></p>
              </div>
              <div className="bg-bg-elevated/50 rounded-lg p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">弯道数量</p>
                <p className="text-xl font-semibold text-text-primary">{trackInfo.turns} <span className="text-sm text-text-secondary">turns</span></p>
              </div>
              <div className="bg-bg-elevated/50 rounded-lg p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">首次举办</p>
                <p className="text-xl font-semibold text-text-primary">{trackInfo.firstHeld}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackDetailModal;
