import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  SlidersHorizontal, 
  X, 
  BookOpen, 
  Loader2, 
  GraduationCap, 
  Award, 
  RotateCcw, 
  Sparkles, 
  Filter 
} from 'lucide-react';
import { allPapers, allSubjects } from '../../data/papersData';
import { api } from '../../services/api';

// Helper to reliably detect O-Level vs A-Level
const detectLevel = (p) => {
  const lvlName = (p.subjectId?.levelId?.name || p.levelName || p.level || '').toLowerCase();
  const subName = (p.subjectId?.name || p.subjectName || '').toLowerCase();
  const title = (p.title || '').toLowerCase();

  if (
    lvlName.includes('o/l') || lvlName.includes('ordinary') || 
    subName.includes('(o/l)') || subName.includes('o/l') || subName.includes('ordinary') ||
    title.includes('(o/l)') || title.includes('o/l') || title.includes('ordinary')
  ) {
    return 'o-level';
  }

  if (
    lvlName.includes('a/l') || lvlName.includes('advanced') || 
    subName.includes('(a/l)') || subName.includes('a/l') || subName.includes('advanced') ||
    title.includes('(a/l)') || title.includes('a/l') || title.includes('advanced')
  ) {
    return 'a-level';
  }

  return 'a-level';
};

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  
  // Clean Filter States (No auto-selection by default)
  const [selectedLevels, setSelectedLevels] = useState([]); // [] = all levels
  const [selectedTypes, setSelectedTypes] = useState([]);   // [] = all types
  const [selectedYears, setSelectedYears] = useState([]);   // [] = all years
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Data from MongoDB (Loaded once for ultra-fast instant live search in body)
  // Data from MongoDB (Loaded once on mount, filtered locally in-body on keystroke)
  const [dbPDFs, setDbPDFs] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync query from URL only on initial mount or back/forward browser navigation
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    if (urlQ !== query) {
      setQuery(urlQ);
    }
  }, [searchParams]);

  // Load all PDFs and Subjects once on initial mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pdfRes, subRes] = await Promise.all([
          api.getPDFs(),
          api.getSubjects()
        ]);

        if (subRes && subRes.success && Array.isArray(subRes.data)) {
          const mappedSubs = subRes.data.map(s => {
            const lvl = (s.levelId?.name?.toLowerCase().includes('o/l') || s.levelId?.name?.toLowerCase().includes('ordinary') || s.name.toLowerCase().includes('(o/l)')) ? 'o-level' : 'a-level';
            return {
              id: s._id,
              name: s.name,
              level: lvl,
              levelName: s.levelId?.name || (lvl === 'o-level' ? 'Ordinary Level (O/L)' : 'Advanced Level (A/L)')
            };
          });
          setDbSubjects(mappedSubs);
        }

        if (pdfRes && pdfRes.success && Array.isArray(pdfRes.data) && pdfRes.data.length > 0) {
          const mappedPDFs = pdfRes.data.map(p => {
            const lvl = detectLevel(p);
            const isScheme = p.typeId?.name === 'Marking Scheme' || (p.title || '').toLowerCase().includes('marking');
            return {
              id: p._id,
              title: p.title,
              subjectId: p.subjectId?._id || p.subjectId || 'general',
              subjectName: p.subjectId?.name || 'Subject',
              level: lvl,
              type: isScheme ? 'marking-scheme' : 'past-paper',
              typeName: isScheme ? 'Marking Scheme' : 'Past Paper',
              year: p.year,
              medium: p.medium || 'Sinhala',
              mediums: [p.medium || 'Sinhala'],
              fileUrl: p.fileUrl,
              fileSize: p.fileSize || '1.2 MB'
            };
          });
          setDbPDFs(mappedPDFs);
        }
      } catch (err) {
        console.error('Error fetching search data from MongoDB:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Live Instant Letter-by-Letter Query Handler (Instant local filtering in body, no backend requests)
  const handleQueryChange = (val) => {
    setQuery(val);
    // Smoothly update URL query param in background without triggering re-fetch
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Form submit prevention (Prevents page reload, keeps search 100% in-body)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Exam Level Toggle
  const handleSelectLevelQuick = (lvl) => {
    if (lvl === 'all') {
      setSelectedLevels([]);
    } else {
      setSelectedLevels([lvl]);
    }
    setSelectedSubject('all');
  };

  const toggleLevelCheckbox = (lvl) => {
    setSelectedLevels(prev => {
      if (prev.includes(lvl)) {
        return prev.filter(item => item !== lvl);
      } else {
        return [lvl];
      }
    });
    setSelectedSubject('all');
  };

  const toggleType = (t) => {
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const toggleYear = (y) => {
    setSelectedYears(prev => 
      prev.includes(y) ? prev.filter(item => item !== y) : [...prev, y]
    );
  };

  // Available subjects for the dropdown
  const availableSubjects = useMemo(() => {
    const pool = dbSubjects.length > 0 ? dbSubjects : allSubjects;
    if (selectedLevels.length === 1) {
      return pool.filter(s => selectedLevels.includes(s.level));
    }
    return pool;
  }, [dbSubjects, selectedLevels]);

  // Reset subject if out of scope
  useEffect(() => {
    if (selectedSubject !== 'all') {
      const exists = availableSubjects.some(s => s.id === selectedSubject || s.name === selectedSubject);
      if (!exists) {
        setSelectedSubject('all');
      }
    }
  }, [availableSubjects, selectedSubject]);

  // Master Pool of papers
  const pool = useMemo(() => {
    if (dbPDFs.length > 0) return dbPDFs;
    return allPapers.map(p => ({
      ...p,
      level: p.level || (p.title?.toLowerCase().includes('o/l') ? 'o-level' : 'a-level'),
      typeName: p.type === 'marking-scheme' ? 'Marking Scheme' : 'Past Paper'
    }));
  }, [dbPDFs]);

  // Live Instant Letter-by-Letter Filter in the Body
  const filtered = useMemo(() => {
    const qLower = query.toLowerCase().trim();
    const queryTokens = qLower.split(/\s+/).filter(Boolean);

    return pool.filter(paper => {
      // 1. Exam Level Filter (When A/L selected -> ONLY A/L; when O/L selected -> ONLY O/L)
      if (selectedLevels.length > 0) {
        if (!selectedLevels.includes(paper.level)) {
          return false;
        }
      }

      // 2. Instant Letter-by-Letter Multi-token Search across all attributes
      if (queryTokens.length > 0) {
        const title = (paper.title || '').toLowerCase();
        const subject = (paper.subjectName || '').toLowerCase();
        const year = (paper.year || '').toString();
        const mediumStr = (paper.medium || (Array.isArray(paper.mediums) ? paper.mediums.join(' ') : '')).toLowerCase();
        const typeName = (paper.typeName || (paper.type === 'marking-scheme' ? 'marking scheme answers scheme' : 'past paper question paper')).toLowerCase();
        const levelCode = paper.level === 'o-level' ? 'o-level o/l ordinary ol' : 'a-level a/l advanced al';
        const subtitle = (paper.subtitle || '').toLowerCase();

        const fullSearchableText = `${title} ${subject} ${year} ${mediumStr} ${typeName} ${levelCode} ${subtitle}`;

        const allTokensMatch = queryTokens.every(token => fullSearchableText.includes(token));
        if (!allTokensMatch) {
          return false;
        }
      }

      // 3. Subject Select Filter
      if (selectedSubject !== 'all') {
        const subId = paper.subjectId?._id || paper.subjectId;
        const matchesId = subId === selectedSubject;
        const matchesName = (paper.subjectName || '').toLowerCase() === selectedSubject.toLowerCase();
        if (!matchesId && !matchesName) {
          return false;
        }
      }

      // 4. File Type Filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(paper.type)) {
          return false;
        }
      }

      // 5. Year Filter
      if (selectedYears.length > 0) {
        if (!selectedYears.includes(paper.year)) {
          return false;
        }
      }

      // 6. Medium Filter
      if (selectedMedium !== 'all') {
        if ((paper.medium || '').toLowerCase() !== selectedMedium.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [pool, query, selectedLevels, selectedSubject, selectedTypes, selectedYears, selectedMedium]);

  const handleResetAllFilters = () => {
    setSelectedLevels([]);
    setSelectedTypes([]);
    setSelectedYears([]);
    setSelectedSubject('all');
    setSelectedMedium('all');
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const isOnlyOL = selectedLevels.length === 1 && selectedLevels[0] === 'o-level';
  const isOnlyAL = selectedLevels.length === 1 && selectedLevels[0] === 'a-level';
  const isAllLevels = selectedLevels.length === 0;

  const totalActiveFilters = selectedLevels.length + 
                             selectedTypes.length + 
                             selectedYears.length + 
                             (selectedSubject !== 'all' ? 1 : 0) + 
                             (selectedMedium !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-10 sm:py-14 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium uppercase tracking-wider border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Live Search</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-white">
              {query ? `Search: "${query}"` : "Search Past Papers & Marking Schemes"}
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
              Type any subject, year, or keyword to filter past papers and marking schemes live.
            </p>

            {/* Instant Live Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl pt-2">
              <div className="flex items-center bg-white rounded-2xl shadow-lg p-1 sm:p-1.5 border border-slate-100">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Type letter by letter to filter instantly (e.g. 2024, maths, science)..."
                  className="w-full py-2.5 text-slate-800 text-xs sm:text-sm font-normal focus:outline-none bg-transparent"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleQueryChange('')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:inline-flex items-center px-3.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-xl shrink-0 mr-1">
                  <span>Live Filter</span>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Quick Level Filter Pills Row */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
              Exam Level:
            </span>
            
            <button
              onClick={() => handleSelectLevelQuick('all')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isAllLevels 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Levels</span>
            </button>

            <button
              onClick={() => handleSelectLevelQuick('o-level')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isOnlyOL 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>O-Level Only</span>
            </button>

            <button
              onClick={() => handleSelectLevelQuick('a-level')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isOnlyAL 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>A-Level Only</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {totalActiveFilters > 0 && (
              <button
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar Filters */}
          <aside className={`
            lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 h-fit
            ${mobileFilterOpen ? 'fixed inset-0 z-50 overflow-y-auto m-0 rounded-none' : 'hidden lg:block'}
          `}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm">Filter Archive</h3>
              </div>
              
              {totalActiveFilters > 0 && (
                <button
                  onClick={handleResetAllFilters}
                  className="text-xs font-medium text-rose-600 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}

              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 1. Exam Level Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  1. Exam Level
                </h4>
                {selectedLevels.length === 1 && (
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedLevels[0] === 'o-level' ? 'O/L Only' : 'A/L Only'}
                  </span>
                )}
              </div>
              
              <div className="space-y-1.5">
                <label className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm font-normal cursor-pointer transition select-none ${
                  isOnlyOL 
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-slate-100/60'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isOnlyOL}
                      onChange={() => toggleLevelCheckbox('o-level')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>Ordinary Level (O/L)</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Grade 11</span>
                </label>

                <label className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm font-normal cursor-pointer transition select-none ${
                  isOnlyAL 
                    ? 'bg-purple-50/70 border-purple-200 text-purple-900' 
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-slate-100/60'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isOnlyAL}
                      onChange={() => toggleLevelCheckbox('a-level')}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                    />
                    <span>Advanced Level (A/L)</span>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">A-Level</span>
                </label>
              </div>
            </div>

            {/* 2. Subject Select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  2. Subject ({availableSubjects.length})
                </h4>
                {selectedSubject !== 'all' && (
                  <button
                    onClick={() => setSelectedSubject('all')}
                    className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl p-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">
                  -- All Subjects ({availableSubjects.length}) --
                </option>
                {availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {selectedLevels.length !== 1 ? `(${s.level === 'o-level' ? 'O/L' : 'A/L'})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. File Type Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  3. Document Type
                </h4>
                {selectedTypes.length > 0 && (
                  <button
                    onClick={() => setSelectedTypes([])}
                    className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'past-paper', label: 'Past Papers (Questions)' },
                  { id: 'marking-scheme', label: 'Marking Schemes & Answers' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 text-xs sm:text-sm font-normal text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(item.id)}
                      onChange={() => toggleType(item.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Language Medium Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                4. Language Medium
              </h4>
              <select
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl p-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Mediums (Sinhala, English, Tamil)</option>
                <option value="Sinhala">Sinhala Medium</option>
                <option value="English">English Medium</option>
                <option value="Tamil">Tamil Medium</option>
              </select>
            </div>

            {/* 5. Year Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  5. Examination Year
                </h4>
                {selectedYears.length > 0 && (
                  <button
                    onClick={() => setSelectedYears([])}
                    className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                  <label key={y} className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(y)}
                      onChange={() => toggleYear(y)}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>{y} Exam</span>
                  </label>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm shadow-md cursor-pointer"
              >
                Apply Filters ({filtered.length} Results)
              </button>
            )}

          </aside>

          {/* Right Results Column */}
          <main className="lg:col-span-8 space-y-3">
            
            {/* Header Result Count Bar */}
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-700 text-sm">
                  Showing <span className="font-semibold text-blue-600">{filtered.length}</span> matching papers & schemes
                  {query && (
                    <span className="text-slate-500 text-xs ml-1 font-normal">
                      for "{query}"
                    </span>
                  )}
                </span>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  {isOnlyAL && "Showing only A-Level past papers"}
                  {isOnlyOL && "Showing only O-Level past papers"}
                  {isAllLevels && "Live client filtering without server latency"}
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>

            {/* Results Card List */}
            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map(paper => {
                  const isAL = paper.level === 'a-level';
                  const isScheme = paper.type === 'marking-scheme';

                  return (
                    <div
                      key={paper.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl ${isScheme ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} flex items-center justify-center shrink-0 border ${isScheme ? 'border-emerald-100' : 'border-rose-100'}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        
                        <div className="space-y-1.5">
                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              isAL ? 'bg-purple-50 text-purple-700 border border-purple-200/60' : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            }`}>
                              {isAL ? 'A-Level' : 'O-Level'}
                            </span>
                            
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-normal">
                              {paper.year} Exam
                            </span>

                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              isScheme ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {paper.typeName || (isScheme ? 'Marking Scheme' : 'Past Paper')}
                            </span>

                            <span className="text-[11px] text-slate-400 font-normal">
                              {paper.fileSize}
                            </span>
                          </div>

                          {/* Paper Title */}
                          <h3 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                            {paper.title}
                          </h3>

                          {/* Subtitle */}
                          <p className="text-xs text-slate-500 font-normal">
                            {paper.subjectName} • {paper.medium} Medium
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Link
                          to={`/view/${paper.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </Link>
                        
                        <a
                          href={paper.fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 shadow-xs">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
                <div>
                  <h3 className="text-base font-semibold text-slate-800">No matching documents found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 font-normal">
                    {query ? `No documents match "${query}". Try typing a different keyword or year.` : "No documents match your active filters."}
                  </p>
                </div>

                <button
                  onClick={handleResetAllFilters}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 shadow-xs transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}
