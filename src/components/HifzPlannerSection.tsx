import React, { useState, useEffect } from 'react';
import { JUZ_AMMA_SURAHS } from '../data/academyData';
import { RotateCcw, Plus } from 'lucide-react';

type SurahStatus = 'unstarted' | 'sabqi' | 'mutqin';

interface HifzLogEntry {
  id: string;
  date: string;
  surahName: string;
  tier: 'Sabaq (New)' | 'Sabqi (Recent)' | 'Manzil (Long-Term)';
  linesCompleted: number;
  accuracyPct: number;
}

interface HifzPlannerSectionProps {
  onSelectHifzTrack: () => void;
}

export const HifzPlannerSection: React.FC<HifzPlannerSectionProps> = ({ onSelectHifzTrack }) => {
  // Interactive Sliders with explicit units
  const [dailyLines, setDailyLines] = useState<number>(5);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [completedJuz, setCompletedJuz] = useState<number>(2);

  // Persistent Surah Status Map for Juz 30
  const [surahStatuses, setSurahStatuses] = useState<Record<number, SurahStatus>>(() => {
    try {
      const saved = localStorage.getItem('noor_juz30_statuses');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      114: 'mutqin',
      113: 'mutqin',
      112: 'mutqin',
      108: 'mutqin',
      103: 'mutqin',
      97: 'sabqi',
      96: 'sabqi',
      95: 'sabqi',
      94: 'mutqin',
      93: 'sabqi',
      87: 'unstarted',
      78: 'unstarted'
    };
  });

  // Persistent Recent Sabaq / Manzil Log
  const [sessionLogs, setSessionLogs] = useState<HifzLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('noor_hifz_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'log-1',
        date: 'Oct 05, 2026',
        surahName: 'Surah Al-Alaq (96:1–19)',
        tier: 'Sabaq (New)',
        linesCompleted: 7,
        accuracyPct: 97
      },
      {
        id: 'log-2',
        date: 'Oct 04, 2026',
        surahName: 'Surah Ad-Duha & Ash-Sharh',
        tier: 'Sabqi (Recent)',
        linesCompleted: 9,
        accuracyPct: 99
      }
    ];
  });

  const [newLogSurah, setNewLogSurah] = useState<string>('Surah Al-Qadr (97:1–5)');
  const [newLogTier, setNewLogTier] = useState<HifzLogEntry['tier']>('Sabaq (New)');
  const [newLogLines, setNewLogLines] = useState<number>(5);

  useEffect(() => {
    try {
      localStorage.setItem('noor_juz30_statuses', JSON.stringify(surahStatuses));
    } catch {
      // Ignore
    }
  }, [surahStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem('noor_hifz_logs', JSON.stringify(sessionLogs));
    } catch {
      // Ignore
    }
  }, [sessionLogs]);

  // Mathematical Calculation of 15-Line Madani Mushaf Completion
  // Total Mushaf: 604 pages * 15 lines = 9,060 lines (~302 lines per Juz)
  const totalMushafLines = 9060;
  const completedLines = Math.min(totalMushafLines, completedJuz * 302);
  const remainingLines = Math.max(0, totalMushafLines - completedLines);
  const weeklyLinesRate = dailyLines * daysPerWeek;
  const weeksToCompleteAll = Math.ceil(remainingLines / Math.max(1, weeklyLinesRate));
  const monthsToCompleteSingleJuz = (302 / Math.max(1, weeklyLinesRate) / 4.33).toFixed(1);
  const yearsToCompleteFullQuran = (weeksToCompleteAll / 52).toFixed(1);

  // Daily Sabqi (Recent Review) and Manzil (Long-term Revision) prescription
  const recommendedSabqiPages = Math.max(2, Math.min(10, Math.ceil(dailyLines / 3) * 2));
  const recommendedManzilPages = completedJuz > 0 ? Math.max(5, Math.min(20, completedJuz * 2)) : 3;

  const cycleSurahStatus = (surahNumber: number) => {
    setSurahStatuses((prev) => {
      const current = prev[surahNumber] || 'unstarted';
      const next: SurahStatus =
        current === 'unstarted' ? 'sabqi' : current === 'sabqi' ? 'mutqin' : 'unstarted';
      return { ...prev, [surahNumber]: next };
    });
  };

  const handleAddSessionLog = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: HifzLogEntry = {
      id: `log-${Date.now()}`,
      date: 'Today',
      surahName: newLogSurah,
      tier: newLogTier,
      linesCompleted: newLogLines,
      accuracyPct: 98
    };
    setSessionLogs((prev) => [entry, ...prev.slice(0, 5)]);
  };

  const handleResetChecklist = () => {
    setDailyLines(5);
    setDaysPerWeek(5);
    setCompletedJuz(2);
  };

  const masteredCount = JUZ_AMMA_SURAHS.filter(
    (s) => surahStatuses[s.number] === 'mutqin'
  ).length;
  const sabqiCount = JUZ_AMMA_SURAHS.filter(
    (s) => surahStatuses[s.number] === 'sabqi'
  ).length;

  return (
    <section
      id="hifz-tracker"
      className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[#E6E4DD]"
      aria-labelledby="hifz-planner-heading"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-xs font-medium text-[#5A625C]">
            03. Spaced-Repetition Memorization Architecture
          </p>
          <h2
            id="hifz-planner-heading"
            className="mt-1 font-display text-2xl md:text-3xl font-semibold text-[#141815]"
          >
            Three-Tier Hifz Jadwal Calculator & Juz Amma Ledger
          </h2>
          <p className="mt-2 max-w-[68ch] text-sm md:text-base text-[#5A625C] leading-relaxed">
            Model your daily 15-line Madani Mushaf pace across Sabaq (new lines), Sabqi (active Juz consolidation), and Manzil (long-term cycle), or track your Juz Amma Surah mastery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetChecklist}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#5A625C] hover:text-[#141815] border border-[#D5D2C8] rounded-lg bg-white transition-colors self-start whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset Calculator Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Cadence Calculator & 3-Tier Output (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[#E6E4DD] bg-white p-6 md:p-7">
          <h3 className="font-display text-lg font-semibold text-[#141815]">
            15-Line Madani Mushaf Pace Modeler
          </h3>
          <p className="mt-1 text-xs text-[#5A625C]">
            Adjust sliders to compute your personalized retention schedule.
          </p>

          <div className="mt-6 space-y-5">
            {/* Slider 1 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="daily-lines-slider" className="font-medium text-[#141815]">
                  Daily New Memorization (Sabaq)
                </label>
                <span className="font-mono tabular-nums font-semibold text-[#0B5D46]">
                  {dailyLines} {dailyLines === 15 ? 'lines (1 Full Page)/day' : 'lines/day'}
                </span>
              </div>
              <input
                id="daily-lines-slider"
                type="range"
                min="2"
                max="15"
                step="1"
                value={dailyLines}
                onChange={(e) => setDailyLines(parseInt(e.target.value, 10))}
                className="w-full accent-[#0B5D46] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5A625C] font-mono tabular-nums mt-1">
                <span>2 lines (Light)</span>
                <span>7 lines (Half Page)</span>
                <span>15 lines (1 Page)</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="days-week-slider" className="font-medium text-[#141815]">
                  Active Sabaq Days per Week
                </label>
                <span className="font-mono tabular-nums font-semibold text-[#0B5D46]">
                  {daysPerWeek} days/week
                </span>
              </div>
              <input
                id="days-week-slider"
                type="range"
                min="2"
                max="6"
                step="1"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value, 10))}
                className="w-full accent-[#0B5D46] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5A625C] font-mono tabular-nums mt-1">
                <span>2 days/wk</span>
                <span>4 days/wk</span>
                <span>6 days/wk (+1 Audit Day)</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="completed-juz-slider" className="font-medium text-[#141815]">
                  Current Juz Already Memorized
                </label>
                <span className="font-mono tabular-nums font-semibold text-[#141815]">
                  {completedJuz} / 30 Juz ({Math.round((completedJuz / 30) * 100)}%)
                </span>
              </div>
              <input
                id="completed-juz-slider"
                type="range"
                min="0"
                max="29"
                step="1"
                value={completedJuz}
                onChange={(e) => setCompletedJuz(parseInt(e.target.value, 10))}
                className="w-full accent-[#0B5D46] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5A625C] font-mono tabular-nums mt-1">
                <span>0 Juz</span>
                <span>15 Juz (Half Mushaf)</span>
                <span>29 Juz</span>
              </div>
            </div>
          </div>

          {/* Computed Projection Readout (Unboxed Tabular Metrics) */}
          <div className="mt-6 pt-6 border-t border-[#E6E4DD] grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#FAF9F5] p-3.5 border border-[#E6E4DD]">
              <p className="text-xs text-[#5A625C]">Time per Single Juz</p>
              <p className="mt-1 font-mono tabular-nums text-xl font-semibold text-[#141815]">
                {monthsToCompleteSingleJuz} months
              </p>
              <p className="mt-0.5 text-[11px] text-[#5A625C] tabular-nums">
                At {weeklyLinesRate} lines/week
              </p>
            </div>

            <div className="rounded-lg bg-[#FAF9F5] p-3.5 border border-[#E6E4DD]">
              <p className="text-xs text-[#5A625C]">Full Khatmah Projection</p>
              <p className="mt-1 font-mono tabular-nums text-xl font-semibold text-[#0B5D46]">
                {yearsToCompleteFullQuran} years
              </p>
              <p className="mt-0.5 text-[11px] text-[#5A625C] tabular-nums">
                {remainingLines.toLocaleString()} lines remaining
              </p>
            </div>
          </div>

          {/* Prescribed Daily 3-Tier Distribution */}
          <div className="mt-5 rounded-lg bg-[#FAF9F5] p-4 border border-[#E6E4DD] space-y-2.5 text-xs">
            <p className="font-semibold text-[#141815]">
              Prescribed Daily Jadwal Ratio (100% Retention Protocol)
            </p>
            <div className="flex items-center justify-between text-[#5A625C]">
              <span>1. Sabaq (New Memorization):</span>
              <span className="font-mono tabular-nums font-semibold text-[#141815]">
                {dailyLines} lines (20 mins)
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5A625C]">
              <span>2. Sabqi (Last 14 Days Consolidation):</span>
              <span className="font-mono tabular-nums font-semibold text-[#B45309]">
                {recommendedSabqiPages} pages (15 mins)
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5A625C]">
              <span>3. Manzil (Cumulative Old Juz Cycle):</span>
              <span className="font-mono tabular-nums font-semibold text-[#059669]">
                {recommendedManzilPages} pages (20 mins)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectHifzTrack}
            className="mt-6 w-full rounded-lg bg-[#0B5D46] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#094836] transition-colors whitespace-nowrap"
          >
            Assign This Hifz Jadwal to My Assessment
          </button>
        </div>

        {/* Right Column: Interactive Juz Amma Surah Mastery Matrix & Daily Log (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#E6E4DD] bg-white p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E4DD]">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#141815]">
                Interactive Juz Amma (Juz 30) Mastery Matrix
              </h3>
              <p className="text-xs text-[#5A625C]">
                Click any Surah card to cycle its audit state: ○ Unstarted → ▲ Sabqi Revision → ● Mastered (Mutqin)
              </p>
            </div>
            <div className="text-xs font-mono tabular-nums text-[#141815]">
              <span className="text-[#059669] font-semibold">● {masteredCount} Mutqin</span>
              <span className="mx-2 text-[#D5D2C8]">·</span>
              <span className="text-[#B45309] font-semibold">▲ {sabqiCount} Sabqi</span>
            </div>
          </div>

          {/* Grid of 12 Key Juz Amma Surahs */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {JUZ_AMMA_SURAHS.map((surah) => {
              const status = surahStatuses[surah.number] || 'unstarted';
              const statusLabel =
                status === 'mutqin'
                  ? '● MUTQIN (MASTERED)'
                  : status === 'sabqi'
                  ? '▲ SABQI (REVISION)'
                  : '○ UNSTARTED';
              const statusColor =
                status === 'mutqin'
                  ? 'border-[#059669] bg-[#059669]/5 text-[#059669]'
                  : status === 'sabqi'
                  ? 'border-[#B45309] bg-[#B45309]/5 text-[#B45309]'
                  : 'border-[#E6E4DD] bg-[#FAF9F5] text-[#5A625C]';

              return (
                <button
                  key={surah.number}
                  type="button"
                  onClick={() => cycleSurahStatus(surah.number)}
                  className={`text-left rounded-lg border p-3 transition-colors hover:border-[#0B5D46] ${statusColor}`}
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs font-semibold text-[#141815] truncate">
                      {surah.number}. {surah.name}
                    </span>
                    <span lang="ar" className="font-arabic text-base font-bold text-[#141815]">
                      {surah.arabicName}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#5A625C] font-mono tabular-nums">
                    {surah.ayahCount} Ayahs · {surah.linesCount}L
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-semibold tracking-tight whitespace-nowrap">
                    {statusLabel}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Daily Recitation Log Form */}
          <div className="mt-7 pt-6 border-t border-[#E6E4DD]">
            <h4 className="text-xs font-semibold text-[#141815] mb-3">
              Log Daily Recitation Entry (Persisted in Browser Ledger)
            </h4>
            <form onSubmit={handleAddSessionLog} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-5">
                <label htmlFor="log-surah-select" className="sr-only">
                  Select Surah or Passage
                </label>
                <select
                  id="log-surah-select"
                  value={newLogSurah}
                  onChange={(e) => setNewLogSurah(e.target.value)}
                  className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3 py-2 text-xs text-[#141815]"
                >
                  {JUZ_AMMA_SURAHS.map((s) => (
                    <option key={s.number} value={`Surah ${s.name} (${s.number}:1–${s.ayahCount})`}>
                      Surah {s.name} ({s.number}:1–{s.ayahCount})
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="log-tier-select" className="sr-only">
                  Select Revision Tier
                </label>
                <select
                  id="log-tier-select"
                  value={newLogTier}
                  onChange={(e) => setNewLogTier(e.target.value as HifzLogEntry['tier'])}
                  className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3 py-2 text-xs text-[#141815]"
                >
                  <option value="Sabaq (New)">Sabaq (New)</option>
                  <option value="Sabqi (Recent)">Sabqi (Recent)</option>
                  <option value="Manzil (Long-Term)">Manzil (Long-Term)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="log-lines-input" className="sr-only">
                  Lines Recited
                </label>
                <input
                  id="log-lines-input"
                  type="number"
                  min={1}
                  max={30}
                  value={newLogLines}
                  onChange={(e) => setNewLogLines(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3 py-2 text-xs font-mono tabular-nums text-[#141815]"
                  aria-label="Lines recited"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full inline-flex items-center justify-center gap-1 rounded-lg bg-[#141815] px-3 py-2 text-xs font-medium text-white hover:bg-[#2A302C] transition-colors whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Log
                </button>
              </div>
            </form>

            {/* Recent Ledger Rows (No Table Dot Scatter, Clean Unboxed Tabular Numerals) */}
            <div className="mt-4 divide-y divide-[#E6E4DD] border-t border-b border-[#E6E4DD]">
              {sessionLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 text-[#141815]">
                    <span className="font-medium">{entry.surahName}</span>
                    <span className="text-[#5A625C]" aria-hidden="true">·</span>
                    <span className="text-[#5A625C]">{entry.tier}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums text-[#5A625C]">
                    <span>{entry.linesCompleted} lines</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#059669] font-medium">{entry.accuracyPct}% Audit</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
