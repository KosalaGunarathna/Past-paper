import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Compass, 
  Heart, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import aboutStoryImg from '../../assets/image/about_story.jpg';

export default function About() {
  const stats = [
    { number: '1,000+', label: 'Past Papers & Schemes' },
    { number: '50,000+', label: 'Active Monthly Students' },
    { number: '100%', label: 'Free Forever' },
    { number: '3', label: 'Mediums (Sinhala/Tamil/Eng)' },
  ];

  const values = [
    {
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      title: 'Our Mission',
      description: 'To democratize access to high-quality educational materials and past examination papers for every Sri Lankan student regardless of geographic or financial barriers.'
    },
    {
      icon: Compass,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      title: 'Our Vision',
      description: 'To become the most reliable, comprehensive, and student-first digital academic repository across all provinces in Sri Lanka.'
    },
    {
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      title: 'Our Values',
      description: 'Committed to 100% free access, authenticity of official syllabus materials, simplicity in user experience, and continuous community support.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white py-12 sm:py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Empowering Sri Lankan Education</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              About PastPapers.lk
            </h1>
            <p className="text-base sm:text-lg text-blue-100 font-normal">
              Our mission is to support Sri Lankan Ordinary Level and Advanced Level students in achieving their academic dreams.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-12">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center">
              <span className="block text-2xl sm:text-4xl font-black text-blue-600">{stat.number}</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 block">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Our Story Split Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                Our Story & Origins
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                Built by Students, <br /> For Future Island Rankers
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                PastPapers.lk was created with a simple yet powerful goal — to solve the difficulty students face when searching for reliable past examination papers, accurate marking schemes, and syllabus guidelines.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Too often, papers are scattered across unorganized drives or buried behind paywalls. We believe every student in Colombo, Kandy, Jaffna, Galle, or remote rural areas deserves equal, fast, and 100% free access to official past exam materials.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Verified Official Question Papers</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Zero Ads or Subscription Fees</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100">
                <img 
                  src={aboutStoryImg} 
                  alt="Graduation cap and study books"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${v.color}`} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="rounded-3xl bg-blue-600 text-white p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black">
            Have Questions or Need Help?
          </h3>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Our team is always here to assist students, teachers, and schools. Reach out through our contact page.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-900 font-bold text-sm shadow-md hover:bg-blue-50 transition"
            >
              <span>Contact Us Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
