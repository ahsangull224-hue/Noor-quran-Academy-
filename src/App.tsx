/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle2, ChevronDown, ChevronUp, Calendar, Copy, Check } from 'lucide-react';
import {
  COURSE_TRACKS,
  SCHOLARS,
  TESTIMONIALS,
  PRACTICE_AYAHS,
  CourseTrack
} from './data/academyData';
import { ResilientImage } from './components/ResilientImage';
import { TajweedSimulationLab } from './components/TajweedSimulationLab';
import { HifzPlannerSection } from './components/HifzPlannerSection';
import { AdsterraNativeBanner } from './components/AdsterraNativeBanner';
import { quranAudio } from './utils/quranAudio';

interface ConfirmedBooking {
  id: string;
  studentName: string;
  guardianOrStudentEmail: string;
  phone: string;
  learnerGroup: 'Child (Ages 5–12)' | 'Adult / Youth Brother' | 'Adult / Youth Sister';
  trackTitle: string;
  scholarName: string;
  timeSlot: string;
  readingLevel: string;
  bookedAt: string;
}

export default function App() {
  // Hero Recitation Preview State
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [heroAudioLabel, setHeroAudioLabel] = useState(
    'Listen to Sample Tarteel Recitation · Surah Al-Fatihah 1:1'
  );

  // Curriculum Filter & Syllabus Expansion State
  const [courseFilter, setCourseFilter] = useState<'all' | 'children' | 'adults' | 'ijazah'>('all');
  const [expandedSyllabusId, setExpandedSyllabusId] = useState<string>('tajweed-phonetics');

  // Scholar Directory Filter State
  const [scholarFilter, setScholarFilter] = useState<'all' | 'male' | 'female'>('all');

  // Admissions Form State
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [learnerGroup, setLearnerGroup] = useState<ConfirmedBooking['learnerGroup']>('Child (Ages 5–12)');
  const [selectedTrackTitle, setSelectedTrackTitle] = useState<string>(COURSE_TRACKS[0].title);
  const [selectedScholarName, setSelectedScholarName] = useState<string>(SCHOLARS[1].name);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Saturday · 15:00 UTC (10:00 EST)');
  const [readingLevel, setReadingLevel] = useState<string>('Reads connected Arabic with hesitation');
  const [formError, setFormError] = useState<string>('');
  const [copiedPrep, setCopiedPrep] = useState<boolean>(false);

  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>(() => {
    try {
      const saved = localStorage.getItem('noor_confirmed_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('noor_confirmed_bookings', JSON.stringify(confirmedBookings));
    } catch {
      // Ignore storage error
    }
  }, [confirmedBookings]);

  const handleToggleHeroAudio = () => {
    if (heroPlaying) {
      quranAudio.stopAll();
      setHeroPlaying(false);
      setHeroAudioLabel('Paused · Surah Al-Fatihah 1:1');
      return;
    }

    const fatihah = PRACTICE_AYAHS[0];
    setHeroPlaying(true);
    setHeroAudioLabel('Playing Recitation · Sheikh Mishary Rashid Alafasy');
    quranAudio.playAyah(
      fatihah.globalAyahNumber,
      fatihah.fullArabic,
      1.0,
      () => setHeroPlaying(true),
      () => {
        setHeroPlaying(false);
        setHeroAudioLabel('Completed · Replay Surah Al-Fatihah 1:1');
      }
    );
  };

  const scrollToAdmissionsWithPreset = (trackTitle?: string, scholarName?: string, genderPref?: 'male' | 'female') => {
    if (trackTitle) setSelectedTrackTitle(trackTitle);
    if (scholarName) setSelectedScholarName(scholarName);
    if (genderPref === 'female') {
      setLearnerGroup('Adult / Youth Sister');
    } else if (genderPref === 'male') {
      setLearnerGroup('Adult / Youth Brother');
    }
    const el = document.getElementById('admissions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredCourses: CourseTrack[] =
    courseFilter === 'all'
      ? COURSE_TRACKS
      : COURSE_TRACKS.filter((c) => c.category === courseFilter);

  const filteredScholars =
    scholarFilter === 'all'
      ? SCHOLARS
      : SCHOLARS.filter((s) => s.gender === scholarFilter);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = studentName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      setFormError('Please enter the student’s full name (at least 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Please provide a valid email address for the diagnostic link and rubric report.');
      return;
    }
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      setFormError('Please enter a valid contact phone or WhatsApp number (minimum 7 digits).');
      return;
    }

    const newBooking: ConfirmedBooking = {
      id: `NQA-${Math.floor(100000 + Math.random() * 900000)}`,
      studentName: trimmedName,
      guardianOrStudentEmail: trimmedEmail,
      phone: trimmedPhone,
      learnerGroup,
      trackTitle: selectedTrackTitle,
      scholarName: selectedScholarName,
      timeSlot: selectedTimeSlot,
      readingLevel,
      bookedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    setConfirmedBookings((prev) => [newBooking, ...prev]);
    setStudentName('');
    setEmail('');
    setPhone('');
  };

  const handleCopyPreparationBrief = (booking: ConfirmedBooking) => {
    const summaryText = `Noor Quran Academy — Diagnostic Assessment Confirmation\nReference ID: ${booking.id}\nStudent: ${booking.studentName} (${booking.learnerGroup})\nAcademic Track: ${booking.trackTitle}\nExaminer: ${booking.scholarName}\nScheduled Slot: ${booking.timeSlot}\nPreparation: Please have a 15-line Madani Mushaf or open the Tajweed Lab on Surah Al-Fatihah and Surah Al-Ikhlas.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopiedPrep(true);
        window.setTimeout(() => setCopiedPrep(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141815] selection:bg-[#0B5D46] selection:text-white">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 border-b border-[#E6E4DD] bg-[#FAF9F5]/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          {/* Zone 1: Brand Logo & Wordmark at Top-Left */}
          <a
            href="#"
            className="flex items-center gap-3 font-display text-lg md:text-xl font-semibold tracking-tight text-[#141815] whitespace-nowrap shrink-0"
          >
            <img
              src="/src/assets/images/noor_quran_academy_logo_1791454511997.jpg"
              alt="Noor Quran Academy Logo"
              referrerPolicy="no-referrer"
              className="h-11 w-11 md:h-12 md:w-12 rounded-xl object-cover shadow-xs border border-[#0B5D46]/25 shrink-0"
            />
            <span>Noor Quran Academy</span>
          </a>

          {/* Zone 2: 5 clean text navigation links with subtle hover underlines */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A625C]"
          >
            <a
              href="#tajweed-lab"
              className="hover:text-[#141815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Tajweed Lab
            </a>
            <a
              href="#curriculum"
              className="hover:text-[#141815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Curriculum
            </a>
            <a
              href="#hifz-tracker"
              className="hover:text-[#141815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Hifz Planner
            </a>
            <a
              href="#scholars"
              className="hover:text-[#141815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Scholars
            </a>
            <a
              href="#admissions"
              className="hover:text-[#141815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Admissions
            </a>
            <a
              href="https://arwf.org/4/e70892450ac9e884f6031c9eb0d15fcf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0B5D46] hover:underline underline-offset-4 font-semibold transition-colors whitespace-nowrap inline-flex items-center gap-0.5"
            >
              <span>Free Library</span>
              <span className="text-[10px]">↗</span>
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToAdmissionsWithPreset()}
              className="rounded-lg bg-[#0B5D46] px-4 py-2 text-xs font-medium text-white hover:bg-[#094836] transition-colors whitespace-nowrap shrink-0"
            >
              Schedule Diagnostic
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION: Proposition + Dominant 16:9 Focal Carrier + Adjacent Proof */}
        <section className="mx-auto max-w-[1200px] px-6 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Editorial Proposition (6 cols) */}
            <div className="lg:col-span-6">
              {/* Quiet Unboxed Regional & Institutional Trust Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A625C]">
                <span>Al-Azhar & Madinah Sanad Faculty</span>
                <span aria-hidden="true">·</span>
                <span>One-on-One Live Instruction</span>
                <span aria-hidden="true">·</span>
                <span>Ages 5 to Adult</span>
              </div>

              <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold leading-[1.12] tracking-tight text-[#141815]">
                Recite, Memorize, and Understand the Quran with Unbroken Sanad Precision.
              </h1>

              <p className="mt-5 max-w-[62ch] text-base text-[#5A625C] leading-relaxed">
                Noor Quran Academy pairs children, youth, and adults with Ijazah-certified male and female scholars for structured 1-on-1 instruction in Makharij phonetics, three-tier Hifz retention, and classical Quranic Arabic.
              </p>

              {/* Single Primary CTA + Quiet Secondary Anchor */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToAdmissionsWithPreset()}
                  className="rounded-lg bg-[#0B5D46] px-5 py-3 text-sm font-medium text-white hover:bg-[#094836] transition-colors whitespace-nowrap"
                >
                  Schedule Free 30-Minute Oral Diagnostic
                </button>
                <a
                  href="#tajweed-lab"
                  className="px-4 py-3 text-sm font-medium text-[#141815] hover:text-[#0B5D46] underline underline-offset-4 transition-colors whitespace-nowrap"
                >
                  Explore Interactive Tajweed Lab
                </a>
              </div>

              {/* Claim-to-Proof Adjacency: Quantified Institutional Outcomes */}
              <div className="mt-10 pt-8 border-t border-[#E6E4DD] grid grid-cols-3 gap-6">
                <div>
                  <p className="font-mono tabular-nums text-2xl font-semibold text-[#141815]">
                    94.2%
                  </p>
                  <p className="mt-1 text-xs text-[#5A625C] leading-snug">
                    Makharij & Tajweed rubric mastery within 16 weeks of 2x/week study
                  </p>
                </div>
                <div>
                  <p className="font-mono tabular-nums text-2xl font-semibold text-[#141815]">
                    1,480+
                  </p>
                  <p className="mt-1 text-xs text-[#5A625C] leading-snug">
                    Juz memorizations audited and certified across 28 countries since 2019
                  </p>
                </div>
                <div>
                  <p className="font-mono tabular-nums text-2xl font-semibold text-[#141815]">
                    100%
                  </p>
                  <p className="mt-1 text-xs text-[#5A625C] leading-snug">
                    Faculty hold verified Ijazah in Hafs ‘an ‘Asim or Warsh ‘an Nafi’
                  </p>
                </div>
              </div>
            </div>

            {/* Right Dominant 16:9 Visual Asset + Live Audio Manuscript Preview (6 cols) */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-xl border border-[#E6E4DD] bg-white">
                <div className="relative aspect-video w-full overflow-hidden bg-[#14261F]">
                  <ResilientImage
                    src="/src/assets/images/hero_quran_manuscript_1791310292670.jpg"
                    alt="Open classical illuminated Quran manuscript resting on a carved walnut rehal stand in warm morning sunlight"
                    className="h-full w-full object-cover"
                    fallbackTitle="Al-Mushaf Ash-Shareef"
                    fallbackSubtitle="15-Line Classical Madani Script & Phonetic Study"
                  />
                  {/* Measured Contrast Scrim for Manuscript Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <p
                      lang="ar"
                      dir="rtl"
                      className="font-arabic text-2xl sm:text-3xl text-white leading-relaxed"
                    >
                      وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
                    </p>
                    <p className="mt-1 text-xs text-[#E6E4DD]">
                      “And recite the Quran with measured, distinct recitation (Tarteel).” — Surah Al-Muzzammil 73:4
                    </p>
                  </div>
                </div>

                {/* Interactive Audio Bar attached to Hero Manuscript */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white">
                  <div className="text-xs text-[#141815] font-medium truncate">
                    {heroAudioLabel}
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleHeroAudio}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF9F5] border border-[#D5D2C8] px-3 py-1.5 text-xs font-medium text-[#0B5D46] hover:bg-[#0B5D46] hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    {heroPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                        Pause Recitation
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        Play Tarteel Audio
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: INTERACTIVE TAJWEED & MAKHARIJ SANDBOX */}
        <TajweedSimulationLab
          onRequestAssessmentWithTrack={(trackTitle) =>
            scrollToAdmissionsWithPreset(trackTitle)
          }
        />

        {/* SECTION 02: STRUCTURED ACADEMIC CURRICULUM & SYLLABUS INSPECTOR */}
        <section
          id="curriculum"
          className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[#E6E4DD]"
          aria-labelledby="curriculum-heading"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="text-xs font-medium text-[#5A625C]">
                02. Structured Academic Tracks & Rubric Syllabi
              </p>
              <h2
                id="curriculum-heading"
                className="mt-1 font-display text-2xl md:text-3xl font-semibold text-[#141815]"
              >
                Curriculum Designed for Measurable Recitation Mastery
              </h2>
              <p className="mt-2 max-w-[68ch] text-sm md:text-base text-[#5A625C] leading-relaxed">
                Every student follows a milestone-graded syllabus with bi-weekly oral audits and written parent or adult progress dossiers.
              </p>
            </div>

            {/* Interactive Filter Tabs */}
            <div
              className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EFECE4] p-1 self-start"
              role="group"
              aria-label="Filter academic tracks by student group"
            >
              {[
                { id: 'all', label: 'All Tracks (3)' },
                { id: 'children', label: 'Children Ages 5–12' },
                { id: 'adults', label: 'Youth & Adults' },
                { id: 'ijazah', label: 'Sanad Ijazah' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCourseFilter(tab.id as typeof courseFilter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    courseFilter === tab.id
                      ? 'bg-white text-[#141815] shadow-xs'
                      : 'text-[#5A625C] hover:text-[#141815]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards with Expandable 4-Module Syllabus Matrix */}
          <div className="space-y-8">
            {filteredCourses.map((course) => {
              const isSyllabusOpen = expandedSyllabusId === course.id;
              return (
                <article
                  key={course.id}
                  className="rounded-xl border border-[#E6E4DD] bg-white p-6 md:p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* 4:3 Editorial Image Slot (4 cols) */}
                    <div className="lg:col-span-4">
                      <div className="aspect-4/3 w-full overflow-hidden rounded-lg border border-[#E6E4DD] bg-[#14261F]">
                        <ResilientImage
                          src={course.imageUrl}
                          alt={course.title}
                          className="h-full w-full object-cover"
                          fallbackTitle={course.title}
                          fallbackSubtitle={course.arabicSubtitle}
                        />
                      </div>
                      {/* Unboxed Metadata below thumbnail */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[#5A625C] font-mono tabular-nums">
                        <span>{course.durationWeeks} Weeks</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.sessionsPerWeek}x / week ({course.sessionMinutes}m)</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#141815] font-semibold">
                          ${course.tuitionMonthlyUsd}/mo
                        </span>
                      </div>
                    </div>

                    {/* Course Details & Syllabus Toggle (8 cols) */}
                    <div className="lg:col-span-8">
                      {/* Unboxed Kicker Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A625C]">
                        <div>
                          <span className="font-mono font-semibold text-[#0B5D46]">
                            Track {course.index}
                          </span>
                          <span className="mx-2" aria-hidden="true">·</span>
                          <span>{course.categoryLabel}</span>
                          <span className="mx-2" aria-hidden="true">·</span>
                          <span>{course.level}</span>
                        </div>
                        <span lang="ar" className="font-arabic text-base text-[#0B5D46] font-bold">
                          {course.arabicSubtitle}
                        </span>
                      </div>

                      <h3 className="mt-2 font-display text-xl md:text-2xl font-semibold text-[#141815]">
                        {course.index}. {course.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-[#5A625C] leading-relaxed max-w-[68ch]">
                        {course.summary}
                      </p>

                      {/* Concrete Outcomes List */}
                      <div className="mt-4 pt-4 border-t border-[#E6E4DD]">
                        <p className="text-xs font-semibold text-[#141815] mb-2">
                          Verified Graduation Outcomes:
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#5A625C]">
                          {course.outcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="font-mono text-[#0B5D46] font-semibold">
                                0{i + 1}.
                              </span>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => scrollToAdmissionsWithPreset(course.title)}
                          className="rounded-lg bg-[#0B5D46] px-4 py-2 text-xs font-medium text-white hover:bg-[#094836] transition-colors whitespace-nowrap"
                        >
                          Enroll in {course.title.split('&')[0].trim()}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedSyllabusId((prev) =>
                              prev === course.id ? '' : course.id
                            )
                          }
                          aria-expanded={isSyllabusOpen}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-4 py-2 text-xs font-medium text-[#141815] hover:bg-[#EFECE4] transition-colors whitespace-nowrap"
                        >
                          {isSyllabusOpen ? (
                            <>
                              Hide 4-Module Syllabus Rubric
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                            </>
                          ) : (
                            <>
                              Inspect 4-Module Syllabus & Rubric
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Expandable Syllabus & Assessment Rubric Matrix */}
                      {isSyllabusOpen && (
                        <div className="mt-6 pt-5 border-t border-[#E6E4DD] grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {course.syllabusModules.map((mod) => (
                            <div
                              key={mod.weekRange}
                              className="rounded-lg bg-[#FAF9F5] p-4 border border-[#E6E4DD]"
                            >
                              <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[#0B5D46] font-semibold">
                                <span>{mod.weekRange}</span>
                                <span>Oral Jury Check</span>
                              </div>
                              <h4 className="mt-1 text-xs font-semibold text-[#141815]">
                                {mod.title}
                              </h4>
                              <p className="mt-1 text-xs text-[#5A625C] leading-relaxed">
                                {mod.focus}
                              </p>
                              <p className="mt-2 pt-2 border-t border-[#E6E4DD] text-[11px] font-mono text-[#141815]">
                                Rubric Standard: {mod.assessmentMetric}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SPONSORED PARTNER RESOURCE BANNER (Smartlink Unit 31761364) */}
        <section className="mx-auto max-w-[1200px] px-6 py-4" aria-label="Sponsored Learning Resources">
          <div className="rounded-xl border border-[#0B5D46]/25 bg-gradient-to-r from-[#052219] via-[#093527] to-[#0D4433] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-mono tracking-wider text-[#D4AF37]">
                <span>PARTNER SPOTLIGHT</span>
                <span>·</span>
                <span>FREE EDUCATIONAL RESOURCES</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-white">
                Complimentary Quranic Study Guides & Digital E-Books
              </h3>
              <p className="text-xs md:text-sm text-[#D5E2DC] max-w-[62ch] leading-relaxed">
                Access curated Tajweed rule charts, vocabulary reference lists, and authentic digital learning resources provided by our educational partners.
              </p>
            </div>
            <a
              href="https://arwf.org/4/e70892450ac9e884f6031c9eb0d15fcf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-xs font-semibold text-[#141815] hover:bg-[#E5C158] transition-colors whitespace-nowrap shrink-0 shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Access Partner Library</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        {/* NATIVE BANNER AD (Adsterra Unit 31761365) */}
        <AdsterraNativeBanner />

        {/* SECTION 03: INTERACTIVE HIFZ & SPACED-REPETITION PLANNER */}
        <HifzPlannerSection
          onSelectHifzTrack={() =>
            scrollToAdmissionsWithPreset('Structured Hifz & Unbroken Sanad Ijazah')
          }
        />

        {/* SECTION 04: CERTIFIED SCHOLARS & ATTRIBUTABLE PROOF OF IMPACT */}
        <section
          id="scholars"
          className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[#E6E4DD]"
          aria-labelledby="scholars-heading"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="text-xs font-medium text-[#5A625C]">
                04. Sanad Faculty & Student Outcomes
              </p>
              <h2
                id="scholars-heading"
                className="mt-1 font-display text-2xl md:text-3xl font-semibold text-[#141815]"
              >
                Examine Your Recitation with Ijazah-Certified Scholars
              </h2>
              <p className="mt-2 max-w-[68ch] text-sm md:text-base text-[#5A625C] leading-relaxed">
                Choose between male Qaris and dedicated female Ustadhas holding verified chains of transmission from Al-Azhar University, Madinah, and Amman.
              </p>
            </div>

            {/* Interactive Gender / Faculty Filter */}
            <div
              className="inline-flex items-center gap-1 rounded-lg bg-[#EFECE4] p-1 self-start"
              role="group"
              aria-label="Filter scholars by instructor group"
            >
              {[
                { id: 'all', label: 'All Faculty (4)' },
                { id: 'female', label: 'Female Ustadhas (Sisters & Kids)' },
                { id: 'male', label: 'Male Shaykhs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScholarFilter(tab.id as typeof scholarFilter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    scholarFilter === tab.id
                      ? 'bg-white text-[#141815] shadow-xs'
                      : 'text-[#5A625C] hover:text-[#141815]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scholar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredScholars.map((scholar) => (
              <div
                key={scholar.id}
                className="rounded-xl border border-[#E6E4DD] bg-white p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Quiet Unboxed Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A625C] font-mono tabular-nums">
                    <span className="text-[#0B5D46] font-semibold">
                      {scholar.yearsTeaching} Years Teaching
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{scholar.studentsGraduated} Students Audited</span>
                    <span aria-hidden="true">·</span>
                    <span>{scholar.languages.join(' / ')}</span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-semibold text-[#141815]">
                    {scholar.name}
                  </h3>
                  <p className="text-xs font-medium text-[#0B5D46] mt-0.5">
                    {scholar.title}
                  </p>

                  <p className="mt-3 text-xs text-[#5A625C] leading-relaxed">
                    {scholar.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#E6E4DD] space-y-1.5 text-xs">
                    <p className="text-[#141815]">
                      <span className="text-[#5A625C]">Alma Mater:</span> {scholar.almaMater}
                    </p>
                    <p className="text-[#141815]">
                      <span className="text-[#5A625C]">Sanad Authority:</span> {scholar.qiraatChain}
                    </p>
                    <p className="text-[#141815]">
                      <span className="text-[#5A625C]">Focus Areas:</span>{' '}
                      {scholar.specialties.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E4DD] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-mono tabular-nums text-[#5A625C]">
                    Next Diagnostic Slot: <strong className="text-[#141815]">{scholar.nextAvailableSlot}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      scrollToAdmissionsWithPreset(
                        undefined,
                        scholar.name,
                        scholar.gender
                      )
                    }
                    className="rounded-lg border border-[#0B5D46] px-3.5 py-2 text-xs font-medium text-[#0B5D46] hover:bg-[#0B5D46] hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    Request {scholar.name.split(' ')[0]} {scholar.name.split(' ')[1]}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Attributable Student & Parent Testimonials (Claim-to-Proof Adjacency) */}
          <div className="mt-14 pt-12 border-t border-[#E6E4DD]">
            <div className="mb-8">
              <p className="text-xs font-medium text-[#5A625C]">
                Verified Student & Family Outcomes
              </p>
              <h3 className="mt-1 font-display text-xl md:text-2xl font-semibold text-[#141815]">
                Documented Progress Across Children, Professionals & Ijazah Candidates
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((item) => (
                <blockquote
                  key={item.id}
                  className="rounded-xl border border-[#E6E4DD] bg-white p-6 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-mono tabular-nums font-semibold text-[#0B5D46]">
                      {item.metric}
                    </p>
                    <p className="mt-3 text-sm text-[#141815] leading-relaxed">
                      “{item.quote}”
                    </p>
                  </div>
                  <footer className="mt-6 pt-4 border-t border-[#E6E4DD] text-xs">
                    <p className="font-semibold text-[#141815]">{item.name}</p>
                    <p className="text-[#5A625C] mt-0.5">
                      {item.role} · {item.organization}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: INTERACTIVE DIAGNOSTIC ASSESSMENT & ADMISSIONS FORM */}
        <section
          id="admissions"
          className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[#E6E4DD]"
          aria-labelledby="admissions-heading"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Explanation & Diagnostic Protocol (5 cols) */}
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-[#5A625C]">
                05. Admissions & Complimentary Oral Diagnostic
              </p>
              <h2
                id="admissions-heading"
                className="mt-1 font-display text-2xl md:text-3xl font-semibold text-[#141815]"
              >
                Schedule Your 30-Minute Diagnostic Recitation Audit
              </h2>
              <p className="mt-3 text-sm text-[#5A625C] leading-relaxed">
                Every new student begins with a private 30-minute diagnostic session with an Al-Azhar or Madinah certified instructor. There is no payment required for the diagnostic evaluation.
              </p>

              <div className="mt-6 space-y-4 border-t border-[#E6E4DD] pt-6 text-xs">
                <div>
                  <p className="font-semibold text-[#141815]">
                    01. Articulation & Makharij Mapping (10 Minutes)
                  </p>
                  <p className="mt-1 text-[#5A625C] leading-relaxed">
                    Your examiner listens to short passages from Juz Amma to chart throat, tongue, and nasal articulation accuracy.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#141815]">
                    02. Live Sample Lesson & Sight-Reading Check (12 Minutes)
                  </p>
                  <p className="mt-1 text-[#5A625C] leading-relaxed">
                    Experience our interactive digital 15-line Madani Mushaf annotation board and corrective phonetic drills.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#141815]">
                    03. Personalized 16-Week Study Plan & Jadwal (8 Minutes)
                  </p>
                  <p className="mt-1 text-[#5A625C] leading-relaxed">
                    Receive a written diagnostic scorecard and weekly Sabaq/Sabqi schedule tailored to your family or work calendar.
                  </p>
                </div>
              </div>

              {/* Confirmed Bookings List (If user has submitted one or more bookings) */}
              {confirmedBookings.length > 0 && (
                <div className="mt-8 rounded-xl border border-[#059669] bg-[#059669]/5 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Confirmed Diagnostic Assessment Dossier</span>
                  </div>
                  {confirmedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="mt-3 pt-3 border-t border-[#059669]/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono tabular-nums">
                        <span className="font-semibold text-[#141815]">Ref: {b.id}</span>
                        <span className="text-[#5A625C]">{b.bookedAt}</span>
                      </div>
                      <p className="text-[#141815] font-medium">
                        Student: {b.studentName} · {b.learnerGroup}
                      </p>
                      <p className="text-[#5A625C]">Track: {b.trackTitle}</p>
                      <p className="text-[#5A625C]">
                        Examiner: {b.scholarName} · {b.timeSlot}
                      </p>
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCopyPreparationBrief(b)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-white border border-[#D5D2C8] px-3 py-1.5 text-xs font-medium text-[#141815] hover:bg-[#FAF9F5] transition-colors"
                        >
                          {copiedPrep ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#059669]" aria-hidden="true" />
                              Copied Preparation Packet
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              Copy Preparation Brief
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Interactive Validated Booking Form (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-[#E6E4DD] bg-white p-6 md:p-8">
              <div className="flex items-center justify-between pb-5 border-b border-[#E6E4DD]">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#141815]">
                    Diagnostic Registration Dossier
                  </h3>
                  <p className="text-xs text-[#5A625C] mt-0.5">
                    Select student profile, academic track, and preferred scholar.
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-[#0B5D46] shrink-0" aria-hidden="true" />
              </div>

              <form onSubmit={handleBookingSubmit} className="mt-6 space-y-5" noValidate>
                {formError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#DC2626] bg-[#DC2626]/5 px-4 py-3 text-xs font-medium text-[#DC2626]"
                  >
                    ▲ Validation Notice: {formError}
                  </div>
                )}

                {/* Learner Group Selector */}
                <div>
                  <label className="block text-xs font-medium text-[#141815] mb-2">
                    Student Profile & Classroom Assignment
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        'Child (Ages 5–12)',
                        'Adult / Youth Sister',
                        'Adult / Youth Brother'
                      ] as ConfirmedBooking['learnerGroup'][]
                    ).map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => {
                          setLearnerGroup(group);
                          if (group === 'Adult / Youth Sister') {
                            setSelectedScholarName(SCHOLARS[1].name);
                          } else if (group === 'Child (Ages 5–12)') {
                            setSelectedScholarName(SCHOLARS[3].name);
                          }
                        }}
                        className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-center transition-colors whitespace-nowrap ${
                          learnerGroup === group
                            ? 'border-[#0B5D46] bg-[#0B5D46]/10 text-[#0B5D46] font-semibold'
                            : 'border-[#D5D2C8] bg-[#FAF9F5] text-[#5A625C] hover:text-[#141815]'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="student-name"
                      className="block text-xs font-medium text-[#141815] mb-1.5"
                    >
                      Student Full Name *
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      required
                      placeholder="e.g., Zayd Al-Mansoor"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141815] placeholder:text-[#8C948E] focus:border-[#0B5D46] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="student-email"
                      className="block text-xs font-medium text-[#141815] mb-1.5"
                    >
                      Email Address (For Classroom Link & Rubric) *
                    </label>
                    <input
                      id="student-email"
                      type="email"
                      required
                      placeholder="parent.or.student@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141815] placeholder:text-[#8C948E] focus:border-[#0B5D46] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone & Current Reading Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="student-phone"
                      className="block text-xs font-medium text-[#141815] mb-1.5"
                    >
                      Phone / WhatsApp Number (With Country Code) *
                    </label>
                    <input
                      id="student-phone"
                      type="tel"
                      required
                      placeholder="+1 (416) 555-0194"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3.5 py-2.5 text-sm font-mono tabular-nums text-[#141815] placeholder:text-[#8C948E] focus:border-[#0B5D46] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reading-level"
                      className="block text-xs font-medium text-[#141815] mb-1.5"
                    >
                      Current Arabic & Mushaf Familiarity
                    </label>
                    <select
                      id="reading-level"
                      value={readingLevel}
                      onChange={(e) => setReadingLevel(e.target.value)}
                      className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3.5 py-2.5 text-xs text-[#141815] focus:border-[#0B5D46] focus:bg-white focus:outline-none"
                    >
                      <option value="Complete beginner (Learning Arabic alphabet)">
                        Complete beginner (Learning Arabic alphabet)
                      </option>
                      <option value="Reads connected Arabic with hesitation">
                        Reads connected Arabic with hesitation
                      </option>
                      <option value="Reads fluently, seeking Tajweed & Makharij precision">
                        Reads fluently, seeking Tajweed & Makharij precision
                      </option>
                      <option value="Memorized 3+ Juz, seeking Hifz / Sanad Ijazah">
                        Memorized 3+ Juz, seeking Hifz / Sanad Ijazah
                      </option>
                    </select>
                  </div>
                </div>

                {/* Academic Track & Preferred Scholar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="track-select"
                      className="block text-xs font-medium text-[#141815] mb-1.5"
                    >
                      Primary Academic Track
                    </label>
                    <select
                      id="track-select"
                      value={selectedTrackTitle}
                      onChange={(e) => setSelectedTrackTitle(e.target.value)}
                      className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3.5 py-2.5 text-xs text-[#141815] focus:border-[#0B5D46] focus:bg-white focus:outline-none"
                    >
                      {COURSE_TRACKS.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.index}. {t.title} (${t.tuitionMonthlyUsd}/mo)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="scholar-select"
                      className="block text-xs font-medium text-[#141815] mb-1.5"
                    >
                      Preferred Examining Scholar
                    </label>
                    <select
                      id="scholar-select"
                      value={selectedScholarName}
                      onChange={(e) => setSelectedScholarName(e.target.value)}
                      className="w-full rounded-lg border border-[#D5D2C8] bg-[#FAF9F5] px-3.5 py-2.5 text-xs text-[#141815] focus:border-[#0B5D46] focus:bg-white focus:outline-none"
                    >
                      {SCHOLARS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.gender === 'female' ? 'Female Ustadha' : 'Male Shaykh'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block text-xs font-medium text-[#141815] mb-2">
                    Select Diagnostic Time Window (30-Minute Live Video/Audio Session)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'Tomorrow · 14:00 UTC (09:00 EST / 14:00 GMT)',
                      'Tomorrow · 17:30 UTC (12:30 EST / 17:30 GMT)',
                      'Saturday · 15:00 UTC (10:00 EST / 15:00 GMT)',
                      'Sunday · 19:00 UTC (14:00 EST / 19:00 GMT)'
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-2 text-xs font-mono tabular-nums rounded-lg border text-left transition-colors truncate ${
                          selectedTimeSlot === slot
                            ? 'border-[#0B5D46] bg-[#0B5D46]/10 text-[#0B5D46] font-semibold'
                            : 'border-[#D5D2C8] bg-[#FAF9F5] text-[#5A625C] hover:text-[#141815]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#0B5D46] px-5 py-3 text-sm font-medium text-white hover:bg-[#094836] transition-colors whitespace-nowrap"
                  >
                    Confirm Complimentary 30-Minute Diagnostic Session
                  </button>
                  <p className="mt-2 text-center text-xs text-[#5A625C]">
                    No credit card required · Dedicated female classrooms available for sisters & children
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET INSTITUTIONAL FOOTER */}
      <footer className="border-t border-[#E6E4DD] bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-lg font-semibold text-[#141815]">
              Noor Quran Academy
            </p>
            <p className="mt-1 text-xs text-[#5A625C]">
              Classical Tajweed Phonetics, Three-Tier Hifz Memorization & Sanad Certification Institute.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#5A625C]">
            <a href="#tajweed-lab" className="hover:text-[#141815] transition-colors">
              Tajweed Lab
            </a>
            <a href="#curriculum" className="hover:text-[#141815] transition-colors">
              Curriculum
            </a>
            <a href="#hifz-tracker" className="hover:text-[#141815] transition-colors">
              Hifz Planner
            </a>
            <a href="#scholars" className="hover:text-[#141815] transition-colors">
              Faculty
            </a>
            <a href="#admissions" className="hover:text-[#141815] transition-colors">
              Admissions
            </a>
            <a
              href="https://arwf.org/4/e70892450ac9e884f6031c9eb0d15fcf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0B5D46] hover:underline transition-colors"
            >
              Partner Library ↗
            </a>
            <span>© {new Date().getFullYear()} Noor Quran Academy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
