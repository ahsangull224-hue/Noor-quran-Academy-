import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import {
  PRACTICE_AYAHS,
  TAJWEED_RULES,
  MAKHARIJ_ZONES,
  TajweedRuleType,
  PracticeAyah,
  WordSegment,
  MakhrajPoint
} from '../data/academyData';
import { quranAudio } from '../utils/quranAudio';

interface TajweedSimulationLabProps {
  onRequestAssessmentWithTrack: (trackTitle: string) => void;
}

export const TajweedSimulationLab: React.FC<TajweedSimulationLabProps> = ({
  onRequestAssessmentWithTrack
}) => {
  const [labStage, setLabStage] = useState<'verse-analyzer' | 'makharij-map'>('verse-analyzer');
  const [selectedAyahId, setSelectedAyahId] = useState<string>(PRACTICE_AYAHS[0].id);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [highlightedRuleFilter, setHighlightedRuleFilter] = useState<TajweedRuleType | 'all'>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [targetMaddBeats, setTargetMaddBeats] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSourceStatus, setAudioSourceStatus] = useState<string>('Ready · Studio Audio Engine');
  const [activeMakhrajId, setActiveMakhrajId] = useState<MakhrajPoint['id']>('halq');
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(0);
  const [practicedItems, setPracticedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('noor_practiced_phonemes');
      return saved ? JSON.parse(saved) : ['fatihah-1:w1', 'halq:0'];
    } catch {
      return ['fatihah-1:w1', 'halq:0'];
    }
  });

  const currentAyah: PracticeAyah =
    PRACTICE_AYAHS.find((a) => a.id === selectedAyahId) || PRACTICE_AYAHS[0];
  const currentWord: WordSegment =
    currentAyah.words[activeWordIndex] || currentAyah.words[0];
  const currentRuleMeta = TAJWEED_RULES[currentWord.rule];
  const currentMakhraj: MakhrajPoint =
    MAKHARIJ_ZONES.find((m) => m.id === activeMakhrajId) || MAKHARIJ_ZONES[0];
  const currentLetter =
    currentMakhraj.letters[activeLetterIdx] || currentMakhraj.letters[0];

  useEffect(() => {
    try {
      localStorage.setItem('noor_practiced_phonemes', JSON.stringify(practicedItems));
    } catch {
      // Ignore storage errors
    }
  }, [practicedItems]);

  useEffect(() => {
    return () => {
      quranAudio.stopAll();
    };
  }, []);

  const markPracticed = (key: string) => {
    setPracticedItems((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const handleSelectAyah = (ayahId: string) => {
    quranAudio.stopAll();
    setIsPlaying(false);
    setSelectedAyahId(ayahId);
    setActiveWordIndex(0);
  };

  const handlePlayFullAyah = () => {
    if (isPlaying) {
      quranAudio.stopAll();
      setIsPlaying(false);
      setAudioSourceStatus('Paused');
      return;
    }

    setIsPlaying(true);
    setAudioSourceStatus('Streaming Recitation · Sheikh Mishary Alafasy');

    quranAudio.playAyah(
      currentAyah.globalAyahNumber,
      currentAyah.fullArabic,
      playbackSpeed,
      () => {
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);
        setAudioSourceStatus('Recitation Complete · Verified Cadence');
        markPracticed(`${currentAyah.id}:full`);
      },
      (mode) => {
        if (mode === 'cdn') {
          setAudioSourceStatus('Active · Mishary Alafasy 128kbps Recitation');
        } else {
          setAudioSourceStatus('Active · Formant & Arabic Phonetic Synthesis');
        }
      }
    );
  };

  const handlePlaySingleWord = (index: number) => {
    const word = currentAyah.words[index];
    if (!word) return;
    setActiveWordIndex(index);
    setActiveMakhrajId(word.makhrajZone);
    setIsPlaying(true);
    setAudioSourceStatus(`Auditioning Word: ${word.transliteration} (${TAJWEED_RULES[word.rule].shortLabel})`);

    const effectiveBeats = word.rule === 'madd' ? targetMaddBeats : word.beats;
    const baseFreq = word.rule === 'tafkheem' ? 185 : word.rule === 'qalqalah' ? 255 : 220;

    quranAudio.playWordOrPhoneme(
      word.arabic,
      baseFreq,
      effectiveBeats,
      playbackSpeed,
      () => {
        setIsPlaying(false);
        setAudioSourceStatus(`Analyzed · ${word.transliteration} (${effectiveBeats} Harakat)`);
        markPracticed(`${currentAyah.id}:${word.id}`);
      }
    );
  };

  const handleStepNextWord = () => {
    const nextIdx = (activeWordIndex + 1) % currentAyah.words.length;
    handlePlaySingleWord(nextIdx);
  };

  const handleResetLab = () => {
    quranAudio.stopAll();
    setIsPlaying(false);
    setActiveWordIndex(0);
    setHighlightedRuleFilter('all');
    setPlaybackSpeed(1.0);
    setTargetMaddBeats(4);
    setAudioSourceStatus('Reset · Ready for Diagnostic Audition');
  };

  const handleAuditionMakhrajLetter = (zone: MakhrajPoint, letterIdx: number) => {
    setActiveMakhrajId(zone.id);
    setActiveLetterIdx(letterIdx);
    const letterObj = zone.letters[letterIdx];
    if (!letterObj) return;

    setIsPlaying(true);
    setAudioSourceStatus(`Articulating ${letterObj.name} · ${zone.arabicTitle}`);
    quranAudio.playWordOrPhoneme(
      letterObj.exampleArabic,
      letterObj.baseFreq,
      2,
      playbackSpeed,
      () => {
        setIsPlaying(false);
        setAudioSourceStatus(`Completed · ${letterObj.name} (${letterObj.exampleArabic})`);
        markPracticed(`${zone.id}:${letterIdx}`);
      }
    );
  };

  // Build SVG path for the active word's acoustic pitch contour
  const contourPoints = currentWord.pitchContour.map((val, idx) => {
    const x = 60 + idx * 110;
    const y = 145 - val * 95;
    return { x, y, val };
  });
  const polylineString = contourPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <section
      id="tajweed-lab"
      className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[#E6E4DD]"
      aria-labelledby="tajweed-lab-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-xs font-medium text-[#5A625C] tracking-normal">
            01. Interactive Phonetics & Recitation Sandbox
          </p>
          <h2
            id="tajweed-lab-heading"
            className="mt-1 font-display text-2xl md:text-3xl font-semibold text-[#141815]"
          >
            Tajweed Acoustic & Makharij Diagnostic Lab
          </h2>
          <p className="mt-2 max-w-[68ch] text-sm md:text-base text-[#5A625C] leading-relaxed">
            Inspect word-by-word Tajweed rules, audition authentic recitation audio, and trace exact vocal-tract articulation stations before your live scholar assessment.
          </p>
        </div>

        {/* Stage Switcher (Interactive Segmented Control) */}
        <div
          className="inline-flex items-center gap-1 rounded-lg bg-[#EFECE4] p-1 self-start"
          role="tablist"
          aria-label="Simulation Stage Switcher"
        >
          <button
            type="button"
            role="tab"
            aria-selected={labStage === 'verse-analyzer'}
            onClick={() => {
              quranAudio.stopAll();
              setIsPlaying(false);
              setLabStage('verse-analyzer');
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              labStage === 'verse-analyzer'
                ? 'bg-white text-[#141815] shadow-xs'
                : 'text-[#5A625C] hover:text-[#141815]'
            }`}
          >
            Stage 1: Verse Tajweed & Pitch Curve
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={labStage === 'makharij-map'}
            onClick={() => {
              quranAudio.stopAll();
              setIsPlaying(false);
              setLabStage('makharij-map');
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              labStage === 'makharij-map'
                ? 'bg-white text-[#141815] shadow-xs'
                : 'text-[#5A625C] hover:text-[#141815]'
            }`}
          >
            Stage 2: Vocal-Tract Makharij Map
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (65% Left Interactive Stage / 35% Right Control & Concept Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT ZONE: Interactive Stage (8 cols on 12-col grid = 66.6%) */}
        <div className="lg:col-span-8 rounded-xl border border-[#E6E4DD] bg-white p-6 md:p-8">
          {labStage === 'verse-analyzer' ? (
            <div>
              {/* Top Surah Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6E4DD]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PRACTICE_AYAHS.map((ayah) => (
                    <button
                      key={ayah.id}
                      type="button"
                      onClick={() => handleSelectAyah(ayah.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        selectedAyahId === ayah.id
                          ? 'bg-[#0B5D46] text-white'
                          : 'bg-[#F5F3EE] text-[#5A625C] hover:text-[#141815]'
                      }`}
                    >
                      {ayah.reference}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-[#5A625C] tabular-nums">
                  <span>{currentAyah.surahArabic}</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>{currentAyah.revelationPlace}</span>
                </div>
              </div>

              {/* Full Ayah Display Banner */}
              <div className="my-6 rounded-lg bg-[#FAF9F5] p-6 border border-[#E6E4DD]">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-medium text-[#5A625C]">
                    Interactive Word-by-Word Mushaf Stage (Click any word to audition phonetics)
                  </span>
                  <span className="text-xs font-mono tabular-nums text-[#0B5D46]">
                    {audioSourceStatus}
                  </span>
                </div>

                {/* Right-to-Left Interactive Word Segments */}
                <div
                  dir="rtl"
                  className="flex flex-wrap items-center justify-center gap-4 py-4"
                >
                  {currentAyah.words.map((word, idx) => {
                    const ruleMeta = TAJWEED_RULES[word.rule];
                    const isSelected = idx === activeWordIndex;
                    const isDimmed =
                      highlightedRuleFilter !== 'all' && word.rule !== highlightedRuleFilter;
                    const isPracticed = practicedItems.includes(`${currentAyah.id}:${word.id}`);

                    return (
                      <button
                        key={word.id}
                        type="button"
                        onClick={() => handlePlaySingleWord(idx)}
                        className={`group relative flex flex-col items-center rounded-lg px-4 py-3 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0B5D46] ${
                          isSelected
                            ? `border-2 ${ruleMeta.borderClass} ${ruleMeta.bgClass} -translate-y-0.5`
                            : 'border border-[#E6E4DD] bg-white hover:border-[#0B5D46]/50'
                        } ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
                      >
                        <span
                          lang="ar"
                          className={`font-arabic text-3xl md:text-4xl leading-relaxed tracking-wide ${ruleMeta.textClass}`}
                        >
                          {word.arabic}
                        </span>
                        <span
                          dir="ltr"
                          className="mt-1.5 text-xs font-medium text-[#141815] whitespace-nowrap"
                        >
                          {word.transliteration}
                        </span>
                        <span
                          dir="ltr"
                          className={`mt-1 text-[11px] font-mono tabular-nums whitespace-nowrap ${ruleMeta.textClass}`}
                        >
                          {ruleMeta.shortLabel}
                        </span>
                        {isPracticed && (
                          <span
                            dir="ltr"
                            className="mt-1 text-[10px] text-[#059669] font-medium"
                          >
                            ✓ Audited
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-center text-sm text-[#5A625C] italic">
                  “{currentAyah.fullTranslation}”
                </p>
              </div>

              {/* Scientific Pitch Contour & Harakat Duration Curve */}
              <div className="mt-6 pt-6 border-t border-[#E6E4DD]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#141815]">
                      Acoustic Pitch & Harakat Elongation Curve — “{currentWord.transliteration}” ({currentWord.arabic})
                    </h3>
                    <p className="text-xs text-[#5A625C]">
                      Rule: {currentRuleMeta.name} · Target Duration:{' '}
                      <span className="font-mono tabular-nums font-semibold text-[#141815]">
                        {currentWord.rule === 'madd' ? targetMaddBeats : currentWord.beats} Harakat
                      </span>{' '}
                      · Articulation Zone: {currentWord.makhrajZone.toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-xs font-mono tabular-nums font-semibold ${currentRuleMeta.textClass}`}>
                    {currentRuleMeta.shortLabel}
                  </span>
                </div>

                {/* Live Coordinate Axes SVG */}
                <div className="rounded-lg border border-[#E6E4DD] bg-[#FAF9F5] p-4">
                  <svg
                    viewBox="0 0 560 175"
                    className="w-full h-40 overflow-visible"
                    role="img"
                    aria-label={`Acoustic pitch contour and Harakat timing graph for ${currentWord.transliteration}`}
                  >
                    {/* Horizontal Grid Lines */}
                    <line x1="50" y1="35" x2="520" y2="35" stroke="#E2E0D8" strokeDasharray="3 3" />
                    <line x1="50" y1="85" x2="520" y2="85" stroke="#E2E0D8" strokeDasharray="3 3" />
                    <line x1="50" y1="135" x2="520" y2="135" stroke="#CBD5E1" strokeWidth="1" />

                    {/* Y-Axis Labels */}
                    <text x="10" y="39" className="fill-[#5A625C] text-[10px] font-mono">
                      High F2
                    </text>
                    <text x="10" y="89" className="fill-[#5A625C] text-[10px] font-mono">
                      Nominal
                    </text>
                    <text x="10" y="139" className="fill-[#5A625C] text-[10px] font-mono">
                      Rest
                    </text>

                    {/* Shaded Area under Curve */}
                    <polygon
                      points={`60,135 ${polylineString} 500,135`}
                      fill={currentRuleMeta.colorHex}
                      fillOpacity="0.12"
                    />

                    {/* Main Acoustic Curve Line */}
                    <polyline
                      fill="none"
                      stroke={currentRuleMeta.colorHex}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineString}
                    />

                    {/* Data Nodes & Beat Timestamps */}
                    {contourPoints.map((pt, idx) => {
                      const beatTime = (
                        ((idx + 1) *
                          (currentWord.rule === 'madd' ? targetMaddBeats : currentWord.beats)) /
                        5
                      ).toFixed(1);
                      return (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isPlaying ? 6 : 4.5}
                            fill="#FFFFFF"
                            stroke={currentRuleMeta.colorHex}
                            strokeWidth="2.5"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 10}
                            textAnchor="middle"
                            className="fill-[#141815] text-[10px] font-mono"
                          >
                            {Math.round(pt.val * 100)}%
                          </text>
                          <text
                            x={pt.x}
                            y="156"
                            textAnchor="middle"
                            className="fill-[#5A625C] text-[10px] font-mono"
                          >
                            {beatTime}h
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* STAGE 2: Interactive Vocal-Tract Makharij Diagram */
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6E4DD]">
                <div>
                  <h3 className="text-base font-semibold text-[#141815]">
                    Anatomical Makharij Al-Huroof Explorer (5 Major Vocal Stations)
                  </h3>
                  <p className="text-xs text-[#5A625C]">
                    Select a vocal-tract station on the diagram or buttons below to inspect airflow vectors and audition phoneme examples.
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#0B5D46]">
                  {audioSourceStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
                {/* Interactive Sagittal Vocal Tract SVG Diagram */}
                <div className="md:col-span-6 rounded-lg border border-[#E6E4DD] bg-[#FAF9F5] p-4">
                  <svg
                    viewBox="0 0 300 300"
                    className="w-full h-64"
                    role="img"
                    aria-label="Interactive sagittal cross-section of the human vocal tract showing the 5 Arabic Makharij articulation regions"
                  >
                    {/* Head / Vocal Tract Silhouette Outline */}
                    <path
                      d="M 90 40 Q 210 35 245 110 Q 265 165 250 230 L 245 280 L 185 280 L 185 235 Q 145 235 110 215 Q 70 210 68 185 L 82 170 L 65 155 L 78 140 L 55 125 L 85 90 Z"
                      fill="#F2EFE7"
                      stroke="#C7C3B8"
                      strokeWidth="2"
                    />
                    {/* Nasal Cavity Chamber (Al-Khayshum) */}
                    <path
                      d="M 88 108 Q 140 92 185 122 Q 150 132 95 126 Z"
                      fill={activeMakhrajId === 'khayshum' ? '#059669' : '#E2DFD5'}
                      fillOpacity={activeMakhrajId === 'khayshum' ? '0.28' : '0.6'}
                      stroke="#059669"
                      strokeWidth={activeMakhrajId === 'khayshum' ? '2' : '0.8'}
                    />
                    {/* Hard & Soft Palate + Tongue (Al-Lisan) */}
                    <path
                      d="M 92 165 Q 145 142 195 175 Q 165 198 102 185 Z"
                      fill={activeMakhrajId === 'lisan' ? '#0284C7' : '#E2DFD5'}
                      fillOpacity={activeMakhrajId === 'lisan' ? '0.28' : '0.6'}
                      stroke="#0284C7"
                      strokeWidth={activeMakhrajId === 'lisan' ? '2' : '0.8'}
                    />
                    {/* Pharynx / Throat Column (Al-Halq) */}
                    <path
                      d="M 208 175 L 235 175 L 235 268 L 208 268 Z"
                      rx="8"
                      fill={activeMakhrajId === 'halq' ? '#B45309' : '#E2DFD5'}
                      fillOpacity={activeMakhrajId === 'halq' ? '0.28' : '0.6'}
                      stroke="#B45309"
                      strokeWidth={activeMakhrajId === 'halq' ? '2' : '0.8'}
                    />

                    {/* Active Airflow Pathway Vector */}
                    <path
                      d={currentMakhraj.svgCoords.pathD}
                      fill="none"
                      stroke="#0B5D46"
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />

                    {/* Interactive Station Nodes */}
                    {MAKHARIJ_ZONES.map((zone) => {
                      const isActive = zone.id === activeMakhrajId;
                      return (
                        <g
                          key={zone.id}
                          onClick={() => {
                            setActiveMakhrajId(zone.id);
                            setActiveLetterIdx(0);
                          }}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={zone.svgCoords.cx}
                            cy={zone.svgCoords.cy}
                            r={isActive ? 13 : 9}
                            fill={isActive ? '#0B5D46' : '#FFFFFF'}
                            stroke="#0B5D46"
                            strokeWidth="2.5"
                          />
                          <text
                            x={zone.svgCoords.cx}
                            y={zone.svgCoords.cy + 3.5}
                            textAnchor="middle"
                            className={`text-[9px] font-mono font-semibold ${
                              isActive ? 'fill-white' : 'fill-[#141815]'
                            }`}
                          >
                            {zone.indexNumber}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-[#5A625C]">
                    <span>● Click numbered stations (01–05)</span>
                    <span>Dashed vector: Primary acoustic airstream</span>
                  </div>
                </div>

                {/* Station Selector & Phoneme Cards */}
                <div className="md:col-span-6 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {MAKHARIJ_ZONES.map((zone) => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => {
                          setActiveMakhrajId(zone.id);
                          setActiveLetterIdx(0);
                        }}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          activeMakhrajId === zone.id
                            ? 'bg-[#0B5D46] text-white'
                            : 'bg-[#F5F3EE] text-[#5A625C] hover:text-[#141815]'
                        }`}
                      >
                        {zone.indexNumber}. {zone.arabicTitle}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[#E6E4DD] bg-[#FAF9F5] p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-base font-semibold text-[#141815]">
                        {currentMakhraj.name}
                      </h4>
                      <span lang="ar" className="font-arabic text-xl text-[#0B5D46] font-bold">
                        {currentMakhraj.arabicTitle}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5A625C]">
                      {currentMakhraj.anatomicalRegion} · {currentMakhraj.airflowType}
                    </p>

                    <div className="mt-4 space-y-2.5">
                      {currentMakhraj.letters.map((ltr, idx) => {
                        const isSelected = idx === activeLetterIdx;
                        const isDone = practicedItems.includes(`${currentMakhraj.id}:${idx}`);
                        return (
                          <button
                            key={ltr.name}
                            type="button"
                            onClick={() => handleAuditionMakhrajLetter(currentMakhraj, idx)}
                            className={`w-full text-left rounded-lg p-3 border transition-colors flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-[#0B5D46] bg-white'
                                : 'border-[#E6E4DD] bg-white/60 hover:border-[#0B5D46]/40'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  lang="ar"
                                  className="font-arabic text-xl font-bold text-[#0B5D46]"
                                >
                                  {ltr.char}
                                </span>
                                <span className="text-xs font-semibold text-[#141815]">
                                  {ltr.name}
                                </span>
                                {isDone && (
                                  <span className="text-[11px] text-[#059669] font-medium">
                                    · Practiced
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-[#5A625C]">
                                {ltr.sifaat} · Example: <strong lang="ar" className="font-arabic text-sm text-[#141815]">{ltr.exampleArabic}</strong> ({ltr.exampleMeaning})
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0B5D46] whitespace-nowrap shrink-0">
                              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Audition
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ZONE: Control & Concept Deck (4 cols on 12-col grid = 33.3%) */}
        <div className="lg:col-span-4 rounded-xl border border-[#E6E4DD] bg-white p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6E4DD] pb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#141815]">
                  Phonetic Control Deck
                </h3>
                <p className="text-xs text-[#5A625C]">
                  Real-time cadence & rule parameters
                </p>
              </div>
              <span className="font-mono tabular-nums text-xs text-[#0B5D46] font-semibold">
                {practicedItems.length} Audited
              </span>
            </div>

            {/* Playback Transport Bar */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handlePlayFullAyah}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B5D46] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#094836] transition-colors whitespace-nowrap"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    Recite Full Ayah
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleStepNextWord}
                  title="Step to Next Word"
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] py-2.5 text-xs font-medium text-[#141815] hover:bg-[#EFECE4] transition-colors"
                >
                  <SkipForward className="h-3.5 w-3.5" aria-label="Next Word" />
                </button>
                <button
                  type="button"
                  onClick={handleResetLab}
                  title="Reset Simulation Parameters"
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] py-2.5 text-xs font-medium text-[#141815] hover:bg-[#EFECE4] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-label="Reset Parameters" />
                </button>
              </div>
            </div>

            {/* Labeled Parameter Sliders (Mandatory Explicit Label + Value + Unit) */}
            <div className="mt-6 space-y-4 border-t border-[#E6E4DD] pt-5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label htmlFor="tempo-slider" className="font-medium text-[#141815]">
                    Recitation Tempo (Tarteel Cadence)
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-[#0B5D46]">
                    {playbackSpeed.toFixed(2)}x speed
                  </span>
                </div>
                <input
                  id="tempo-slider"
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#0B5D46] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5A625C] font-mono tabular-nums mt-1">
                  <span>0.75x (Tahqeeq)</span>
                  <span>1.00x (Tarteel)</span>
                  <span>1.25x (Hadr)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label htmlFor="madd-slider" className="font-medium text-[#141815]">
                    Madd Elongation Target
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-[#B45309]">
                    {targetMaddBeats} Harakat (Beats)
                  </span>
                </div>
                <input
                  id="madd-slider"
                  type="range"
                  min="2"
                  max="6"
                  step="2"
                  value={targetMaddBeats}
                  onChange={(e) => setTargetMaddBeats(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0B5D46] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5A625C] font-mono tabular-nums mt-1">
                  <span>2h (Qasr)</span>
                  <span>4h (Tawassut)</span>
                  <span>6h (Ishba’)</span>
                </div>
              </div>
            </div>

            {/* Interactive Tajweed Rule Highlighter Filter */}
            <div className="mt-6 border-t border-[#E6E4DD] pt-5">
              <p className="text-xs font-medium text-[#141815] mb-2.5">
                Isolate Tajweed Rule on Stage
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setHighlightedRuleFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    highlightedRuleFilter === 'all'
                      ? 'bg-[#141815] text-white'
                      : 'bg-[#F5F3EE] text-[#5A625C] hover:text-[#141815]'
                  }`}
                >
                  All Rules
                </button>
                {(['ghunnah', 'madd', 'qalqalah', 'tafkheem'] as TajweedRuleType[]).map((rKey) => {
                  const r = TAJWEED_RULES[rKey];
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() =>
                        setHighlightedRuleFilter((prev) => (prev === r.id ? 'all' : r.id))
                      }
                      className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors whitespace-nowrap ${
                        highlightedRuleFilter === r.id
                          ? 'bg-[#0B5D46] text-white'
                          : 'bg-[#F5F3EE] text-[#141815] hover:bg-[#E6E4DD]'
                      }`}
                    >
                      {r.glyph} {r.id.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contextual Scholarly Annotation Callout */}
            <div className="mt-6 rounded-lg bg-[#FAF9F5] p-4 border border-[#E6E4DD]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#141815]">
                  {labStage === 'verse-analyzer'
                    ? `Diagnostic Note · ${currentWord.transliteration}`
                    : `Articulation Note · ${currentLetter.name}`}
                </span>
                <span className="font-arabic text-base font-bold text-[#0B5D46]" lang="ar">
                  {labStage === 'verse-analyzer' ? currentWord.arabic : currentLetter.char}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-[#5A625C] leading-relaxed">
                {labStage === 'verse-analyzer'
                  ? currentWord.ruleNote
                  : currentMakhraj.articulationGuide}
              </p>
              <p className="mt-2 text-[11px] font-mono text-[#141815]">
                Mechanism: {currentRuleMeta.acousticMechanism}
              </p>
            </div>
          </div>

          {/* Direct Action to Book Live Tajweed Evaluation */}
          <div className="border-t border-[#E6E4DD] pt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#5A625C]">
              <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" aria-hidden="true" />
              <span>Want 1-on-1 oral feedback?</span>
            </div>
            <button
              type="button"
              onClick={() => onRequestAssessmentWithTrack('Tajweed Phonetics & Makharij Mastery')}
              className="px-3.5 py-2 text-xs font-medium text-[#0B5D46] border border-[#0B5D46] rounded-lg hover:bg-[#0B5D46] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Book Oral Audit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
