import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  DownloadCloud, 
  GraduationCap
} from 'lucide-react';
import { downloadProgressInsightsPDF } from '../utils/pdfGenerator';

interface ProgressInsightsViewProps {
  userGoal: string;
  userLevel: string;
  lang?: 'en' | 'hi' | 'ta';
}

export default function ProgressInsightsView({ userGoal, userLevel, lang = 'en' }: ProgressInsightsViewProps) {
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      downloadProgressInsightsPDF("Priya Verma", userGoal, userLevel);
      setDownloading(false);
    }, 850);
  };

  // Translations
  const tr = {
    en: {
      sihSol: "Solution for One-Stop Personalized Career & Education Advisor (SIH 2026) • Aligned with NEP 2020",
      roomTitle: "AI Diagnostic Room",
      title: "Progress & Predictive Insights",
      desc: "Continuous diagnostic maps assessing course competencies, potential skill gaps, and future career path calibrations aligned with the National Higher Education Qualification Framework.",
      exportReport: "Export Student PDF",
      generating: "Generating...",
      trackSub: "B.Tech 2nd Year (CSE) • MNNIT Allahabad",
      neoAccelerated: "NEP-2020 Accelerated Stream",
      streakTitle: "Active Cohort Streak",
      streakDays: "12 Days Active",
      learningWeight: "Acquired Learning Weight",
      goalTitle: "Registered Professional Goal",
      natQual: "National Qualification Link",
      masteryTitle: "1. Curricular Mastery Progress Ticker",
      mastered: "Mastered",
      experientialGrade: "Experiential Grade",
      bench: "Exemplary Benchmark",
      deficitTitle: "2. Target Curriculum Gap Resolution",
      recom: "Smart Recommendation",
      currentMastery: "Current Mastery",
      reqMastery: "Professional Target Standard",
      projectionsTitle: "3. Diagnostic Projections",
      projectedCgpa: "Projected CGPA Scale",
      derived: "Derived from registry snapshots",
      targetSynergy: "Target Role Synergy",
      match: "Match",
      estPath: "Estimated Goal Path",
      dailyCommit: "With 2-hour daily commitment",
      estimatedMonths: "4.5 Months",
      safetyTitle: "Academic Safety Ticker",
      lowRisk: "Low Risk",
      activeState: "Active review state established"
    },
    hi: {
      sihSol: "वन-स्टॉप व्यक्तिगत कैरियर और शिक्षा सलाहकार (SIH 2026) • एनईपी 2020 संरेखित",
      roomTitle: "एआई डायग्नोस्टिक कक्ष",
      title: "प्रगति और भविष्य कहनेवाला अंतर्दृष्टि",
      desc: "राष्ट्रीय उच्च शिक्षा योग्यता ढांचे के साथ संरेखित पाठ्यक्रम दक्षताओं, संभावित कौशल अंतरालों और भविष्य के करियर पथ अंशांकन का निरंतर नैदानिक मूल्यांकन।",
      exportReport: "लर्निंग रिपोर्ट निर्यात (PDF)",
      generating: "तैयार किया जा रहा है...",
      trackSub: "बी.टेक द्वितीय वर्ष (सीएसई) • एमएनएनआईटी इलाहाबाद",
      neoAccelerated: "एनईपी-2020 त्वरित धारा",
      streakTitle: "सक्रिय कोहोर्ट निरंतरता",
      streakDays: "१२ दिन सक्रिय",
      learningWeight: "अधिग्रहीत सीखने का भार (XP)",
      goalTitle: "पंजीकृत व्यावसायिक लक्ष्य",
      natQual: "राष्ट्रीय योग्यता लिंक",
      masteryTitle: "1. पाठ्यचर्या महारत प्रगति सूचक",
      mastered: "सफलतापूर्वक सीखा",
      experientialGrade: "अनुभवात्मक ग्रेड",
      bench: "अनुकरणीय बेंचमार्क",
      deficitTitle: "2. लक्षित पाठ्यक्रम कौशल अंतराल समाधान",
      recom: "स्मार्ट सलाह",
      currentMastery: "वर्तमान महारत",
      reqMastery: "व्यावसायिक लक्ष्य मानक",
      projectionsTitle: "3. नैदानिक अनुमान एवं परिणाम",
      projectedCgpa: "अनुमानित सीजीपीए पैमाना",
      derived: "पंजीकरण स्नैपशॉट से प्राप्त",
      targetSynergy: "लक्षित भूमिका तालमेल",
      match: "मैच",
      estPath: "अनुमानित लक्ष्य अवधि",
      dailyCommit: "२ घंटे दैनिक प्रतिबद्धता के साथ",
      estimatedMonths: "४.५ महीने",
      safetyTitle: "शैक्षणिक सुरक्षा सूचक",
      lowRisk: "कम जोखिम",
      activeState: "सक्रिय समीक्षा स्थिति स्थापित"
    },
    ta: {
      sihSol: "ஒருங்கிணைந்த தனிப்பயனாக்கப்பட்ட கல்வி வழிகாட்டி (SIH 2026) • NEP 2020",
      roomTitle: "நவீன கண்டறியும் அறை",
      title: "முன்னேற்றம் மற்றும் கணிப்புகள்",
      desc: "தேசிய உயர்கல்வி தகுதி கட்டமைப்போடு ஒத்திசைக்கப்பட்ட கற்கைப்பாதைகள், திறன்களின் இடைவெளிகள் மற்றும் தொழில் வழிகாட்டி கணிப்புகள்.",
      exportReport: "மதிப்பீட்டு சான்றிதழ் PDF",
      generating: "தயாரிக்கப்படுகிறது...",
      trackSub: "பி.டெக் இரண்டாம் ஆண்டு (சிஎஸ்இ) • எம்என்என்ஐடி அலகாபாத்",
      neoAccelerated: "NEP-2020 கற்றல் பிரிவு",
      streakTitle: "தினசரி கற்றல் தொடர்ச்சி",
      streakDays: "12 நாட்கள் தொடர்ந்து",
      learningWeight: "பெறப்பட்ட கற்றல் புள்ளிகள் (XP)",
      goalTitle: "பதிவுசெய்யப்பட்ட தொழில் இலக்கு",
      natQual: "தேசிய தகுதி இணைப்பு",
      masteryTitle: "1. பாடத்திட்ட தேர்ச்சி முன்னேற்ற கண்காணிப்பு",
      mastered: "தேர்ச்சி பெற்றது",
      experientialGrade: "அனுபவ கற்றல் தரம்",
      bench: "சிறந்த அளவுகோல்",
      deficitTitle: "2. திறன்களின் இடைவெளி மற்றும் தீர்வுகள்",
      recom: "ஸ்மார்ட் பரிந்துரை",
      currentMastery: "தற்போதைய தேர்ச்சி",
      reqMastery: "தொழில்முறை இலக்கு நிலை",
      projectionsTitle: "3. உத்தேச கணிப்புகள்",
      projectedCgpa: "உத்தேச CGPA அளவு",
      derived: "பதிவுத் தரவுகளிலிருந்து கணக்கிடப்பட்டது",
      targetSynergy: "இலக்கு பொருத்தம்",
      match: "பொருத்தம்",
      estPath: "இலக்கை அடைய உத்தேச காலம்",
      dailyCommit: "தினசரி 2 மணிநேர கற்றல் மூலம்",
      estimatedMonths: "4.5 மாதங்கள்",
      safetyTitle: "கல்வி பாதுகாப்பு அளவுகோல்",
      lowRisk: "குறைந்த ஆபத்து",
      activeState: "செயலில் உள்ள ஆய்வு நிலை"
    }
  };

  const curr = tr[lang] || tr.en;

  // Skill Gap metrics
  const skillGaps = [
    { 
      name: lang === 'hi' ? "डेटाबेस स्केलिंग और सामान्यीकरण" : lang === 'ta' ? "தரவுத்தள அளவிடுதல் & இயல்பாக்கம்" : "Database Scaling & Normalization", 
      level: 65, 
      required: 90, 
      gap: 25, 
      recommendation: lang === 'hi' ? "सैंडबॉक्स लैब में इंडेक्सिंग और पोस्टग्रेज प्रतिकृतियों को तैनात करें।" : lang === 'ta' ? "இண்டெக்சிங் மற்றும் தரவுத்தள பிரதிகளங்களை சैंडबॉक्स ஆய்பகத்தில் செயல்படுத்தவும்." : "Deploy indexing & MongoDB/Postgres replication replicas in Sandbox Lab" 
    },
    { 
      name: lang === 'hi' ? "बैकप्रोपेगेशन गणित और मैट्रिक्स व्युत्पन्न" : lang === 'ta' ? "நுண்கணித அடிப்படைகள் & மேட்ரிக்ஸ் வகைக்கெழு" : "Backpropagation Math & Matrix Derivatives", 
      level: 70, 
      required: 95, 
      gap: 25, 
      recommendation: lang === 'hi' ? "एआई मेंटोर के साथ उच्च-स्मरण मैट्रिक्स ग्रेडिएंट्स का अभ्यास करें।" : lang === 'ta' ? "ஸ்மார்ட் வழிகாட்டியுடன் மேட்ரிக்ஸ் சாய்வுகளைப் பயிற்சி செய்யவும்." : "Practice 5 High-Recall Matrix gradients with AI Mentor Assistant" 
    },
    { 
      name: lang === 'hi' ? "प्रणाली आर्किटेक्चर डिजाइन पैटर्न" : lang === 'ta' ? "கணினி வடிவமைப்பு வார்ப்புருக்கள்" : "System Architecture Design Patterns", 
      level: 55, 
      required: 80, 
      gap: 25, 
      recommendation: lang === 'hi' ? "स्वयं/एनईपी के साथ प्रणाली डिजाइन सूक्ष्म सत्र पूरे करें।" : lang === 'ta' ? "SWAYAM/NEP கணினி வடிவமைப்பு வகுப்புகளை நிறைவு செய்யவும்." : "Complete System Design micro-sessions aligned on SWAYAM/NEP" 
    },
    { 
      name: lang === 'hi' ? "उन्नत रिएक्ट स्टेट प्रबंधन" : lang === 'ta' ? "மேம்பட்ட ரியாக்ட் மேலாண்மை" : "Advanced React State Management", 
      level: 92, 
      required: 95, 
      gap: 3, 
      recommendation: lang === 'hi' ? "Next.js ऐप राउटर प्रदर्शन अनुकूलन की समीक्षा करें।" : lang === 'ta' ? "Next.js செயல்திறன் மேம்பாடுகளை ஆய்வு செய்யவும்." : "Review Next.js App Router performance optimizations" 
    },
    { 
      name: lang === 'hi' ? "व्यावसायिक कैनवास और उत्पाद रोडमैप" : lang === 'ta' ? "வணிக வடிவமைப்பு & திட்ட வழிகாட்டி" : "Business Canvas & Product Roadmaps", 
      level: 45, 
      required: 75, 
      gap: 30, 
      recommendation: lang === 'hi' ? "अगले मील के पत्थर में बीज स्टार्टअप सत्यापन टेम्पलेट्स की जांच करें।" : lang === 'ta' ? "தொடக்க நிலை ஸ்டார்ட்-அப் வடிவங்களை சரிபார்க்கவும்." : "Examine seed startup validation templates in Next Milestones" 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 text-white py-3 px-6 text-center text-sm font-bold tracking-wide shadow-sm rounded-xl">
        {curr.sihSol}
      </div>

      {/* Main Header with Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-xs gap-4">
        <div className="flex-1">
          <span className="text-[10px] font-black uppercase text-indigo-650 tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-505 animate-pulse" />
            {curr.roomTitle}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display mt-1">
            {curr.title}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed mt-0.5">
            {curr.desc}
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer justify-center shrink-0"
        >
          <DownloadCloud className={`w-4 h-4 text-indigo-200 ${downloading ? 'animate-bounce' : ''}`} />
          {downloading ? curr.generating : curr.exportReport}
        </button>
      </div>

      {/* STUDENT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-quick">
        {/* Left Column: Student Profile snapshot */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl opacity-50 -mr-6 -mt-6"></div>
            
            <div className="relative text-center">
              <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 mx-auto mb-3 shadow shadow-indigo-500/30">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-xl text-indigo-600">
                  PV
                </div>
                <div className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              <h3 className="text-lg font-black text-slate-900 font-display">Priya Verma</h3>
              <p className="text-xs font-semibold text-slate-500">{curr.trackSub}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-5 text-indigo-750 font-bold text-[10px] uppercase rounded-full mt-2.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-650 text-indigo-600" />
                {curr.neoAccelerated}
              </div>
            </div>

            <hr className="my-5 border-slate-100" />

            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                    🔥
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{curr.streakTitle}</p>
                    <h4 className="text-base font-black text-slate-900 font-display">{curr.streakDays}</h4>
                  </div>
                </div>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">NEP Target</span>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    ⚡
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{curr.learningWeight}</p>
                    <h4 className="text-base font-black text-slate-900 font-display">4,850 Total XP</h4>
                  </div>
                </div>
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">+500 XP Week</span>
              </div>
            </div>

            <div className="mt-5 p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">{curr.goalTitle}</span>
              <p className="text-xs font-bold font-sans leading-relaxed mt-1 text-slate-100">
                {userGoal}
              </p>
              <div className="mt-3 flex justify-between items-center bg-white/10 p-2 rounded-lg text-[10px] font-bold">
                <span className="text-indigo-200">{curr.natQual}</span>
                <span className="text-[#a5b4fc]">NHEQF Level 8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key metrics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 font-display border-b border-slate-100 pb-3 mb-5">
              {curr.masteryTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-4 flex flex-col items-center justify-center py-4 bg-slate-900/40 border border-slate-700/55 rounded-2xl shrink-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="rgba(200, 200, 200, 0.15)" strokeWidth="8" fill="transparent" />
                    <circle cx="56" cy="56" r="46" stroke="#6366f1" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * 78) / 100} strokeLinecap="round" fill="transparent" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-black font-sans text-indigo-400 block leading-none">78%</span>
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-405 text-slate-400">{curr.mastered}</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-350 mt-3 flex items-center gap-1 justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  {curr.experientialGrade}
                </span>
                <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wide bg-indigo-550/15 px-2 py-0.5 rounded mt-1">
                  {curr.bench}
                </span>
              </div>

              <div className="sm:col-span-8 space-y-4 text-left">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-slate-800 flex items-center gap-1.5 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      {lang === 'hi' ? "फ्रंटएंड सॉफ्टवेयर इंजीनियरिंग (रिएक्ट संरेखित)" : lang === 'ta' ? "முன்னணி பொறியியல் வடிவமைப்பு" : "Frontend Engineering (React, HTML5, Next.js)"}
                    </span>
                    <span className="text-cyan-500">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-slate-800 flex items-center gap-1.5 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-455 bg-indigo-400"></span>
                      {lang === 'hi' ? "बैकएंड आर्किटेक्चर (एक्सप्रेस, डेटाबेस डिजाइन)" : lang === 'ta' ? "பின்னணி சேவையகம் வடிவமைப்புகள்" : "Backend Architecture (Node, Express, Mongo)"}
                    </span>
                    <span className="text-indigo-600">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-slate-800 flex items-center gap-1.5 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      {lang === 'hi' ? "सिस्टम डिजाइन और लोड स्केलिंग सिद्धांत" : lang === 'ta' ? "கணினி வடிவமைப்பு தத்துவங்கள்" : "System Design & Load Scaling Principles"}
                    </span>
                    <span className="text-amber-500">55%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 font-display border-b border-slate-100 pb-3 mb-5">
              {curr.deficitTitle}
            </h3>
            
            <div className="space-y-4">
              {skillGaps.map((gp, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 text-left">
                    <h4 className="text-xs font-extrabold text-slate-900 font-display">{gp.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black uppercase tracking-wider">
                      {lang === 'hi' ? `घाटा: ${gp.gap}% मानक से कम` : lang === 'ta' ? `குறைபாடு: ${gp.gap}% இலக்குக்கு கீழ்` : `Deficit Gap: ${gp.gap}% Below Syllabus`}
                    </span>
                  </div>

                  <div className="relative pt-1">
                    <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: `${gp.level}%` }}></div>
                      <div className="absolute top-0 h-full border-r-2 border-cyan-400 transition-all" style={{ left: `${gp.required}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mt-1">
                      <span>{curr.currentMastery}: {gp.level}%</span>
                      <span className="text-indigo-600 font-extrabold">{curr.reqMastery}: {gp.required}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-indigo-805 font-bold bg-indigo-50/50 border border-indigo-100 p-2 rounded-lg leading-normal flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-650 shrink-0 mt-0.5 animate-pulse" />
                    <span>
                      <strong className="text-slate-900">{curr.recom}:</strong> {gp.recommendation}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 font-display border-b border-slate-100 pb-3 mb-5">
              {curr.projectionsTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/80 border border-indigo-500/30 rounded-xl space-y-1 text-left relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">A+</div>
                <div className="pt-2">
                  <p className="text-[9px] font-black text-indigo-300 uppercase tracking-wider">{curr.projectedCgpa}</p>
                  <h4 className="text-xl font-black text-white font-display">8.7 / 10.0</h4>
                  <p className="text-[9px] text-slate-400 leading-normal">{curr.derived}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950/80 border border-cyan-500/30 rounded-xl space-y-1 text-left relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">89%</div>
                <div className="pt-2">
                  <p className="text-[9px] font-black text-cyan-405 text-cyan-400 uppercase tracking-wider">{curr.targetSynergy}</p>
                  <h4 className="text-xl font-black text-white font-display">89% {curr.match}</h4>
                  <p className="text-[9px] text-slate-400 leading-normal">Full-Stack & Startup metrics</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/80 border border-amber-500/30 rounded-xl space-y-1 text-left relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs font-sans">4.5</div>
                <div className="pt-2">
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-wider">{curr.estPath}</p>
                  <h4 className="text-xl font-black text-white font-display">{curr.estimatedMonths}</h4>
                  <p className="text-[9px] text-slate-400 leading-normal">{curr.dailyCommit}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-850 to-purple-950/80 border border-purple-500/30 rounded-xl space-y-1 text-left relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">★</div>
                <div className="pt-2">
                  <p className="text-[9px] font-black text-purple-300 uppercase tracking-wider">{curr.safetyTitle}</p>
                  <div className="flex items-center gap-1">
                    <h4 className="text-xl font-black text-white font-display">{curr.lowRisk}</h4>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] animate-pulse mt-1"></span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal">{curr.activeState}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
