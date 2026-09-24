import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import { oLevelSubjects } from '../../data/papersData';
import { api } from '../../services/api';
import SubjectCard from '../../components/SubjectCard';

export default function OLevelSubjects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [dbSubjects, setDbSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOLSubjects = async () => {
      try {
        const res = await api.getSubjects();
        if (res.success && res.data) {
          const olOnly = res.data.filter(s => 
            s.levelId?.name?.toLowerCase().includes('o/l') || 
            s.levelId?.name?.toLowerCase().includes('ordinary')
          ).map(s => ({
            id: s._id,
            name: s.name,
            level: 'o-level',
            category: 'Core Subjects',
            description: `${s.name} past papers, model papers and marking schemes from 2018 to 2024.`,
            color: 'blue',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            paperCount: '2018 - 2024'
          }));
          if (olOnly.length > 0) {
            setDbSubjects(olOnly);
          }
        }
      } catch (err) {
        console.error('Failed to load O/L subjects from DB:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOLSubjects();
  }, []);

  const categories = ['All', 'Core Subjects', 'Group I', 'Group II', 'Group III', 'Religion'];

  const subjectList = dbSubjects.length > 0 ? dbSubjects : oLevelSubjects;

  const filteredSubjects = subjectList.filter(sub => {
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesSearch = sub.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          (sub.description && sub.description.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-semibold uppercase tracking-wider text-blue-200 border border-blue-400/30">
              <GraduationCap className="w-4 h-4" />
              <span>G.C.E. Ordinary Level (Grade 11)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              O-Level Examination Subjects
            </h1>
            <p className="text-sm sm:text-base text-blue-200 font-normal leading-relaxed">
              Select a subject to view past papers, marking schemes, model answers and revision notes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Search & Filter Header Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              Categories:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search O-Level subject..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

        </div>

        {/* Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              O-Level Subjects ({filteredSubjects.length})
              {selectedCategory !== 'All' && (
                <span className="text-blue-600 font-medium text-sm ml-2">
                  • {selectedCategory}
                </span>
              )}
            </h2>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              Updated for 2024 Exam Syllabus
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 flex items-center justify-center gap-2 text-blue-600 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading O-Level subjects...</span>
            </div>
          ) : filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredSubjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No subjects match your search.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchFilter(''); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium cursor-pointer transition"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
