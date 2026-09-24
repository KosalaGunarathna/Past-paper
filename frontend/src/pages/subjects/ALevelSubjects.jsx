import React, { useState, useEffect } from 'react';
import { Award, Search, BookOpen, Loader2, Sparkles, Layers } from 'lucide-react';
import { aLevelSubjects } from '../../data/papersData';
import { api } from '../../services/api';
import SubjectCard from '../../components/SubjectCard';

export default function ALevelSubjects() {
  const [selectedStream, setSelectedStream] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbStreams, setDbStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Standard official A/L streams fallback
  const defaultStreams = [
    'All',
    'Physical Science (Maths)',
    'Biological Science',
    'Commerce',
    'Technology (ET/BST)',
    'Arts',
    'Information Technology (ICT)'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subRes, streamRes] = await Promise.all([
          api.getSubjects(),
          api.getStreams()
        ]);

        // Load streams from DB
        if (streamRes && streamRes.success && Array.isArray(streamRes.data)) {
          const fetchedStreamNames = streamRes.data.map(st => st.name).filter(Boolean);
          if (fetchedStreamNames.length > 0) {
            // Merge with defaults to ensure complete list without duplicates
            const merged = ['All', ...new Set([...defaultStreams.slice(1), ...fetchedStreamNames])];
            setDbStreams(merged);
          }
        }

        // Load subjects from DB
        if (subRes && subRes.success && Array.isArray(subRes.data)) {
          const alOnly = subRes.data.filter(s => 
            s.levelId?.name?.toLowerCase().includes('a/l') || 
            s.levelId?.name?.toLowerCase().includes('advanced') ||
            s.name.toLowerCase().includes('(a/l)')
          ).map(s => {
            const streamNames = Array.isArray(s.streamIds) ? s.streamIds.map(st => st.name || st).filter(Boolean) : [];
            return {
              id: s._id,
              name: s.name,
              level: 'a-level',
              stream: streamNames.join(' / ') || 'General',
              streams: streamNames,
              streamIds: Array.isArray(s.streamIds) ? s.streamIds.map(st => st._id || st) : [],
              description: `${s.name} A-Level past papers, model papers, and marking schemes.`,
              color: 'purple',
              bgLight: 'bg-purple-50',
              textColor: 'text-purple-600',
              borderColor: 'border-purple-200',
              paperCount: '2018 - 2024'
            };
          });
          if (alOnly.length > 0) {
            setDbSubjects(alOnly);
          }
        }
      } catch (err) {
        console.error('Failed to load A/L subjects/streams from DB:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const streams = dbStreams.length > 0 ? dbStreams : defaultStreams;
  const subjectList = dbSubjects.length > 0 ? dbSubjects : aLevelSubjects;

  const filteredSubjects = subjectList.filter(sub => {
    let matchesStream = true;
    if (selectedStream !== 'All') {
      const target = selectedStream.toLowerCase();
      const subStreamNames = (sub.streams || []).map(st => (typeof st === 'string' ? st : st.name || '').toLowerCase());
      const subStreamField = (sub.stream || '').toLowerCase();
      
      // Direct matching
      const directMatch = subStreamNames.some(st => st.includes(target) || target.includes(st)) || subStreamField.includes(target);
      
      // Keyword matching across common A/L stream naming
      let keywordMatch = false;
      if (target.includes('math') || target.includes('physical')) {
        keywordMatch = subStreamField.includes('math') || subStreamField.includes('physical') || subStreamNames.some(st => st.includes('math') || st.includes('physical'));
      } else if (target.includes('bio')) {
        keywordMatch = subStreamField.includes('bio') || subStreamNames.some(st => st.includes('bio'));
      } else if (target.includes('comm')) {
        keywordMatch = subStreamField.includes('comm') || subStreamNames.some(st => st.includes('comm'));
      } else if (target.includes('tech') || target.includes('et') || target.includes('bst') || target.includes('sft')) {
        keywordMatch = subStreamField.includes('tech') || subStreamField.includes('sft') || subStreamNames.some(st => st.includes('tech') || st.includes('sft'));
      } else if (target.includes('art')) {
        keywordMatch = subStreamField.includes('art') || subStreamNames.some(st => st.includes('art'));
      } else if (target.includes('ict') || target.includes('information')) {
        keywordMatch = subStreamField.includes('ict') || subStreamField.includes('info') || subStreamNames.some(st => st.includes('ict') || st.includes('info'));
      }

      matchesStream = directMatch || keywordMatch;
    }

    const matchesSearch = sub.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          (sub.description && sub.description.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesStream && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold uppercase tracking-wider text-purple-200 border border-purple-400/30">
              <Award className="w-4 h-4" />
              <span>G.C.E. Advanced Level (A/L)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              A-Level Examination Subjects
            </h1>
            <p className="text-sm sm:text-base text-purple-200 font-normal leading-relaxed">
              Explore past papers, marking schemes, model papers, and resource books categorized by study streams.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Search & Filter Header Bar with All Streams */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-8 space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Stream Navigation Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                Streams:
              </span>
              
              {streams.map(stream => {
                const isSelected = selectedStream === stream;
                return (
                  <button
                    key={stream}
                    onClick={() => setSelectedStream(stream)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {stream}
                  </button>
                );
              })}
            </div>

            {/* Instant Search Box */}
            <div className="relative w-full lg:w-72 shrink-0">
              <input
                type="text"
                placeholder="Search A-Level subject..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

          </div>

        </div>

        {/* Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              A-Level Subjects ({filteredSubjects.length})
              {selectedStream !== 'All' && (
                <span className="text-purple-600 font-medium text-sm ml-2">
                  • {selectedStream}
                </span>
              )}
            </h2>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              Covers Physical Science, Bio, Commerce, Technology, Arts & ICT
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 flex items-center justify-center gap-2 text-purple-600 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading A-Level subjects...</span>
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
              <p className="font-semibold text-slate-700">No A-Level subjects found in "{selectedStream}".</p>
              <button
                onClick={() => { setSelectedStream('All'); setSearchFilter(''); }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-medium cursor-pointer transition"
              >
                Show all A-Level subjects
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

