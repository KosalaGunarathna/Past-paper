import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Award, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Smartphone, 
  Target, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { oLevelSubjects, aLevelSubjects } from '../data/papersData';
import { api } from '../services/api';
import SubjectCard from '../components/SubjectCard';
import heroStudentImg from '../assets/image/hero_student.jpg';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbSubjects, setDbSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await api.getSubjects();
        if (res.success && res.data && res.data.length > 0) {
          setDbSubjects(res.data);
        }
      } catch (e) {
        console.error('Failed to load subjects from DB:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Process DB subjects or fallback
  const olFromDb = dbSubjects
    .filter(s => s.levelId?.name?.toLowerCase().includes('o/l') || s.levelId?.name?.toLowerCase().includes('ordinary'))
    .map(s => ({
      id: s._id,
      name: s.name,
      level: 'o-level',
      color: 'blue',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      paperCount: '2018 - 2024 (6 Years)'
    }));

  const alFromDb = dbSubjects
    .filter(s => s.levelId?.name?.toLowerCase().includes('a/l') || s.levelId?.name?.toLowerCase().includes('advanced'))
    .map(s => ({
      id: s._id,
      name: s.name,
      level: 'a-level',
      stream: s.streamIds?.[0]?.name || 'General',
      color: 'purple',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      paperCount: '2018 - 2024 (6 Years)'
    }));

  const popularOLevel = olFromDb.length > 0 ? olFromDb.slice(0, 8) : oLevelSubjects.slice(0, 8);
  const popularALevel = alFromDb.length > 0 ? alFromDb.slice(0, 8) : aLevelSubjects.slice(0, 8);

  const valueProps = [
    {
      icon: Download,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      title: 'Easy Download',
      description: 'Get your past papers and marking schemes in PDF format instantly with zero fuss.'
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      title: 'Trusted Content',
      description: 'Updated and accurate papers from official Sri Lankan Department of Examinations sources.'
    },
    {
      icon: Smartphone,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      title: 'Access Anywhere',
      description: 'Study smoothly on your smartphone, tablet, laptop or desktop computer.'
    },
    {
      icon: Target,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      title: 'Better Results',
      description: 'Practice real exam questions, improve speed, and get closer to your academic dreams.'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-indigo-50/40 to-slate-50 pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Country Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sri Lanka's #1 Exam Archive</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                O-Level & A-Level <br />
                <span className="text-blue-600">Past Papers</span> & Answers
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Download official past papers, structured questions, essay prompts, and marking schemes to prepare for your exams and achieve your goals.
              </p>

              {/* Big Hero Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-xl">
                <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-blue-500/10 border-2 border-slate-200 focus-within:border-blue-500 p-1.5 sm:p-2 transition-all">
                  <div className="pl-3 pr-2 text-slate-400">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by subject, paper name, year or exam..."
                    className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-600/30 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Past Papers</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Marking Schemes</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>100% Free Download</span>
                </div>
              </div>

            </div>

            {/* Right Visual Image & Floating Card (5 Cols) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl -z-10"></div>

                {/* Hero Student Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img 
                    src={heroStudentImg} 
                    alt="Sri Lankan student preparing for exam"
                    className="w-full h-80 sm:h-96 object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Bottom Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                </div>

                {/* Floating "Better Preparation" Badge */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3.5 animate-float-slow">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Better Preparation</h4>
                    <p className="text-xs font-semibold text-blue-600">Brighter Future</p>
                  </div>
                </div>

                {/* Floating Stats Badge */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-slate-100 text-center">
                  <span className="block text-lg font-black text-slate-900">1000+</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Papers & Schemes</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Exam Level Quick Switch Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          <Link
            to="/o-level"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                  Grade 11
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">O-Level (Ordinary Level)</h3>
                <p className="text-blue-100 text-sm max-w-sm">
                  Find past papers, model questions, and marking rubrics for all O/L subjects.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white group-hover:underline">
              <span>Explore O-Level Subjects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/a-level"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                  Advanced Level
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">A-Level (Advanced Level)</h3>
                <p className="text-purple-100 text-sm max-w-sm">
                  Access past papers & detailed solutions for Maths, Science, Commerce, Tech & Arts.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white group-hover:underline">
              <span>Explore A-Level Subjects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Section 1: O-Level Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  O-Level (Grade 11)
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Find past papers and marking schemes for all O-Level subjects.
                </p>
              </div>
            </div>

            <Link
              to="/o-level"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0"
            >
              <span>View All O-Level Subjects</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularOLevel.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>

        </div>
      </section>

      {/* Section 2: A-Level Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  A-Level (Advanced Level)
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Access past papers and marking schemes for all A-Level subjects.
                </p>
              </div>
            </div>

            <Link
              to="/a-level"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0"
            >
              <span>View All A-Level Subjects</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularALevel.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>

        </div>
      </section>

      {/* Value Proposition Grid (4 Features from mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black">
              Ready to Ace Your G.C.E. Exams?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Start practicing with verified past papers, model questions, and detailed marking criteria today.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/o-level"
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
              >
                Browse O-Level Papers
              </Link>
              <Link
                to="/a-level"
                className="px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition"
              >
                Browse A-Level Papers
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
