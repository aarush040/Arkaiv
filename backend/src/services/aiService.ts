import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY is not defined or is placeholder.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export const generateRoadmap = async (goal: string, duration: string, level: string): Promise<any[]> => {
  const ai = getGemini();

  if (!ai) {
    // Return simulated roadmap
    const steps = [
      { title: 'Fundamentals', description: `Learn the basics of ${goal}`, order: 1, completed: false },
      { title: 'Core Concepts', description: 'Deep dive into core topics', order: 2, completed: false },
      { title: 'Advanced Topics', description: 'Master advanced concepts', order: 3, completed: false },
      { title: 'Projects', description: 'Build real-world projects', order: 4, completed: false },
      { title: 'Review & Optimize', description: 'Review and optimize your learning', order: 5, completed: false },
    ];
    return steps;
  }

  try {
    const prompt = `Generate a structured ${duration}-day learning roadmap for "${goal}" at ${level} level. 
Return a JSON array of steps with title, description (2-3 sentences), and order. Each step should be a milestone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '[]';
    // Attempt to parse JSON from the response
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return [];
  }
};

export const generateQuiz = async (topic: string, difficulty: string, numQuestions: number = 5): Promise<any[]> => {
  const ai = getGemini();

  if (!ai) {
    // Simulated quiz
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        question: `Sample question ${i + 1} about ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
      });
    }
    return questions;
  }

  try {
    const prompt = `Generate ${numQuestions} ${difficulty} difficulty multiple-choice questions about "${topic}".
Return ONLY a JSON array of objects with fields: question (string), options (array of 4 strings), correctAnswer (index 0-3).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '[]';
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    return [];
  }
};

export const generatePerformanceReview = async (
  userId: string,
  stats: { tasksCompleted: number; tasksTotal: number; quizzesPassed: number; studyHours: number; streak: number }
): Promise<string> => {
  const ai = getGemini();

  const completionRate = stats.tasksTotal > 0 ? ((stats.tasksCompleted / stats.tasksTotal) * 100).toFixed(0) : 0;

  if (!ai) {
    return `Performance Review Summary:
- Task completion rate: ${completionRate}%
- Quizzes passed: ${stats.quizzesPassed}
- Study hours: ${stats.studyHours}
- Current streak: ${stats.streak} days

Strong areas: Consistency in daily learning
Areas for improvement: Try to increase revision frequency
Recommendation: Add 20 minutes of revision to your daily routine.`;
  }

  try {
    const prompt = `You are an AI academic coach. Review this student's performance:
- Tasks completed: ${stats.tasksCompleted}/${stats.tasksTotal} (${completionRate}%)
- Quizzes passed: ${stats.quizzesPassed}
- Study hours: ${stats.studyHours}
- Current streak: ${stats.streak} days

Provide a concise performance review with:
1. Strong areas (2-3 points)
2. Weak areas (2-3 points)
3. Specific recommendations for improvement
4. Next milestone suggestion`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text || 'Review could not be generated.';
  } catch (error) {
    console.error('Error generating review:', error);
    return 'Review service temporarily unavailable. Please try again later.';
  }
};

export const chatWithAI = async (
  message: string,
  previousMessages: Array<{ sender: string; text: string }>,
  userGoal: string,
  userLevel: string,
  context: string
): Promise<string> => {
  const ai = getGemini();

  const systemPrompt = `You are ARKAIV AI, a strict, no-nonsense academic coach and study mentor.
The student is working on their roadmap.
Current Goal: ${userGoal || 'AI Engineer'}
User Skill Level: ${userLevel || 'Intermediate'}
Current Context: ${context || 'Roadmap & Study Review'}

Behavioral Mandates:
1. ABSOLUTELY NO FLUFF, no generic "Good job!" or standard superficial encouragement. Keep it professional, objective, and demanding.
2. Focus strictly on learning outcomes, mathematical/conceptual precision, and academic rigour.
3. Be highly critical when the student gives incomplete explanations, wrong answers, or shows low effort. Address the mistake directly, correct it, and ask a follow-up check.
4. Push students with step-by-step corrections, follow-up concepts, and targeted questions.
5. Keep responses highly structured, concise (2-4 clear paragraphs or clean lists), and reference their professional goal (${userGoal}) to maintain academic accountability.`;

  if (!ai) {
    // Simulated response based on keywords
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('chain rule') || lowerMsg.includes('derivative') || lowerMsg.includes('calculus')) {
      return `Let's examine the chain rule with precision. The chain rule states: dy/dx = dy/du * du/dx. This fundamental calculus principle is the backbone of backpropagation in neural networks.

Consider f(x) = sin(x²):
1. Inner function u = x², du/dx = 2x
2. Outer function y = sin(u), dy/du = cos(u)
3. Chain: dy/dx = cos(x²) * 2x

This exact mechanism powers gradient descent in deep learning. Can you apply this to find the gradient of f(x) = e^(2x) * cos(x)?`;
    }
    return `I'm your AI academic coach. Let's focus on your goal: ${userGoal}.

Current context: ${context}

What specific topic or problem would you like to work on? I can help with:
1. Explaining concepts with precise examples
2. Generating practice problems
3. Reviewing your understanding
4. Creating study plans

Be specific with your request for the most effective session.`;
  }

  try {
    const contents: any[] = [];

    if (previousMessages && Array.isArray(previousMessages)) {
      previousMessages.forEach((msg) => {
        contents.push({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
      },
    });

    return response.text || "Let's refine your question and try again with more precision.";
  } catch (error) {
    console.error('AI chat error:', error);
    return 'AI service temporarily unavailable. Please try again later.';
  }
};