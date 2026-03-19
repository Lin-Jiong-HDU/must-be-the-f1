'use client';

import { useEffect, useMemo, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import type { Track, RaceEvent } from '@/types/content';

interface TrackData {
  name: string;
  id: string;
  points: { x: number | null; y: number | null; z: number | null }[];
}

interface TrackLineProps {
  trackData: TrackData;
  color?: string;
  autoRotate?: boolean;
}

function TrackLine({ trackData, color = '#E10600', autoRotate = true }: TrackLineProps) {
  const groupRef = useRef<THREE.Group>(null);

  const scale = 1.8;
  const points = useMemo(() => {
    return trackData.points
      .filter(p => p.x !== null && p.y !== null)
      .map(p => new THREE.Vector3(p.x! * scale, 0, p.y! * scale));
  }, [trackData.points]);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 外发光 */}
      <Line points={points} color={color} lineWidth={8} opacity={0.08} transparent />
      <Line points={points} color={color} lineWidth={5} opacity={0.2} transparent />
      {/* 主线 */}
      <Line points={points} color={color} lineWidth={2} opacity={0.9} />
    </group>
  );
}

interface Track3DDetailProps {
  track: Track;
  race?: RaceEvent;
  currentYear: number;
}

export function Track3DDetail({ track, race, currentYear }: Track3DDetailProps) {
  const [trackPoints, setTrackPoints] = useState<TrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    import(`@/content/data/tracks/${track.id}.json`)
      .then(m => {
        setTrackPoints(m as TrackData);
        setIsLoading(false);
      })
      .catch(() => {
        setTrackPoints(null);
        setIsLoading(false);
      });
  }, [track.id]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 返回导航 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">返回赛道资料库</span>
        </Link>
      </div>

      {/* 3D 赛道区域 */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-dark">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-text-muted text-sm">加载赛道模型...</span>
            </div>
          </div>
        ) : trackPoints ? (
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 2, 1.5], fov: 40 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.6} />
              <Suspense fallback={null}>
                <TrackLine trackData={trackPoints} />
              </Suspense>
            </Canvas>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-dark">
            <span className="text-text-muted">赛道模型暂未可用</span>
          </div>
        )}

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg-dark via-transparent to-transparent" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-bg-dark/50 via-transparent to-transparent" />
      </div>

      {/* 赛道信息卡片 */}
      <div className="relative z-10 bg-gradient-to-t from-bg-dark via-bg-dark to-transparent pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 标题区 */}
          <div className="text-center mb-8">
            {/* 小标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
              <span className="text-primary text-sm font-medium tracking-wider">
                {track.officialName}
              </span>
            </div>

            {/* 主标题 */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
            >
              {track.name}
            </h1>

            {/* 地点 */}
            <p className="text-lg text-text-secondary">
              {track.location}，{track.country}
            </p>
          </div>

          {/* 数据网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-bg-card/80 backdrop-blur border border-border-subtle rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">单圈长度</p>
              <p className="text-2xl font-bold text-text-primary">
                {track.length}
                <span className="text-sm font-normal text-text-secondary ml-1">km</span>
              </p>
            </div>
            <div className="bg-bg-card/80 backdrop-blur border border-border-subtle rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">比赛圈数</p>
              <p className="text-2xl font-bold text-text-primary">
                {track.laps}
                <span className="text-sm font-normal text-text-secondary ml-1">圈</span>
              </p>
            </div>
            <div className="bg-bg-card/80 backdrop-blur border border-border-subtle rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">弯道数量</p>
              <p className="text-2xl font-bold text-text-primary">
                {track.turns}
                <span className="text-sm font-normal text-text-secondary ml-1">个</span>
              </p>
            </div>
            <div className="bg-bg-card/80 backdrop-blur border border-border-subtle rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">首次举办</p>
              <p className="text-2xl font-bold text-text-primary">{track.firstHeld}</p>
            </div>
          </div>

          {/* 比赛总距离 */}
          <div className="bg-bg-card/50 border border-border-subtle rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">比赛总距离</p>
                <p className="text-xl font-semibold text-text-primary">
                  {(track.length * track.laps).toFixed(3)} km
                </p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-sm mb-1">计算公式</p>
                <p className="text-text-secondary text-sm">
                  {track.length} km × {track.laps} 圈
                </p>
              </div>
            </div>
          </div>

          {/* 比赛信息 & 相关链接 */}
          {race && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/races/${race.round}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.95] text-bg-dark text-sm font-medium rounded-xl hover:bg-white transition-colors shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                查看本赛季赛事
              </Link>
              <Link
                href={`/guides?track=${track.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] text-text-primary text-sm font-medium rounded-xl border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.15] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                观赛攻略
              </Link>
            </div>
          )}

          {/* 如果没有比赛，只显示攻略链接 */}
          {!race && (
            <div className="flex justify-center">
              <Link
                href={`/guides?track=${track.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] text-text-primary text-sm font-medium rounded-xl border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.15] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                查看观赛攻略
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
