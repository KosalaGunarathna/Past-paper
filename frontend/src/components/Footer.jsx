import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Heart, Send, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1c38] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                PastPapers<span className="text-blue-400">.lk</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sri Lanka's dedicated platform providing free, high-speed access to official G.C.E. Ordinary Level and Advanced Level past papers, model questions, and marking schemes.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/o-level" className="hover:text-white transition">O-Level (Grade 11)</Link>
              </li>
              <li>
                <Link to="/a-level" className="hover:text-white transition">A-Level (Advanced)</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition">Study Resources</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Subjects */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Subjects
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/subject/o-level/ol-maths" className="hover:text-white transition">O/L Mathematics</Link>
              </li>
              <li>
                <Link to="/subject/o-level/ol-science" className="hover:text-white transition">O/L Science</Link>
              </li>
              <li>
                <Link to="/subject/a-level/al-comb-maths" className="hover:text-white transition">A/L Combined Maths</Link>
              </li>
              <li>
                <Link to="/subject/a-level/al-physics" className="hover:text-white transition">A/L Physics</Link>
              </li>
              <li>
                <Link to="/subject/a-level/al-chemistry" className="hover:text-white transition">A/L Chemistry</Link>
              </li>
              <li>
                <Link to="/subject/a-level/al-accounting" className="hover:text-white transition">A/L Accounting</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>No. 122, Main Street, Colombo 00100, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:support@pastpapers.lk" className="hover:text-white transition">
                  support@pastpapers.lk
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2025 PastPapers.lk. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Learn Today • Succeed Tomorrow</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Sri Lankan Students
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
