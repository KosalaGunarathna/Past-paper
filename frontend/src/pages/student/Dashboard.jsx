import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Bookmark, 
  Clock, 
  BookOpen, 
  FileText, 
  Eye, 
  Sparkles, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { allSubjects } from '../../data/papersData';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('downloads');

  const recentDownloads = [
    {
      id: 'ol-maths-2024-p1-pp',
      title: '2024 - Mathematics (O-Level) Paper 1',
      subject: 'Mathematics',
      level: 'O-Level',
      date: '12 Apr 2025',
      size: '1.2 MB',
      type: 'Past Paper'
    },
    {
      id: 'al-physics-2024-ms',
      title: '2024 - Physics (A-Level) Marking Scheme',
      subject: 'Physics',
      level: 'A-Level',
      date: '10 Apr 2025',
      size: '0.8 MB',
      type: 'Marking Scheme'
    },
    {
      id: 'ol-english-2023-p2-pp',
      title: '2023 - English (O-Level) Paper 2',
      subject: 'English',
      level: 'O-Level',
      date: '08 Apr 2025',
      size: '1.4 MB',
      type: 'Past Paper'
    },
    {
      id: 'al-comb-maths-2023-p1-pp',
      title: '2023 - Combined Maths (A-Level) Paper 1',
      subject: 'Combined Mathematics',
      level: 'A-Level',
      date: '02 Apr 2025',
      size: '1.9 MB',
      type: 'Past Paper'
    }
  ];

  const bookmarkedSubjects = allSubjects.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white py-10 sm:py-14 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{user?.role === 'admin' ? 'Administrator Account' : 'Student Account'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Hello, {user?.username || 'Student'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Welcome back to your personalized past paper study dashboard.
                </p>
              </div>
            </div>

            <Link
              to="/o-level"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition self-start sm:self-center"
            >
              Browse New Papers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Downloads</span>
              <h3 className="text-2xl font-black text-slate-900">12 Papers</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Subjects</span>
              <h3 className="text-2xl font-black text-slate-900">5 Subjects</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Streak</span>
              <h3 className="text-2xl font-black text-slate-900">7 Days</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next G.C.E. Exam</span>
              <h3 className="text-2xl font-black text-slate-900">Dec 2025</h3>
            </div>
          </div>

        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Recent Downloads
                  </h2>
                  <p className="text-xs text-slate-500">
                    Quickly re-open or download your recently accessed past papers.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {recentDownloads.length} Available
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {recentDownloads.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl px-2 transition">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.type === 'Marking Scheme' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} flex items-center justify-center shrink-0`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Downloaded on {item.date} • {item.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        to={`/view/${item.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => alert(`Re-downloading ${item.title}`)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Pinned Subjects
              </h3>

              <div className="space-y-2">
                {bookmarkedSubjects.map(sub => (
                  <Link
                    key={sub.id}
                    to={`/subject/${sub.level}/${sub.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/60 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${sub.bgLight} flex items-center justify-center`}>
                        <BookOpen className={`w-4 h-4 ${sub.textColor}`} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {sub.level === 'o-level' ? 'O-Level' : 'A-Level'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </Link>
                ))}
              </div>

              <Link
                to="/o-level"
                className="block text-center py-2.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-xl transition"
              >
                + Explore More Subjects
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h4 className="text-base font-bold">Exam Countdown Tip</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Solve at least 5 years of past papers under exam conditions before attempting the real exam.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
