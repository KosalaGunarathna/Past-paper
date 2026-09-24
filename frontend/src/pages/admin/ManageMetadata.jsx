import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  CheckCircle2, 
  Globe, 
  FileText, 
  Award, 
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../../services/api';

export default function ManageMetadata() {
  const [levels, setLevels] = useState([]);
  const [streams, setStreams] = useState([]);
  const [types, setTypes] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter per card
  const [levelSearch, setLevelSearch] = useState('');
  const [streamSearch, setStreamSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');
  const [mediumSearch, setMediumSearch] = useState('');

  // Form Inputs for Adding
  const [newLevelName, setNewLevelName] = useState('');
  const [newStreamName, setNewStreamName] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [newMediumName, setNewMediumName] = useState('');

  // Editing States (Store ID being edited and current text)
  const [editingLevelId, setEditingLevelId] = useState(null);
  const [editingLevelName, setEditingLevelName] = useState('');

  const [editingStreamId, setEditingStreamId] = useState(null);
  const [editingStreamName, setEditingStreamName] = useState('');

  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState('');

  const [editingMediumId, setEditingMediumId] = useState(null);
  const [editingMediumName, setEditingMediumName] = useState('');

  const [notification, setNotification] = useState('');

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const [lvlsRes, strmsRes, typesRes, medsRes] = await Promise.all([
        api.getLevels(),
        api.getStreams(),
        api.getTypes(),
        api.getMediums()
      ]);

      if (lvlsRes.success && lvlsRes.data) setLevels(lvlsRes.data);
      if (strmsRes.success && strmsRes.data) setStreams(strmsRes.data);
      if (typesRes.success && typesRes.data) setTypes(typesRes.data);
      if (medsRes.success && medsRes.data) {
        setMediums(medsRes.data);
      } else {
        setMediums([
          { _id: '1', name: 'Sinhala', code: 'SI' },
          { _id: '2', name: 'English', code: 'EN' },
          { _id: '3', name: 'Tamil', code: 'TA' }
        ]);
      }
    } catch (err) {
      console.error('Error loading metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Filtered lists per card
  const filteredLevels = useMemo(() => 
    levels.filter(l => l.name.toLowerCase().includes(levelSearch.toLowerCase())),
    [levels, levelSearch]
  );

  const filteredStreams = useMemo(() => 
    streams.filter(s => s.name.toLowerCase().includes(streamSearch.toLowerCase())),
    [streams, streamSearch]
  );

  const filteredTypes = useMemo(() => 
    types.filter(t => t.name.toLowerCase().includes(typeSearch.toLowerCase())),
    [types, typeSearch]
  );

  const filteredMediums = useMemo(() => 
    mediums.filter(m => m.name.toLowerCase().includes(mediumSearch.toLowerCase())),
    [mediums, mediumSearch]
  );

  // ==================== 1. EXAM LEVEL CRUD ====================

  const handleAddLevel = async (e) => {
    e.preventDefault();
    if (!newLevelName.trim()) return;

    try {
      const res = await api.createLevel({ name: newLevelName.trim() });
      if (res.success && res.data) {
        setLevels([...levels, res.data]);
        showToast(`Level "${newLevelName}" added to database!`);
      } else {
        showToast(res.message || 'Failed to add level.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server.');
    }
    setNewLevelName('');
  };

  const handleStartEditLevel = (lvl) => {
    setEditingLevelId(lvl._id || lvl.id);
    setEditingLevelName(lvl.name);
  };

  const handleSaveEditLevel = async (id) => {
    if (!editingLevelName.trim()) return;

    try {
      const res = await api.updateLevel(id, { name: editingLevelName.trim() });
      if (res.success && res.data) {
        setLevels(levels.map(l => (l._id || l.id) === id ? res.data : l));
        showToast(`Level updated to "${editingLevelName}"!`);
      } else {
        showToast(res.message || 'Failed to update level.');
      }
    } catch (err) {
      console.error(err);
      setLevels(levels.map(l => (l._id || l.id) === id ? { ...l, name: editingLevelName } : l));
      showToast('Level updated locally.');
    }
    setEditingLevelId(null);
    setEditingLevelName('');
  };

  const handleDeleteLevel = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Level "${name}" from database?`)) {
      try {
        await api.deleteLevel(id);
      } catch (e) {
        /* ignore */
      }
      setLevels(levels.filter(l => (l._id || l.id) !== id));
      showToast(`Level "${name}" deleted.`);
    }
  };

  // ==================== 2. A-LEVEL STREAM CRUD ====================

  const handleAddStream = async (e) => {
    e.preventDefault();
    if (!newStreamName.trim()) return;

    try {
      const res = await api.createStream({ name: newStreamName.trim() });
      if (res.success && res.data) {
        setStreams([...streams, res.data]);
        showToast(`Stream "${newStreamName}" added to database!`);
      } else {
        showToast(res.message || 'Failed to add stream.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server.');
    }
    setNewStreamName('');
  };

  const handleStartEditStream = (stream) => {
    setEditingStreamId(stream._id || stream.id);
    setEditingStreamName(stream.name);
  };

  const handleSaveEditStream = async (id) => {
    if (!editingStreamName.trim()) return;

    try {
      const res = await api.updateStream(id, { name: editingStreamName.trim() });
      if (res.success && res.data) {
        setStreams(streams.map(s => (s._id || s.id) === id ? res.data : s));
        showToast(`Stream updated to "${editingStreamName}"!`);
      } else {
        showToast(res.message || 'Failed to update stream.');
      }
    } catch (err) {
      console.error(err);
      setStreams(streams.map(s => (s._id || s.id) === id ? { ...s, name: editingStreamName } : s));
      showToast('Stream updated locally.');
    }
    setEditingStreamId(null);
    setEditingStreamName('');
  };

  const handleDeleteStream = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Stream "${name}" from database?`)) {
      try {
        await api.deleteStream(id);
      } catch (e) {
        /* ignore */
      }
      setStreams(streams.filter(s => (s._id || s.id) !== id));
      showToast(`Stream "${name}" deleted.`);
    }
  };

  // ==================== 3. DOCUMENT TYPE CRUD ====================

  const handleAddType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    try {
      const res = await api.createType({ name: newTypeName.trim() });
      if (res.success && res.data) {
        setTypes([...types, res.data]);
        showToast(`Type "${newTypeName}" added to database!`);
      } else {
        showToast(res.message || 'Failed to add document type.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server.');
    }
    setNewTypeName('');
  };

  const handleStartEditType = (type) => {
    setEditingTypeId(type._id || type.id);
    setEditingTypeName(type.name);
  };

  const handleSaveEditType = async (id) => {
    if (!editingTypeName.trim()) return;

    try {
      const res = await api.updateType(id, { name: editingTypeName.trim() });
      if (res.success && res.data) {
        setTypes(types.map(t => (t._id || t.id) === id ? res.data : t));
        showToast(`Type updated to "${editingTypeName}"!`);
      } else {
        showToast(res.message || 'Failed to update type.');
      }
    } catch (err) {
      console.error(err);
      setTypes(types.map(t => (t._id || t.id) === id ? { ...t, name: editingTypeName } : t));
      showToast('Type updated locally.');
    }
    setEditingTypeId(null);
    setEditingTypeName('');
  };

  const handleDeleteType = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Document Type "${name}" from database?`)) {
      try {
        await api.deleteType(id);
      } catch (e) {
        /* ignore */
      }
      setTypes(types.filter(t => (t._id || t.id) !== id));
      showToast(`Document Type "${name}" deleted.`);
    }
  };

  // ==================== 4. MEDIUMS / LANGUAGES CRUD ====================

  const handleAddMedium = async (e) => {
    e.preventDefault();
    if (!newMediumName.trim()) return;

    try {
      const res = await api.createMedium({ name: newMediumName.trim() });
      if (res.success && res.data) {
        setMediums([...mediums, res.data]);
        showToast(`Medium "${newMediumName}" added to database!`);
      } else {
        showToast(res.message || 'Failed to add medium.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server.');
    }
    setNewMediumName('');
  };

  const handleStartEditMedium = (med) => {
    setEditingMediumId(med._id || med.id);
    setEditingMediumName(med.name);
  };

  const handleSaveEditMedium = async (id) => {
    if (!editingMediumName.trim()) return;

    try {
      const res = await api.updateMedium(id, { name: editingMediumName.trim() });
      if (res.success && res.data) {
        setMediums(mediums.map(m => (m._id || m.id) === id ? res.data : m));
        showToast(`Medium updated to "${editingMediumName}"!`);
      } else {
        showToast(res.message || 'Failed to update medium.');
      }
    } catch (err) {
      console.error(err);
      setMediums(mediums.map(m => (m._id || m.id) === id ? { ...m, name: editingMediumName } : m));
      showToast('Medium updated locally.');
    }
    setEditingMediumId(null);
    setEditingMediumName('');
  };

  const handleDeleteMedium = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Medium "${name}" from database?`)) {
      try {
        await api.deleteMedium(id);
      } catch (e) {
        /* ignore */
      }
      setMediums(mediums.filter(m => (m._id || m.id) !== id));
      showToast(`Medium "${name}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Metadata Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage Exam Levels, A-Level Streams, Document Types, and Mediums with instant search.
          </p>
        </div>

        <button
          onClick={fetchMetadata}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer self-start sm:self-center"
          title="Refresh Metadata"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Main Management Cards Grid: 2 Top, 2 Bottom (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ================= 1. EXAM LEVELS ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-black text-slate-900">1. Exam Levels ({levels.length})</h2>
            </div>
          </div>

          {/* Quick Search in Levels */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search levels..."
              value={levelSearch}
              onChange={(e) => setLevelSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Add Level Form */}
          <form onSubmit={handleAddLevel} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Add level (e.g. O/L, A/L)..."
              value={newLevelName}
              onChange={(e) => setNewLevelName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Levels List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredLevels.map((lvl) => {
              const levelId = lvl._id || lvl.id;
              const isEditing = editingLevelId === levelId;

              return (
                <div key={levelId} className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2 transition">
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingLevelName}
                        onChange={(e) => setEditingLevelName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditLevel(levelId)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingLevelId(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{lvl.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditLevel(lvl)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Edit Level"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLevel(levelId, lvl.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Delete Level"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 2. A-LEVEL STREAMS ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-black text-slate-900">2. A-Level Streams ({streams.length})</h2>
            </div>
          </div>

          {/* Quick Search in Streams */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search streams..."
              value={streamSearch}
              onChange={(e) => setStreamSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Add Stream Form */}
          <form onSubmit={handleAddStream} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Add stream (e.g. Maths, Bio)..."
              value={newStreamName}
              onChange={(e) => setNewStreamName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Streams List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredStreams.map((st) => {
              const streamId = st._id || st.id;
              const isEditing = editingStreamId === streamId;

              return (
                <div key={streamId} className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2 transition">
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingStreamName}
                        onChange={(e) => setEditingStreamName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-purple-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 font-bold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditStream(streamId)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingStreamId(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{st.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditStream(st)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Edit Stream"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStream(streamId, st.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Delete Stream"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 3. DOCUMENT TYPES ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-slate-900">3. Document Types ({types.length})</h2>
            </div>
          </div>

          {/* Quick Search in Types */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search types..."
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Add Type Form */}
          <form onSubmit={handleAddType} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Add type (e.g. Past Paper)..."
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Types List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredTypes.map((tp) => {
              const typeId = tp._id || tp.id;
              const isEditing = editingTypeId === typeId;

              return (
                <div key={typeId} className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2 transition">
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingTypeName}
                        onChange={(e) => setEditingTypeName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditType(typeId)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTypeId(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{tp.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditType(tp)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Edit Type"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteType(typeId, tp.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Delete Type"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 4. MEDIUMS / LANGUAGES ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-black text-slate-900">4. Mediums ({mediums.length})</h2>
            </div>
          </div>

          {/* Quick Search in Mediums */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search mediums..."
              value={mediumSearch}
              onChange={(e) => setMediumSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Add Medium Form */}
          <form onSubmit={handleAddMedium} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Add medium (e.g. Tamil)..."
              value={newMediumName}
              onChange={(e) => setNewMediumName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Mediums List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredMediums.map((med) => {
              const medId = med._id || med.id;
              const isEditing = editingMediumId === medId;

              return (
                <div key={medId} className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2 transition">
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingMediumName}
                        onChange={(e) => setEditingMediumName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-amber-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditMedium(medId)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingMediumId(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{med.name}</span>
                        {med.code && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 text-[10px] font-bold">
                            {med.code}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditMedium(med)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Edit Medium"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedium(medId, med.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                          title="Delete Medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
