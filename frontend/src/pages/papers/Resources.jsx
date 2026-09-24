import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Lightbulb, 
  Calendar, 
  Download, 
  Sparkles 
} from 'lucide-react';
import { studyResources } from '../../data/papersData';

export default function Resources() {
  const [downloadedItem, setDownloadedItem] = useState('');

  const handleDownload = (title) => {
    setDownloadedItem(title);
    setTimeout(() => setDownloadedItem(''), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 sm:py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Academic Preparation Toolkit</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Study Resources
            </h1>
            <p className="text-base sm:text-lg text-blue-100 font-normal">
              Additional study notes, expert-crafted model answers, revision timetables, and exam strategy guides to help you score an A.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {downloadedItem && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in">
            <span>✅ Successfully downloaded "{downloadedItem}" resource guide!</span>
            <span className="text-xs text-emerald-600">Saved to device</span>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {studyResources.map((res) => {
            let IconComponent = FileText;
            if (res.icon === 'CheckCircle2') IconComponent = CheckCircle2;
            if (res.icon === 'Lightbulb') IconComponent = Lightbulb;
            if (res.icon === 'Calendar') IconComponent = Calendar;

            return (
              <div
                key={res.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {res.count}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {res.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {res.category}
                  </span>
                  <button
                    onClick={() => handleDownload(res.title)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resource</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips and Advice Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Top Exam Strategies from Past Island Rankers
            </h2>
            <p className="text-slate-500 text-sm">
              Key habits to maximize marks in both G.C.E. O/L and A/L examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
              <h4 className="font-bold text-blue-900 text-base">1. Time-Box Past Papers</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Always set an exact timer identical to real exam hours (e.g. 2 hours for MCQ, 3 hours for essay).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
              <h4 className="font-bold text-purple-900 text-base">2. Study Marking Schemes</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review official marking schemes to understand step marks, keywords, and formatting required by examiners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-emerald-900 text-base">3. Review Weak Concepts</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Maintain an error log of questions you missed and re-attempt them 3 days later to solidify understanding.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
