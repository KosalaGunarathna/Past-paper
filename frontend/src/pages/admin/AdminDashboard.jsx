import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Layers, 
  PlusCircle, 
  Upload, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  Download,
  Eye,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalPDFs: 0,
    totalUsers: 0,
    totalLevels: 2,
    totalStreams: 6,
    recentPDFs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Admin Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your Sri Lankan past paper repository, subjects, streams, and PDF files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/subjects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Subject</span>
          </Link>
          <Link
            to="/admin/papers"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Subjects</span>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalSubjects} Subjects</h3>
            <span className="text-[11px] font-bold text-blue-600">Database Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Past Papers</span>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalPDFs} PDFs</h3>
            <span className="text-[11px] font-bold text-purple-600">MongoDB Archives</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Registered Accounts</span>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalUsers} Users</h3>
            <span className="text-[11px] font-bold text-emerald-600">Active In DB</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Streams & Levels</span>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalLevels} Levels • {stats.totalStreams} Streams</h3>
            <span className="text-[11px] font-bold text-amber-600">Configured</span>
          </div>
        </div>

      </div>

      {/* Quick Actions & Recent Uploads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Uploads Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Recently Published Past Papers
              </h2>
              <p className="text-xs text-slate-400">
                Live exam papers stored in MongoDB database.
              </p>
            </div>
            <Link
              to="/admin/papers"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-xs font-bold">Loading live database records...</span>
              </div>
            ) : stats.recentPDFs?.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No past papers uploaded yet. Click "Upload PDF" above to add one.
              </div>
            ) : (
              stats.recentPDFs?.map((paper) => (
                <div key={paper._id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${paper.typeId?.name === 'Marking Scheme' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} flex items-center justify-center shrink-0 text-xs font-bold`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {paper.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {paper.subjectId?.name || 'Subject'} • {paper.year} • {paper.medium} Medium • {paper.fileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/view/${paper._id}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Quick Admin Actions
            </h3>

            <div className="space-y-2.5">
              <Link
                to="/admin/subjects"
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 transition font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Add New Subject</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
              </Link>

              <Link
                to="/admin/papers"
                className="flex items-center justify-between p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 transition font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>Upload Past Paper PDF</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
              </Link>

              <Link
                to="/admin/metadata"
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Configure Streams & Levels</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-400">Database Status</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MongoDB Connected (past-paper DB)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
