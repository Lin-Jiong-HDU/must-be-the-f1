// components/home/SeasonCalendar.tsx
import { getCalendar, getTrack } from '@/lib/data';

interface SeasonCalendarProps {
  year?: number;
}

export function SeasonCalendar({ year = new Date().getFullYear() }: SeasonCalendarProps) {
  const races = getCalendar(year);
  const completed = races.filter(r => new Date(r.date) < new Date()).length;
  const progress = races.length > 0 ? (completed / races.length) * 100 : 0;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-card/20 to-transparent" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="space-y-3">
            <p className="text-sm text-text-muted tracking-wider">
              CHAMPIONSHIP
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight">
              {year} 赛季日历
            </h2>
          </div>

          {/* 进度统计 */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* 进度环 */}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-medium text-text-primary">
                  {completed}
                </span>
                <span className="text-[10px] text-text-muted -mt-1">
                  / {races.length}
                </span>
              </div>
            </div>

            {/* 文字说明 */}
            <div className="space-y-1">
              <div className="text-2xl font-medium text-text-primary">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-text-muted">赛季进度</div>
            </div>
          </div>
        </div>

        {/* 赛道时间轴 */}
        <div className="relative pb-4">
          {/* 进度线 */}
          <div className="absolute top-7 left-0 right-0 h-px bg-white/[0.06]" />
          <div
            className="absolute top-7 left-0 h-px bg-white/20 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

          {/* 赛道列表 */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {races.map((race, index) => {
              const isPast = new Date(race.date) < new Date();
              const isNext = !isPast && (index === 0 || new Date(races[index - 1].date) < new Date());
              const track = getTrack(race.track);

              return (
                <div
                  key={race.round}
                  className="group relative flex flex-col items-center shrink-0 pt-2"
                >
                  {/* 圆点 */}
                  <div
                    className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${isPast
                        ? 'bg-rose-500/[0.12] border border-rose-500/30'
                        : isNext
                          ? 'bg-amber-500/[0.1] border border-amber-500/30 ring-1 ring-amber-500/20'
                          : 'bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08]'
                      }
                    `}
                    title={`${race.name} · ${track?.location}`}
                  >
                    {/* 已完成标识 */}
                    {isPast && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* 下一站标识 */}
                    {isNext && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-amber-500 text-[10px] text-bg-dark font-medium whitespace-nowrap tracking-wide">
                        NEXT
                      </div>
                    )}

                    <span
                      className={`
                        text-base font-medium
                        ${isPast
                          ? 'text-rose-400'
                          : isNext
                            ? 'text-amber-400'
                            : 'text-text-muted group-hover:text-text-secondary'
                        }
                      `}
                    >
                      {race.round}
                    </span>
                  </div>

                  {/* 赛道名称 */}
                  <div className="mt-3 text-center space-y-0.5">
                    <div
                      className={`
                        text-xs font-medium
                        ${isPast || isNext ? 'text-text-secondary' : 'text-text-muted'}
                      `}
                    >
                      {race.name.split(' ').pop()?.substring(0, 5)}
                    </div>
                    <div className="text-[10px] text-text-muted/70">
                      {new Date(race.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部图例 */}
        <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-md bg-rose-500/[0.12] border border-rose-500/30" />
            <span className="text-xs text-text-muted">已完成</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-md bg-amber-500/[0.1] border border-amber-500/30" />
            <span className="text-xs text-text-muted">即将进行</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-md bg-white/[0.02] border border-white/[0.05]" />
            <span className="text-xs text-text-muted">待进行</span>
          </div>
        </div>
      </div>
    </section>
  );
}
