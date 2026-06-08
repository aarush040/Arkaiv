import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Map, 
  Layers, 
  User, 
  LogOut, 
  Bell, 
  ChevronRight, 
  Clock, 
  Sparkle,
  Send,
  HelpCircle,
  FileCheck2,
  Bookmark,
  CheckSquare,
  Home,
  Languages,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { TabName, Milestone, DailyMission, ChatMessage, Submission, AuthUser } from '../types';
import HomeView from './HomeView';
import RoadmapView from './RoadmapView';
import EvaluationView from './EvaluationView';
import MentorView, { renderMessageText } from './MentorView';
import ProgressInsightsView from './ProgressInsightsView';
import aiService from '../services/aiService';

interface DashboardProps {
  initialProfile: {
    goal: string;
    level: string;
    commitment: number;
    duration: number;
    marksheetUploaded?: boolean;
    marksheetName?: string;
  };
  user?: AuthUser;
  onLogOut: () => void;
  onRedoOnboarding?: () => void;
}

export default function DashboardView({ initialProfile, onLogOut, user, onRedoOnboarding }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [lang, setLang] = useState<'en' | 'hi' | 'ta'>('en');
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<string[]>([
    "Curriculum updated: Aligned B.Tech CSE learning paths to Product & Startup criteria.",
    "Integrated academic performance from NIT Allahabad academic registry snapshots."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Frontend Mastery', subtitle: 'Advanced React, Next.js, and Tailwind CSS layouts.', status: 'in-progress', progress: 72 },
    { id: '2', title: 'Backend & Full Stack', subtitle: 'Node.js, database integration, and authenticated REST APIs.', status: 'locked', progress: 15 },
    { id: '3', title: 'Product & Startup Skills', subtitle: 'Product principles, agile cycles, and startup seed project execution.', status: 'locked', progress: 0 }
  ]);

  const [missions, setMissions] = useState<DailyMission[]>([
    { id: 'm1', title: 'Implement Binary Search Tree with traversal methods', category: 'Data Structures & Algorithms', duration: '40 min', status: 'PENDING' },
    { id: 'm2', title: 'Create REST API for User Authentication', category: 'Backend Engineering', duration: '30 min', status: 'PENDING' },
    { id: 'm3', title: 'Design Database Schema for E-commerce App', category: 'Database Systems', duration: '35 min', status: 'PENDING' },
    { id: 'm4', title: 'Solve 5 LeetCode problems on Dynamic Programming', category: 'DP & Competitive Programming', duration: '60 min', status: 'UPCOMING' }
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 's1', name: 'Build_Product_Ecommerce_Dashboard.zip', size: '2.8 MB', timeAgo: '1 hour ago', type: 'doc', status: 'completed' },
    { id: 's2', name: 'Core_Syllabus_BTech_CS_Bridge.pdf', size: '1.1 MB', timeAgo: '2 days ago', type: 'doc', status: 'completed' }
  ]);

  const [mentorChatMessages, setMentorChatMessages] = useState<ChatMessage[]>([
    { 
      id: 'm1', 
      sender: 'ai', 
      text: `Priya Verma, let's skip the small talk. You are on the pathway to become a Full-Stack Developer & Startup Founder, but a roadmap means absolutely nothing without meticulous mathematical and system design execution.

We are covering React State management and Sandbox Security today. This topic bridges your Computer Science syllabus at NIT Allahabad directly to industry-grade distributed systems. Vague, hand-waving explanations will not get you through technical assessments or venture audits.

What concept shall we drill first? Choose wisely.`, 
      timestamp: 'Just now' 
    }
  ]);
  const [isSendingMentorMessage, setIsSendingMentorMessage] = useState(false);

  const [companionInput, setCompanionInput] = useState('');
  const [companionMessages, setCompanionMessages] = useState<ChatMessage[]>([
    { id: 'c1', sender: 'ai', text: "Hey Priya, got questions regarding dynamic state management or Node.js backend integration? Ask instantly.", timestamp: 'Just now' }
  ]);
  const [isSendingCompanionMsg, setIsSendingCompanionMsg] = useState(false);
  const companionEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    companionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [companionMessages]);

  const handleToggleMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const isDone = m.status === 'DONE';
        const updatedStatus = isDone ? 'PENDING' : 'DONE';
        if (updatedStatus === 'DONE') {
          setNotifications(n => ["✓ Completed study unit: Mapped status updated!", ...n]);
        }
        return { ...m, status: updatedStatus as any };
      }
      return m;
    }));
  };

  const handleGradedSubmissions = (scores: any) => {
    setNotifications(prev => ["New homework task graded: Mapped to NCERT Level 2 criteria!", ...prev]);
    setMilestones(prev => prev.map(m => {
      if (m.id === '2') {
        return { ...m, progress: 88 };
      }
      return m;
    }));
  };

  const handleAddSubmission = (sub: Submission) => {
    setSubmissions(prev => [sub, ...prev]);
  };

  const handleSendChatMessage = async (text: string, isMentor: boolean) => {
    const senderMessages = isMentor ? mentorChatMessages : companionMessages;
    const setMessages = isMentor ? setMentorChatMessages : setCompanionMessages;
    const setLoading = isMentor ? setIsSendingMentorMessage : setIsSendingCompanionMsg;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await aiService.chat({
        message: text,
        previousMessages: senderMessages.slice(-5).map(m => ({ sender: m.sender, text: m.text })),
        userGoal: initialProfile.goal,
        userLevel: initialProfile.level,
        context: activeTab,
      });
      
      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.text,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'ai',
        text: lang === 'hi' 
          ? "क्षमा करें, नेटवर्क रिज़ॉल्यूशन त्रुटि। कृपया पुनः प्रयास करें।" 
          : lang === 'ta'
          ? "மன்னிக்கவும், பிணைய பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்." 
          : "Sorry, network resolution error. Please try again.",
        timestamp: 'Just now'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="arkaiv-dashboard-root" className="min-h-screen bg-transparent flex flex-col font-sans text-slate-100">
      
      {/* Top Header */}
      <header className="backdrop-blur-md bg-slate-950/70 sticky top-0 z-40 border-b border-slate-800 py-3 px-4 md:px-8 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black tracking-tight text-indigo-400 font-display">
            ARKA<span className="text-white">IV</span>
          </h2>
          <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-[10px] font-bold text-indigo-300">
            {lang === 'hi' ? "एनईपी 2020 मंच" : lang === 'ta' ? "NEP 2020 தளம்" : "NEP 2020 Platform"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-full p-0.5 gap-1 shadow-inner">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                lang === 'en' ? 'bg-indigo-600 text-white shadow-lg glow-btn-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                lang === 'hi' ? 'bg-indigo-600 text-white shadow-lg glow-btn-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                lang === 'ta' ? 'bg-indigo-600 text-white shadow-lg glow-btn-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-950/40 border border-emerald-800/30 rounded-full text-emerald-400 text-[10px] font-extrabold uppercase">
            <Sparkle className="w-3 h-3 text-emerald-405 animate-pulse" />
            {lang === 'hi' ? "सक्रिय कार्यक्रम संरेखित" : lang === 'ta' ? "செயலில் உள்ள திட்டம்" : "Active Program Mapped"}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-800 text-slate-300 transition-all cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-indigo-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-4 space-y-3.5 z-50 animate-fade-in text-left">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-450 text-indigo-300">Diagnostic Logs</p>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-2.5 bg-slate-950/70 rounded-xl text-xs leading-normal text-slate-200 border border-slate-800/60">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onLogOut}
            className="p-1.5 bg-red-950/20 hover:bg-red-950/45 text-red-450 hover:text-red-300 rounded-full border border-red-900/40 transition-all cursor-pointer"
            title="Reset Settings"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-950/60 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-6 flex flex-col justify-between shrink-0">
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-2.5">
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Active Learner Profile</span>
                <h4 className="font-extrabold text-sm text-white font-display mt-0.5">
                  {user?.name || "Priya Verma"}
                </h4>
                <p className="text-[10px] text-slate-350 font-semibold leading-normal mt-0.5">
                  B.Tech CS • NIT Allahabad
                </p>
              </div>
              {onRedoOnboarding && (
                <button
                  id="recalibrate-onboarding-btn"
                  onClick={onRedoOnboarding}
                  className="w-full text-center py-1.5 px-2 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 text-[10px] font-bold text-indigo-300 rounded-lg cursor-pointer transition-all"
                >
                  Recalibrate Path
                </button>
              )}
            </div>

            <nav className="space-y-1">
              {[
                { id: 'dashboard', title: lang === 'hi' ? 'मुख्य पृष्ठ / डैशबोर्ड' : lang === 'ta' ? 'முகப்பு / டேஷ்போர்டு' : 'Home / Dashboard', icon: Home },
                { id: 'roadmap', title: lang === 'hi' ? 'अध्ययन रोडमैप' : lang === 'ta' ? 'வழிகாட்டி காலவரிசை' : 'Roadmap timeline', icon: Map },
                { id: 'ai-mentor', title: lang === 'hi' ? 'एआई सलाहकार' : lang === 'ta' ? 'செயற்கை வழிகாட்டி' : 'AI Advisor', icon: User },
                { id: 'evaluation', title: lang === 'hi' ? 'मूल्यांकन लैब' : lang === 'ta' ? 'மதிப்பீட்டு ஆய்வகம்' : 'Tasks / Evaluation', icon: Layers },
                { id: 'progress-insights', title: lang === 'hi' ? 'प्रगति और अंतर्दृष्टि' : lang === 'ta' ? 'முன்னேற்றம் & நுண்ணறிவு' : 'Progress & Insights', icon: TrendingUp },
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setActiveTab(btn.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                    activeTab === btn.id
                      ? 'bg-indigo-650 text-white shadow-lg glow-btn-primary font-extrabold border-indigo-500'
                      : 'text-slate-300 hover:bg-slate-900/60 border-transparent hover:text-white'
                  }`}
                >
                  <btn.icon className="w-4.5 h-4.5 shrink-0" />
                  <span className="truncate">{btn.title}</span>
                  {activeTab === btn.id && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-200" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-indigo-950/45 border border-indigo-900/50 rounded-xl space-y-2 text-left">
              <div className="flex justify-between items-center text-[10px] font-bold text-indigo-300 uppercase">
                <span>Direct NCERT Focus</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-transparent">
          <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-6">
            <div className="flex-1 min-w-0">
              {activeTab === 'dashboard' && (
                <HomeView 
                  userGoal={initialProfile.goal}
                  userLevel={initialProfile.level}
                  lang={lang}
                  lowDataMode={lowDataMode}
                  setLowDataMode={setLowDataMode}
                  onNavigateToTab={(t) => setActiveTab(t)}
                />
              )}

              {activeTab === 'roadmap' && (
                <RoadmapView 
                  userGoal={initialProfile.goal}
                  userLevel={initialProfile.level}
                  milestones={milestones}
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  onNavigateToTab={(t) => setActiveTab(t)}
                  lang={lang}
                />
              )}

              {activeTab === 'evaluation' && (
                <EvaluationView 
                  userGoal={initialProfile.goal}
                  submissions={submissions}
                  onAddSubmission={handleAddSubmission}
                  onGraded={handleGradedSubmissions}
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  lang={lang}
                />
              )}

              {activeTab === 'ai-mentor' && (
                <MentorView 
                  userGoal={initialProfile.goal}
                  userLevel={initialProfile.level}
                  chatMessages={mentorChatMessages}
                  onSendMessage={(t) => handleSendChatMessage(t, true)}
                  isSendingMesssage={isSendingMentorMessage}
                  lang={lang}
                />
              )}

              {activeTab === 'progress-insights' && (
                <ProgressInsightsView 
                  userGoal={initialProfile.goal}
                  userLevel={initialProfile.level}
                  lang={lang}
                />
              )}
            </div>

            {activeTab === 'roadmap' && (
              <aside className="w-full xl:w-[310px] bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xl h-[520px] shrink-0 relative">
                <div className="flex flex-col h-full justify-between space-y-3">
                  <div className="pb-2 border-b border-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-xs text-white font-display text-left">
                        {lang === 'hi' ? "सहायक बॉट" : lang === 'ta' ? "துணை போட்" : "Ask Companion Bot"}
                      </h4>
                      <p className="text-[9px] font-bold tracking-wider text-indigo-400 uppercase text-left">
                        {lang === 'hi' ? "पाठ्यक्रम समाधान क्षेत्र" : lang === 'ta' ? "பாடப்பகுதி தீர்வுகள்" : "Curriculum Area Resolver"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1 scrollbar-thin text-left">
                    {companionMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex gap-2 max-w-[90%] ${
                          msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[9px] ${
                          msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-805 bg-slate-800 text-indigo-300'
                        }`}>
                          {msg.sender === 'user' ? 'RS' : 'A'}
                        </div>
                        <div className={`p-2.5 rounded-2xl text-xs leading-normal ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none font-sans font-medium shadow-md'
                            : 'bg-slate-950/60 border border-slate-800/80 text-slate-200 rounded-tl-none font-sans'
                        }`}>
                          {msg.sender === 'user' ? (
                            <span>{msg.text}</span>
                          ) : (
                            renderMessageText(msg.text)
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isSendingCompanionMsg && (
                      <div className="flex gap-2 max-w-[80%]">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-[9px] font-bold animate-pulse shrink-0">
                          A
                        </div>
                        <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <div className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                    <div ref={companionEndRef} />
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2 bg-transparent">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => handleSendChatMessage("What are matrix dimensional gradients?", false)}
                        className="text-[9px] font-bold px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-indigo-650/40 text-slate-300 transition-all cursor-pointer truncate text-left"
                      >
                        {lang === 'hi' ? "मैट्रिक्स ग्रेडिएंट्स क्या हैं?" : lang === 'ta' ? "மேட்ரிக்ஸ் சாய்வுகள் என்றால் என்ன?" : "What are matrix gradients?"}
                      </button>
                      <button 
                        onClick={() => handleSendChatMessage("Define normal NCERT calculus derivative proofs?", false)}
                        className="text-[9px] font-bold px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-indigo-650/40 text-slate-300 transition-all cursor-pointer truncate text-left"
                      >
                        {lang === 'hi' ? "कैलकुलस अवकलन प्रमाण" : lang === 'ta' ? "நுண்கணித வகைக்கெழு நிரூபணங்கள்" : "NCERT Calculus Proofs"}
                      </button>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <input 
                        type="text"
                        value={companionInput}
                        onChange={(e) => setCompanionInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && companionInput.trim() && (handleSendChatMessage(companionInput.trim(), false), setCompanionInput(''))}
                        placeholder={lang === 'hi' ? "प्रश्न लिखें..." : lang === 'ta' ? "கேள்வி எழுதுங்கள்..." : "Type query..."}
                        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        onClick={() => {
                          if (!companionInput.trim()) return;
                          handleSendChatMessage(companionInput.trim(), false);
                          setCompanionInput('');
                        }}
                        disabled={isSendingCompanionMsg || !companionInput.trim()}
                        className="bg-indigo-600 text-white p-1.5 rounded-lg transition-all hover:bg-indigo-700 disabled:opacity-40 cursor-pointer shadow-md"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}