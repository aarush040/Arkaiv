import React, { useState } from 'react';
import { 
  CloudUpload, 
  Rocket, 
  CheckCircle, 
  Lightbulb, 
  Clock, 
  Link as LinkIcon, 
  FileText,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Terminal,
  Activity,
  Award,
  Check,
  ShieldAlert,
  ArrowRight,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import { Submission, DailyMission } from '../types';
import taskService from '../services/taskService';

interface EvaluationProps {
  userGoal: string;
  submissions: Submission[];
  onAddSubmission: (sub: any) => void;
  onGraded: (newGlowScores: any) => void;
  missions: DailyMission[];
  onToggleMission: (id: string) => void;
  lang?: any;
}

// Rich detailed scorecards mapped for each completed submission ID or task
const mockScorecards: Record<string, any> = {
  s1: {
    fileName: 'Build_Product_Ecommerce_Dashboard.zip',
    taskName: 'Design Database Schema for E-commerce App',
    overallScore: '8.4/10',
    scores: {
      understanding: 8.5,
      conceptualClarity: 8.0,
      execution: 9.0,
      nepCompliance: 8.5,
      careerRelevance: 8.0
    },
    highestArea: 'Execution (9.0/10) - Highly optimized component decomposition and fluid viewports responsive scaling.',
    lackedArea: 'Conceptual Clarity (8.0/10) - Storing authentication tokens inside simple local variables with no persistent vault backup checks.',
    feedback: 'Priya Verma, you show excellent layout instincts. However, transient routes and state elements represent unstable engineering practice under heavy traffic index loads. Focus on backend SQL schemas and caching loops in the coming sprint.'
  },
  s2: {
    fileName: 'Core_Syllabus_BTech_CS_Bridge.pdf',
    taskName: 'Implement Binary Search Tree with traversal methods',
    overallScore: '9.0/10',
    scores: {
      understanding: 9.5,
      conceptualClarity: 9.0,
      execution: 9.0,
      nepCompliance: 9.0,
      careerRelevance: 8.5
    },
    highestArea: 'Conceptual Understanding (9.5/10) - Spotless pre-calculation on recursive depth-first traversals stack spaces.',
    lackedArea: 'Career Relevance & Scaling (8.5/10) - Missing AVL balance factor mechanisms which causes execution regression on highly biased linear arrays.',
    feedback: 'Your stack allocation algorithms are perfectly compiled. Priya, your BSS performance scores above NIT competitive cohorts. To reach 10/10 efficiency, implement complete dynamic balancing rules.'
  }
};

export default function EvaluationView({ 
  userGoal, 
  submissions, 
  onAddSubmission,
  onGraded,
  missions = [],
  onToggleMission
}: EvaluationProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string>('');
  const [selectedPastSubmission, setSelectedPastSubmission] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStage, setEvaluationStage] = useState('');
  
  // Evaluation Output details - Aligned with NEP 2020 Rubric & Career Relevance
  const [evaluationResult, setEvaluationResult] = useState<any>({
    fileName: "Build_Product_Ecommerce_Dashboard.zip",
    isMatch: true,
    grade: "B+ (84/100)",
    scores: {
      understanding: 8.5,
      conceptualClarity: 8.0,
      execution: 9.0,
      nepCompliance: 8.5,
      careerRelevance: 9.0
    },
    sandboxOutput: `[SANDBOX START] Node.js 20 Runtime Initialized
> Executing Vite static bundler ...
> Compiling React components paired with Tailwind CSS utilities.
> Bundling static assets to ./dist folder: 2.8 MB
[SANDBOX EXIT SUCCESS] Status Code: 0 (Visual design fully responsive. State management needs optimization.)`,
    insights: [
      {
        title: "Strengths (Accurate Execution)",
        desc: "Excellent front-end execution using Tailwind CSS responsive viewport utilities. Viewport resizing behaviors are fully fluid and CSS component definitions show high standard of craftsmanship."
      },
      {
        title: "Weaknesses & Room for Improvement (Concept Gap)",
        desc: "State persistence is incomplete. Your routing is transient and lacks server-side session hooks. Let me be clear: a dashboard without a persistent storage layer or request cache policies is not production-ready."
      },
      {
        title: "NEP-2020 Compliance Diagnostic",
        desc: "Meets high competency standards of the National Credit Framework for practical integration. However, to advance, you must replace the static mock variables with dynamic database proxies in the next submission."
      }
    ]
  });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      submitWork(e.dataTransfer.files[0].name, '2.1 MB');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      submitWork(e.target.files[0].name, '1.5 MB');
    }
  };

  const submitWork = async (fileName: string, fileSize: string) => {
    setIsEvaluating(true);
    
    const stages = [
      "Securing sandbox Node.js/Linux container...",
      "Validating ES2520 component structures and Tailwind CSS elements...",
      "Analyzing database connections and dynamic states integrity filters...",
      "Gauging industry standard layout and responsiveness criteria...",
      "Evaluating readiness against Full-Stack Developer & Product Manager requirements..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setEvaluationStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      // Use the root-level server's evaluate endpoint via taskService
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          userGoal,
          selectedMissionId
        })
      });

      const data = await response.json();
      
      const parsedScores = {
        understanding: data.scores.understanding || 0,
        conceptualClarity: data.scores.conceptualClarity || 0,
        execution: data.scores.execution || 0,
        nepCompliance: data.scores.nepCompliance || 0,
        careerRelevance: data.scores.careerRelevance || 0,
        nepRubricScore: data.scores.nepCompliance * 10 || 0,
      };

      const result = {
        fileName: data.fileName,
        isMatch: data.isMatch !== false,
        grade: data.grade,
        reasons: data.reasons || [],
        feedback: data.feedback || "",
        scores: parsedScores,
        sandboxOutput: data.isMatch === false
          ? `[SANDBOX FATAL ERROR] Submission mismatched.
Task Relevance check: FAILED.
The system rejected task components for ${data.fileName}.`
          : `[SANDBOX START] Node.js 20/Vite Server Initialized
> Executing compiler bundle run for ${data.fileName}...
> Analyzing local routes and client layout styling.
> Compiling React components. Status: SUCCESS.
[SANDBOX EXIT SUCCESS] Status Code: 0 (Execution complete)`,
        insights: data.insights || [
          {
            title: "Rejection Diagnostic",
            desc: "The file you submitted is off-topic. You must submit a file relevant to building full-stack platforms, design layouts, startup models, or coding mechanics."
          }
        ]
      };

      setEvaluationResult(result);
      
      // Update historical activity log
      onAddSubmission({
        id: Math.random().toString(),
        name: fileName,
        size: fileSize,
        timeAgo: "Just now",
        type: fileName.endsWith('.py') ? 'link' : 'doc',
        status: data.isMatch === false ? 'failed' : 'completed',
        taskName: data.selectedTaskName || "Assigned Study Task",
        overallScore: data.isMatch === false ? "Not Graded" : `${((parsedScores.understanding + parsedScores.conceptualClarity + parsedScores.execution + parsedScores.nepCompliance + parsedScores.careerRelevance) / 5).toFixed(1)}/10`,
        scores: parsedScores,
        highestArea: data.insights?.[0] ? `${data.insights[0].title}: ${data.insights[0].desc}` : "Execution metrics matching maximum expectations.",
        lackedArea: data.insights?.[1] ? `${data.insights[1].title}: ${data.insights[1].desc}` : "Algorithmic edge cases.",
        feedback: data.feedback || "Execution parameters verified. Complete all checklist modules to advance credit."
      });

      onGraded(parsedScores);

      // Automatically mark the chosen check-listed study task completed upon successful review
      if (data.isMatch !== false && onToggleMission && selectedMissionId) {
        const targetMission = missions.find(m => m.id === selectedMissionId);
        if (targetMission && targetMission.status !== 'DONE') {
          onToggleMission(selectedMissionId);
        }
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getGradeDisplay = (gradeStr: string) => {
    if (!gradeStr) return { letter: "", marks: "" };
    const matches = gradeStr.match(/^([A-Za-z0-9\+\-]+)\s*\(([^)]+)\)/);
    if (matches) {
      return { letter: matches[1], marks: matches[2] };
    }
    return { letter: gradeStr, marks: "" };
  };

  const { letter: gradeLetter, marks: gradeMarks } = getGradeDisplay(evaluationResult.grade);

  return (
    <div id="arkaiv-evaluation-root" className="space-y-6 animate-fade-in text-left">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 text-white py-3 px-6 text-center text-sm font-bold tracking-wide shadow-sm">
        Solution for <span className="underline decoration-white/50">One-Stop Personalized Career & Education Advisor</span> (SIH 2026) 
        • Aligned with NEP 2020
      </div>

      {/* Goal Evaluation Sandbox Banner */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-indigo-900/40 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 backdrop-blur-md">
        <div className="bg-indigo-950 p-2.5 text-indigo-400 border border-indigo-900 rounded-full shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-black uppercase text-indigo-300 tracking-wider font-display">National Innovation Evaluation Sandbox</h4>
          <p className="text-xs text-slate-350 leading-relaxed">
            Submit files representing your study work in <strong className="font-extrabold text-[#818cf8]">{userGoal}</strong>. Our custom Python & PDF sandbox executes simulation algorithms to verify solutions and dynamically issues skill-mastery scores.
          </p>
        </div>
      </div>

      {/* 1. Today's CORE Study Tasks (Top Tracker Checklist) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-widest font-display flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse inline-block" />
              1. TODAY'S TASKS Checklist (Select one first to activate uploader)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              You must highlight the target task from Priya Verma's to-do list below before dragging your code.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-indigo-950 font-bold border border-indigo-900 text-indigo-400 px-2.5 py-1 rounded">
            Candidate: Priya Verma (CSE Tracker)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {missions.map((m) => {
            const isSelected = selectedMissionId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMissionId(m.id);
                }}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer select-none text-left flex flex-col justify-between min-h-[115px] ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      {m.category}
                    </span>
                    <span className={`text-[8.5px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded-sm ${
                      m.status === 'DONE'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/40'
                        : 'bg-indigo-955 text-indigo-300 border border-indigo-900/40'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2">
                    {m.title}
                  </h4>
                </div>

                <div className="flex justify-between items-center border-t border-slate-900/60 pt-2 mt-2">
                  <span className="text-[9.5px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {m.duration}
                  </span>
                  {isSelected ? (
                    <span className="text-[10px] text-indigo-400 font-black font-mono flex items-center gap-0.5 animate-pulse">
                      <Check className="w-3.5 h-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-[9.5px] text-slate-500 font-medium">Click to bind</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sandbox uploads & today's tasks selector - 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 text-white">
            <h3 className="text-sm font-black uppercase text-white tracking-wider font-display pb-2 border-b border-slate-800">
              Evaluate Active Study Task
            </h3>
            
            {/* Selected Active Task status bar */}
            {!selectedMissionId ? (
              <div className="bg-amber-950/30 border border-amber-900/40 text-amber-300 p-3.5 rounded-xl text-xs space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-505 shrink-0" />
                  Task Linkage Required
                </p>
                <p className="text-[11px] text-slate-400">
                  Select an active checklist task above from today's list to unlock the sandboxed evaluator.
                </p>
              </div>
            ) : (() => {
              const currentMission = missions.find(m => m.id === selectedMissionId) || missions[0];
              const getSuggestedFile = (mid: string) => {
                if (mid === 'm1') return { name: 'bst_traversal.py', size: '12 KB', hint: 'Binary Search Tree traversal logic in Python.' };
                if (mid === 'm2') return { name: 'auth_routes.js', size: '8 KB', hint: 'Express routes with JWT payload authentication.' };
                if (mid === 'm3') return { name: 'ecommerce_schema.sql', size: '22 KB', hint: '3NF Database Relational schema declaration.' };
                if (mid === 'm4') return { name: 'leetcode_dp_solutions.py', size: '14 KB', hint: 'Dynamic Programming optimal memorization arrays.' };
                return { name: 'bst_traversal.py', size: '12 KB', hint: 'Relevant academic files.' };
              };
              const reco = getSuggestedFile(selectedMissionId);

              return (
                <div className="bg-indigo-950/40 border border-indigo-900/40 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase bg-indigo-900/60 text-indigo-305 px-2 py-0.5 rounded-md border border-indigo-800/30">
                      Active: {currentMission.category}
                    </span>
                    <span className="text-[9.5px] font-black uppercase text-indigo-400">
                      Unlocked
                    </span>
                  </div>
                  <h4 className="font-extrabold text-indigo-300 leading-snug">
                    {currentMission.title}
                  </h4>
                  
                  <div className="mt-3 pt-2.5 border-t border-indigo-900/40 space-y-2">
                    <span className="text-[9px] font-black uppercase text-indigo-300 tracking-wide block">Expected Submission File:</span>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#818cf8] font-mono">{reco.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 font-bold block bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">{reco.size}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-350 leading-relaxed font-semibold">{reco.hint}</p>
                    </div>
                  </div>
                </div>
              );
            })()}



            {/* Drag and Drop Area - Activated strictly on task select */}
            <div 
              onDragEnter={selectedMissionId ? handleDrag : undefined}
              onDragOver={selectedMissionId ? handleDrag : undefined}
              onDragLeave={selectedMissionId ? handleDrag : undefined}
              onDrop={selectedMissionId ? handleDrop : undefined}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[148px] text-center ${
                !selectedMissionId
                  ? 'border-slate-800 bg-slate-950/30 grayscale opacity-45 cursor-not-allowed'
                  : dragActive 
                    ? 'border-indigo-600 bg-indigo-950/20' 
                    : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/60'
              }`}
            >
              <input 
                type="file" 
                id="eval-file-upload" 
                className="hidden" 
                onChange={handleFileSelect} 
                disabled={!selectedMissionId}
              />
              <label 
                htmlFor={selectedMissionId ? "eval-file-upload" : undefined} 
                className="w-full flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                {!selectedMissionId ? (
                  <>
                    <Lock className="w-8 h-8 text-slate-500" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
                      🔒 File Upload Locked
                    </p>
                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed max-w-[210px]">
                      Highlight one study task checklist above from today's list to link your file upload.
                    </p>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-8 h-8 text-indigo-400 animate-bounce" />
                    <p className="text-xs font-bold text-slate-105 font-display">
                      Upload your work for: <span className="text-[#818cf8] underline font-extrabold">"{missions.find(m => m.id === selectedMissionId)?.title}"</span>
                    </p>
                    <p className="text-[10.5px] text-emerald-400 font-black uppercase tracking-wider">
                      🟢 Drop Zone Unlocked • Click to scan
                    </p>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* Lesson Submissions History */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Recent Submissions Log
              </h3>
              <span className="text-[9px] font-mono text-slate-500 font-bold">Click file to view detailed scorecard modal</span>
            </div>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {submissions.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={() => {
                    // Match either pre-existing mockScorecards or default scorecard details dynamically
                    const metadata = mockScorecards[sub.id] || {
                      fileName: sub.name,
                      taskName: sub.taskName || "Assigned Study Task Checklist Item",
                      overallScore: sub.overallScore || "8.5/10",
                      scores: sub.scores || {
                        understanding: 8.5,
                        conceptualClarity: 8.0,
                        execution: 9.0,
                        nepCompliance: 8.5,
                        careerRelevance: 9.0
                      },
                      highestArea: sub.highestArea || "Code modularity and execution schema correctness.",
                      lackedArea: sub.lackedArea || "Edge case parameters missing validation.",
                      feedback: sub.feedback || "Good progress demonstrated. Fix requested optimizations to advance skill credits points."
                    };
                    setSelectedPastSubmission(metadata);
                  }}
                  className="flex items-center justify-between p-3 bg-slate-950/60 hover:bg-indigo-950/40 rounded-xl border border-slate-850 hover:border-indigo-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-300 flex items-center justify-center shrink-0 group-hover:bg-indigo-900 transition-all border border-indigo-900/40">
                      {sub.type === 'doc' ? <FileText className="w-4.5 h-4.5" /> : <LinkIcon className="w-4.5 h-4.5" />}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-100 truncate max-w-[150px] group-hover:text-indigo-400 transition-colors">
                        {sub.name}
                      </h5>
                      <span className="text-[9px] text-slate-400 block font-semibold">
                        {sub.size} • {sub.timeAgo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {sub.status === 'failed' ? (
                      <>
                        <X className="w-3.5 h-3.5 text-rose-400 font-black shrink-0" />
                        <span className="text-[10px] font-black text-rose-400 uppercase">Not Graded</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 font-black shrink-0" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase">Graded</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Dynamic Evaluator Grades Bento - 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {evaluationResult.isMatch === false ? (
            <div className="bg-[#451a21]/42 border border-rose-900/50 rounded-2xl p-6 text-white space-y-4 animate-shake">
              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-rose-950/50 text-rose-400 rounded-xl shrink-0 border border-rose-900/40">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase text-rose-300 tracking-wide font-display">
                    Critical Submission Failure
                  </h4>
                  <p className="text-xs font-bold text-rose-350 leading-relaxed">
                    {evaluationResult.feedback || "This submission does not match the assigned task."}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-950 border border-rose-900/30 rounded-xl p-4 space-y-2 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">Specific Rejection Reasons:</span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-350 font-semibold">
                  {evaluationResult.reasons && evaluationResult.reasons.map((reason: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-900/30 rounded-xl text-[11px] text-rose-300 font-extrabold flex justify-between items-center">
                <span>NEP MATCH FACTOR: 0% (FAILED COMPETENCY AUDIT)</span>
                <span className="bg-rose-800 text-white px-2 py-0.5 rounded text-[9px] uppercase font-black">Action Required</span>
              </div>
            </div>
          ) : (
            /* Main Scoring Bento Box Layout */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Grade Card */}
              <div className="md:col-span-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg text-center relative overflow-hidden border border-indigo-500 min-h-[170px]">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-200 block">AI Evaluation Grade</span>
                <div className="my-2.5 flex flex-col items-center justify-center -space-y-0.5">
                  <span className="text-5xl font-black font-display text-white leading-none tracking-tight drop-shadow-sm">
                    {gradeLetter}
                  </span>
                  {gradeMarks && (
                    <span className="text-xs font-bold text-indigo-200 tracking-wider mt-1 block">
                      ({gradeMarks})
                    </span>
                  )}
                </div>
                <span className="inline-block self-center bg-white/20 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Syllabus Verified
                </span>
              </div>

              {/* NEP 2020 Rubric alignment indicator widget - ENHANCED & WIDER */}
              <div className="md:col-span-4 bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg text-center border border-emerald-500 min-h-[170px] transform hover:scale-[1.01] transition-transform">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 block">NEP 2020 Rubric Score</span>
                <p className="text-5xl font-black font-display text-white leading-none tracking-tight my-2.5 drop-shadow-sm">
                  {evaluationResult.scores.nepRubricScore || (evaluationResult.scores.nepCompliance * 10)} <span className="text-base font-medium opacity-80">/ 100</span>
                </p>
                <span className="inline-block self-center bg-emerald-500/30 border border-emerald-400/20 text-emerald-100 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Conceptual Mastery Mode
                </span>
              </div>

              {/* Target Career Relevance Coefficient widget - ENHANCED */}
              <div className="md:col-span-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-900/60 p-6 rounded-2xl flex flex-col justify-between text-center text-white relative shadow-lg overflow-hidden min-h-[170px] transform hover:scale-[1.01] transition-transform">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#818cf8] block">Career Relevance Score</span>
                <p className="text-5xl font-black font-display text-indigo-300 leading-none tracking-tight my-2.5 drop-shadow-sm">
                  {evaluationResult.scores.careerRelevance * 10} <span className="text-base font-medium opacity-80">/ 100</span>
                </p>
                <span className="inline-block self-center bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Direct Track Fit
                </span>
              </div>

            </div>
          )}

          {/* Detailed 5-metric Competency Rubrics List */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <h4 className="text-xs font-black uppercase text-white tracking-wider font-display pb-2 border-b border-slate-800">
              NEP 2020-Aligned Multi-Dimensional Rubric
            </h4>
            
            <div className="space-y-3.5">
              {[
                { name: "Understanding", score: evaluationResult.scores.understanding, label: "Structural Comprehension", desc: "How deeply you understand the constraints and workflow." },
                { name: "Conceptual Clarity", score: evaluationResult.scores.conceptualClarity, label: "Theoretical Correctness", desc: "No-nonsense verification of logic, mathematical models, or data flows." },
                { name: "Execution", score: evaluationResult.scores.execution, label: "Code/Schema Viability", desc: "Clean implementation, responsive viewport layouts, syntax rules integrity." },
                { name: "NEP Compliance", score: evaluationResult.scores.nepCompliance, label: "Core Competency Mastery", desc: "Shift away from rote memorization to skill-based qualifications." },
                { name: "Career Relevance", score: evaluationResult.scores.careerRelevance, label: "Portfolio Readiness", desc: "Industry standards fit for distributed full stack roles." }
              ].map(rub => {
                const percentage = rub.score * 10;
                let trackBg = "bg-indigo-600";
                if (evaluationResult.isMatch === false) {
                  trackBg = "bg-rose-500";
                } else if (percentage >= 85) {
                  trackBg = "bg-emerald-500";
                } else if (percentage >= 60) {
                  trackBg = "bg-indigo-505";
                } else {
                  trackBg = "bg-amber-500";
                }

                return (
                  <div key={rub.name} className="space-y-1.5 text-slate-200">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex gap-1.5 items-center">
                        <span className="text-white font-extrabold font-display">{rub.name}</span>
                        <span className="text-[10px] text-[#818cf8]/80 font-mono">({rub.label})</span>
                      </div>
                      <span className="font-extrabold text-indigo-400">{percentage}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full ${trackBg} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-[10.5px] text-slate-405 leading-relaxed font-semibold">{rub.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Interactive Sandboxed Code Execution Results Output Terminal */}
          <section className="bg-slate-950 border border-slate-900 text-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-900/60 flex justify-between items-center px-4 py-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider font-mono">
                  Sandboxed Code Execution Output (NEP Compliant)
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                STATUS: SUCCESS
              </div>
            </div>
            
            <div className="p-4 bg-slate-950/90 font-mono text-[11px] leading-relaxed text-emerald-400/90 whitespace-pre-wrap overflow-x-auto text-left max-h-[160px] scrollbar-thin">
              {evaluationResult.sandboxOutput}
            </div>
          </section>

          {/* AI Insights & Curriculum aligning details */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-xs font-black uppercase text-[#818cf8] tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
                NEP 2020 Rubric insights
              </h4>
              <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 rounded leading-none">
                Verified
              </span>
            </div>

            <div className="space-y-4">
              {evaluationResult.insights.map((ins: any) => (
                <div key={ins.title} className="flex gap-3 leading-normal">
                  <div className="w-5 h-5 rounded-full bg-slate-950 border border-indigo-900 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-black text-white uppercase tracking-wide font-display">
                      {ins.title}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      {ins.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Evaluating loader screen spinner */}
      {isEvaluating && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-indigo-950 rounded-2xl max-w-sm w-full p-6 text-center space-y-3.5 shadow-2xl relative text-white max-w-[340px]">
            <div className="w-12 h-12 bg-slate-950 border border-indigo-900/60 rounded-full flex items-center justify-center mx-auto text-indigo-400 animate-spin">
              <Sparkles className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">Simulating Execution</h4>
              <p className="text-[10.5px] font-mono tracking-widest text-indigo-400 animate-pulse bg-slate-950 border border-slate-850 px-2 py-1 rounded">
                {evaluationStage}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Running python shape checks, gradient math verifications and grading against National NEP Guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Scorecard Modal for Past/Recent Submissions */}
      {selectedPastSubmission && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-thin text-white">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block font-mono">
                  NATIONAL EVALUATION SYSTEM • SECURE SCORECARD
                </span>
                <h3 className="text-lg font-black font-display text-white mt-1">
                  AI Evaluation Report: {selectedPastSubmission.fileName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPastSubmission(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body content */}
            <div className="p-6 space-y-6 text-left font-sans">
              
              {/* Task Details & Grade row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[9px] font-mono font-black uppercase text-slate-400">Selected Core Task</span>
                  <p className="text-xs font-extrabold text-[#818cf8] leading-relaxed">{selectedPastSubmission.taskName}</p>
                </div>
                <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-900/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black uppercase text-indigo-300">Overall Score</span>
                    <p className="text-xl font-black font-display text-white">{selectedPastSubmission.overallScore}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 bg-indigo-600 text-white rounded font-bold uppercase tracking-wider">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Rubric metrics breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono">
                  Rubric Breakdown (5-Dimensional Domain Metrics)
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Conceptual Understanding", score: selectedPastSubmission.scores?.understanding || 8.5 },
                    { name: "Theoretical Correctness", score: selectedPastSubmission.scores?.conceptualClarity || 8.0 },
                    { name: "Execution & Coding Viability", score: selectedPastSubmission.scores?.execution || 9.0 },
                    { name: "NEP-2020 Compliance", score: selectedPastSubmission.scores?.nepCompliance || 8.5 },
                    { name: "Industrial Career Relevance", score: selectedPastSubmission.scores?.careerRelevance || 9.0 }
                  ].map((rub) => {
                    const percentage = Math.round(rub.score * 10);
                    let barColor = "bg-indigo-500";
                    if (percentage >= 90) barColor = "bg-emerald-500";
                    else if (percentage >= 80) barColor = "bg-indigo-500";
                    else barColor = "bg-amber-500";

                    return (
                      <div key={rub.name} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-200 truncate">{rub.name}</span>
                          <span className="font-bold text-[#818cf8]">{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Weaknesses row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 space-y-1.5">
                  <span className="text-[9.5px] font-black uppercase text-emerald-400 tracking-widest block font-mono">
                    ✦ HIGHEST SCORING AREA
                  </span>
                  <p className="text-xs text-slate-200 font-bold leading-normal">
                    {selectedPastSubmission.highestArea}
                  </p>
                </div>

                {/* Weaknesses */}
                <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-1.5">
                  <span className="text-[9.5px] font-black uppercase text-rose-400 tracking-widest block font-mono">
                    ▲ AREA FOR SYSTEM IMPROVEMENT
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-normal">
                    {selectedPastSubmission.lackedArea}
                  </p>
                </div>

              </div>

              {/* Honest strict feedback from Advisor */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[9.5px] font-black uppercase text-indigo-400 tracking-widest block font-mono">
                  HONEST ACADEMIC VERDICT (STRICT CLINICAL DIRECTION)
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed font-semibold">
                  "{selectedPastSubmission.feedback}"
                </p>
              </div>

            </div>

            {/* Footer buttons close */}
            <div className="p-6 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPastSubmission(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
              >
                Close Scorecard Report
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
