// Past papers data store
export const examLevels = [
  {
    id: 'o-level',
    name: 'O-Level (Grade 11)',
    shortName: 'O-Level',
    description: 'Find past papers and marking schemes for all O-Level subjects.',
    badge: 'Grade 11',
    color: 'blue',
    icon: 'GraduationCap'
  },
  {
    id: 'a-level',
    name: 'A-Level (Advanced Level)',
    shortName: 'A-Level',
    description: 'Access past papers and marking schemes for all A-Level subjects.',
    badge: 'Advanced Level',
    color: 'purple',
    icon: 'Award'
  }
];

export const oLevelSubjects = [
  {
    id: 'ol-maths',
    name: 'Mathematics',
    code: 'MATH-OL',
    level: 'o-level',
    category: 'Core Subjects',
    icon: 'Calculator',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    availablePapers: 28,
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Ordinary Level Mathematics past papers, part I & II with marking schemes and step-by-step model solutions.'
  },
  {
    id: 'ol-english',
    name: 'English Language',
    code: 'ENG-OL',
    level: 'o-level',
    category: 'Core Subjects',
    icon: 'BookA',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-100',
    textColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    availablePapers: 24,
    years: [2024, 2023, 2022, 2021, 2020, 2019],
    mediums: ['English'],
    description: 'G.C.E. O/L English Language question papers, essay prompts, listening exercises and official marking criteria.'
  },
  {
    id: 'ol-sinhala',
    name: 'Sinhala Language',
    code: 'SIN-OL',
    level: 'o-level',
    category: 'Core Subjects',
    icon: 'Languages',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    textColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    availablePapers: 22,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['Sinhala'],
    description: 'Sinhala Language and Literature papers with structured questions and evaluation schemes.'
  },
  {
    id: 'ol-tamil',
    name: 'Tamil Language',
    code: 'TAM-OL',
    level: 'o-level',
    category: 'Core Subjects',
    icon: 'BookOpen',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-100',
    textColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    availablePapers: 20,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['Tamil'],
    description: 'Tamil Language and Literature papers with detailed essay guides and marking points.'
  },
  {
    id: 'ol-science',
    name: 'Science',
    code: 'SCI-OL',
    level: 'o-level',
    category: 'Core Subjects',
    icon: 'FlaskConical',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-100',
    textColor: 'text-teal-600',
    iconBg: 'bg-teal-100',
    availablePapers: 30,
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'General Science covering Physics, Chemistry, and Biology modules with structured essay evaluations.'
  },
  {
    id: 'ol-history',
    name: 'History',
    code: 'HIST-OL',
    level: 'o-level',
    category: 'Core Subjects',
    icon: 'Landmark',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-100',
    textColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    availablePapers: 22,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Sri Lankan & World History question papers, map work guides, and full marking keys.'
  },
  {
    id: 'ol-geography',
    name: 'Geography',
    code: 'GEO-OL',
    level: 'o-level',
    category: 'Group I',
    icon: 'Globe',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
    textColor: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
    availablePapers: 18,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Physical and Human Geography exam papers, map reading techniques, and scoring schemes.'
  },
  {
    id: 'ol-buddhism',
    name: 'Buddhism',
    code: 'BUD-OL',
    level: 'o-level',
    category: 'Religion',
    icon: 'Flower2',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    textColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    availablePapers: 16,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala'],
    description: 'Buddhist Culture & Philosophy examination papers and official grading criteria.'
  },
  {
    id: 'ol-commerce',
    name: 'Commerce & Accounting',
    code: 'COM-OL',
    level: 'o-level',
    category: 'Group I',
    icon: 'Briefcase',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-100',
    textColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
    availablePapers: 20,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Business and Accounting studies past papers with financial accounting format guidelines.'
  },
  {
    id: 'ol-ict',
    name: 'ICT (Information Tech)',
    code: 'ICT-OL',
    level: 'o-level',
    category: 'Group III',
    icon: 'Monitor',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-100',
    textColor: 'text-sky-600',
    iconBg: 'bg-sky-100',
    availablePapers: 24,
    years: [2024, 2023, 2022, 2021, 2020, 2019],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Information & Communication Technology papers including flowcharts, Python, HTML, and networking.'
  },
  {
    id: 'ol-art',
    name: 'Art & Design',
    code: 'ART-OL',
    level: 'o-level',
    category: 'Group II',
    icon: 'Palette',
    bgLight: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-100',
    textColor: 'text-fuchsia-600',
    iconBg: 'bg-fuchsia-100',
    availablePapers: 14,
    years: [2024, 2023, 2022, 2021],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Art history, traditional motifs, and practical drawing question papers.'
  },
  {
    id: 'ol-agriculture',
    name: 'Agriculture & Food Tech',
    code: 'AGRI-OL',
    level: 'o-level',
    category: 'Group III',
    icon: 'Sprout',
    bgLight: 'bg-lime-50',
    borderColor: 'border-lime-100',
    textColor: 'text-lime-600',
    iconBg: 'bg-lime-100',
    availablePapers: 16,
    years: [2024, 2023, 2022, 2021],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Agricultural Science & Technology exam papers with marking schemes.'
  }
];

export const aLevelSubjects = [
  {
    id: 'al-comb-maths',
    name: 'Combined Mathematics',
    code: 'CMATH-AL',
    level: 'a-level',
    stream: 'Physical Science (Maths)',
    icon: 'Calculator',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    availablePapers: 34,
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Pure Maths & Applied Maths full papers with step-by-step marking rubrics.'
  },
  {
    id: 'al-physics',
    name: 'Physics',
    code: 'PHY-AL',
    level: 'a-level',
    stream: 'Physical / Bio Science',
    icon: 'Atom',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-100',
    textColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    availablePapers: 32,
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Physics Paper I (50 MCQs) & Paper II (Structured & Essay) with standard resource schemes.'
  },
  {
    id: 'al-chemistry',
    name: 'Chemistry',
    code: 'CHEM-AL',
    level: 'a-level',
    stream: 'Physical / Bio Science',
    icon: 'FlaskConical',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    textColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    availablePapers: 32,
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Organic, Inorganic and Physical Chemistry structured questions and answers.'
  },
  {
    id: 'al-biology',
    name: 'Biology',
    code: 'BIO-AL',
    level: 'a-level',
    stream: 'Biological Science',
    icon: 'Leaf',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-100',
    textColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    availablePapers: 30,
    years: [2024, 2023, 2022, 2021, 2020, 2019],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Botanical & Zoological principles, physiology essays, and structured question evaluations.'
  },
  {
    id: 'al-accounting',
    name: 'Accounting',
    code: 'ACC-AL',
    level: 'a-level',
    stream: 'Commerce',
    icon: 'Receipt',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-100',
    textColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
    availablePapers: 26,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Financial Statements, Auditing, Cost Accounting worksheets and official keys.'
  },
  {
    id: 'al-business-studies',
    name: 'Business Studies',
    code: 'BS-AL',
    level: 'a-level',
    stream: 'Commerce',
    icon: 'Briefcase',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-100',
    textColor: 'text-sky-600',
    iconBg: 'bg-sky-100',
    availablePapers: 24,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Management, Marketing, Finance case studies and evaluation schemes.'
  },
  {
    id: 'al-economics',
    name: 'Economics',
    code: 'ECON-AL',
    level: 'a-level',
    stream: 'Commerce / Arts',
    icon: 'TrendingUp',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    textColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    availablePapers: 26,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Micro & Macro Economics, Fiscal and Monetary policies questions with marking schemes.'
  },
  {
    id: 'al-ict',
    name: 'ICT (Information Tech)',
    code: 'ICT-AL',
    level: 'a-level',
    stream: 'All Streams / Tech',
    icon: 'Monitor',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
    textColor: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
    availablePapers: 28,
    years: [2024, 2023, 2022, 2021, 2020, 2019],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Advanced Python, SQL Database management, Networking, and System Design papers.'
  },
  {
    id: 'al-engineering-tech',
    name: 'Engineering Technology (ET)',
    code: 'ET-AL',
    level: 'a-level',
    stream: 'Technology',
    icon: 'Wrench',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-100',
    textColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    availablePapers: 20,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Civil, Mechanical, Electrical technology concepts and technical calculations.'
  },
  {
    id: 'al-bio-tech',
    name: 'Bio Systems Technology (BST)',
    code: 'BST-AL',
    level: 'a-level',
    stream: 'Technology',
    icon: 'Dna',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-100',
    textColor: 'text-teal-600',
    iconBg: 'bg-teal-100',
    availablePapers: 18,
    years: [2024, 2023, 2022, 2021],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Post-harvest technology, Food processing, and Environmental biology papers.'
  },
  {
    id: 'al-sft',
    name: 'Science for Technology (SFT)',
    code: 'SFT-AL',
    level: 'a-level',
    stream: 'Technology',
    icon: 'Cpu',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-100',
    textColor: 'text-violet-600',
    iconBg: 'bg-violet-100',
    availablePapers: 22,
    years: [2024, 2023, 2022, 2021, 2020],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Fundamental Physics, Chemistry, Biology and Math modules tailored for Technology stream.'
  },
  {
    id: 'al-logic',
    name: 'Logic & Scientific Method',
    code: 'LOGIC-AL',
    level: 'a-level',
    stream: 'Arts',
    icon: 'Brain',
    bgLight: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-100',
    textColor: 'text-fuchsia-600',
    iconBg: 'bg-fuchsia-100',
    availablePapers: 16,
    years: [2024, 2023, 2022, 2021],
    mediums: ['English', 'Sinhala', 'Tamil'],
    description: 'Symbolic logic, Deductive arguments, Scientific methodology questions and solutions.'
  }
];

// Generate paper list for each subject & year
export const generatePapersForSubject = (subject) => {
  const papers = [];
  const years = subject.years || [2024, 2023, 2022, 2021, 2020];
  const mediums = subject.mediums || ['English', 'Sinhala', 'Tamil'];

  years.forEach(year => {
    // Paper 1
    papers.push({
      id: `${subject.id}-${year}-p1-pp`,
      subjectId: subject.id,
      subjectName: subject.name,
      level: subject.level,
      year: year,
      type: 'past-paper',
      title: `${year} - ${subject.name} (${subject.level === 'o-level' ? 'O-Level' : 'A-Level'}) Paper 1`,
      subtitle: 'Structured / MCQ Questions',
      mediums: mediums,
      fileSize: '1.2 MB',
      pageCount: 8,
      downloadCount: 1420 + Math.floor(Math.random() * 800),
      previewUrl: `/view/${subject.id}-${year}-p1-pp`
    });

    // Paper 2
    papers.push({
      id: `${subject.id}-${year}-p2-pp`,
      subjectId: subject.id,
      subjectName: subject.name,
      level: subject.level,
      year: year,
      type: 'past-paper',
      title: `${year} - ${subject.name} (${subject.level === 'o-level' ? 'O-Level' : 'A-Level'}) Paper 2`,
      subtitle: 'Essay / Long Structured Questions',
      mediums: mediums,
      fileSize: '1.8 MB',
      pageCount: 12,
      downloadCount: 1680 + Math.floor(Math.random() * 950),
      previewUrl: `/view/${subject.id}-${year}-p2-pp`
    });

    // Marking Scheme Paper 1 & 2
    papers.push({
      id: `${subject.id}-${year}-ms`,
      subjectId: subject.id,
      subjectName: subject.name,
      level: subject.level,
      year: year,
      type: 'marking-scheme',
      title: `${year} - ${subject.name} (${subject.level === 'o-level' ? 'O-Level' : 'A-Level'}) Marking Scheme`,
      subtitle: 'Official Evaluation Rubric & Model Answers',
      mediums: mediums,
      fileSize: '0.9 MB',
      pageCount: 6,
      downloadCount: 2150 + Math.floor(Math.random() * 1200),
      previewUrl: `/view/${subject.id}-${year}-ms`
    });
  });

  return papers;
};

// All papers flat list for search
export const allSubjects = [...oLevelSubjects, ...aLevelSubjects];
export const allPapers = allSubjects.flatMap(sub => generatePapersForSubject(sub));

export const studyResources = [
  {
    id: 'res-revision',
    title: 'Revision Notes',
    description: 'Subject-wise concise summary notes, mind maps and formula cheat sheets for O-Level & A-Level.',
    category: 'Study Guides',
    icon: 'FileText',
    color: 'blue',
    count: '150+ Notes'
  },
  {
    id: 'res-model',
    title: 'Model Answers & Essays',
    description: 'Expert-crafted sample answers, top-scoring essay outlines, and evaluation breakdowns.',
    category: 'Exam Prep',
    icon: 'CheckCircle2',
    color: 'emerald',
    count: '80+ Sets'
  },
  {
    id: 'res-tips',
    title: 'Exam Tips & Time Management',
    description: 'Proven study strategies, time allocation techniques for paper 1 and paper 2, and common mistakes to avoid.',
    category: 'Strategy',
    icon: 'Lightbulb',
    color: 'amber',
    count: '30+ Guides'
  },
  {
    id: 'res-plans',
    title: 'Study Plans & Timetables',
    description: 'Customizable 30-day, 60-day, and 90-day revision timetables tailored for Sri Lankan syllabus.',
    category: 'Planning',
    icon: 'Calendar',
    color: 'purple',
    count: '12+ Templates'
  }
];
