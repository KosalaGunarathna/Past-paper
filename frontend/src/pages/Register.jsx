import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import Navbar from '../components/Navigater.jsx';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState(''); 
  const [username, setUsername] = useState('');


  const handleRegister = (e) => {
    e.preventDefault();
    
    //Validate passwords match
    if (password1 !== password2) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Registration attempted:', { username, email, password1, password2 });
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 bg-white">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Join PastPaper and start learning today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password"
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                required
                minLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password"
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-900 text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-blue-800 transition text-sm sm:text-base"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account? <a href="/login" className="text-blue-900 hover:text-blue-700 font-medium">Login</a>
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <button 
                type="button"
                className="flex items-center justify-center px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-sm sm:text-base"
              >
                <span className="font-medium text-gray-700">Google</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-sm sm:text-base"
              >
                <span className="font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm sm:text-base text-gray-600">
            <p>© 2024 PastPaper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}