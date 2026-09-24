import React, { useState, useEffect, useMemo } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Edit3,
  Search, 
  CheckCircle2, 
  X, 
  Check,
  RefreshCw,
  Link as LinkIcon,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../../services/api';

export default function ManagePapers() {
  const [papersList, setPapersList] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbTypes, setDbTypes] = useState([]);
  const [dbMediums, setDbMediums] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);

  // Advanced Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all'); // all, o-level, a-level
  const [filterSubjectId, setFilterSubjectId] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState([]); // array of type names e.g. ['Past Paper', 'Marking Scheme']
  const [selectedMediums, setSelectedMediums] = useState([]); // array of mediums e.g. ['Sinhala', 'English', 'Tamil']
  const [selectedYears, setSelectedYears] = useState([]); // array of years e.g. [2024, 2023]
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Add Form state
  const [formData, setFormData] = useState({
    subjectId: '',
    typeId: '',
    year: '2024',
    part: 'Full Paper',
    medium: 'Sinhala',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.4 MB'
  });

  // Edit Form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    subjectId: '',
    typeId: '',
    year: '2024',
    part: 'Full Paper',
    medium: 'Sinhala',
    fileUrl: '',
    fileSize: '1.4 MB'
  });

  const [successMsg, setSuccessMsg] = useState('');

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pdfsRes, subsRes, typesRes, medsRes] = await Promise.all([
        api.getPDFs(),
        api.getSubjects(),
        api.getTypes(),
        api.getMediums()
      ]);

      if (subsRes.success && subsRes.data) {
        setDbSubjects(subsRes.data);
        if (subsRes.data.length > 0 && !formData.subjectId) {
          setFormData(prev => ({ ...prev, subjectId: subsRes.data[0]._id }));
        }
      }

      if (typesRes.success && typesRes.data) {
        setDbTypes(typesRes.data);
        if (typesRes.data.length > 0 && !formData.typeId) {
          setFormData(prev => ({ ...prev, typeId: typesRes.data[0]._id }));
        }
      }

      if (medsRes.success && medsRes.data) {
        setDbMediums(medsRes.data);
      }

      if (pdfsRes.success && pdfsRes.data) {
        setPapersList(pdfsRes.data);
      }
    } catch (err) {
      console.error('Failed to load papers metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Available Years list from data
  const availableYears = useMemo(() => {
    const yearsSet = new Set(papersList.map(p => p.year).filter(Boolean));
    [2025, 2024, 2023, 2022, 2021, 2020].forEach(y => yearsSet.add(y));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [papersList]);

  // Handle Type Checkbox Toggle
  const toggleTypeFilter = (typeName) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) ? prev.filter(t => t !== typeName) : [...prev, typeName]
    );
  };

  // Handle Medium Checkbox Toggle
  const toggleMediumFilter = (medName) => {
    setSelectedMediums(prev => 
      prev.includes(medName) ? prev.filter(m => m !== medName) : [...prev, medName]
    );
  };

  // Handle Year Checkbox Toggle
  const toggleYearFilter = (yr) => {
    setSelectedYears(prev => 
      prev.includes(yr) ? prev.filter(y => y !== yr) : [...prev, yr]
    );
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setFilterSubjectId('all');
    setSelectedTypes([]);
    setSelectedMediums([]);
    setSelectedYears([]);
  };

  // Filtered List
  const filteredPapers = useMemo(() => {
    return papersList.filter(paper => {
      const typeName = paper.typeId?.name || (typeof paper.typeId === 'string' ? paper.typeId : '');
      const subName = paper.subjectId?.name || '';
      const levelName = paper.subjectId?.levelId?.name || (typeof paper.subjectId?.levelId === 'string' ? paper.subjectId.levelId : '');
      const isOL = levelName.toLowerCase().includes('o/l') || levelName.toLowerCase().includes('ordinary');
      const isAL = levelName.toLowerCase().includes('a/l') || levelName.toLowerCase().includes('advanced');

      // 1. Level Filter
      if (filterLevel === 'o-level' && !isOL) return false;
      if (filterLevel === 'a-level' && !isAL) return false;

      // 2. Subject Filter
      if (filterSubjectId !== 'all') {
        const pSubId = paper.subjectId?._id || paper.subjectId;
        if (pSubId !== filterSubjectId) return false;
      }

      // 3. Document Type Filter (Checkboxes)
      if (selectedTypes.length > 0) {
        const matchesAnyType = selectedTypes.some(t => typeName.toLowerCase().includes(t.toLowerCase()));
        if (!matchesAnyType) return false;
      }

      // 4. Medium Filter (Checkboxes)
      if (selectedMediums.length > 0) {
        if (!selectedMediums.includes(paper.medium)) return false;
      }

      // 5. Year Filter (Checkboxes)
      if (selectedYears.length > 0) {
        if (!selectedYears.includes(paper.year)) return false;
      }

      // 6. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = (paper.title || '').toLowerCase().includes(q);
        const matchesSub = subName.toLowerCase().includes(q);
        const matchesYear = (paper.year || '').toString().includes(q);
        const matchesMed = (paper.medium || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesYear && !matchesMed) return false;
      }

      return true;
    });
  }, [papersList, searchTerm, filterLevel, filterSubjectId, selectedTypes, selectedMediums, selectedYears]);

  // Create Paper
  const handleUploadPaper = async (e) => {
    e.preventDefault();
    const selectedSub = dbSubjects.find(s => s._id === formData.subjectId) || dbSubjects[0];
    const selectedType = dbTypes.find(t => t._id === formData.typeId) || dbTypes[0];

    const isScheme = selectedType?.name?.toLowerCase().includes('marking');
    const autoTitle = `${formData.year} - ${selectedSub?.name || 'Subject'} ${isScheme ? 'Marking Scheme' : formData.part}`;

    try {
      const payload = {
        title: autoTitle,
        year: parseInt(formData.year),
        part: formData.part,
        medium: formData.medium,
        fileUrl: formData.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: formData.fileSize || '1.2 MB',
        subjectId: formData.subjectId || dbSubjects[0]?._id,
        typeId: formData.typeId || dbTypes[0]?._id
      };

      const res = await api.createPDF(payload);
      if (res.success && res.data) {
        setPapersList([res.data, ...papersList]);
        showToast(`"${autoTitle}" uploaded and published to database!`);
      } else {
        showToast(res.message || 'Paper created.');
      }
    } catch (err) {
      console.error('Error uploading PDF to backend:', err);
      showToast('Error uploading PDF.');
    }

    setShowAddModal(false);
  };

  // Start Edit Paper
  const handleStartEditPaper = (paper) => {
    setEditingPaper(paper);
    setEditFormData({
      title: paper.title || '',
      subjectId: paper.subjectId?._id || paper.subjectId || (dbSubjects[0]?._id || ''),
      typeId: paper.typeId?._id || paper.typeId || (dbTypes[0]?._id || ''),
      year: paper.year ? paper.year.toString() : '2024',
      part: paper.part || 'Full Paper',
      medium: paper.medium || 'Sinhala',
      fileUrl: paper.fileUrl || '',
      fileSize: paper.fileSize || '1.4 MB'
    });
  };

  // Save Edit Paper
  const handleSaveEditPaper = async (e) => {
    e.preventDefault();
    if (!editingPaper) return;

    try {
      const paperId = editingPaper._id || editingPaper.id;
      const selectedSub = dbSubjects.find(s => s._id === editFormData.subjectId);
      const selectedType = dbTypes.find(t => t._id === editFormData.typeId);

      const payload = {
        title: editFormData.title.trim() || `${editFormData.year} - ${selectedSub?.name || 'Subject'} ${editFormData.part}`,
        year: parseInt(editFormData.year),
        part: editFormData.part,
        medium: editFormData.medium,
        fileUrl: editFormData.fileUrl,
        fileSize: editFormData.fileSize,
        subjectId: editFormData.subjectId,
        typeId: editFormData.typeId
      };

      const res = await api.updatePDF(paperId, payload);
      if (res.success && res.data) {
        setPapersList(papersList.map(p => (p._id || p.id) === paperId ? res.data : p));
        showToast(`Document "${payload.title}" updated successfully!`);
      } else {
        setPapersList(papersList.map(p => (p._id || p.id) === paperId ? {
          ...p,
          ...payload,
          subjectId: selectedSub || p.subjectId,
          typeId: selectedType || p.typeId
        } : p));
        showToast(`Document updated!`);
      }
    } catch (err) {
      console.error('Error updating PDF:', err);
      showToast('Error updating PDF document.');
    }

    setEditingPaper(null);
  };

  // Delete Paper
  const handleDeletePaper = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete PDF record "${title}" from database?`)) {
      try {
        await api.deletePDF(id);
      } catch (e) {
        /* ignore */
      }
      setPapersList(papersList.filter(p => (p._id || p.id) !== id));
      showToast(`Document "${title}" deleted.`);
    }
  };

  const activeFiltersCount = (filterLevel !== 'all' ? 1 : 0) + 
                             (filterSubjectId !== 'all' ? 1 : 0) + 
                             selectedTypes.length + 
                             selectedMediums.length + 
                             selectedYears.length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Manage Past Papers & Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Filter, search, edit, and organize exam PDF documents stored in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInitialData}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Refresh papers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Paper</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ================= SEARCH & FILTER BAR ================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, subject name, year, medium..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterLevel === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilterLevel('o-level')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterLevel === 'o-level' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              O-Level
            </button>
            <button
              onClick={() => setFilterLevel('a-level')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterLevel === 'a-level' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A-Level
            </button>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer shrink-0 ${
              showFilterDrawer || activeFiltersCount > 0
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Options</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Checkbox Filter Rows */}
        {showFilterDrawer && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-150 text-xs">
            
            {/* 1. Subject Select */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                Subject Filter
              </span>
              <select
                value={filterSubjectId}
                onChange={(e) => setFilterSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Subjects ({dbSubjects.length})</option>
                {dbSubjects.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.levelId?.name?.includes('O/L') ? 'O/L' : 'A/L'})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Document Types Checkboxes */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                Document Types
              </span>
              <div className="flex flex-col gap-1.5">
                {['Past Paper', 'Marking Scheme'].map(tp => (
                  <label key={tp} className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(tp)}
                      onChange={() => toggleTypeFilter(tp)}
                      className="w-4 h-4 rounded-md border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>{tp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Mediums Checkboxes */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                Mediums
              </span>
              <div className="flex flex-col gap-1.5">
                {['Sinhala', 'English', 'Tamil'].map(med => (
                  <label key={med} className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedMediums.includes(med)}
                      onChange={() => toggleMediumFilter(med)}
                      className="w-4 h-4 rounded-md border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>{med} Medium</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Examination Years Checkboxes */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                Years
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto">
                {availableYears.slice(0, 6).map(yr => (
                  <label key={yr} className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium font-mono">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(yr)}
                      onChange={() => toggleYearFilter(yr)}
                      className="w-3.5 h-3.5 rounded-md border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>{yr}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================= PAPERS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 grid grid-cols-12 items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Year</div>
          <div className="col-span-6">Title & Subject</div>
          <div className="col-span-2">Medium & Type</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {filteredPapers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">No documents match the active search & filters</p>
              <button
                onClick={handleResetFilters}
                className="text-xs text-purple-600 font-bold hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredPapers.map((paper) => {
              const paperId = paper._id || paper.id;
              const subName = paper.subjectId?.name || 'General Subject';
              const levelName = paper.subjectId?.levelId?.name || 'O/L';
              const typeName = paper.typeId?.name || 'Past Paper';
              const isScheme = typeName.toLowerCase().includes('marking');

              return (
                <div 
                  key={paperId} 
                  className="p-4 sm:px-6 hover:bg-slate-50/70 transition grid grid-cols-12 items-center gap-2"
                >
                  
                  {/* Year */}
                  <div className="col-span-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black font-mono">
                      {paper.year}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <div className="col-span-6">
                    <h4 className="text-sm font-bold text-slate-900">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {subName} • {levelName} • {paper.fileSize || '1.5 MB'}
                    </p>
                  </div>

                  {/* Medium & Type */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                      isScheme ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isScheme ? 'Marking Scheme' : 'Past Paper'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                      {paper.medium || 'Sinhala'} Medium
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleStartEditPaper(paper)}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                      title="Edit PDF document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePaper(paperId, paper.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {filteredPapers.length} of {papersList.length} documents</span>
        </div>

      </div>

      {/* ================= UPLOAD NEW PAPER FORM MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl w-full max-w-xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <span>Publish New Exam PDF</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          <form onSubmit={handleUploadPaper} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Subject *
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {dbSubjects.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.levelId?.name || 'Subject'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Examination Year *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                    <option key={y} value={y}>{y} Examination</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Document Type *
                </label>
                <select
                  value={formData.typeId}
                  onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {dbTypes.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Part / Section
                </label>
                <select
                  value={formData.part}
                  onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Paper 1">Paper 1 (MCQ / Structured)</option>
                  <option value="Paper 2">Paper 2 (Essay Questions)</option>
                  <option value="Full Paper">Full Paper (Complete)</option>
                  <option value="Full Scheme">Full Scheme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medium *
                </label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {dbMediums.length > 0 ? (
                    dbMediums.map(m => (
                      <option key={m._id} value={m.name}>{m.name} Medium</option>
                    ))
                  ) : (
                    <>
                      <option value="Sinhala">Sinhala Medium</option>
                      <option value="English">English Medium</option>
                      <option value="Tamil">Tamil Medium</option>
                    </>
                  )}
                </select>
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                PDF File URL or Cloud Link *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="https://pastpapers.lk/files/2024-maths-p1.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
              >
                Upload & Publish
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PAPER MODAL ================= */}
      {editingPaper && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl w-full max-w-xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                <span>Edit Document Record</span>
              </h2>
              <button
                onClick={() => setEditingPaper(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPaper} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={editFormData.subjectId}
                    onChange={(e) => setEditFormData({ ...editFormData, subjectId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {dbSubjects.map(sub => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name} ({sub.levelId?.name || 'Subject'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Examination Year *
                  </label>
                  <select
                    value={editFormData.year}
                    onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                      <option key={y} value={y}>{y} Examination</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Document Type *
                  </label>
                  <select
                    value={editFormData.typeId}
                    onChange={(e) => setEditFormData({ ...editFormData, typeId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {dbTypes.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Part / Section
                  </label>
                  <select
                    value={editFormData.part}
                    onChange={(e) => setEditFormData({ ...editFormData, part: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Paper 1">Paper 1 (MCQ / Structured)</option>
                    <option value="Paper 2">Paper 2 (Essay Questions)</option>
                    <option value="Full Paper">Full Paper (Complete)</option>
                    <option value="Full Scheme">Full Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Medium *
                  </label>
                  <select
                    value={editFormData.medium}
                    onChange={(e) => setEditFormData({ ...editFormData, medium: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {dbMediums.length > 0 ? (
                      dbMediums.map(m => (
                        <option key={m._id} value={m.name}>{m.name} Medium</option>
                      ))
                    ) : (
                      <>
                        <option value="Sinhala">Sinhala Medium</option>
                        <option value="English">English Medium</option>
                        <option value="Tamil">Tamil Medium</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PDF File URL *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={editFormData.fileUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, fileUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPaper(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
