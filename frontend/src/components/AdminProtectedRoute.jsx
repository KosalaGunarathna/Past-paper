import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();

  // If user is not logged in at all, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but does not have the 'admin' role
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200">
              <Lock className="w-3.5 h-3.5" />
              Restricted Area
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Access Denied
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are signed in as a <strong>Standard Student Account</strong>. Only system administrators can view the admin dashboard and change user roles.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
            >
              Go to Student Dashboard
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has 'admin' role
  return children;
}
