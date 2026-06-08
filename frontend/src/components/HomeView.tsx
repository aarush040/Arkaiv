import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  User, 
  Layers, 
  Wifi, 
  WifiOff, 
  Zap, 
  ArrowRight,
  TrendingUp,
  FileDown
} from 'lucide-react';

interface HomeViewProps {
  userGoal: string;
  userLevel: string;
  lang: 'en' | 'hi' | 'ta';
  lowDataMode: boolean;
  setLowDataMode: (v: boolean) => void;
  onNavigateToTab: (t: any) => void;
}

export default function HomeView({ 
  userGoal, 
  userLevel, 
  lang,
  lowDataMode,
  setLowDataMode,
  onNavigateToTab 
}: HomeViewProps) {

  // Local Multilingual dictionary for the welcome banner
  const t = {
    en: {
      sihSol: "Solution for One-Stop Personalized Career & Education Advisor (SIH 2026) • Aligned with NEP 2020",
      welcomeMsg: "Welcome back, Priya Verma",
      trackSub: "B.Tech CSE • MNNIT Allahabad",
      continuePath: "Continue Roadmap",
      continuePathDesc: "Pick up where you left off in your learning path",
      talkMentor: "Talk to AI Mentor",
      talkMentorDesc: "Clear doubts, translate concepts, or run a quick recap quiz",
      submitTask: "Submit Task",
      submitTaskDesc: "Submit your assignment code for sandboxed evaluation",
      lowDataTitle: "Offline / Low-Data Mode",
      lowDataActive: "Offline Caching Active",
      lowDataInactive: "Standard Sync Mode",
      lowDataDesc: "Ensures reliable, zero-lag loading of core curriculum elements even on patchy public networks.",
      streakTitle: "Syllabus Streak"
    },
    hi: {
      sihSol: "वन-स्टॉप व्यक्तिगत कैरियर और शिक्षा सलाहकार (SIH 2026) • एनईपी 2020 संरेखित",
      welcomeMsg: "स्वागत है, प्रिया वर्मा",
      trackSub: "बी.टेक सीएस • एमएनएनआईटी इलाहाबाद",
      continuePath: "रोडमैप जारी रखें",
      continuePathDesc: "अपने सीखने के मार्ग में वहीं से शुरू करें जहां आपने छोड़ा था",
      talkMentor: "एआई सलाहकार से बात करें",
      talkMentorDesc: "संदेह दूर करें, कॉन्सेप्ट स्पष्ट करें, या त्वरित क्विज लें",
      submitTask: "टास्क सबमिट करें",
      submitTaskDesc: "सुरक्षित सैंडबॉक्स मूल्यांकन के लिए अपना असाइनमेंट भेजें",
      lowDataTitle: "ऑफ़लाइन / कम-डेटा मोड",
      lowDataActive: "ऑफ़लाइन कैशिंग सक्रिय",
      lowDataInactive: "मानक ऑनलाइन सिंक",
      lowDataDesc: "कमजोर इंटरनेट में भी मुख्य पाठ्यक्रम सामग्री को सुचारू रूप से लोड और ब्राउज़ करने के लिए कैशिंग का उपयोग करता है।",
      streakTitle: "दैनिक निरंतरता"
    },
    ta: {
      sihSol: "ஒருங்கிணைந்த தனிப்பயனாக்கப்பட்ட கல்வி வழிகாட்டி (SIH 2026) • NEP 2020",
      welcomeMsg: "வருக, பிரியா வர்மா",
      trackSub: "பி.டெக் சி.எஸ் • எம்.என்.என்.ஐ.டி அலகாபாத்",
      continuePath: "பாடப்பாதையை தொடரவும்",
      continuePathDesc: "உங்களது கற்றல் பாதையில் விட்ட இடத்திலிருந்து தொடங்குங்கள்",
      talkMentor: "வழிகாட்டியுடன் உரையாடவும்",
      talkMentorDesc: "சந்தேகங்களை தீர்க்கவும் அல்லது விரைவான விவாதங்கள் நடத்தவும்",
      submitTask: "பாடப்பணியை சமர்ப்பிக்கவும்",
      submitTaskDesc: "மதிப்பீட்டு ஆய்வகத்திற்கு உங்களது பாடப்பணியை சமர்ப்பிக்கவும்",
      lowDataTitle: "ஆஃப்லைன் / குறைந்த தரவு",
      lowDataActive: "ஆஃப்லைன் கற்றல் இயக்கம்",
      lowDataInactive: "ஆன்லைன் கற்றல் ஒத்திசைவு",
      lowDataDesc: "இணைய வசதி குறைவாக இருந்தாலும் முக்கிய பாடங்களை முன்கூட்டியே சேமித்து தடையின்றி இயங்கும்.",
      streakTitle: "தினசரி கற்றல் தொடர்ச்சி"
    }
  };

  const curr = t[lang] || t.en;

  return (
    <div className="space-y-6 animate-fade-in pb-10 text-left">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#311042] to-[#1e1b4b] text-[#cbd5e1] py-3 px-6 text-center text-xs md:text-sm font-bold tracking-wide shadow-md rounded-xl border border-indigo-900/40">
        {curr.sihSol}
      </div>

      {/* 1. STUDENT WELCOME & ACTIVE PROFILE SUMMARY */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/20">
        
        {/* Dynamic Background Accents */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle cx="80" cy="70" r="30" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="80" cy="70" r="15" stroke="#818cf8" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0 flex items-center justify-center">
              <div id="dashboard-welcome-pv" className="w-full h-full rounded-1.5xl bg-slate-900 flex items-center justify-center font-black text-xl text-indigo-300">
                PV
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Active National Pathway
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white mt-0.5">
                {curr.welcomeMsg}
              </h2>
              <p className="text-xs text-slate-350 font-semibold mt-0.5">
                {curr.trackSub}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:max-w-xs text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#a5b4fc] block">Target Professional Aim</span>
            <p className="text-xs font-bold text-slate-100 leading-snug mt-1">
              {userGoal}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-md text-[9px] font-black uppercase tracking-widest">
              Program Tier: {userLevel}
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Section: 2 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: TODAY'S DIAL AND STREAK - 5 COLS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Circular Progress Overview */}
          <div className="glass-card hover:bg-slate-900/40 duration-300 transition-all rounded-3xl p-6 flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-900/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
            
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 self-start font-display">
              Today's Syllabus Progress
            </h3>

            {/* Circular progress SVG */}
            <div className="relative w-40 h-40 flex items-center justify-center my-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="66" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                <circle cx="80" cy="80" r="66" stroke="url(#indigoGrad)" strokeWidth="10" strokeDasharray="415" strokeDashoffset={415 - (415 * 60) / 100} strokeLinecap="round" fill="transparent" />
                
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Central typography */}
              <div className="absolute text-center border-transparent">
                <span className="text-4xl font-extrabold font-display text-indigo-400 tracking-tight leading-none">
                  60%
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 text-slate-300 block mt-1">
                  Mastered
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-205 text-white">
                3 of 5 Recommended daily units completed
              </h4>
              <p className="text-[11px] text-[#cbd5e1] max-w-xs">
                Complete "Weights optimization calculation" to reach today's syllabus objective.
              </p>
            </div>
          </div>

          {/* Daily Streak Counter */}
          <div className="glass-card hover:bg-slate-900/40 duration-300 transition-all rounded-3xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-950/30 border border-orange-900/20 text-orange-405 flex items-center justify-center text-xl shrink-0">
                🔥
              </div>
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{curr.streakTitle}</span>
                <h4 className="text-base font-black text-slate-100 font-display">
                  12 Days Ongoing Study Streak
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-950/35 text-emerald-400 border border-emerald-800/40 text-[9px] font-black uppercase rounded-lg">
              On Track
            </span>
          </div>

          {/* Caching Mode Offline Toggle */}
          <div className="glass-card hover:bg-slate-900/40 duration-300 transition-all rounded-3xl p-5 space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lowDataMode ? (
                  <WifiOff className="w-5 h-5 text-amber-500 animate-bounce" />
                ) : (
                  <Wifi className="w-5 h-5 text-emerald-500 animate-pulse" />
                )}
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {curr.lowDataTitle}
                </h4>
              </div>

              {/* IOS Styled Switch Button */}
              <button
                id="dashboard-offline-toggle"
                onClick={() => setLowDataMode(!lowDataMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  lowDataMode ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    lowDataMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <div className={`px-2.5 py-0.5 border rounded text-[9px] font-extrabold uppercase inline-block ${
                lowDataMode ? 'bg-amber-950/30 border-amber-800/40 text-amber-400' : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
              }`}>
                {lowDataMode ? curr.lowDataActive : curr.lowDataInactive}
              </div>
              <p className="text-[10px] text-slate-350 leading-normal">
                {curr.lowDataDesc}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK ACTION CARDS & RELEVANCE LINKS - 7 COLS */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a855f7] font-display text-left">
              Quick Action Core
            </h3>

            {/* Quick Action Matrix List */}
            <div className="grid grid-cols-1 gap-4 flex-1">
              
              {/* Action 1: Roadmap */}
              <div 
                id="quick-card-roadmap"
                onClick={() => onNavigateToTab('roadmap')}
                className="glass-card hover:bg-slate-900/40 duration-300 transition-all rounded-3xl p-5 flex items-start gap-4 cursor-pointer group text-left hover:-translate-y-0.5 border-l-4 border-l-indigo-500"
              >
                <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-900/60 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Map className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-400 transition-colors font-display">
                    {curr.continuePath}
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {curr.continuePathDesc}
                  </p>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5 pt-1.5 ">
                    <span>Next Milestone: Calculus Derivatives & Matrix Gradients</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>

              {/* Action 2: AI Mentor */}
              <div 
                id="quick-card-ai"
                onClick={() => onNavigateToTab('ai-mentor')}
                className="glass-card hover:bg-slate-900/40 duration-300 transition-all rounded-3xl p-5 flex items-start gap-4 cursor-pointer group text-left hover:-translate-y-0.5 border-l-4 border-l-purple-500"
              >
                <div className="w-12 h-12 bg-purple-950/60 border border-purple-900/60 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-white group-hover:text-[#c084fc] transition-colors font-display">
                    {curr.talkMentor}
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {curr.talkMentorDesc}
                  </p>
                  <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5 pt-1.5">
                    <span>Ask: Explain matrix transpose dimensions with live sandbox models</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>

              {/* Action 3: Tasks & Sandbox Evaluator */}
              <div 
                id="quick-card-eval"
                onClick={() => onNavigateToTab('evaluation')}
                className="glass-card hover:bg-slate-900/40 duration-300 transition-all rounded-3xl p-5 flex items-start gap-4 cursor-pointer group text-left hover:-translate-y-0.5 border-l-4 border-l-emerald-500"
              >
                <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-450 transition-colors font-display">
                    {curr.submitTask}
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {curr.submitTaskDesc}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pt-1.5">
                    <span>Available Sandbox lesson: Build E-commerce checkout components</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick PDF portfolio trigger (same as dashboard view portfolio SPEC) */}
          <div className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-0.5 max-w-md">
              <span className="text-[9px] font-black uppercase text-indigo-350 tracking-wider">Dynamic Syllabus Portfolio</span>
              <h4 className="text-xs font-bold text-white">Download Curriculum Specification</h4>
              <p className="text-[11px] text-slate-350 leading-relaxed mt-0.5">
                Generate a comprehensive PDF documentation portfolio outlining user profile details, selected timeline modules, and NEP competencies.
              </p>
            </div>
            
            <button 
              onClick={() => {
                import('../utils/pdfGenerator').then(m => {
                  m.downloadPrototypeSpecPDF(userGoal, userLevel);
                });
              }} 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-lg glow-btn-primary flex items-center gap-2 cursor-pointer self-stretch sm:self-auto justify-center"
            >
              <FileDown className="w-4 h-4 text-indigo-200 animate-bounce" />
              Download Spec Portfolio
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
