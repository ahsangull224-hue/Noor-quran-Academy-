export type TajweedRuleType = 'ghunnah' | 'qalqalah' | 'madd' | 'idgham' | 'tafkheem' | 'nominal';

export interface TajweedRuleMeta {
  id: TajweedRuleType;
  name: string;
  arabicName: string;
  glyph: string;
  shortLabel: string;
  beats: string;
  colorHex: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
  phoneticDescription: string;
  acousticMechanism: string;
}

export interface WordSegment {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  rule: TajweedRuleType;
  ruleNote: string;
  beats: number;
  makhrajZone: 'jawf' | 'halq' | 'lisan' | 'shafatan' | 'khayshum';
  pitchContour: number[]; // 5 normalized values (0.2 to 1.0) for acoustic curve
}

export interface PracticeAyah {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  globalAyahNumber: number; // For cdn.islamic.network/quran/audio/128/ar.alafasy/{globalAyahNumber}.mp3
  surahName: string;
  surahArabic: string;
  reference: string;
  fullArabic: string;
  fullTranslation: string;
  revelationPlace: string;
  words: WordSegment[];
}

export interface MakhrajPoint {
  id: 'jawf' | 'halq' | 'lisan' | 'shafatan' | 'khayshum';
  indexNumber: string;
  name: string;
  arabicTitle: string;
  anatomicalRegion: string;
  svgCoords: { cx: number; cy: number; pathD: string };
  letters: {
    char: string;
    name: string;
    translit: string;
    sifaat: string;
    exampleArabic: string;
    exampleMeaning: string;
    baseFreq: number;
  }[];
  articulationGuide: string;
  airflowType: string;
}

export interface CourseTrack {
  id: string;
  index: string;
  title: string;
  arabicSubtitle: string;
  category: 'children' | 'adults' | 'ijazah';
  categoryLabel: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionMinutes: number;
  level: string;
  imageUrl: string;
  summary: string;
  outcomes: string[];
  syllabusModules: {
    weekRange: string;
    title: string;
    focus: string;
    assessmentMetric: string;
  }[];
  tuitionMonthlyUsd: number;
}

export interface ScholarProfile {
  id: string;
  name: string;
  title: string;
  gender: 'male' | 'female';
  almaMater: string;
  qiraatChain: string;
  yearsTeaching: number;
  studentsGraduated: number;
  languages: string[];
  specialties: string[];
  nextAvailableSlot: string;
  bio: string;
}

export interface JuzSurahItem {
  number: number;
  name: string;
  arabicName: string;
  ayahCount: number;
  linesCount: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Extended';
}

export const TAJWEED_RULES: Record<TajweedRuleType, TajweedRuleMeta> = {
  ghunnah: {
    id: 'ghunnah',
    name: 'Ghunnah (Nasalization)',
    arabicName: 'غُنَّة',
    glyph: '◆',
    shortLabel: '◆ GHUNNAH · 2 BEATS',
    beats: '2 Harakat',
    colorHex: '#059669',
    textClass: 'text-[#059669]',
    borderClass: 'border-[#059669]',
    bgClass: 'bg-[#059669]/10',
    phoneticDescription: 'Resonant nasal sound emitted from Al-Khayshum (nasal passage) on Noon and Meem Mushaddadah.',
    acousticMechanism: 'Sustained nasal murmur for 2 full beats while oral closure or partial assimilation is held.'
  },
  madd: {
    id: 'madd',
    name: 'Madd (Vowel Elongation)',
    arabicName: 'مَدّ طَبِيعِي / عَارِض',
    glyph: '▲',
    shortLabel: '▲ MADD · 2–4 BEATS',
    beats: '2–4 Harakat',
    colorHex: '#B45309',
    textClass: 'text-[#B45309]',
    borderClass: 'border-[#B45309]',
    bgClass: 'bg-[#B45309]/10',
    phoneticDescription: 'Controlled prolongation of long vowels (Alif, Waw, Ya) originating from the open oral cavity (Al-Jawf).',
    acousticMechanism: 'Unobstructed laminar airflow through the glottis maintaining steady fundamental pitch.'
  },
  qalqalah: {
    id: 'qalqalah',
    name: 'Qalqalah (Echoing Bounce)',
    arabicName: 'قَلْقَلَة',
    glyph: '●',
    shortLabel: '● QALQALAH · ECHO',
    beats: '1.5 Harakat',
    colorHex: '#0284C7',
    textClass: 'text-[#0284C7]',
    borderClass: 'border-[#0284C7]',
    bgClass: 'bg-[#0284C7]/10',
    phoneticDescription: 'Crisp acoustic release on unvoweled Qutb Jadad letters (ق ط ب ج د) without adding a vowel.',
    acousticMechanism: 'Plosive burst created by sudden separation of articulators without glottal friction.'
  },
  tafkheem: {
    id: 'tafkheem',
    name: 'Tafkheem (Heavy Elevation)',
    arabicName: 'تَفْخِيم',
    glyph: '■',
    shortLabel: '■ TAFKHEEM · HEAVY',
    beats: '1–2 Harakat',
    colorHex: '#7C2D12',
    textClass: 'text-[#7C2D12]',
    borderClass: 'border-[#7C2D12]',
    bgClass: 'bg-[#7C2D12]/10',
    phoneticDescription: 'Posterior tongue elevation (Isti’la) directing sound waves toward the hard palate for full resonance.',
    acousticMechanism: 'Lowered second formant (F2) creating rich, pharyngealized acoustic weight.'
  },
  idgham: {
    id: 'idgham',
    name: 'Idgham / Lam Shamsiyyah',
    arabicName: 'إِدْغَام شَمْسِي',
    glyph: '◈',
    shortLabel: '◈ IDGHAM · MERGE',
    beats: '2 Harakat',
    colorHex: '#4338CA',
    textClass: 'text-[#4338CA]',
    borderClass: 'border-[#4338CA]',
    bgClass: 'bg-[#4338CA]/10',
    phoneticDescription: 'Complete assimilation of a silent letter into the following solar or nasal consonant.',
    acousticMechanism: 'Zero transition gap between consonant closures; geminated hold duration.'
  },
  nominal: {
    id: 'nominal',
    name: 'Tarqeeq (Clear Light Articulation)',
    arabicName: 'تَرْقِيق',
    glyph: '○',
    shortLabel: '○ TARQEEQ · CLEAR',
    beats: '1 Harakah',
    colorHex: '#141815',
    textClass: 'text-[#141815]',
    borderClass: 'border-[#D5D2C8]',
    bgClass: 'bg-[#F3F1EC]',
    phoneticDescription: 'Standard precise articulation with resting posterior tongue posture and clear short vowel timing.',
    acousticMechanism: 'Balanced formant spacing with crisp consonant-to-vowel transition.'
  }
};

export const PRACTICE_AYAHS: PracticeAyah[] = [
  {
    id: 'fatihah-1',
    surahNumber: 1,
    ayahNumber: 1,
    globalAyahNumber: 1,
    surahName: 'Al-Fatihah',
    surahArabic: 'سُورَةُ الفَاتِحَة',
    reference: 'Surah Al-Fatihah 1:1',
    revelationPlace: 'Makkiyah',
    fullArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    fullTranslation: 'In the Name of Allah, the Most Compassionate, the Most Merciful.',
    words: [
      {
        id: 'w1',
        arabic: 'بِسْمِ',
        transliteration: 'Bismi',
        translation: 'In the Name',
        rule: 'nominal',
        ruleNote: 'Sharp Kasrah under Ba (Ash-Shafatan) followed by whispered Seen (Hams) and clear Meem.',
        beats: 1,
        makhrajZone: 'shafatan',
        pitchContour: [0.45, 0.55, 0.50, 0.48, 0.42]
      },
      {
        id: 'w2',
        arabic: 'اللَّهِ',
        transliteration: 'Allāhi',
        translation: 'of Allah,',
        rule: 'nominal',
        ruleNote: 'Lam in Lafz Al-Jalalah is pronounced light (Tarqeeq) because it is preceded by a Kasrah in Bismi.',
        beats: 2,
        makhrajZone: 'lisan',
        pitchContour: [0.50, 0.72, 0.68, 0.55, 0.45]
      },
      {
        id: 'w3',
        arabic: 'الرَّحْمَٰنِ',
        transliteration: 'Ar-Raḥmāni',
        translation: 'the Most Compassionate,',
        rule: 'tafkheem',
        ruleNote: 'Solar Lam merges into Heavy Ra (Tafkheem), middle-throat Haa (Al-Halq), and 2-beat Madd Tabi’i.',
        beats: 2,
        makhrajZone: 'halq',
        pitchContour: [0.58, 0.78, 0.82, 0.70, 0.52]
      },
      {
        id: 'w4',
        arabic: 'الرَّحِيمِ',
        transliteration: 'Ar-Raḥīm',
        translation: 'the Most Merciful.',
        rule: 'madd',
        ruleNote: 'Madd Arid Lissukoon on the Ya before stopping on Meem — sustained smoothly for 2, 4, or 6 beats.',
        beats: 4,
        makhrajZone: 'jawf',
        pitchContour: [0.62, 0.85, 0.88, 0.76, 0.40]
      }
    ]
  },
  {
    id: 'ikhlas-1',
    surahNumber: 112,
    ayahNumber: 1,
    globalAyahNumber: 6222,
    surahName: 'Al-Ikhlas',
    surahArabic: 'سُورَةُ الإِخْلَاص',
    reference: 'Surah Al-Ikhlas 112:1–2',
    revelationPlace: 'Makkiyah',
    fullArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ',
    fullTranslation: 'Say: He is Allah, the One. Allah, the Eternal Refuge.',
    words: [
      {
        id: 'ik-1',
        arabic: 'قُلْ',
        transliteration: 'Qul',
        translation: 'Say:',
        rule: 'tafkheem',
        ruleNote: 'Deep uvular Qaf from the posterior tongue with elevated Isti’la, followed by clear Lam.',
        beats: 1,
        makhrajZone: 'lisan',
        pitchContour: [0.70, 0.75, 0.62, 0.55, 0.50]
      },
      {
        id: 'ik-2',
        arabic: 'هُوَ',
        transliteration: 'Huwa',
        translation: 'He is',
        rule: 'nominal',
        ruleNote: 'Deep glottal Ha from the lowest throat (Aqsa Al-Halq) transitioning cleanly to rounded Waw.',
        beats: 1,
        makhrajZone: 'halq',
        pitchContour: [0.48, 0.52, 0.54, 0.50, 0.46]
      },
      {
        id: 'ik-3',
        arabic: 'اللَّهُ',
        transliteration: 'Allāhu',
        translation: 'Allah,',
        rule: 'tafkheem',
        ruleNote: 'Heavy Lam (Tafkheem) in Lafz Al-Jalalah because it follows a Fathah on Huwa.',
        beats: 2,
        makhrajZone: 'lisan',
        pitchContour: [0.55, 0.84, 0.80, 0.66, 0.54]
      },
      {
        id: 'ik-4',
        arabic: 'أَحَدٌ',
        transliteration: 'Aḥad',
        translation: 'the One.',
        rule: 'qalqalah',
        ruleNote: 'Qalqalah Kubra (Major Echo) on the final Dal when stopping — crisp bounce without adding a vowel.',
        beats: 2,
        makhrajZone: 'lisan',
        pitchContour: [0.52, 0.68, 0.44, 0.78, 0.38]
      },
      {
        id: 'ik-5',
        arabic: 'الصَّمَدُ',
        transliteration: 'Aṣ-Ṣamad',
        translation: 'the Eternal Refuge.',
        rule: 'qalqalah',
        ruleNote: 'Idgham Shamsi into heavy emphatic Saad (Itbaq), ending with Qalqalah Kubra on Dal.',
        beats: 2,
        makhrajZone: 'lisan',
        pitchContour: [0.64, 0.82, 0.60, 0.80, 0.35]
      }
    ]
  },
  {
    id: 'alaq-1',
    surahNumber: 96,
    ayahNumber: 1,
    globalAyahNumber: 6107,
    surahName: 'Al-Alaq',
    surahArabic: 'سُورَةُ العَلَق',
    reference: 'Surah Al-Alaq 96:1',
    revelationPlace: 'Makkiyah',
    fullArabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    fullTranslation: 'Recite in the Name of your Lord Who created.',
    words: [
      {
        id: 'al-1',
        arabic: 'اقْرَأْ',
        transliteration: 'Iqra’',
        translation: 'Recite',
        rule: 'qalqalah',
        ruleNote: 'Qalqalah Sughra (Minor Echo) on the unvoweled Qaf in mid-word, followed by heavy Ra and sharp Hamzah stop.',
        beats: 2,
        makhrajZone: 'lisan',
        pitchContour: [0.50, 0.85, 0.62, 0.74, 0.45]
      },
      {
        id: 'al-2',
        arabic: 'بِاسْمِ',
        transliteration: 'Bismi',
        translation: 'in the Name',
        rule: 'nominal',
        ruleNote: 'Hamzatul-Wasl drops in connected recitation; crisp bilabial Ba and sibilant Seen.',
        beats: 1,
        makhrajZone: 'shafatan',
        pitchContour: [0.46, 0.56, 0.52, 0.48, 0.44]
      },
      {
        id: 'al-3',
        arabic: 'رَبِّكَ',
        transliteration: 'Rabbika',
        translation: 'of your Lord',
        rule: 'tafkheem',
        ruleNote: 'Heavy Ra with Fathah followed by geminated Ba (Shaddah) held with firm bilabial closure.',
        beats: 2,
        makhrajZone: 'shafatan',
        pitchContour: [0.64, 0.76, 0.58, 0.52, 0.48]
      },
      {
        id: 'al-4',
        arabic: 'الَّذِي',
        transliteration: 'Alladhī',
        translation: 'Who',
        rule: 'madd',
        ruleNote: 'Interdental Dhal (tip of tongue with upper incisors) followed by 2-beat Madd Tabi’i on Ya.',
        beats: 2,
        makhrajZone: 'jawf',
        pitchContour: [0.54, 0.68, 0.72, 0.66, 0.58]
      },
      {
        id: 'al-5',
        arabic: 'خَلَقَ',
        transliteration: 'Khalaq',
        translation: 'created.',
        rule: 'qalqalah',
        ruleNote: 'Heavy velar Kha (Adna Al-Halq), light Lam, and Qalqalah Kubra on the final uvular Qaf.',
        beats: 2,
        makhrajZone: 'halq',
        pitchContour: [0.68, 0.55, 0.48, 0.86, 0.36]
      }
    ]
  },
  {
    id: 'rahman-1',
    surahNumber: 55,
    ayahNumber: 1,
    globalAyahNumber: 4902,
    surahName: 'Ar-Rahman',
    surahArabic: 'سُورَةُ الرَّحْمَٰن',
    reference: 'Surah Ar-Rahman 55:1–3',
    revelationPlace: 'Madaniyah',
    fullArabic: 'الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ',
    fullTranslation: 'The Most Compassionate. Taught the Quran. Created humankind.',
    words: [
      {
        id: 'rh-1',
        arabic: 'الرَّحْمَٰنُ',
        transliteration: 'Ar-Raḥmān',
        translation: 'The Most Compassionate.',
        rule: 'madd',
        ruleNote: 'Emphatic Ra, pharyngeal Haa, and sustained Madd Arid Lissukoon over the dagger Alif.',
        beats: 4,
        makhrajZone: 'jawf',
        pitchContour: [0.56, 0.80, 0.88, 0.82, 0.46]
      },
      {
        id: 'rh-2',
        arabic: 'عَلَّمَ',
        transliteration: '‘Allama',
        translation: 'Taught',
        rule: 'nominal',
        ruleNote: 'Deep pharyngeal ‘Ayn from the middle throat (Wasat Al-Halq) with geminated Lam.',
        beats: 2,
        makhrajZone: 'halq',
        pitchContour: [0.52, 0.64, 0.68, 0.58, 0.50]
      },
      {
        id: 'rh-3',
        arabic: 'الْقُرْآنَ',
        transliteration: 'Al-Qur’ān',
        translation: 'the Quran.',
        rule: 'tafkheem',
        ruleNote: 'Lunar Lam (Izhar Qamari), heavy Qaf and Ra, glottal Hamzah, and Madd Badal / Arid.',
        beats: 4,
        makhrajZone: 'lisan',
        pitchContour: [0.60, 0.78, 0.84, 0.76, 0.42]
      },
      {
        id: 'rh-4',
        arabic: 'الْإِنسَانَ',
        transliteration: 'Al-Insān',
        translation: 'humankind.',
        rule: 'ghunnah',
        ruleNote: 'Ikhfa Haqiqi on Noon Sakinah before Seen — 2 beats of light nasal Ghunnah from Al-Khayshum.',
        beats: 2,
        makhrajZone: 'khayshum',
        pitchContour: [0.55, 0.74, 0.78, 0.82, 0.40]
      }
    ]
  }
];

export const MAKHARIJ_ZONES: MakhrajPoint[] = [
  {
    id: 'jawf',
    indexNumber: '01',
    name: 'Al-Jawf · The Oral & Pharyngeal Cavity',
    arabicTitle: 'الجَوْف',
    anatomicalRegion: 'Empty space above the larynx extending through the mouth',
    svgCoords: {
      cx: 175,
      cy: 155,
      pathD: 'M 215 215 Q 205 150 140 140 Q 95 138 75 148'
    },
    letters: [
      {
        char: 'ا',
        name: 'Alif Maddiyyah',
        translit: 'ā',
        sifaat: 'Jahr · Rakhawah · Istifal',
        exampleArabic: 'قَالَ',
        exampleMeaning: 'He said (open vertical jaw posture)',
        baseFreq: 220
      },
      {
        char: 'و',
        name: 'Waw Maddiyyah',
        translit: 'ū',
        sifaat: 'Jahr · Rakhawah · Lip Rounding',
        exampleArabic: 'يَقُولُ',
        exampleMeaning: 'He says (rounded bilabial projection)',
        baseFreq: 196
      },
      {
        char: 'ي',
        name: 'Ya Maddiyyah',
        translit: 'ī',
        sifaat: 'Jahr · Rakhawah · Mid-Tongue Arch',
        exampleArabic: 'قِيلَ',
        exampleMeaning: 'It was said (lowered jaw, arched blade)',
        baseFreq: 261
      }
    ],
    articulationGuide: 'These three prolongation letters do not terminate at a physical contact point; they cease smoothly as the breath stream settles.',
    airflowType: 'Unobstructed Laminar Resonance (2 to 6 Harakat)'
  },
  {
    id: 'halq',
    indexNumber: '02',
    name: 'Al-Halq · The Three Tiers of the Throat',
    arabicTitle: 'الحَلْق',
    anatomicalRegion: 'Lower glottis (Aqsa), middle pharynx (Wasat), and upper velum (Adna)',
    svgCoords: {
      cx: 222,
      cy: 225,
      pathD: 'M 225 265 L 222 215 Q 218 180 190 165'
    },
    letters: [
      {
        char: 'ء / هـ',
        name: 'Hamzah & Ha (Aqsa Al-Halq)',
        translit: '’ / h',
        sifaat: 'Deepest Throat · Glottal Fold Control',
        exampleArabic: 'إِهْدِنَا',
        exampleMeaning: 'Guide us (glottal release)',
        baseFreq: 165
      },
      {
        char: 'ع / ح',
        name: '‘Ayn & Haa (Wasat Al-Halq)',
        translit: '‘ / ḥ',
        sifaat: 'Middle Throat · Epiglottal Constriction',
        exampleArabic: 'الرَّحْمَٰنِ',
        exampleMeaning: 'The Most Compassionate',
        baseFreq: 185
      },
      {
        char: 'غ / خ',
        name: 'Ghayn & Kha (Adna Al-Halq)',
        translit: 'gh / kh',
        sifaat: 'Upper Throat · Uvular Isti’la',
        exampleArabic: 'غَيْرِ',
        exampleMeaning: 'Not / Other than',
        baseFreq: 205
      }
    ],
    articulationGuide: 'Six letters divided strictly across three vertical stations of the throat. Avoid substituting glottal Ha for pharyngeal Haa.',
    airflowType: 'Pharyngeal & Glottal Constriction Gradient'
  },
  {
    id: 'lisan',
    indexNumber: '03',
    name: 'Al-Lisan · The Ten Stations of the Tongue',
    arabicTitle: 'اللِّسَان',
    anatomicalRegion: 'Posterior root, lateral edges, dorsum, blade, and apex of the tongue',
    svgCoords: {
      cx: 145,
      cy: 168,
      pathD: 'M 195 185 Q 150 168 95 162'
    },
    letters: [
      {
        char: 'ق / ك',
        name: 'Qaf & Kaf (Aqsa Al-Lisan)',
        translit: 'q / k',
        sifaat: 'Posterior Tongue against Soft & Hard Palate',
        exampleArabic: 'خَلَقَ',
        exampleMeaning: 'He created (Qalqalah on Qaf)',
        baseFreq: 240
      },
      {
        char: 'ض / ل',
        name: 'Daad & Lam (Hafat Al-Lisan)',
        translit: 'ḍ / l',
        sifaat: 'Lateral Tongue Edge against Upper Molars',
        exampleArabic: 'الضَّالِّينَ',
        exampleMeaning: 'Those who went astray (Istitalah)',
        baseFreq: 215
      },
      {
        char: 'ط / د / ت',
        name: 'Taa, Dal & Ta (Taraf Al-Lisan)',
        translit: 'ṭ / d / t',
        sifaat: 'Tongue Apex at Upper Incisor Gum Line',
        exampleArabic: 'الصِّرَاطَ',
        exampleMeaning: 'The Straight Path',
        baseFreq: 275
      },
      {
        char: 'ظ / ذ / ث',
        name: 'Zaa, Dhal & Tha (Interdental)',
        translit: 'ẓ / dh / th',
        sifaat: 'Tongue Tip touching Edge of Upper Incisors',
        exampleArabic: 'الْعَظِيمِ',
        exampleMeaning: 'The Supreme',
        baseFreq: 290
      }
    ],
    articulationGuide: 'Eighteen Arabic letters articulate via Al-Lisan. Precision between emphatic (Musta’liyah) and light (Mustafilah) pairs preserves meaning.',
    airflowType: 'Targeted Palatal, Alveolar & Dental Contact'
  },
  {
    id: 'shafatan',
    indexNumber: '04',
    name: 'Ash-Shafatan · The Labial Articulation',
    arabicTitle: 'الشَّفَتَان',
    anatomicalRegion: 'Upper and lower lips and upper incisor contact against lower lip',
    svgCoords: {
      cx: 76,
      cy: 162,
      pathD: 'M 115 164 L 68 162'
    },
    letters: [
      {
        char: 'ف',
        name: 'Fa (Labiodental)',
        translit: 'f',
        sifaat: 'Hams · Rakhawah · Upper Incisors on Wet Lower Lip',
        exampleArabic: 'فَاتِحَة',
        exampleMeaning: 'The Opening',
        baseFreq: 310
      },
      {
        char: 'ب / م / و',
        name: 'Ba, Meem & Non-Madd Waw',
        translit: 'b / m / w',
        sifaat: 'Bilabial Closure (Ba/Meem) & Rounding (Waw)',
        exampleArabic: 'بِسْمِ',
        exampleMeaning: 'In the Name',
        baseFreq: 190
      }
    ],
    articulationGuide: 'Ba requires firm bilabial seal (with Qalqalah when unvoweled), Meem couples lip closure with nasal resonance, and Waw rounds without teeth contact.',
    airflowType: 'Bilabial Seal & Labiodental Fricative'
  },
  {
    id: 'khayshum',
    indexNumber: '05',
    name: 'Al-Khayshum · The Nasal Resonance Chamber',
    arabicTitle: 'الخَيْشُوم',
    anatomicalRegion: 'Posterior nasal passage above the soft palate connecting to nostrils',
    svgCoords: {
      cx: 132,
      cy: 112,
      pathD: 'M 185 145 Q 155 112 90 108'
    },
    letters: [
      {
        char: 'نّ / مّ',
        name: 'Noon & Meem Mushaddadah',
        translit: 'nn / mm',
        sifaat: 'Akmal Maratib Al-Ghunnah (Fullest 2-Beat Resonance)',
        exampleArabic: 'إِنَّا',
        exampleMeaning: 'Indeed We',
        baseFreq: 247
      },
      {
        char: 'نْ / ً ٍ ٌ',
        name: 'Ikhfa & Idgham Bi-Ghunnah',
        translit: 'n (nasalized)',
        sifaat: 'Light or Heavy Ghunnah matching following consonant',
        exampleArabic: 'مِنْ قَبْلِكَ',
        exampleMeaning: 'Before you (Heavy Ghunnah before Qaf)',
        baseFreq: 233
      }
    ],
    articulationGuide: 'Ghunnah is an intrinsic phonetic quality of Noon and Meem. Its timbre shifts to heavy (Mufakhamah) when followed by an elevated letter.',
    airflowType: 'Sustained Nasal Harmonics (2 Harakat)'
  }
];

export const COURSE_TRACKS: CourseTrack[] = [
  {
    id: 'tajweed-phonetics',
    index: '01',
    title: 'Tajweed Phonetics & Makharij Mastery',
    arabicSubtitle: 'إِتْقَانُ التَّجْوِيدِ وَمَخَارِجِ الحُرُوف',
    category: 'adults',
    categoryLabel: 'Youth & Adults',
    durationWeeks: 16,
    sessionsPerWeek: 2,
    sessionMinutes: 45,
    level: 'Foundational to Intermediate',
    imageUrl: '/src/assets/images/course_tajweed_mastery_1791310307269.jpg',
    summary: 'Systematic training in the seventeen sub-points of Arabic articulation (Makharij), letter attributes (Sifaat), and applied recitation of Juz Amma and Juz Tabarak.',
    outcomes: [
      'Master all 17 classical articulation points verified via live oral examination',
      'Eliminate hidden vowel distortions (Lahn Khafi) and timing imbalances in Madd',
      'Recite Juz 29 and Juz 30 with full Tarteel fluency and annotated rubric feedback'
    ],
    syllabusModules: [
      {
        weekRange: 'Weeks 1–4',
        title: 'Anatomical Makharij & Sifaat Al-Huroof',
        focus: 'Diagnostic mapping of throat, tongue, and labial consonants; contrasting heavy (Isti’la) and light pairs.',
        assessmentMetric: '95% accuracy on isolated and connected phoneme audit'
      },
      {
        weekRange: 'Weeks 5–8',
        title: 'Noon Sakinah, Tanween & Meem Rules',
        focus: 'Izhar, Idgham, Iqlab, and Ikhfa with calibrated 2-beat Ghunnah resonance and heavy/light transitions.',
        assessmentMetric: 'Zero timing drift across 20 timed recitation passages'
      },
      {
        weekRange: 'Weeks 9–12',
        title: 'Taxonomy of Madd & Waqf (Stopping Rules)',
        focus: 'Natural vs. secondary elongations (2, 4, 5, and 6 Harakat) and meaning-preserving pause boundaries.',
        assessmentMetric: 'Practical recitation exam on Surah Al-Mulk and Surah Al-Qalam'
      },
      {
        weekRange: 'Weeks 13–16',
        title: 'Matn Al-Jazariyyah Applied Recitation',
        focus: 'Full Tarteel application across Juz Amma with live instructor phonetic correction and certification.',
        assessmentMetric: 'Final Oral Recitation Jury (Minimum 90/100 Rubric Score)'
      }
    ],
    tuitionMonthlyUsd: 95
  },
  {
    id: 'sanad-hifz',
    index: '02',
    title: 'Structured Hifz & Unbroken Sanad Ijazah',
    arabicSubtitle: 'بَرْنَامَجُ الحِفْظِ وَالإِجَازَةِ بِالسَّنَدِ المُتَّصِل',
    category: 'ijazah',
    categoryLabel: 'Ijazah & Sanad Track',
    durationWeeks: 52,
    sessionsPerWeek: 4,
    sessionMinutes: 60,
    level: 'Intermediate to Advanced',
    imageUrl: '/src/assets/images/course_hifz_sanad_1791310320035.jpg',
    summary: 'Three-tier spaced-repetition memorization methodology (Sabaq, Sabqi, Manzil) supervised by scholars holding unbroken chains of transmission (Sanad) in Hafs and Warsh.',
    outcomes: [
      'Complete structured Juz-by-Juz memorization with zero retention decay via the 3-tier Jadwal system',
      'Pass cumulative 5-Juz blind oral audits before advancing to subsequent sections',
      'Earn a documented Ijazah certificate linking your recitation chain to the Prophet ﷺ'
    ],
    syllabusModules: [
      {
        weekRange: 'Phase 1',
        title: 'Pre-Hifz Fluency & Visual Page Anchoring',
        focus: 'Establishing 15-line Madani Mushaf spatial memory, eye-tracking cadence, and error-free sight reading.',
        assessmentMetric: 'Fluent sight recitation of 3 consecutive pages without hesitation'
      },
      {
        weekRange: 'Phase 2',
        title: 'Sabaq & Sabqi Consolidation Cycle',
        focus: 'Daily new page memorization paired with mandatory 14-day rolling review of the active Juz.',
        assessmentMetric: 'Maximum 1 minor prompt allowed per 20-page Sabqi block'
      },
      {
        weekRange: 'Phase 3',
        title: 'Mutashabihat (Similar Verses) Indexing',
        focus: 'Thematic and lexical differentiation of parallel passages across Surahs to prevent cross-Juz slips.',
        assessmentMetric: '100% precision on 50 high-similarity verse transitions'
      },
      {
        weekRange: 'Phase 4',
        title: 'Khatmah Recitation & Sanad Conferral',
        focus: 'Complete verbatim recitation before a senior Muqri’ for formal Ijazah documentation.',
        assessmentMetric: 'Signed Sanad Diploma registered in the Academy Archive'
      }
    ],
    tuitionMonthlyUsd: 165
  },
  {
    id: 'noorani-children',
    index: '03',
    title: 'Noorani Qaida & Classical Quranic Arabic',
    arabicSubtitle: 'القَاعِدَةُ النُّورَانِيَّةُ وَالعَرَبِيَّةُ القُرْآنِيَّة',
    category: 'children',
    categoryLabel: 'Children (Ages 5–12) & Beginners',
    durationWeeks: 12,
    sessionsPerWeek: 3,
    sessionMinutes: 30,
    level: 'Complete Beginner',
    imageUrl: '/src/assets/images/course_arabic_foundations_1791310331731.jpg',
    summary: 'Engaging one-on-one foundational track building Arabic script recognition, short/long vowel fluency, and high-frequency Quranic vocabulary for young learners and new Muslims.',
    outcomes: [
      'Transition from isolated alphabet letters to fluent connected Mushaf reading in 12 weeks',
      'Understand the root meanings of the 300 most frequent words in the Quran (covering 70% of verses)',
      'Memorize the daily prophetic supplications (Adhkar) and the final 15 Surahs of Juz Amma'
    ],
    syllabusModules: [
      {
        weekRange: 'Weeks 1–3',
        title: 'Isolated & Connected Letter Architecture',
        focus: 'Visual and phonetic mastery of all 28 Arabic letters in initial, medial, and final script forms.',
        assessmentMetric: 'Instant recognition of 84 letter-form permutations'
      },
      {
        weekRange: 'Weeks 4–6',
        title: 'Harakat, Tanween & Sukoon Cadence',
        focus: 'Rhythmic syllable building with Fathah, Kasrah, Dammah, and crisp Sukoon consonant stops.',
        assessmentMetric: 'Zero vowel elongation errors on short-vowel words'
      },
      {
        weekRange: 'Weeks 7–9',
        title: 'Shaddah Gemination & Natural Madd',
        focus: 'Connecting multi-syllable Quranic words directly from the 15-line Madani script.',
        assessmentMetric: 'Independent reading of Surah An-Naba through Surah Ad-Duha'
      },
      {
        weekRange: 'Weeks 10–12',
        title: 'First Mushaf Transition & Core Vocabulary',
        focus: 'Guided recitation of short Makki Surahs alongside foundational trilateral root comprehension.',
        assessmentMetric: 'Graduation to Full Tajweed Track with Parent Progress Dossier'
      }
    ],
    tuitionMonthlyUsd: 85
  }
];

export const SCHOLARS: ScholarProfile[] = [
  {
    id: 'sheikh-mahmoud',
    name: 'Shaykh Mahmoud Al-Minshawi',
    title: 'Senior Chair of Qira’at & Sanad Examination',
    gender: 'male',
    almaMater: 'Al-Azhar University, Faculty of Usool Ad-Deen (Cairo)',
    qiraatChain: '29th Generation Sanad in Qira’at Al-‘Ashr (Ten Canonical Readings)',
    yearsTeaching: 18,
    studentsGraduated: 410,
    languages: ['Arabic (Native)', 'English (Fluent)'],
    specialties: ['Sanad Ijazah Auditing', 'Advanced Phonetics', 'Matn Ash-Shatibiyyah'],
    nextAvailableSlot: 'Tomorrow · 14:00 UTC',
    bio: 'Trained in Cairo under senior reciters of Al-Azhar, Shaykh Mahmoud has examined over 400 Hifz and Tajweed candidates across North America, Europe, and Southeast Asia.'
  },
  {
    id: 'ustadha-maryam',
    name: 'Ustadha Maryam Bint Tariq',
    title: 'Lead Female Instructor for Sisters & Youth Tajweed',
    gender: 'female',
    almaMater: 'Institute of the Holy Quran, Sharjah & Cairo Ijazah Board',
    qiraatChain: 'Ijazah in Hafs ‘an ‘Asim & Shu’bah with Unbroken Chain',
    yearsTeaching: 12,
    studentsGraduated: 340,
    languages: ['English (Native)', 'Arabic (Fluent)', 'Urdu'],
    specialties: ['Sisters Hifz Mentorship', 'Applied Makharij Diagnostics', 'Child Pedagogy'],
    nextAvailableSlot: 'Tomorrow · 16:30 UTC',
    bio: 'Specializing in patient, high-precision phonetic coaching for sisters and children, Ustadha Maryam integrates visual articulation diagrams with structured weekly revision rubrics.'
  },
  {
    id: 'sheikh-ibrahim',
    name: 'Shaykh Ibrahim Al-Shanqiti',
    title: 'Director of Hifz Retention & Classical Arabic',
    gender: 'male',
    almaMater: 'Islamic University of Madinah, College of Noble Quran',
    qiraatChain: 'Dual Sanad in Warsh ‘an Nafi’ & Hafs ‘an ‘Asim',
    yearsTeaching: 14,
    studentsGraduated: 295,
    languages: ['Arabic (Native)', 'English (Fluent)', 'French'],
    specialties: ['Mauritanian Lauh Memorization', 'Mutashabihat Indexing', 'Quranic Morphology'],
    nextAvailableSlot: 'Thursday · 18:00 UTC',
    bio: 'Combining traditional West African and Madinan memorization methodologies, Shaykh Ibrahim designs individualized spaced-repetition schedules for working professionals and youth.'
  },
  {
    id: 'ustadha-khadijah',
    name: 'Ustadha Khadijah Al-Ansari',
    title: 'Early Childhood Noorani Qaida Specialist',
    gender: 'female',
    almaMater: 'Dar Al-Huda Quranic Pedagogical Institute (Amman)',
    qiraatChain: 'Certified Mu’allimah in Al-Qa’idah An-Nooraniyyah & Hafs',
    yearsTeaching: 9,
    studentsGraduated: 260,
    languages: ['English (Native)', 'Arabic (Native)'],
    specialties: ['Ages 5–12 Foundations', 'Interactive Phonics', 'Juz Amma Memorization'],
    nextAvailableSlot: 'Friday · 15:00 UTC',
    bio: 'Known for transforming hesitant young beginners into confident Mushaf readers within one academic term through structured 30-minute interactive lessons.'
  }
];

export const JUZ_AMMA_SURAHS: JuzSurahItem[] = [
  { number: 78, name: 'An-Naba', arabicName: 'النَّبَأ', ayahCount: 40, linesCount: 23, difficulty: 'Extended' },
  { number: 87, name: 'Al-A’la', arabicName: 'الأَعْلَى', ayahCount: 19, linesCount: 8, difficulty: 'Intermediate' },
  { number: 93, name: 'Ad-Duha', arabicName: 'الضُّحَى', ayahCount: 11, linesCount: 5, difficulty: 'Foundational' },
  { number: 94, name: 'Ash-Sharh', arabicName: 'الشَّرْح', ayahCount: 8, linesCount: 4, difficulty: 'Foundational' },
  { number: 95, name: 'At-Tin', arabicName: 'التِّين', ayahCount: 8, linesCount: 4, difficulty: 'Foundational' },
  { number: 96, name: 'Al-Alaq', arabicName: 'العَلَق', ayahCount: 19, linesCount: 7, difficulty: 'Intermediate' },
  { number: 97, name: 'Al-Qadr', arabicName: 'القَدْر', ayahCount: 5, linesCount: 3, difficulty: 'Foundational' },
  { number: 103, name: 'Al-Asr', arabicName: 'العَصْر', ayahCount: 3, linesCount: 2, difficulty: 'Foundational' },
  { number: 108, name: 'Al-Kawthar', arabicName: 'الكَوْثَر', ayahCount: 3, linesCount: 1.5, difficulty: 'Foundational' },
  { number: 112, name: 'Al-Ikhlas', arabicName: 'الإِخْلَاص', ayahCount: 4, linesCount: 2, difficulty: 'Foundational' },
  { number: 113, name: 'Al-Falaq', arabicName: 'الفَلَق', ayahCount: 5, linesCount: 2.5, difficulty: 'Foundational' },
  { number: 114, name: 'An-Nas', arabicName: 'النَّاس', ayahCount: 6, linesCount: 3, difficulty: 'Foundational' }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Dr. Tariq Siddiqui',
    role: 'Cardiologist & Parent of Two Students',
    organization: 'Toronto, Canada',
    metric: 'Completed Juz 30 & 29 in 11 Months',
    quote: 'Before enrolling with Ustadha Khadijah, our 7-year-old struggled to connect Arabic letters without guessing vowels. Through the structured 30-minute Noorani Qaida rubric, both of our children now read directly from the Madani Mushaf and completed Juz Amma with verified Tajweed.'
  },
  {
    id: 't2',
    name: 'Amina Rahman',
    role: 'Senior Software Architect & Ijazah Candidate',
    organization: 'London, United Kingdom',
    metric: 'Passed 15-Juz Blind Audit with 98.4% Accuracy',
    quote: 'As a full-time engineer, my previous Hifz attempts stalled whenever work became busy because I lacked a formal Manzil revision system. Shaykh Ibrahim’s three-tier daily Jadwal kept my past 15 Juz rock-solid while adding four new pages every month.'
  },
  {
    id: 't3',
    name: 'Yusuf Al-Mansoor',
    role: 'Graduate Student in Comparative Literature',
    organization: 'Chicago, United States',
    metric: 'Makharij Assessment Score Rose from 61% to 96%',
    quote: 'I had recited the Quran for twenty years without realizing I was pronouncing Qaf and Haa from the wrong station of the throat. One semester of phonetic diagnostics with Shaykh Mahmoud transformed my recitation clarity and confidence leading prayer.'
  }
];
