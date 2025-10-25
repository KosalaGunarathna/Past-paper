import React from 'react'
import { BookOpen } from 'lucide-react';
import { useState } from 'react';

const Login = () => {

const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div>
      
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 md:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-white" size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-sm sm:text-base text-gray-600">Login to access your learning resources</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm sm:text-base"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">Forgot password?</a>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-900 text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-blue-800 transition text-sm sm:text-base"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Don't have an account? <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">Sign up</a>
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <button className="flex items-center justify-center px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-sm sm:text-base">
                  <span className="font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-sm sm:text-base">
                  <span className="font-medium text-gray-700">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      

    </div>
  )
}

export default Login