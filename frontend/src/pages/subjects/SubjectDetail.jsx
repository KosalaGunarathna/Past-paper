import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Languages,
  Loader2
} from 'lucide-react';
import { allSubjects, generatePapersForSubject } from '../../data/papersData';
import { api } from '../../services/api';
import SubjectIcon from '../../components/SubjectIcon';

export default function SubjectDetail() {
  const { level, subjectId } = useParams();
  const [activeTab, setActiveTab] = useState('past-papers');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [dbSubject, setDbSubject] = useState(null);
  const [dbPDFs, setDbPDFs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch subject by ID from DB if it looks like an ObjectId or matches
        if (subjectId && subjectId.length === 24) {
          const sRes = await api.getSubjectById(subjectId);
          if (sRes.success && sRes.data) {
            setDbSubject(sRes.data);
          }
        }
        const pRes = await api.getPDFs({ subjectId });
        if (pRes.success && pRes.data && pRes.data.length > 0) {
          setDbPDFs(pRes.data);
        }
      } catch (err) {
        console.error('Error fetching subject detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const fallbackSubject = allSubjects.find(s => s.id === subjectId) || allSubjects[0];
  const subject = dbSubject ? {
    id: dbSubject._id,
    name: dbSubject.name,
    level: dbSubject.levelId?.name?.toLowerCase().includes('o/l') ? 'o-level' : 'a-level',
    code: dbSubject._id.substring(18).toUpperCase(),
    description: `${dbSubject.name} examination past papers, marking schemes and model questions.`,
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    years: [2024, 2023, 2022, 2021, 2020]
  } : fallbackSubject;

  const allGenerated = generatePapersForSubject(fallbackSubject);

  // If we have DB PDFs, map them
  const papersToDisplay = dbPDFs.length > 0 ? dbPDFs.map(p => ({
    id: p._id,
    title: p.title,
    subtitle: `${p.year} Examination • ${p.part || 'Full Paper'}`,
    year: p.year,
    type: p.typeId?.name === 'Marking Scheme' ? 'marking-scheme' : 'past-paper',
    mediums: [p.medium],
    fileSize: p.fileSize || '1.2 MB',
    pageCount: 12,
    downloadCount: 1420
  })) : allGenerated;

  const filteredPapers = papersToDisplay.filter(paper => {
    const matchesType = activeTab === 'past-papers' 
      ? paper.type === 'past-paper' 
      : paper.type === 'marking-scheme';
    const matchesYear = selectedYear === 'all' || paper.year === parseInt(selectedYear);
    const matchesMed = selectedMedium === 'all' || paper.mediums.includes(selectedMedium);
    return matchesType && matchesYear && matchesMed;
  });

  const handleDownload = (paperTitle) => {
    setDownloadSuccess(`Downloading "${paperTitle}"...`);
    setTimeout(() => {
      setDownloadSuccess('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Subject Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-6 flex-wrap">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={subject.level === 'o-level' ? '/o-level' : '/a-level'} className="hover:text-white transition">
              {subject.level === 'o-level' ? 'O-Level' : 'A-Level'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{subject.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${subject.bgLight || 'bg-blue-50'} flex items-center justify-center shrink-0 shadow-lg`}>
                <SubjectIcon 
                  name={subject.icon} 
                  className={`w-9 h-9 sm:w-11 sm:h-11 ${subject.textColor || 'text-blue-600'}`} 
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
                    {subject.level === 'o-level' ? 'O-Level' : 'A-Level'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Code: {subject.code}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white">
                  {subject.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
                  {subject.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={subject.level === 'o-level' ? '/o-level' : '/a-level'}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All {subject.level === 'o-level' ? 'O/L' : 'A/L'} Subjects</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Tab Switcher & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/80 mb-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('past-papers')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'past-papers'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Past Papers</span>
              </button>

              <button
                onClick={() => setActiveTab('marking-schemes')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'marking-schemes'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marking Schemes</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="all">All Years (2018 - 2024)</option>
                  {(subject.years || [2024, 2023, 2022, 2021, 2020]).map(y => (
                    <option key={y} value={y}>{y} Examination</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="all">All Mediums</option>
                  <option value="English">English Medium</option>
                  <option value="Sinhala">Sinhala Medium</option>
                  <option value="Tamil">Tamil Medium</option>
                </select>
              </div>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {downloadSuccess}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">Saved to Downloads</span>
            </div>
          )}

        </div>

        {/* Papers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 hidden md:grid md:grid-cols-12 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <div className="col-span-2">Year</div>
            <div className="col-span-5">Paper & Details</div>
            <div className="col-span-2">Mediums Available</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-4 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:grid md:grid-cols-12 md:items-center gap-4"
              >
                <div className="md:col-span-2 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-sm font-black border border-blue-100">
                    {paper.year}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold md:hidden">
                    {paper.type === 'marking-scheme' ? 'Marking Scheme' : 'Past Paper'}
                  </span>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${paper.type === 'marking-scheme' ? 'text-emerald-600' : 'text-rose-500'}`} />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {paper.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    {paper.subtitle} • {paper.fileSize} • {paper.pageCount} Pages • {paper.downloadCount.toLocaleString()} downloads
                  </p>
                </div>

                <div className="md:col-span-2 flex items-center gap-1.5 flex-wrap">
                  {paper.mediums.map((med) => (
                    <span
                      key={med}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 border border-slate-200"
                    >
                      {med}
                    </span>
                  ))}
                </div>

                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2 pt-2 md:pt-0">
                  <Link
                    to={`/view/${paper.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Online</span>
                  </Link>

                  <button
                    onClick={() => handleDownload(paper.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
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

    </div>
  );
}
