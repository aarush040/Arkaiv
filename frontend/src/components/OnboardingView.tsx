import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Code, 
  Brain, 
  GraduationCap, 
  Building2, 
  PlusCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Baby,
  Activity,
  Flame,
  Upload,
  FileText,
  Import,
  Check,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: (data: {
    goal: string;
    level: string;
    commitment: number;
    duration: number;
    marksheetUploaded?: boolean;
    marksheetName?: string;
  }) => void;
}

export default function OnboardingView({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [customGoalText, setCustomGoalText] = useState<string>('');
  const [level, setLevel] = useState<string | null>(null);
  const [commitment, setCommitment] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Marksheet states
  const [isUploadingMarksheet, setIsUploadingMarksheet] = useState(false);
  const [uploadedMarksheetName, setUploadedMarksheetName] = useState<string | null>(null);
  const [marksheetInsights, setMarksheetInsights] = useState<string | null>(null);

  // Gov platforms sync state
  const [syncPlatform, setSyncPlatform] = useState<string | null>(null);

  const getGraduationDate = () => {
    if (!duration) return '';
    const date = new Date();
    date.setMonth(date.getMonth() + duration);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinishing(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isFinishing) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete({
                goal: goal === 'Custom Goal' ? customGoalText : (goal || 'Become a Full-Stack Developer & Startup Founder'),
                level: level || 'B.Tech 2nd Year',
                commitment: commitment || 2,
                duration: duration || 12,
                marksheetUploaded: !!uploadedMarksheetName,
                marksheetName: uploadedMarksheetName || undefined
              });
            }, 800);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isFinishing, onComplete, goal, customGoalText, level, commitment, duration, uploadedMarksheetName]);

  const stepProgress = (currentStep / 3) * 100;

  // Handle mock marksheet upload
  const simulateMarksheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedMarksheetName(file.name);
      setIsUploadingMarksheet(true);
      setSyncPlatform(null);

      setTimeout(() => {
        setIsUploadingMarksheet(false);
        setMarksheetInsights(
          "Successfully parsed NIT Allahabad B.Tech CSE transcripts! Found high SGPA consistency (8.7, 9.1, 8.4). Detected gaps: System Design & DevOps Basics. Generating tailored remedial full-stack bridging roadmap..."
        );
        setLevel("B.Tech 2nd Year"); // Autoselect appropriate undergraduate state
      }, 1800);
    }
  };

  const handleGovPlatformSync = (platform: string) => {
    setSyncPlatform(platform);
    setIsUploadingMarksheet(true);
    setUploadedMarksheetName(null);

    setTimeout(() => {
      setIsUploadingMarksheet(false);
      setUploadedMarksheetName(`${platform}_Academic_Snapshot_Sync.json`);
      setMarksheetInsights(
        `Linked with ${platform}! Imported profile and scores. Generated remedial study roadmap targeted to master your weak metrics.`
      );
      setLevel("Beginner");
    }, 1550);
  };

  return (
    <div id="arkaiv-onboarding-root" className="min-h-screen flex flex-col justify-between p-4 md:p-8 max-w-5xl mx-auto">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 text-white py-3 px-6 text-center text-sm font-bold tracking-wide shadow-sm rounded-2xl mb-4">
        Solution for <span className="underline decoration-white/50">One-Stop Personalized Career & Education Advisor</span> (SIH 2026) 
        • Aligned with NEP 2020
      </div>

      {/* NEP ALIGNMENT TOP BANNER */}
      <div className="w-full bg-[#eef2ff] border border-[#c7d2fe] p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left mb-6">
        <div className="inline-flex h-7 px-2.5 rounded bg-indigo-600 text-white font-extrabold text-[10px] items-center justify-center tracking-wider shrink-0">
          NEP 2020
        </div>
        <p className="text-xs font-semibold text-indigo-900">
          Aligned with NEP 2020 – Personalized, Multidisciplinary & Skill-Based Learning for All Students.
        </p>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center py-2 mb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-indigo-600 font-display">
            ARKA<span className="text-white bg-indigo-600 px-1.5 rounded-md ml-0.5 inline-block">IV</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-0.5">
            Personalized Career & Competency Roadmap Engine
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700">
            Adaptive Workspace v2.6
          </span>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {/* Progress indicator */}
        <div className="w-full max-w-2xl mx-auto mb-10">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4f46e5]">
              Step {currentStep} of 3
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {Math.round(stepProgress)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Content Screens */}
        <div className="w-full relative min-h-[440px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                    Identify Your Study Goal
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xl mx-auto">
                    We'll structure a customized study program based on your targeted curriculum track or competitive examination goal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Become a Full-Stack Developer & Startup Founder', title: 'Fullstack & Startup Founder', desc: 'Acquire Node.js, Next.js, Cloud DBs, and Startup Pitch/PM competencies.', icon: GraduationCap, color: 'bg-indigo-50 text-indigo-700' },
                    { id: 'Undergraduate Skill Development', title: 'Undergraduate Skill Dev', desc: 'Focus on higher level skill acquisition (Full Stack, Data, AI models).', icon: Code, color: 'bg-emerald-50 text-emerald-700' },
                    { id: 'Competitive Exams', title: 'Competitive Exams', desc: 'Tailored study planner for national examinations such as JEE, NEET & others.', icon: TrendingUp, color: 'bg-blue-50 text-blue-700' },
                    { id: 'Career Transition', title: 'Career Transition', desc: 'Identify target career skills, matching requirements to adaptive modules.', icon: Brain, color: 'bg-purple-50 text-purple-700' },
                    { id: 'Custom Goal', title: 'Custom Goal', desc: 'Compose your own study roadmap node-by-node using our flexible AI advisor.', icon: PlusCircle, color: 'bg-gray-100 text-gray-700' },
                    { id: 'AI Engineer Spec', title: 'AI Engineer Spec', desc: 'Deep dive into computational sciences, neural graphs & derivative optimization.', icon: Sparkles, color: 'bg-amber-50 text-amber-700 animate-pulse' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setGoal(item.id);
                        if (item.id !== 'Custom Goal') {
                          setTimeout(handleNext, 300);
                        }
                      }}
                      className={`group p-5 rounded-xl text-left border-2 transition-all duration-200 flex flex-col gap-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                        goal === item.id 
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/15' 
                          : 'border-gray-200 bg-white hover:border-indigo-600/45'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 font-display transition-colors group-hover:text-indigo-600">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 leading-normal">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Animated Custom Goal field of interest input */}
                {goal === 'Custom Goal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-indigo-50/40 border border-indigo-150 rounded-2xl space-y-4 text-left max-w-4xl mx-auto"
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4.5 h-4.5 text-indigo-600" />
                      <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider font-display">
                        Design Your Custom Roadmap Node
                      </h4>
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-normal">
                      Provide details about any field of interest or specialized career track you would like to master (e.g., Space Exploration Physics, Robotics Automation, Quantum Computing Algorithms, or Specialized B.Tech streams):
                    </p>

                    <div className="space-y-3">
                      <input 
                        type="text"
                        value={customGoalText}
                        onChange={(e) => setCustomGoalText(e.target.value)}
                        placeholder="Type any customized field of interest you wish to study..."
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 shadow-sm"
                      />

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                          Freedom Templates (Click to fill):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Quantum Algorithms & Quantum Circuits",
                            "Astrophysics Orbital Mechanics",
                            "Game Engine Physics (Vectors, C++ & Unreal Engine)",
                            "AgriTech Robotics & IoT Sensor Arrays",
                            "Fintech Quantitative Trading Systems",
                            "Renewable Energy & Climate Modelling",
                            "Cybersecurity Cryptographic Protocols"
                          ].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setCustomGoalText(preset)}
                              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                customGoalText === preset
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                  : 'bg-white border-slate-200 hover:border-indigo-605 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* GOVT INTEGRATION BOX */}
                <div className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider text-center">
                    🇮🇳 Direct Government Academic Content Integration
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button 
                      onClick={() => handleGovPlatformSync("SWAYAM")}
                      className="px-4 py-2 bg-white text-xs border border-gray-250 hover:border-orange-500 text-orange-600 font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Import className="w-3.5 h-3.5 text-orange-500" />
                      Sync SWAYAM Path
                    </button>
                    <button 
                      onClick={() => handleGovPlatformSync("DIKSHA")}
                      className="px-4 py-2 bg-white text-xs border border-gray-250 hover:border-blue-500 text-blue-600 font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Import className="w-3.5 h-3.5 text-blue-500" />
                      Sync DIKSHA Data
                    </button>
                    <button 
                      onClick={() => handleGovPlatformSync("NCERT")}
                      className="px-4 py-2 bg-white text-xs border border-gray-250 hover:border-emerald-500 text-emerald-600 font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Import className="w-3.5 h-3.5 text-emerald-500" />
                      Import NCERT syllabus
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                    Analyze Current Academic Level
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xl mx-auto">
                    Upload your previous marksheet/report card to auto-detect knowledge gaps, or select your baseline path manually.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto">
                  {/* Left: Marksheet Upload Option - 7 columns */}
                  <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-sm font-black uppercase text-gray-950 tracking-wider">
                          Upload Previous Marksheet / Report Card
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500">
                        Our AI scanner imports previous results to auto-generate personalized developmental nodes for your roadmap. (Accepts PDF, JPG, PNG)
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-200/80 rounded-xl p-6 text-center hover:border-indigo-600/40 transition-colors relative">
                      <input 
                        type="file" 
                        id="marksheet-onboard-upload" 
                        accept="image/*,application/pdf"
                        className="hidden" 
                        onChange={simulateMarksheetUpload}
                      />
                      
                      {isUploadingMarksheet ? (
                        <div className="space-y-2 py-4">
                          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
                          <p className="text-xs font-semibold text-indigo-600 animate-pulse">Scanning Report Card text structures...</p>
                        </div>
                      ) : uploadedMarksheetName ? (
                        <div className="space-y-2 py-2">
                          <Check className="w-8 h-8 text-emerald-600 mx-auto bg-emerald-100 rounded-full p-1 leading-none" />
                          <p className="text-xs font-bold text-gray-900 truncate max-w-[200px] mx-auto">{uploadedMarksheetName}</p>
                          <span className="text-[10px] uppercase font-black tracking-widest text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded">Analysis Complete</span>
                        </div>
                      ) : (
                        <label htmlFor="marksheet-onboard-upload" className="block cursor-pointer py-4 space-y-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto group-hover:scale-105" />
                          <span className="text-xs font-extrabold text-indigo-600 hover:underline block">Choose file to begin scans</span>
                          <span className="text-[9px] text-gray-400 block">Directly integrates with Digilocker & CBSE platforms</span>
                        </label>
                      )}
                    </div>

                    {marksheetInsights && (
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs leading-relaxed text-emerald-800">
                        <strong className="block mb-1">🔍 AI Academic Profiling Result:</strong>
                        {marksheetInsights}
                      </div>
                    )}
                  </div>

                  {/* Right: Manual Baseline Quick-Select - 5 columns */}
                  <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                        Quick Manual Selection
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-normal">
                        Choose manually if you don't have a marksheet snapshot available.
                      </p>
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                      {[
                        { id: 'Beginner', title: 'Beginner Path', desc: 'Covers core prerequisites.', icon: Baby, color: 'border-emerald-100 bg-white text-emerald-600' },
                        { id: 'Intermediate', title: 'Intermediate Path', desc: 'Standard track for board/skills.', icon: Activity, color: 'border-indigo-100 bg-white text-indigo-600' },
                        { id: 'Advanced', title: 'Advanced Track', desc: 'Pushes toward high mastery.', icon: Flame, color: 'border-purple-100 bg-white text-purple-600' },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setLevel(item.id);
                            setTimeout(handleNext, 300);
                          }}
                          className={`p-3.5 rounded-xl border flex items-center justify-between transition-all text-left block w-full ${
                            level === item.id 
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon className="w-4 h-4 shrink-0" />
                            <div>
                              <p className="text-xs font-bold font-display">{item.title}</p>
                              <p className="text-[10px] text-gray-400 font-semibold">{item.desc}</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            level === item.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                          }`}>
                            {level === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-extrabold tracking-tight text-indigo-600 font-display">
                    Setup Your Study Plan
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xl mx-auto">
                    Determine your daily commitment intensity and timeline boundaries to calculate your roadmap completion vectors.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Commitment Container */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <Clock className="w-4.5 h-4.5 text-indigo-600" />
                      <h3 className="text-sm font-extrabold font-display text-gray-950 uppercase tracking-wider">
                        Daily Commitment
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { val: 1, label: 'Light Prep (1 hr/day)' },
                        { val: 2, label: 'Standard study (2 hrs/day)' },
                        { val: 4, label: 'Deep Adaptive (4 hrs/day)' },
                      ].map(btn => (
                        <button
                          key={btn.val}
                          onClick={() => setCommitment(btn.val)}
                          className={`w-full px-4 py-2.5 rounded-xl border flex justify-between items-center font-semibold text-xs transition-all ${
                            commitment === btn.val
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                              : 'border-gray-200 hover:border-indigo-100 text-gray-700 bg-gray-50'
                          }`}
                        >
                          <span>{btn.label}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            commitment === btn.val ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                          }`}>
                            {commitment === btn.val && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline duration container */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <Calendar className="w-4.5 h-4.5 text-emerald-600" />
                      <h3 className="text-sm font-extrabold font-display text-gray-950 uppercase tracking-wider">
                        Study Duration
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 3, 5, 12].map(val => (
                        <button
                          key={val}
                          onClick={() => setDuration(val)}
                          className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                            duration === val
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                              : 'border-gray-200 hover:border-emerald-100 bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-2xl font-black font-display leading-tight">{val}</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">
                            {val === 1 ? 'Month' : 'Months'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {commitment && duration && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="inline-block p-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs font-semibold text-emerald-800 shadow-xs">
                      <div className="flex items-center gap-2 justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
                        <span>Predicted Study Completion Velocity: <strong className="underline decoration-emerald-500 decoration-2">in {duration} months</strong> • Aligned with NEP 2020</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="w-full flex justify-between items-center py-4 border-t border-gray-200 mt-4">
        <button
          onClick={handlePrev}
          className={`flex items-center gap-1 px-4 py-2 font-semibold text-xs text-gray-600 hover:text-indigo-650 transition-all rounded-full ${
            currentStep === 1 ? 'invisible' : 'visible hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={
            (currentStep === 1 && (!goal || (goal === 'Custom Goal' && !customGoalText.trim()))) ||
            (currentStep === 2 && !level) ||
            (currentStep === 3 && (!commitment || !duration))
          }
          className={`group flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-xs shadow transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
            currentStep === 3 
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
          }`}
        >
          {currentStep === 3 ? (
            <>
              Confirm & Generate Adaptive Path
              <Sparkles className="w-3.5 h-3.5 animate-spin text-white/90" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </footer>

      {/* Finishing personalize animation loader */}
      <AnimatePresence>
        {isFinishing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-indigo-950/95 backdrop-blur-md flex items-center justify-center animate-fade-in"
          >
            <div className="max-w-md w-full text-center p-8 text-white">
              <motion.div 
                animate={{ scale: [1, 1.08, 1], rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 bg-indigo-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/40"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-black font-display leading-tight tracking-tight text-white mb-2">
                Personalizing Adaptive Workspace...
              </h2>
              <p className="text-gray-300 text-xs leading-normal mb-6">
                Creating active syllabus nodes aligned directly with your target baseline goals and past report cards. Establishing your personal study logs.
              </p>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4 shadow-inner">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-150 rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">
                Auto-configuring bridge topics under NEP-2020 Guidelines...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
