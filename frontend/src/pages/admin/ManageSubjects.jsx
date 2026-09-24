import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  BookOpen, 
  CheckCircle2, 
  X, 
  Check,
  RefreshCw,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';

export default function ManageSubjects() {
  const [subjectsList, setSubjectsList] = useState([]);
  const [dbLevels, setDbLevels] = useState([]);
  const [dbStreams, setDbStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all'); // all, o-level, a-level
  const [selectedStreamIds, setSelectedStreamIds] = useState([]); // Array of stream IDs
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Add Form State
  const [formData, setFormData] = useState({
    name: '',
    levelId: '',
    streamId: '',
    description: ''
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    levelId: '',
    streamId: '',
    description: ''
  });

  const [successMsg, setSuccessMsg] = useState('');

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [subsRes, lvlsRes, strmsRes] = await Promise.all([
        api.getSubjects(),
        api.getLevels(),
        api.getStreams()
      ]);

      if (lvlsRes.success && lvlsRes.data) {
        setDbLevels(lvlsRes.data);
        if (lvlsRes.data.length > 0 && !formData.levelId) {
          setFormData(prev => ({ ...prev, levelId: lvlsRes.data[0]._id }));
        }
      }

      if (strmsRes.success && strmsRes.data) {
        setDbStreams(strmsRes.data);
      }

      if (subsRes.success && subsRes.data) {
        setSubjectsList(subsRes.data);
      }
    } catch (err) {
      console.error('Error fetching subjects metadata:', err);
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

  // Toggle Stream Checkbox Filter
  const toggleStreamFilter = (streamId) => {
    setSelectedStreamIds(prev =>
      prev.includes(streamId) ? prev.filter(id => id !== streamId) : [...prev, streamId]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setSelectedStreamIds([]);
  };

  // Filtered Subjects
  const filteredSubjects = useMemo(() => {
    return subjectsList.filter(sub => {
      const levelName = sub.levelId?.name || (typeof sub.levelId === 'string' ? sub.levelId : '');
      const isOL = levelName.toLowerCase().includes('o/l') || levelName.toLowerCase().includes('ordinary');
      const isAL = levelName.toLowerCase().includes('a/l') || levelName.toLowerCase().includes('advanced');

      // 1. Level Filter
      if (filterLevel === 'o-level' && !isOL) return false;
      if (filterLevel === 'a-level' && !isAL) return false;

      // 2. Stream Filter (Checkboxes)
      if (selectedStreamIds.length > 0) {
        const subStreamId = sub.streamIds && sub.streamIds[0]?._id ? sub.streamIds[0]._id : sub.streamIds?.[0];
        if (!selectedStreamIds.includes(subStreamId)) return false;
      }

      // 3. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = (sub.name || '').toLowerCase().includes(q);
        const matchesLevel = levelName.toLowerCase().includes(q);
        const streamName = (sub.streamIds && sub.streamIds[0]?.name) ? sub.streamIds[0].name.toLowerCase() : '';
        if (!matchesName && !matchesLevel && !streamName.includes(q)) return false;
      }

      return true;
    });
  }, [subjectsList, filterLevel, selectedStreamIds, searchTerm]);

  // Toggle Add Form
  const handleToggleAddForm = () => {
    if (!formData.levelId && dbLevels.length > 0) {
      setFormData(prev => ({ ...prev, levelId: dbLevels[0]._id }));
    }
    setShowAddForm(prev => !prev);
  };

  // Create Subject
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter subject name.");
      return;
    }

    try {
      const targetLevelId = formData.levelId || dbLevels[0]?._id;
      const payload = {
        name: formData.name.trim(),
        levelId: targetLevelId,
        streamIds: formData.streamId ? [formData.streamId] : []
      };

      const res = await api.createSubject(payload);
      if (res && res.success && res.data) {
        setSubjectsList([res.data, ...subjectsList]);
        showToast(`Subject "${formData.name}" created in database!`);
      } else {
        showToast(res?.message || 'Failed to create subject.');
      }
    } catch (err) {
      console.error('Error adding subject:', err);
      showToast('Error saving subject.');
    }

    setShowAddForm(false);
    setFormData({
      name: '',
      levelId: dbLevels[0]?._id || '',
      streamId: '',
      description: ''
    });
  };

  // Start Edit Subject
  const handleStartEditSubject = (sub) => {
    setEditingSubject(sub);
    setEditFormData({
      name: sub.name || '',
      levelId: sub.levelId?._id || sub.levelId || (dbLevels[0]?._id || ''),
      streamId: (sub.streamIds && sub.streamIds[0]?._id) || (sub.streamIds && sub.streamIds[0]) || '',
      description: sub.description || ''
    });
  };

  // Save Edit Subject
  const handleSaveEditSubject = async (e) => {
    e.preventDefault();
    if (!editingSubject || !editFormData.name.trim()) return;

    try {
      const subId = editingSubject._id || editingSubject.id;
      const payload = {
        name: editFormData.name.trim(),
        levelId: editFormData.levelId || dbLevels[0]?._id,
        streamIds: editFormData.streamId ? [editFormData.streamId] : []
      };

      const res = await api.updateSubject(subId, payload);
      if (res.success && res.data) {
        setSubjectsList(subjectsList.map(s => (s._id || s.id) === subId ? res.data : s));
        showToast(`Subject "${editFormData.name}" updated successfully!`);
      } else {
        const updatedLevel = dbLevels.find(l => l._id === payload.levelId) || editingSubject.levelId;
        const updatedStream = dbStreams.find(s => s._id === payload.streamIds[0]) ? [dbStreams.find(s => s._id === payload.streamIds[0])] : [];
        setSubjectsList(subjectsList.map(s => (s._id || s.id) === subId ? {
          ...s,
          name: payload.name,
          levelId: updatedLevel,
          streamIds: updatedStream
        } : s));
        showToast(`Subject "${editFormData.name}" updated!`);
      }
    } catch (err) {
      console.error('Error updating subject:', err);
      showToast('Error updating subject.');
    }

    setEditingSubject(null);
  };

  // Delete Subject
  const handleDeleteSubject = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete subject "${name}" from database?`)) {
      try {
        await api.deleteSubject(id);
      } catch (e) {
        /* ignore */
      }
      setSubjectsList(subjectsList.filter(s => (s._id || s.id) !== id));
      showToast(`Subject "${name}" deleted.`);
    }
  };

  const activeFiltersCount = (filterLevel !== 'all' ? 1 : 0) + selectedStreamIds.length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Manage Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter by stream, and edit G.C.E. O/L and A/L curriculum subjects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInitialData}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Refresh subjects"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleToggleAddForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Subject</span>
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
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search subjects by name or stream..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
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

          {/* Stream Filter Toggle */}
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer shrink-0 ${
              showFilterOptions || selectedStreamIds.length > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Stream Checkboxes</span>
            {selectedStreamIds.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">
                {selectedStreamIds.length}
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

        {/* Stream Checkboxes Bar */}
        {showFilterOptions && (
          <div className="pt-4 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
              Filter by A-Level Stream (Checkboxes)
            </span>
            <div className="flex flex-wrap gap-2">
              {dbStreams.map(stream => {
                const isChecked = selectedStreamIds.includes(stream._id);
                return (
                  <label 
                    key={stream._id} 
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition select-none ${
                      isChecked 
                        ? 'bg-purple-100 border-purple-300 text-purple-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStreamFilter(stream._id)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>{stream.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ================= SUBJECTS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 grid grid-cols-12 items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          <div className="col-span-6">Subject</div>
          <div className="col-span-4">Level & Stream</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredSubjects.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">No subjects found matching search & filter criteria</p>
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredSubjects.map((sub) => {
              const subId = sub._id || sub.id;
              const levelName = sub.levelId?.name || (typeof sub.levelId === 'string' ? sub.levelId : 'Ordinary Level');
              const streamName = sub.streamIds && sub.streamIds[0]?.name ? sub.streamIds[0].name : 'Core Curriculum';
              const isOL = levelName.toLowerCase().includes('o/l') || levelName.toLowerCase().includes('ordinary');

              return (
                <div 
                  key={subId} 
                  className="p-4 sm:px-6 hover:bg-slate-50/70 transition grid grid-cols-12 items-center gap-2"
                >
                  
                  {/* Subject & Icon */}
                  <div className="col-span-6 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${isOL ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'} flex items-center justify-center shrink-0`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-xs">
                        {levelName} • Past Papers & Schemes
                      </p>
                    </div>
                  </div>

                  {/* Level & Stream */}
                  <div className="col-span-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isOL ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {levelName}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5 font-medium truncate">
                      {streamName}
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleStartEditSubject(sub)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Edit subject"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subId, sub.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete subject"
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
          <span>Showing {filteredSubjects.length} of {subjectsList.length} subjects</span>
        </div>

      </div>

      {/* ================= ADD NEW SUBJECT MODAL ================= */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl w-full max-w-lg space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <span>Create New Subject</span>
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Combined Mathematics, Science..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Exam Level *
                  </label>
                  <select
                    value={formData.levelId}
                    onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dbLevels.map(lvl => (
                      <option key={lvl._id} value={lvl._id}>{lvl.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  A-Level Stream (Optional for O/L)
                </label>
                <select
                  value={formData.streamId}
                  onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- No Stream (General / Core Subject) --</option>
                  {dbStreams.map(st => (
                    <option key={st._id} value={st._id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
                >
                  Save & Publish Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT SUBJECT MODAL ================= */}
      {editingSubject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl w-full max-w-lg space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Edit Subject</span>
              </h2>
              <button
                onClick={() => setEditingSubject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Exam Level *
                </label>
                <select
                  value={editFormData.levelId}
                  onChange={(e) => setEditFormData({ ...editFormData, levelId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dbLevels.map(lvl => (
                    <option key={lvl._id} value={lvl._id}>{lvl.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  A-Level Stream
                </label>
                <select
                  value={editFormData.streamId}
                  onChange={(e) => setEditFormData({ ...editFormData, streamId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- No Stream (General / Core) --</option>
                  {dbStreams.map(st => (
                    <option key={st._id} value={st._id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
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
