import { useState, useRef, useEffect, type ReactNode } from 'react';
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  BookOpen, 
  Compass, 
  TrendingUp, 
  LineChart,
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Sliders,
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import { ChatMessage } from '../types';

// Robust parsing and formatting helper to fix the unstyled/mixed-math representation
export function renderMessageText(text: string): ReactNode {
  if (!text) return null;

  // 1. Separate code blocks from normal text blocks
  const parts: ReactNode[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    const codeLanguage = match[1] || 'code';
    const codeBody = match[2];

    // Push text before code block
    if (textBefore.trim()) {
      parts.push(
        <div key={`text-${lastIndex}`} className="space-y-2 text-slate-200 font-sans font-medium text-sm leading-relaxed antialiased">
          {renderFormattedParagraphs(textBefore)}
        </div>
      );
    }

    // Push formatted code block component
    parts.push(
      <div key={`code-${match.index}`} className="my-3 bg-slate-950 text-[#6cf8bb] p-4 rounded-xl border border-slate-800 shadow-md relative group font-mono text-xs leading-relaxed max-w-full overflow-hidden">
        <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/85 text-[10px] text-slate-500 uppercase font-black tracking-widest select-none">
          <span>{codeLanguage || 'interactive code'}</span>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.navigator && window.navigator.clipboard) {
                window.navigator.clipboard.writeText(codeBody);
              }
            }}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-[9px] font-black cursor-pointer active:scale-95"
          >
            Copy Code
          </button>
        </div>
        <pre className="whitespace-pre overflow-x-auto scrollbar-thin text-[#6cf8bb]/90 pb-1">{codeBody}</pre>
      </div>
    );

    lastIndex = codeBlockRegex.lastIndex;
  }

  // Push remaining text after all code blocks
  const remainingText = text.substring(lastIndex);
  if (remainingText.trim() || parts.length === 0) {
    parts.push(
      <div key={`text-${lastIndex}`} className="space-y-2 text-slate-200 font-sans font-medium text-sm leading-relaxed antialiased">
        {renderFormattedParagraphs(remainingText)}
      </div>
    );
  }

  return <div className="space-y-3">{parts}</div>;
}

// Format blocks of text into paragraph layers or ordered/unordered list layouts
function renderFormattedParagraphs(text: string): ReactNode[] {
  const lines = text.split('\n');
  const result: ReactNode[] = [];
  let listItems: ReactNode[] = [];
  let isInsideList = false;

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      result.push(
        <ul key={key} className="list-disc pl-5 py-1 space-y-1 text-slate-200 font-sans font-medium text-sm leading-relaxed">
          {listItems}
        </ul>
      );
      listItems = [];
      isInsideList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Unordered list formats: "* text" or "- text"
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      isInsideList = true;
      const content = trimmedLine.substring(2);
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed text-slate-200">
          {renderInlineElements(content)}
        </li>
      );
    } 
    // Ordered list formats: "1. text"
    else if (/^\d+\.\s+/.test(trimmedLine)) {
      flushList(`list-f-${index}`);
      // Render as an ordered item with a nice styled offset
      result.push(
        <div key={`ord-${index}`} className="pl-2 py-0.5 flex gap-2 items-start text-slate-200 font-sans font-medium text-sm leading-relaxed">
          <span className="font-extrabold text-indigo-400 shrink-0 text-sm select-none">
            {trimmedLine.match(/^\d+\./)?.[0]}
          </span>
          <div className="flex-1">{renderInlineElements(trimmedLine.replace(/^\d+\.\s+/, ''))}</div>
        </div>
      );
    }
    // Blank lines split paragraphs
    else if (trimmedLine === '') {
      flushList(`list-f-${index}`);
    } 
    // Plain body text
    else {
      flushList(`list-f-${index}`);
      result.push(
        <p key={`p-${index}`} className="leading-relaxed text-slate-200 font-sans font-medium text-sm">
          {renderInlineElements(line)}
        </p>
      );
    }
  });

  // Handle remaining list
  if (isInsideList) {
    flushList(`list-end`);
  }

  return result;
}

// Clean syntax markup, convert raw formulas, and format bold highlights
function renderInlineElements(rawText: string): ReactNode[] {
  if (!rawText) return [];

  // Math formulas cleaning block
  let text = rawText;

  // Clean raw LaTeX formatting into normal readable math symbols so it doesn't look like code errors
  text = text.replace(/\\\$/g, '$');
  
  // Specific fraction patterns: \frac{num}{den} -> (num / den)
  text = text.replace(/\\frac\s*{(.*?)}\s*{(.*?)}/g, '$1/$2');
  
  // Specific calculus and functions patterns
  text = text.replace(/\\partial/g, '∂');
  text = text.replace(/\\ln/g, 'ln');
  text = text.replace(/\\sin/g, 'sin');
  text = text.replace(/\\cos/g, 'cos');
  text = text.replace(/\\theta/g, 'θ');
  text = text.replace(/\\alpha/g, 'α');
  text = text.replace(/\\beta/g, 'β');
  text = text.replace(/\\lambda/g, 'λ');
  text = text.replace(/\\cdot/g, '·');
  text = text.replace(/\\times/g, '×');
  text = text.replace(/\\le/g, '≤');
  text = text.replace(/\\ge/g, '≥');
  text = text.replace(/\\neq/g, '≠');
  text = text.replace(/\\infty/g, '∞');
  text = text.replace(/\\rightarrow/g, '→');

  // Math superscript conversions
  text = text.replace(/\^2/g, '²');
  text = text.replace(/\^3/g, '³');
  text = text.replace(/\^n/g, 'ⁿ');

  // Strip standard LaTeX single/double dollar wrappers
  text = text.replace(/\$\$(.*?)\$\$/g, '$1');
  text = text.replace(/\$(.*?)\$/g, '$1');

  // Inline formatting regex:
  // **bold** -> bold (accent emphasized)
  // `code` -> clean highlight tag
  const inlineRegex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const tokens = text.split(inlineRegex);
  const elements: ReactNode[] = [];

  tokens.forEach((token, index) => {
    // Bold identifier
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldVal = token.slice(2, -2);
      elements.push(
        <strong 
          key={index} 
          className="font-extrabold text-indigo-300 bg-indigo-950/40 px-1 rounded-sm select-text"
        >
          {boldVal}
        </strong>
      );
    } 
    // Inline code identifier
    else if (token.startsWith('`') && token.endsWith('`')) {
      const codeVal = token.slice(1, -1);
      elements.push(
        <code 
          key={index} 
          className="font-bold text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded text-[11px] font-sans border border-indigo-900/30 select-text"
        >
          {codeVal}
        </code>
      );
    } 
    // Italic identifier
    else if (token.startsWith('*') && token.endsWith('*')) {
      const italicVal = token.slice(1, -1);
      elements.push(
        <em key={index} className="italic text-slate-300">
          {italicVal}
        </em>
      );
    } 
    // Regular character strings
    else {
      // Just plain span text using regular font family
      elements.push(<span key={index}>{token}</span>);
    }
  });

  return elements;
}

interface MentorProps {
  userGoal: string;
  userLevel: string;
  chatMessages: ChatMessage[];
  onSendMessage: (txt: string, tag?: string) => void;
  isSendingMesssage: boolean;
  lang?: 'en' | 'hi' | 'ta';
}

export default function MentorView({ 
  userGoal, 
  userLevel, 
  chatMessages, 
  onSendMessage,
  isSendingMesssage,
  lang = 'en'
}: MentorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Spaced Repetition Killer Feature State
  const [showSpacedRep, setShowSpacedRep] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scoreTracker, setScoreTracker] = useState(0);

  const spacedRepQuestions = [
    {
      q: "What is the primary role of the Chain Rule in backpropagation?",
      options: [
        "To initialize weights randomly to prevent bias",
        "To multiply partial derivatives of successive layers to find the gradient of the loss with respect to weights",
        "To calculate the learning rate dynamically over multiple training steps",
        "To prevent overfitting by adding L2 regularization to structural nodes"
      ],
      correct: 1,
      explanation: "Exactly! The Chain Rule allows backpropagation to compute the gradient of the loss with respect to any weight by chaining partial derivatives through the layers."
    },
    {
      q: "For a Sigmoid node with output activation 'a', what is its local derivative input da/dz?",
      options: [
        "a * (1 - a)",
        "a * a",
        "1 - (a * a)",
        "a * (1 + a)"
      ],
      correct: 0,
      explanation: "Correct! The derivative of the sigmoid function σ(z) is σ(z)(1 - σ(z)), which translates beautifully to a(1 - a)."
    },
    {
      q: "Under National Education Policy (NEP) 2020 guidelines, which competency is prioritized over rote learning?",
      options: [
        "Structural memorization of proven algebraic formula sequences",
        "Holistic, cross-disciplinary conceptual mastery and practical problem-solving",
        "Absolute exam percentile ranks based on speed metrics",
        "Speed of repetitive mental arithmetic operations"
      ],
      correct: 1,
      explanation: "Perfect! NEP 2020 shifts the educational focus from rote memorization to holistic, conceptual, and multi-disciplinary critical thinking skills."
    },
    {
      q: "Which mathematical operations represent linear transformations in Machine Learning?",
      options: [
        "Element-wise vector addition of constants only",
        "Vector transpose operations without dimension scaling",
        "Matrix dot products mapping input vectors into high-dimensional linear spaces",
        "Boolean equivalence negation tables"
      ],
      correct: 2,
      explanation: "Splendid! Matrix multiplication (dot product) acts as a linear transformation, scaling, shearing, or rotating coordinate dimensions."
    },
    {
      q: "If a weight has a local gradient of zero (da/dw = 0) during backpropagation, what does it signify?",
      options: [
        "The model loss is increasing exponentially",
        "The node has reached stable maximum learning velocity",
        "Vanishing gradient or parameter stall (the weight will receive no update)",
        "Overfitting is perfectly mitigated"
      ],
      correct: 2,
      explanation: "Correct! When the gradient is zero, the model parameters stall because there's no error signal backpropagating to update the weight."
    }
  ];

  const handleSelectOption = (optIdx: number) => {
    if (showFeedback) return;
    setSelectedAns(optIdx);
    setShowFeedback(true);
    if (optIdx === spacedRepQuestions[currentQuestionIndex].correct) {
      setScoreTracker(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAns(null);
    if (currentQuestionIndex < spacedRepQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCompletedQuiz(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setCompletedQuiz(false);
    setSelectedAns(null);
    setShowFeedback(false);
    setScoreTracker(0);
    setShowSpacedRep(false);
  };

  // Nodes Simulation Weights and Forward values
  const [inputVal, setInputVal] = useState<number>(1.0);
  const [weightVal, setWeightVal] = useState<number>(2.0);
  const [biasVal, setBiasVal] = useState<number>(0.5);
  const [isAnimatingBackprop, setIsAnimatingBackprop] = useState(false);

  // Compute forward values
  // z = x * w + b
  const zVal = Number((inputVal * weightVal + biasVal).toFixed(2));
  // a = sigmoid(z)
  const sigmoid = (v: number) => 1 / (1 + Math.exp(-v));
  const aVal = Number(sigmoid(zVal).toFixed(3));

  // Compute localized derivatives on backprop
  // da/dz = a * (1 - a)
  const da_dz = Number((aVal * (1 - aVal)).toFixed(3));
  // dz/dw = x
  const dz_dw = inputVal;
  // total gradient da_dw = da_dz * dz_dw
  const da_dw = Number((da_dz * dz_dw).toFixed(3));

  const triggerBackpropAnimation = () => {
    setIsAnimatingBackprop(true);
    setTimeout(() => {
      setIsAnimatingBackprop(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="space-y-6 text-left">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#311042] to-[#1e1b4b] text-[#cbd5e1] py-3 px-6 text-center text-xs md:text-sm font-bold tracking-wide shadow-md rounded-xl border border-indigo-900/40">
        Solution for <span className="underline decoration-white/30">One-Stop Personalized Career & Education Advisor</span> (SIH 2026) 
        • Aligned with NEP 2020
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in relative z-10">
      
      {/* Central Column Workspace: Chat System Logs & Computational Node Sandbox - 8 Cols */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Tutor selecting category headers */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            {[
              { id: 'all', title: 'Calculus Stage 1' },
              { id: 'general', title: 'Neural Nets' },
              { id: 'practice', title: 'System Design Labs' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-505 shadow-lg glow-btn-primary font-extrabold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900/60 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
          <div className="text-[10px] uppercase font-black tracking-widest text-indigo-300 flex items-center gap-1.5 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            Mentor Engine Active
          </div>
        </section>

        {/* KILLER FEATURE: SPACED REPETITION QUIZ WIDGET */}
        {!showSpacedRep ? (
          <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-900/30 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-left">
              <span className="px-2.5 py-0.5 bg-amber-950/40 text-amber-300 text-[9px] font-black uppercase tracking-wider rounded-lg border border-amber-800/40 inline-block">
                NEP 2020 retention benchmark
              </span>
              <h4 className="text-sm font-black text-white font-display">
                Generate 5 Targeted Practice Questions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Activate an active recall sprint designed specifically for your current Computer Science & AI goals, checking key backpropagation and matrix concepts.
              </p>
            </div>
            <button
              onClick={() => setShowSpacedRep(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold uppercase rounded-xl text-xs tracking-wider cursor-pointer shadow-lg glow-btn-primary shrink-0 inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-250 animate-pulse" />
              Generate 5 Targeted Practice Questions
            </button>
          </section>
        ) : (
          <section className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left space-y-4">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/5 rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 animate-pulse" />
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Active Spaced Repetition Quest ({currentQuestionIndex + 1} of 5)
                </h4>
              </div>
              <button 
                onClick={handleResetQuiz}
                className="text-[10px] font-bold text-slate-400 hover:text-white uppercase cursor-pointer"
              >
                Quit Quest
              </button>
            </div>

            {!completedQuiz ? (
              <div className="space-y-4">
                <p className="text-sm font-extrabold text-white font-display leading-snug">
                  {spacedRepQuestions[currentQuestionIndex].q}
                </p>

                <div className="space-y-2">
                  {spacedRepQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAns === oIdx;
                    const isCorrect = oIdx === spacedRepQuestions[currentQuestionIndex].correct;
                    let btnStyle = "border-slate-800 hover:bg-slate-950/40 text-slate-200";
                    if (showFeedback) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-950/40 border-rose-500/60 text-rose-300";
                      } else {
                        btnStyle = "opacity-40 border-slate-900 text-slate-450";
                      }
                    } else if (isSelected) {
                      btnStyle = "border-indigo-500 bg-indigo-950/40 text-white";
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={showFeedback}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-3 text-xs rounded-xl border text-left transition-all leading-normal flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md border border-slate-800 flex items-center justify-center bg-slate-950 shrink-0 font-extrabold text-[10px] text-slate-400">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-semibold">
                    <span className="font-black text-indigo-400 block uppercase tracking-wide text-[10px] mb-1">
                      {selectedAns === spacedRepQuestions[currentQuestionIndex].correct ? "🎉 Excellent! Correct answer." : "⚠️ Close! Let's review the concept:"}
                    </span>
                    {spacedRepQuestions[currentQuestionIndex].explanation}
                  </div>
                )}

                {showFeedback && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl tracking-wider cursor-pointer shadow-lg glow-btn-primary"
                    >
                      {currentQuestionIndex === spacedRepQuestions.length - 1 ? "Finish Quest" : "Next Question"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-800/30">
                  <Award className="w-8 h-8 shrink-0 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white font-display">Quest Completed successfully!</h4>
                  <p className="text-xs text-slate-300">
                    You answered <strong className="text-emerald-400 font-extrabold">{scoreTracker} out of 5</strong> questions correctly.
                  </p>
                </div>
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 inline-block text-[11px] font-black text-emerald-400 uppercase tracking-widest leading-none rounded-lg">
                  +100 XP Retention Bonus Awarded
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetQuiz}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Return to Mentor Chat
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Neural Network Node Simulation Sandbox */}
        <section className="bg-slate-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-4 right-4 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-brand-primary/30 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Live Backprop Lab
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 font-display">
              Computational Graph Explorer
            </h3>
            <p className="text-xs text-gray-405 opacity-80 mt-1">
              Adjust Node values and click Backpropagate to see localized partial derivative vector updates in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG custom Canvas mapping x -> w -> y forwarding */}
            <div className="md:col-span-8 h-40 relative flex items-center justify-center">
              
              <svg className="w-full h-full max-w-[340px]" viewBox="0 0 300 120">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
                  </marker>
                  <marker id="arrow-back" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ec4899" />
                  </marker>
                </defs>

                {/* Connection links */}
                <line 
                  x1="60" y1="60" x2="140" y2="60" 
                  stroke={isAnimatingBackprop ? '#ec4899' : '#4f46e5'} 
                  strokeWidth={isAnimatingBackprop ? '3' : '2'} 
                  markerEnd={isAnimatingBackprop ? 'url(#arrow-back)' : 'url(#arrow)'} 
                  className="transition-all duration-300"
                />
                <line 
                  x1="180" y1="60" x2="240" y2="60" 
                  stroke={isAnimatingBackprop ? '#ec4899' : '#4f46e5'} 
                  strokeWidth={isAnimatingBackprop ? '3' : '2'} 
                  markerEnd={isAnimatingBackprop ? 'url(#arrow-back)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />

                {/* Node X: Input */}
                <circle cx="40" cy="60" r="22" className="fill-slate-900 stroke-indigo-500" strokeWidth="2" />
                <text x="40" y="58" textAnchor="middle" fill="#fff" className="text-xs font-bold font-display">X</text>
                <text x="40" y="73" textAnchor="middle" fill="#818cf8" className="text-[10px] font-black">{inputVal}</text>

                {/* Node W: Operation weight multiplication multiplication */}
                <circle cx="160" cy="60" r="24" className="fill-slate-900 stroke-indigo-500 animate-pulse" strokeWidth="2.5" />
                <text x="160" y="54" textAnchor="middle" fill="#6cf8bb" className="text-xs font-extrabold font-display">Z</text>
                <text x="160" y="66" textAnchor="middle" fill="#94a3b8" className="text-[9px]">w={weightVal}</text>
                <text x="160" y="75" textAnchor="middle" fill="#fff" className="text-[10px] font-bold">{zVal}</text>

                {/* Node Y: Prediction */}
                <circle cx="260" cy="60" r="22" className="fill-slate-900 stroke-emerald-500" strokeWidth="2" />
                <text x="260" y="58" textAnchor="middle" fill="#fff" className="text-xs font-bold font-display">A</text>
                <text x="260" y="73" textAnchor="middle" fill="#34d399" className="text-[10px] font-black">{aVal}</text>

                {/* Gradient tags backpropagation indicators */}
                {isAnimatingBackprop && (
                  <>
                    <text x="210" y="45" textAnchor="middle" fill="#ec4899" className="text-[9px] font-bold animate-bounce">
                      da/dz={da_dz}
                    </text>
                    <text x="100" y="45" textAnchor="middle" fill="#ec4899" className="text-[9px] font-bold animate-bounce">
                      dz/dw={dz_dw}
                    </text>
                  </>
                )}
              </svg>

            </div>

            {/* Slider controls pane - 4 Cols */}
            <div className="md:col-span-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="space-y-3">
                {/* Input X slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Input (X)</span>
                    <span className="text-indigo-400 font-bold">{inputVal}</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="3" step="0.1" 
                    value={inputVal} 
                    onChange={(e) => setInputVal(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
                
                {/* Weight slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Weight (w)</span>
                    <span className="text-emerald-400 font-bold">{weightVal}</span>
                  </div>
                  <input 
                    type="range" min="-3" max="3" step="0.1" 
                    value={weightVal} 
                    onChange={(e) => setWeightVal(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">da/dw vector</span>
                  <span className="text-sm font-black text-rose-400 font-mono">{da_dw}</span>
                </div>
                
                <button 
                  onClick={triggerBackpropAnimation}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-[10px] font-black tracking-wider uppercase text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <RefreshCw className={`w-3 h-3 ${isAnimatingBackprop ? 'animate-spin' : ''}`} />
                  Backprop
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Conversational Terminal Logs */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl h-[400px]">
          {/* Messages core container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Profile placeholder avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-650 text-white shadow-lg' 
                    : 'bg-slate-800 text-indigo-300 border border-slate-700 font-extrabold shadow-sm'
                }`}>
                  {msg.sender === 'user' ? 'PV' : 'A'}
                </div>

                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-605 bg-indigo-600 text-white rounded-tr-none font-sans font-semibold shadow-md'
                      : 'bg-slate-950/60 border border-slate-800/85 text-slate-150 rounded-tl-none font-sans'
                  }`}>
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-line font-medium">{msg.text}</p>
                    ) : (
                      renderMessageText(msg.text)
                    )}
                    
                    {/* Render matching formatted python codes code element */}
                    {msg.code && (
                      <div className="mt-3 bg-slate-950 text-emerald-400 p-3 h-32 overflow-y-auto rounded-xl font-mono text-xs border border-slate-800 relative group">
                        <button 
                          onClick={() => navigator.clipboard.writeText(msg.code || '')}
                          className="absolute right-2 top-2 bg-slate-900 hover:bg-slate-800 text-[10px] uppercase font-bold border border-slate-700 px-2 py-1 rounded text-white"
                        >
                          Copy
                        </button>
                        <pre className="whitespace-pre-wrap">{msg.code}</pre>
                      </div>
                    )}
                  </div>

                  {/* Complete interactive options buttons embedded directly in AI actions */}
                  {msg.sender === 'ai' && (
                    <div className="flex flex-wrap gap-2 pt-1 text-left">
                      <button 
                        onClick={() => handleSuggestClick("Generate Practice Quiz for matrix dimensions")}
                        className="py-1.5 px-3 bg-indigo-950/30 border border-indigo-900/40 hover:bg-indigo-900/40 text-[10px] font-extrabold text-indigo-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5 text-indigo-400 font-bold" />
                        Generate Practice Quiz
                      </button>

                      <button 
                        onClick={() => handleSuggestClick(lang === 'ta' ? "Explain this matrix concept bilingual in தமிழ் & English" : "इस मैट्रिक्स कॉन्सेप्ट को स्पष्ट रूप से हिन्दी और English द्विभाषी रूप से समझाएं")}
                        className="py-1.5 px-3 bg-emerald-950/30 border border-emerald-900/40 hover:bg-emerald-900/40 text-[10px] font-extrabold text-emerald-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        {lang === 'ta' ? "Explain in Tamil" : "Explain in Hindi"}
                      </button>

                      <button 
                        onClick={() => handleSuggestClick("Please provide details of Career Paths aligned with Matrix Transformations & ML architectures")}
                        className="py-1.5 px-3 bg-purple-950/30 border border-purple-900/40 hover:bg-purple-900/40 text-[10px] font-extrabold text-purple-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                        Career Path Suggestion
                      </button>

                      <button 
                        onClick={() => handleSuggestClick("Give me 3 spaced repetition questions for daily calculus recall")}
                        className="py-1.5 px-3 bg-amber-950/30 border border-amber-900/40 hover:bg-amber-900/40 text-[10px] font-extrabold text-amber-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        Spaced Repetition Questions
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isSendingMesssage && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-305 border border-slate-700 flex items-center justify-center text-xs font-bold animate-pulse">
                  A
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800/85 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Ribbon */}
          <div className="px-4 py-2 border-t border-slate-800 flex flex-wrap gap-2 bg-slate-950/30 select-none">
            <button 
              onClick={() => handleSuggestClick("Generate Practice Quiz for matrix dimensions")}
              className="py-1 px-2.5 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-indigo-900/40"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Generate Practice Quiz
            </button>

            <button 
              onClick={() => handleSuggestClick("Explain this matrix concept bilingual in हिन्दी & English")}
              className="py-1 px-2.5 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-emerald-900/40"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Explain in Hindi
            </button>

            <button 
              onClick={() => handleSuggestClick("Please provide details of Career Paths and Relevance aligned with Matrix Transformations")}
              className="py-1 px-2.5 bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-purple-900/40"
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              Career Relevance
            </button>

            <button 
              onClick={() => setShowSpacedRep(true)}
              className="py-1 px-2.5 bg-amber-950/30 hover:bg-amber-900/40 text-amber-305 text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-amber-900/40"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Spaced Repetition Questions
            </button>
          </div>

          {/* User input box */}
          <div className="p-4 border-t border-slate-800 flex gap-2 bg-slate-950/60">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ARKAIV AI about ${userGoal} paths, calculus logic, or code optimization...`}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-indigo-550"
            />
            <button 
              onClick={handleSend}
              disabled={isSendingMesssage || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-lg glow-btn-primary"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </section>

      </div>

      {/* Dynamic Right Column Sidebar: Reading lists, laboratory covers - 4 Cols */}
      <div className="lg:col-span-4 space-y-6">
        {/* Course details outline checklist */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 font-display flex items-center gap-1.5">
            <BookOpen className="w-4.5 h-4.5" />
            Stage Study Core
          </h4>

          <div className="space-y-3.5">
            {[
              { id: '1', title: 'Calculus derivatives and Chain Rule formulation', desc: 'Syllabus Core mathematics mapping gradient descents.', time: '12 min read', link: 'Chain Rule' },
              { id: '2', title: 'Understanding backpropagation in MLP networks', desc: 'Step by step forward values and gradient passes.', time: '18 min read', link: 'Backprop' },
              { id: '3', title: 'Weight adaptation and learning rate schedules', desc: 'Calibrating step parameter values to minimize total loss.', time: '15 min study', link: 'Optimization' }
            ].map(item => (
              <div 
                key={item.id}
                onClick={() => onSendMessage(`Explain ${item.link}`)}
                className="p-3.5 bg-slate-950/60 hover:bg-slate-900/40 hover:border-indigo-505/30 transition-all rounded-xl border border-slate-800 cursor-pointer group"
              >
                <div className="flex justify-between items-center mr-1">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Section {item.id}</span>
                  <span className="text-[10px] font-bold text-indigo-400 group-hover:underline">Quick Read</span>
                </div>
                <p className="font-bold text-xs text-white mt-1 leading-tight group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-350 mt-1 leading-normal">
                  {item.desc}
                </p>
                <p className="text-[10px] font-bold text-indigo-405 mt-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-indigo-400" />
                  +15 XP Awarded
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Labs and images graphic simulation cover container */}
        <section className="bg-gradient-to-br from-indigo-950/80 via-slate-900/80 to-slate-950/80 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-indigo-900/60">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <path d="M10 80 Q 40 10, 80 80 T 150 80" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="15" stroke="#fff" strokeWidth="0.5" />
            </svg>
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-505 bg-emerald-500 text-[10px] font-black uppercase text-white tracking-widest shadow-sm">
              Level {userLevel} Lab
            </div>
            <h4 className="text-xl font-bold font-display leading-tight">
              Interactive Compute Simulator
            </h4>
            <p className="text-xs text-slate-350 leading-relaxed opacity-90">
              Launch actual GPU playground scripts to verify matrix convolutions directly against active syllabus nodes.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => onSendMessage("Launch Compute Playground Lab for Backpropagation")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg border border-indigo-500 hover:border-indigo-400 transition-all active:scale-95 cursor-pointer glow-btn-primary"
              >
                Launch Sandbox Laboratory
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
    </div>
  );
}
