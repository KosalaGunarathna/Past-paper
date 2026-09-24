import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Printer,
  Bookmark
} from 'lucide-react';
import { allPapers } from '../../data/papersData';

export default function DocumentViewer() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const paper = allPapers.find(p => p.id === paperId) || allPapers[0];
  const totalPages = paper.pageCount || 8;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 rounded-xl ${paper.type === 'marking-scheme' ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex items-center justify-center shrink-0`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-lg">
                {paper.title}
              </h1>
              <p className="text-xs text-slate-400">
                {paper.level === 'o-level' ? 'G.C.E. O/L' : 'G.C.E. A/L'} • {paper.year} • {paper.fileSize} • {totalPages} Pages
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                saved ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{shared ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={() => alert(`Downloading ${paper.title}...`)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

        </div>
      </header>

      {/* Viewer Floating Controls */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 py-2.5 px-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm text-slate-300">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setZoomLevel(z => Math.max(70, z - 10))}
                className="p-1 hover:bg-slate-700 rounded cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(z => Math.min(150, z + 10))}
                className="p-1 hover:bg-slate-700 rounded cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Document Simulation Sheet */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-900/95">
        
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-14 transition-transform duration-150 min-h-[950px] border border-slate-300 relative select-none"
        >
          
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
              DOEN
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Department of Examinations • Sri Lanka
            </p>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              General Certificate of Education ({paper.level === 'o-level' ? 'Ord. Level' : 'Adv. Level'}) Examination
            </h2>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-2">
              <span className="uppercase">{paper.subjectName}</span>
              <span className="px-3 py-1 bg-slate-100 rounded border border-slate-300 font-mono">
                {paper.year}
              </span>
              <span>{paper.type === 'marking-scheme' ? 'MARKING SCHEME' : 'PAPER I & II'}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1 mb-6">
            <div className="flex justify-between font-bold">
              <span>Time: 2 Hours</span>
              <span>Index Number: ..............................</span>
            </div>
            <p className="italic text-slate-500">
              * Answer all questions in Part A and any four questions from Part B.
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-800 leading-relaxed font-serif">
            {currentPage === 1 && (
              <>
                <div className="font-sans font-black text-sm uppercase tracking-wider pb-1 border-b border-slate-200">
                  Part A - Structured Questions
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="font-bold font-sans">01. </span>
                    <span>Simplify the following algebraic expression and find the value of x when y = 4:</span>
                    <div className="my-2 p-3 bg-slate-50 rounded border border-slate-200 font-mono text-center text-sm">
                      3x + 2(y - 5) = 14
                    </div>
                    <div className="h-10 border-b border-dotted border-slate-400"></div>
                  </div>

                  <div>
                    <span className="font-bold font-sans">02. </span>
                    <span>A cylindrical water tank has a radius of 7m and a height of 10m. Calculate the total surface area of the tank (Take π = 22/7).</span>
                    <div className="h-16 border-b border-dotted border-slate-400"></div>
                  </div>

                  <div>
                    <span className="font-bold font-sans">03. </span>
                    <span>The marked price of an item is Rs. 4,500. A discount of 12% is given for cash payments. What is the selling price of the item?</span>
                    <div className="h-14 border-b border-dotted border-slate-400"></div>
                  </div>
                </div>
              </>
            )}

            {currentPage > 1 && (
              <>
                <div className="font-sans font-black text-sm uppercase tracking-wider pb-1 border-b border-slate-200">
                  Part B - Extended Essay Questions (Page {currentPage})
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="font-bold font-sans">0{currentPage + 2}. </span>
                    <span>(a) Draw the graph of the quadratic function y = x² - 4x + 3 for the domain -1 ≤ x ≤ 5.</span>
                    <p className="text-xs text-slate-500 mt-1">(b) Using your graph, find the roots of the equation x² - 4x + 3 = 0.</p>
                    <div className="h-28 border-b border-dotted border-slate-400 mt-2"></div>
                  </div>

                  <div>
                    <span className="font-bold font-sans">0{currentPage + 3}. </span>
                    <span>State the key principles of thermodynamic equilibrium and explain their application in modern energy conservation systems.</span>
                    <div className="h-32 border-b border-dotted border-slate-400 mt-2"></div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center text-xs text-slate-400 font-sans border-t border-slate-200 pt-3">
            <span>PastPapers.lk Official Archive</span>
            <span>Page {currentPage} of {totalPages}</span>
            <span>Confidential Examination Material</span>
          </div>

        </div>

      </main>

    </div>
  );
}
