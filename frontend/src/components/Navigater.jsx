import React from 'react'
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Navigater() {
    const [menuOpen, setMenuOpen] = useState(false);
     const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };
    

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}>
              <div className="h-10 w-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-900">PastPaper</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-blue-900 font-medium transition">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-900 font-medium transition">Past Papers</a>
              <a href="#" className="text-gray-700 hover:text-blue-900 font-medium transition">Marking Schemes</a>
              <a href="/about" className="text-gray-700 hover:text-blue-900 font-medium transition">About</a>
              <button 
                onClick={navigateToLogin()}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 border-t">
              <div className="flex flex-col space-y-3 pt-4">
                <a href="#" className="text-gray-700 hover:text-blue-900 font-medium py-2">Home</a>
                <a href="#" className="text-gray-700 hover:text-blue-900 font-medium py-2">Past Papers</a>
                <a href="#" className="text-gray-700 hover:text-blue-900 font-medium py-2">Marking Schemes</a>
                <a href="#" className="text-gray-700 hover:text-blue-900 font-medium py-2">About</a>
                <button 
                  onClick={navigateToLogin}
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition text-left"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
  )
}

export default Navigater