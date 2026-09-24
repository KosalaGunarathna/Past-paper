import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import SubjectIcon from './SubjectIcon';

export default function SubjectCard({ subject }) {
  return (
    <Link
      to={`/subject/${subject.level}/${subject.id}`}
      className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-400/60 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`w-12 h-12 rounded-xl ${subject.bgLight || 'bg-blue-50'} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <SubjectIcon 
            name={subject.icon} 
            className={`w-6 h-6 ${subject.textColor || 'text-blue-600'}`} 
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
            {subject.name}
          </h3>
          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {subject.category || subject.stream || `${subject.availablePapers || 20}+ Papers`}
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors">
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
