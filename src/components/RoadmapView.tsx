import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Check, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  DownloadCloud,
  Award
} from 'lucide-react';
import { Milestone, DailyMission } from '../types';
import { downloadPrototypeSpecPDF } from '../utils/pdfGenerator';

interface RoadmapProps {
  userGoal: string;
  userLevel: string;
  milestones: Milestone[];
  missions: DailyMission[];
  onToggleMission: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
  lang?: 'en' | 'hi' | 'ta';
}

export default function RoadmapView({ 
  userGoal, 
  userLevel, 
  milestones, 
  missions, 
  onToggleMission,
  onNavigateToTab,
  lang = 'en'
}: RoadmapProps) {
  
  const [govSyncStatus, setGovSyncStatus] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [remedialUnlocked, setRemedialUnlocked] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Local Multilingual Translation Dictionary
  const tr = {
    en: {
      sihSol: "Solution for One-Stop Personalized Career & Education Advisor (SIH 2026) • Aligned with NEP 2020",
      currNav: "Curriculum Navigator",
      title: "Personalized Learning Roadmap",
      desc: "Your customized month-by-month study track optimized precisely for your career destination. High affinity milestones are continuously refreshed based on your sandboxed grades.",
      exportPdf: "Export Roadmap as PDF",
      exportingPdf: "Exporting PDF...",
      remedialActive: "Adaptive Remedial Path Activated",
      remedialGap: "Matrix Transformation Gaps",
      remedialDesc: "Diagnostic metrics identified scope for improvement in Linear transformation dimensions. ARKAIV has seamlessly interleaved special 10-minute visual simulator resources into your current timeline below to help reinforce concepts.",
      natInt: "National Platform Integrations",
      natIntDesc: "Sync syllabus structures directly with authenticated DIKSHA, SWAYAM, and NCERT pathways.",
      stageTimeline: "Personalized Stage Timeline",
      weightCompletion: "Milestone Weight Completion:",
      coreMastery: "100% Core Mastery Certified",
      complete: "Complete",
      unlockNext: "Finish previous stage to unlock",
      todayRec: "Today's Recommended Syllabus Nodes",
      todayRecDesc: "Target study topics curated to help resolve current matrix dimension gaps.",
      askMentor: "Ask AI Mentor",
      completed: "Completed",
      inProgress: "In-Progress",
      locked: "Locked",
      dismiss: "Dismiss",
      syncBtn: "Sync",
      importBtn: "Import",
      syncingMsg: "Connecting to secure API gateway...",
      sysAugMsg: "Successfully imported latest curated syllabus guidelines and learning objects!"
    },
    hi: {
      sihSol: "वन-स्टॉप व्यक्तिगत कैरियर और शिक्षा सलाहकार (SIH 2026) • एनईपी 2020 संरेखित",
      currNav: "पाठ्यक्रम नेविगेटर",
      title: "व्यक्तिगत शिक्षण रोडमैप",
      desc: "आपके करियर गंतव्य के लिए सटीक रूप से अनुकूलित आपका महीने-दर-महीने का अध्ययन ट्रैक। सैंडबॉक्स किए गए ग्रेड के आधार पर उच्च समानता मील के पत्थर लगातार रीफ्रेश किए जाते हैं।",
      exportPdf: "रोडमैप को पीडीएफ के रूप में डाउनलोड करें",
      exportingPdf: "निर्यात किया जा रहा है...",
      remedialActive: "अनुकूलन उपचारात्मक पथ सक्रिय",
      remedialGap: "मैट्रिक्स रूपांतरण अंतराल",
      remedialDesc: "कैलकुलस डायग्नोस्टिक्स ने मैट्रिक्स आयामों में सुधार की गुंजाइश की पहचान की है। ARKAIV ने अवधारणाओं को मजबूत करने के लिए नीचे आपकी वर्तमान समयरेखा में 10 मिनट के विशेष विज़ुअल सिम्युलेटर संसाधनों को जोड़ दिया है।",
      natInt: "राष्ट्रीय मंच एकीकरण",
      natIntDesc: "DIKSHA, SWAYAM, और NCERT पाठ्यक्रमों के साथ सीधे अध्ययन संरेखित करें।",
      stageTimeline: "व्यक्तिगत चरण समयरेखा",
      weightCompletion: "मील का पत्थर भार पूर्णता:",
      coreMastery: "100% कोर अध्ययन प्रमाणित",
      complete: "पूर्ण",
      unlockNext: "अनलॉक करने के लिए पिछला चरण समाप्त करें",
      todayRec: "आज के अनुशंसित पाठ्यक्रम नोड्स",
      todayRecDesc: "वर्तमान मैट्रिक्स अंतराल को हल करने में मदद करने के लिए चुनिंदा विषय अध्ययन नोड्स।",
      askMentor: "एआई सलाहकार से पूछें",
      completed: "पूर्ण",
      inProgress: "सक्रिय-प्रगति",
      locked: "लॉक्ड",
      dismiss: "खारिज करें",
      syncBtn: "सिंक",
      importBtn: "आयात करें",
      syncingMsg: "सुरक्षित एपीआई गेटवे से कनेक्ट किया जा रहा है...",
      sysAugMsg: "नवीनतम पाठ्यक्रम दिशानिर्देशों और शिक्षण वस्तुओं को सफलतापूर्वक आयात किया गया!"
    },
    ta: {
      sihSol: "ஒருங்கிணைந்த தனிப்பயனாக்கப்பட்ட கல்வி வழிகாட்டி (SIH 2026) • NEP 2020",
      currNav: "பாடநெறி வழிகாட்டி",
      title: "தனிப்பயனாக்கப்பட்ட கற்றல் பாதை",
      desc: "உங்களது தொழில் இலக்குக்கு ஏற்ப மாதவாரியாக வடிவமைக்கப்பட்ட கற்றல் பாதை. ஆன்லைன் மதிப்பீட்டின் அடிப்படையில் பாடங்கள் எப்போது புதுப்பிக்கப்படும்.",
      exportPdf: "பாடப்பாதையை PDF ஆகப் பதிவிறக்கு",
      exportingPdf: "தயாரிக்கப்படுகிறது...",
      remedialActive: "மாற்று கற்றல் வழிமுறைகள்",
      remedialGap: "மேட்ரிக்ஸ் கணக்கீட்டு குறைபாடுகள்",
      remedialDesc: "மேட்ரிக்ஸ் கணக்கீட்டில் உங்களது முன்னேற்றத்தை மேம்படுத்த மாற்று கருத்து கற்றல் முறை செயல்பாட்டில் உள்ளது. ARKAIV உங்களது பாட நேரத்தில் சிமுலேட்டர் கருவிகளை இணைத்துள்ளது.",
      natInt: "தேசிய கல்வி தளங்கள்",
      natIntDesc: "DIKSHA, SWAYAM, மற்றும் NCERT ஆகியவற்றுடன் உங்களது கற்றல் ஒத்திசைவை மேம்படுத்தலாம்.",
      stageTimeline: "முன்னேற்ற நிலைகள் காலவரிசை",
      weightCompletion: "பாடப்பகுதியின் ஒட்டுமொத்த நிறைவு:",
      coreMastery: "100% பாடத்தேர்ச்சி சான்றளிக்கப்பட்டது",
      complete: "நிறைவுற்றது",
      unlockNext: "அடுத்த பகுதியை திறக்க முந்தைய பகுதியை முடிக்கவும்",
      todayRec: "இன்றைய கற்றல் பரிந்துரைகள்",
      todayRecDesc: "மேட்ரிக்ஸ் குறைபாடுகளை நிவர்த்தி செய்ய உதவக்கூடிய தேர்ந்தெடுக்கப்பட்ட பாடங்கள்.",
      askMentor: "வழிகாட்டியிடம் கேளுங்கள்",
      completed: "நிறைவுற்றது",
      inProgress: "செயலாக்கத்தில்",
      locked: "பூட்டப்பட்டது",
      dismiss: "நீக்கவும்",
      syncBtn: "ஒத்திசை",
      importBtn: "இறக்குமதி",
      syncingMsg: "பாதுகாப்பான ஏபிஐ நுழைவாயிலுடன் இணைக்கப்படுகிறது...",
      sysAugMsg: "சமீபத்திய பாடத்திட்ட வழிகாட்டுதல்கள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன!"
    }
  };

  const curr = tr[lang] || tr.en;

  const handleSyncGov = (platform: string) => {
    setIsSyncing(true);
    setGovSyncStatus(curr.syncingMsg + " (" + platform + ")");
    setTimeout(() => {
      setIsSyncing(false);
      setGovSyncStatus(`[${platform}] ` + curr.sysAugMsg);
    }, 1200);
  };

  const handleExportPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      downloadPrototypeSpecPDF(userGoal, userLevel);
      setDownloading(false);
    }, 850);
  };

  // Month-wise breakdown milestones
  const monthMilestones = [
    {
      month: lang === 'hi' ? "महीना 1" : lang === 'ta' ? "மாதம் 1" : "Month 1",
      title: lang === 'hi' ? "रैखिक बीजगणित और संगणकीय आधार" : lang === 'ta' ? "நேரியல் இயற்கணிதம் & கணக்கீட்டு அடிப்படைகள்" : "Linear Algebra & Computational Foundations",
      desc: lang === 'hi' ? "मैट्रिक्स डॉट-उत्पाद, आयामी मानचित्रण और वेक्टर अनुवाद गहरे समन्वय आयामों में मानचित्रण करते हैं।" : lang === 'ta' ? "மேட்ரிக்ஸ் புள்ளி-பெருக்கல்கள், பரிமாண வரைபடங்கள் மற்றும் திசையன் மாற்றங்கள்." : "Matrix dot-products, dimensional mappings, and vector translations mapping into deep coordinate dimensions.",
      status: "completed",
      progress: 100,
      skills: lang === 'hi' ? ["मैट्रिक्स संक्रियाएं", "वेक्टर गणित"] : lang === 'ta' ? ["மேட்ரிக்ஸ் செயல்பாடுகள்", "திசையன் கணிதம்"] : ["Matrix Ops", "Vector Math"],
      careerMark: lang === 'hi' ? "एंट्री लेवल डेटा इंजीनियर ट्रैक को अनलॉक करता है" : lang === 'ta' ? "டேட்டா இன்ஜினியர் பிரிவை திறக்கிறது" : "Unlocks Entry Level Data Engineer Track"
    },
    {
      month: lang === 'hi' ? "महीना 2" : lang === 'ta' ? "மாதம் 2" : "Month 2",
      title: lang === 'hi' ? "कैलकुलस फाउंडेशन और बैकप्रोपेगेशन" : lang === 'ta' ? "நுண்கணித அடிப்படைகள் & बैकप्रोपेगेशन" : "Calculus Foundations & Backpropagation",
      desc: lang === 'hi' ? "चेन नियम व्युत्पत्ति, आंशिक व्युत्पन्न गणित, और वजन ढाल सुधार।" : lang === 'ta' ? "சங்கிலி விதி பெறல், பகுதி வகைக்கெழு கணிதம் மற்றும் சாய்வு திருத்தங்கள்." : "Chain rule derivation, partial derivatives math, and weight gradient corrections mapped under modern CBSE guidelines.",
      status: "in-progress",
      progress: 55,
      skills: lang === 'hi' ? ["अवकल गणित", "ग्रेडिएंट डिसेंट"] : lang === 'ta' ? ["வகைக்கெழு கணிதம்", "சாய்வு இறக்கம்"] : ["Differential Calculus", "Gradient Descent"],
      careerMark: lang === 'hi' ? "मशीन लर्निंग इंजीनियर टियर के लिए आवश्यक" : lang === 'ta' ? "மெஷின் லேர்னிங் பொறியாளர் பிரிவுக்கு தேவை" : "Required for Machine Learning Engineer tier"
    },
    {
      month: lang === 'hi' ? "महीना 3" : lang === 'ta' ? "மாதம் 3" : "Month 3",
      title: lang === 'hi' ? "मुख्य फीडफॉरवर्ड एमएलपी मॉडल" : lang === 'ta' ? "முக்கிய ஃபீட்ஃபார்வர்ட் MLP மாதிரிகள்" : "Core Feedforward MLP Models",
      desc: lang === 'hi' ? "सक्रियण थ्रेसहोल्ड स्केलिंग, तंत्रिका परत गणना मैपिंग।" : lang === 'ta' ? "செயலாக்க எல்லைகள் அளவிடுதல், நரம்பியல் அடுக்கு வரைபடம்." : "Activation thresholds scaling, neural layer counts mapping, and forward computation passes optimization.",
      status: "locked",
      progress: 0,
      skills: lang === 'hi' ? ["एमएलपी नेट", "सक्रियण सुधारे"] : lang === 'ta' ? ["எம்எல்பி நெட்வொர்க்", "செயலாக்க வடிவமைப்பாளர்கள்"] : ["MLP Nets", "Activation Shapers"],
      careerMark: lang === 'hi' ? "मध्यवर्ती एआई वैज्ञानिक भूमिकाओं के लिए आवश्यक" : lang === 'ta' ? "இடைநிலை AI விஞ்ஞானி பணிகளுக்கு தேவை" : "Required for Intermediate AI Scientist roles"
    },
    {
      month: lang === 'hi' ? "महीना 4" : lang === 'ta' ? "மாதம் 4" : "Month 4",
      title: lang === 'hi' ? "पैमाना और डेटाबेस कार्यान्वयन" : lang === 'ta' ? "தரவுத்தள அளவிடுதல் & செயலாக்கம்" : "Scaling & Database Implementations",
      desc: lang === 'hi' ? "MongoDB/PostgreSQL प्रतिकृति डिजाइन, लोड स्केलिंग पैटर्न, और सुरक्षित क्लाउड सिंक।" : lang === 'ta' ? "தரவுத்தள வடிவமைப்பு, அளவிடுதல் மற்றும் மேகக்கணி ஒத்திசைவு." : "MongoDB/PostgreSQL replica design, load scaling patterns, indexing metrics, and secure cloud sync.",
      status: "locked",
      progress: 0,
      skills: lang === 'hi' ? ["डेटाबेस स्केलिंग", "तैनातीकरण"] : lang === 'ta' ? ["தரவுத்தள அளவிடுதல்", "செயலிழக்கம்"] : ["Database Scaling", "Deployments"],
      careerMark: lang === 'hi' ? "लीड फुल स्टैक इंजीनियर प्रोफाइल के लिए आवश्यक" : lang === 'ta' ? "தலைமை முழு அடுக்கு பொறியாளர் பணிகளுக்கு தேவை" : "Required for Lead Full Stack Engineer profiles"
    }
  ];

  return (
    <div id="arkaiv-roadmap-root" className="space-y-6 animate-fade-in text-left pb-10">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 text-white py-3 px-6 text-center text-xs md:text-sm font-bold tracking-wide shadow-sm rounded-xl">
        {curr.sihSol}
      </div>

      {/* Main header row with Actions: Export Roadmap PDF */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border border-slate-200 rounded-3xl shadow-xs gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-650 tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            {curr.currNav}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 font-display mt-0.5">
            {curr.title}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed mt-0.5">
            {curr.desc}
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <DownloadCloud className={`w-4 h-4 text-indigo-200 ${downloading ? 'animate-bounce' : ''}`} />
          {downloading ? curr.exportingPdf : curr.exportPdf}
        </button>
      </div>

      {/* Weak area remedial warning alert */}
      {remedialUnlocked && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3.5 items-start">
          <div className="bg-amber-100 p-2 text-amber-800 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-900">{curr.remedialActive}</span>
              <span className="bg-amber-200 text-amber-950 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                {curr.remedialGap}
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              {curr.remedialDesc}
            </p>
          </div>
        </section>
      )}

      {/* SWAYAM & DIKSHA & NCERT National Integration Controls */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h4 className="text-xs font-black uppercase text-indigo-700 tracking-wider">{curr.natInt}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{curr.natIntDesc}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => handleSyncGov("SWAYAM")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase rounded-lg transition-all border border-slate-200 cursor-pointer"
            >
              {curr.syncBtn} SWAYAM
            </button>
            <button 
              onClick={() => handleSyncGov("DIKSHA")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase rounded-lg transition-all border border-slate-200 cursor-pointer"
            >
              {curr.syncBtn} DIKSHA
            </button>
            <button 
              onClick={() => handleSyncGov("NCERT")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-805 text-slate-800 text-[10px] font-extrabold uppercase rounded-lg transition-all border border-slate-200 cursor-pointer"
            >
              {curr.importBtn} NCERT
            </button>
          </div>
        </div>

        {govSyncStatus && (
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-850 flex items-center justify-between">
            <span>{govSyncStatus}</span>
            <button onClick={() => setGovSyncStatus('')} className="text-[10px] font-extrabold underline uppercase ml-2 cursor-pointer">{curr.dismiss}</button>
          </div>
        )}
      </section>

      {/* Month-wise Roadmap Tree Timeline */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
          {curr.stageTimeline}
        </h3>

        <div className="relative border-l border-slate-200 pl-6 ml-4 space-y-8 text-left">
          {monthMilestones.map((mi, idx) => (
            <div key={idx} className="relative">
              
              {/* Timeline dot custom indicators matching completion status */}
              <span className={`absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white ${
                mi.status === 'completed'
                  ? 'border-emerald-500 text-emerald-600 shadow shadow-emerald-500/10'
                  : mi.status === 'in-progress'
                  ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 shadow shadow-indigo-600/15'
                  : 'border-slate-200 text-slate-400'
              }`}>
                {mi.status === 'completed' ? (
                  <CheckCircle className="w-4.5 h-4.5" />
                ) : mi.status === 'in-progress' ? (
                  <Sparkles className="w-4 h-4 animate-spin [animation-duration:5s]" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </span>

              {/* Main Card Content */}
              <div className={`p-5 rounded-2xl border transition-all ${
                mi.status === 'completed'
                  ? 'bg-emerald-50/10 border-emerald-100 hover:border-emerald-200'
                  : mi.status === 'in-progress'
                  ? 'bg-white border-indigo-600 shadow-md ring-1 ring-slate-100'
                  : 'bg-slate-50/50 border-slate-200/60 opacity-70'
              }`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2 pb-2 border-b border-dashed border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                      {mi.month}
                    </span>
                    <span className="text-slate-300">•</span>
                    <div className="flex gap-1.5">
                      {mi.skills.map(sk => (
                        <span key={sk} className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          mi.status === 'completed' ? 'bg-emerald-50 text-emerald-800' :
                          mi.status === 'in-progress' ? 'bg-indigo-50 text-indigo-705' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${
                    mi.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    mi.status === 'in-progress' ? 'bg-indigo-650 text-white animate-pulse' : 'bg-slate-250 bg-slate-200 text-slate-600'
                  }`}>
                    {mi.status === 'completed' ? curr.completed : mi.status === 'in-progress' ? curr.inProgress : curr.locked}
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <h4 className="font-black text-sm text-slate-900 font-display">
                    {mi.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {mi.desc}
                  </p>
                </div>

                {/* Target Career Relevance links indicator */}
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-2 mt-4 text-left">
                  <TrendingUp className="w-4 h-4 text-indigo-600 font-bold shrink-0" />
                  <span className="text-[10px] font-extrabold text-[#4f46e5] uppercase tracking-wide truncate">
                    {mi.careerMark}
                  </span>
                </div>

                {/* Progress Meter footer */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {curr.weightCompletion}
                  </span>
                  
                  {mi.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 leading-none uppercase text-[10px]">
                      <Award className="w-4 h-4" /> {curr.coreMastery}
                    </span>
                  )}

                  {mi.status === 'in-progress' && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${mi.progress}%` }} />
                      </div>
                      <span className="text-xs font-black text-indigo-600 text-[10px]">{mi.progress}% {curr.complete}</span>
                    </div>
                  )}

                  {mi.status === 'locked' && (
                    <span className="text-xs font-black text-slate-400 text-[10px] uppercase">
                      {curr.unlockNext}
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Recommendations agenda section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider font-display text-left">
              {curr.todayRec}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 text-left">
              {curr.todayRecDesc}
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTab('ai-mentor')}
            className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            {curr.askMentor} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {missions.map((mission) => (
            <div 
              key={mission.id}
              onClick={() => mission.status !== 'UPCOMING' && onToggleMission(mission.id)}
              className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                mission.status === 'DONE'
                  ? 'bg-emerald-50/15 border-emerald-100 hover:bg-emerald-50/20 cursor-pointer'
                  : mission.status === 'PENDING'
                  ? 'bg-white border-slate-200 hover:border-indigo-600/40 cursor-pointer'
                  : 'bg-slate-50/60 border-slate-200/50 opacity-60 pointer-events-none'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                mission.status === 'DONE'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-slate-300'
              }`}>
                {mission.status === 'DONE' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 text-left">
                <p className={`text-xs font-extrabold text-slate-800 ${mission.status === 'DONE' ? 'text-slate-400 line-through' : ''}`}>
                  {lang === 'hi' && mission.id === 'm1' ? "बाइनरी सर्च ट्री कार्यान्वयन" : 
                   lang === 'hi' && mission.id === 'm2' ? "यूज़र ऑथ REST API" :
                   lang === 'hi' && mission.id === 'm3' ? "ई-कॉमर्स डेटाबेस स्कीमा" :
                   lang === 'hi' && mission.id === 'm4' ? "डायनेमिक प्रोग्रामिंग अभ्यास" :
                   lang === 'ta' && mission.id === 'm1' ? "பைனரி தேடல் மரம் செயலாக்கம்" :
                   lang === 'ta' && mission.id === 'm2' ? "பயனர் அங்கீகார REST API" :
                   lang === 'ta' && mission.id === 'm3' ? "மின்-வணிக தரவுத்தள வடிவமைப்பு" :
                   lang === 'ta' && mission.id === 'm4' ? "மாறும் நிரலாக்க பயிற்சி" : mission.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">
                  {lang === 'hi' ? "सॉफ्टवेयर इंजीनियरिंग" : lang === 'ta' ? "நிரலாக்கவியல்" : mission.category} • {mission.duration}
                </p>
              </div>

              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                mission.status === 'DONE' ? 'bg-emerald-50 text-emerald-850' :
                mission.status === 'PENDING' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}>
                {mission.status === 'DONE' ? curr.complete : mission.status === 'PENDING' ? curr.inProgress : curr.locked}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
