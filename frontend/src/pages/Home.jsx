import React from 'react';

import { useState } from 'react';
import { Search, BookOpen, FileText, Award, Menu, X } from 'lucide-react';

export default function PastPaperWebsite() {
  const [currentPage, setCurrentPage] = useState('home');




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Home Page */}
      {currentPage === 'home' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-4 sm:mb-6 leading-tight">
              Your Gateway to<br className="hidden sm:block" /> Academic Excellence
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Access thousands of past papers and marking schemes to prepare for your exams with confidence
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for subjects, papers, or topics..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="bg-blue-100 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-blue-900" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Past Papers</h3>
              <p className="text-sm sm:text-base text-gray-600">Browse and download past examination papers from various subjects and years</p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="bg-green-100 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4">
                <Award className="text-green-700" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Marking Schemes</h3>
              <p className="text-sm sm:text-base text-gray-600">Access detailed marking schemes to understand how answers are evaluated</p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="bg-purple-100 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-purple-700" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Organized Library</h3>
              <p className="text-sm sm:text-base text-gray-600">Everything categorized by subject, level, and year for easy navigation</p>
            </div>
          </div>

          {/* Popular Subjects */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Popular Subjects</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Computer Science'].map((subject) => (
                <button 
                  key={subject}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 p-3 sm:p-4 rounded-lg text-left transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">{subject}</span>
                    <span className="text-gray-400 group-hover:text-blue-900 transition">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-white border-t mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm sm:text-base text-gray-600">
            <p>© 2024 PastPaper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
