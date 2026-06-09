import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  chatWithAI,
  generateRoadmap,
  generateQuiz,
  generatePerformanceReview,
} from '../services/aiService';

/**
 * POST /api/ai/chat
 * Body: { message, previousMessages, userGoal, userLevel, context }
 */
export async function chat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message, previousMessages, userGoal, userLevel, context } = req.body;
    if (!message) {
      res.status(400).json({ error: 'message is required' });
      return;
    }
    const text = await chatWithAI(message, previousMessages, userGoal, userLevel, context);
    res.json({ text, mode: process.env.GEMINI_API_KEY ? 'gemini' : 'simulated' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/generate-roadmap
 * Body: { goal, duration, level }
 */
export async function generateAIRoadmap(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { goal, duration, level } = req.body;
    if (!goal) {
      res.status(400).json({ error: 'goal is required' });
      return;
    }
    const steps = await generateRoadmap(goal, duration || '90', level || 'Intermediate');
    res.json({ steps });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/generate-quiz
 * Body: { topic, difficulty, numQuestions }
 */
export async function generateAIQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { topic, difficulty, numQuestions } = req.body;
    if (!topic) {
      res.status(400).json({ error: 'topic is required' });
      return;
    }
    const questions = await generateQuiz(topic, difficulty || 'medium', numQuestions || 5);
    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/review
 * Generates a personal performance review for the user based on their recent activity.
 */
export async function review(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // In a real implementation, we'd query the user's tasks, quizzes, and study sessions.
    const stats = {
      tasksCompleted: 0,
      tasksTotal: 0,
      quizzesPassed: 0,
      studyHours: 0,
      streak: 0,
    };
    const text = await generatePerformanceReview(req.user!.userId, stats);
    res.json({ review: text });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/evaluate
 * Body: { fileName, selectedMissionId, userGoal }
 *
 * Compatibility endpoint for the legacy EvaluationView component. It runs a
 * deterministic task-similarity check and returns the same 5-dimensional
 * NEP-2020 rubric used by the old root /server.ts.
 */
export async function evaluateSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      fileName = '',
      selectedMissionId = 'm1',
      userGoal = 'Full-Stack Developer',
    } = req.body;

    // Map of active mission/task constraints
    const tasksMap: Record<string, { title: string; keywords: string[]; domain: string; defaultFile: string }> = {
      m1: {
        title: 'Implement Binary Search Tree with traversal methods',
        keywords: ['bst', 'binary', 'tree', 'traversal', 'node', 'search'],
        domain: 'Data Structures & Algorithms',
        defaultFile: 'bst_traversal.py',
      },
      m2: {
        title: 'Create REST API for User Authentication',
        keywords: ['auth', 'api', 'jwt', 'login', 'register', 'express', 'backend'],
        domain: 'Backend Engineering',
        defaultFile: 'auth_routes.js',
      },
      m3: {
        title: 'Design Database Schema for E-commerce App',
        keywords: ['schema', 'database', 'sql', 'postgres', 'mongodb', 'ecom', 'tables'],
        domain: 'Database Systems',
        defaultFile: 'ecommerce_schema.sql',
      },
      m4: {
        title: 'Solve 5 LeetCode problems on Dynamic Programming',
        keywords: ['dp', 'dynamic', 'leetcode', 'knapsack', 'fibonacci', 'memoization'],
        domain: 'DP & Competitive Programming',
        defaultFile: 'leetcode_dp_solutions.py',
      },
    };

    const task = tasksMap[selectedMissionId] || tasksMap.m1;
    const lowerName = fileName.toLowerCase();

    const isRecipe = lowerName.includes('recipe') || lowerName.includes('food');
    const isUnrelated = lowerName.includes('unrelated') || lowerName.includes('feedback') || lowerName.includes('recipe');
    const matchesKeyword = task.keywords.some((kw) => lowerName.includes(kw));
    const isMatch = matchesKeyword && !isUnrelated && !isRecipe;

    if (!isMatch) {
      res.json({
        fileName,
        selectedTaskId: selectedMissionId,
        selectedTaskName: task.title,
        isMatch: false,
        grade: 'Not Graded',
        scores: {
          understanding: 1.0,
          conceptualClarity: 1.0,
          execution: 0.0,
          nepCompliance: 1.0,
          careerRelevance: 0.0,
        },
        feedback: `This submission does not match the selected task: '${task.title}'.`,
        reasons: [
          `Uploaded file name '${fileName}' does not contain domain-specific metrics for our core study task in '${task.domain}'.`,
          `Fails to demonstrate the expected learning benchmarks (missing signature components: ${task.keywords.slice(0, 3).join(', ')}).`,
          'Our system sandbox halted checking because of an off-topic files audit. Double check your selected active task from Today\'s To-Do list.',
        ],
      });
      return;
    }

    // Successful review templates for each task
    if (selectedMissionId === 'm1') {
      res.json({
        fileName,
        selectedTaskId: selectedMissionId,
        selectedTaskName: task.title,
        isMatch: true,
        grade: 'A (92/100)',
        scores: {
          understanding: 9.5,
          conceptualClarity: 9.0,
          execution: 9.5,
          nepCompliance: 9.0,
          careerRelevance: 9.0,
        },
        feedback: 'Excellent work on BST. Tree creation and recursion checks are fully optimized.',
        insights: [
          {
            title: 'Strengths (Recursive Depth)',
            desc: 'Brilliant recursive implementation of Inorder, Preorder, and Postorder traversals. Stack space complexity is handled well at O(H) recursion height.',
          },
          {
            title: 'Weaknesses & Room for Improvement (Balance Factor)',
            desc: 'For highly skewed input keys, your tree degenerates to a linked list. Consider upgrading this implementation to a self-balancing AVL or Red-Black Tree in the next module.',
          },
          {
            title: 'NEP-2020 Compliance Diagnostic',
            desc: 'Exhibits exceptional mental model clarity. Matches the technical core credit guidelines under National Framework tier III.',
          },
        ],
      });
      return;
    }

    if (selectedMissionId === 'm2') {
      res.json({
        fileName,
        selectedTaskId: selectedMissionId,
        selectedTaskName: task.title,
        isMatch: true,
        grade: 'B+ (85/100)',
        scores: {
          understanding: 8.5,
          conceptualClarity: 8.0,
          execution: 9.0,
          nepCompliance: 8.5,
          careerRelevance: 9.0,
        },
        feedback: 'Express routes and JWT validation are fully operational. Passwords must be hashed.',
        insights: [
          {
            title: 'Strengths (Endpoint Modularity)',
            desc: 'Well-structured routes (/api/auth/register and /api/auth/login) using Express Router. JWT payload extraction is robust.',
          },
          {
            title: 'Weaknesses & Room for Improvement (Cryptographic Leak)',
            desc: 'You are storing password credentials in plain-text prior to DB insertions. Use bcrypt with at least 10 salt rounds to defend against database credential dumps.',
          },
          {
            title: 'NEP-2020 Compliance Diagnostic',
            desc: 'Meets application-oriented skill quotas. Satisfies foundational compliance benchmarks for industrial backend systems.',
          },
        ],
      });
      return;
    }

    if (selectedMissionId === 'm3') {
      res.json({
        fileName,
        selectedTaskId: selectedMissionId,
        selectedTaskName: task.title,
        isMatch: true,
        grade: 'B (80/100)',
        scores: {
          understanding: 8.0,
          conceptualClarity: 7.5,
          execution: 8.5,
          nepCompliance: 8.0,
          careerRelevance: 8.5,
        },
        feedback: 'Clean schema layouts. Relational normalization is correct, but indexing must be declared.',
        insights: [
          {
            title: 'Strengths (Entity Separation)',
            desc: 'Proper third normal form (3NF) breakdown for Users, Products, Orders, and Items. Logical foreign key references are declared correctly.',
          },
          {
            title: 'Weaknesses & Room for Improvement (Query Bottlenecks)',
            desc: 'Your orders database lacks query indexes on userId or orderDate. Highly nested joins will cause serious database timeouts as order counts grow.',
          },
          {
            title: 'NEP-2020 Compliance Diagnostic',
            desc: 'Direct verification of database systems competence. Complies with industry-grade schema design rules.',
          },
        ],
      });
      return;
    }

    if (selectedMissionId === 'm4') {
      res.json({
        fileName,
        selectedTaskId: selectedMissionId,
        selectedTaskName: task.title,
        isMatch: true,
        grade: 'A+ (96/100)',
        scores: {
          understanding: 9.8,
          conceptualClarity: 9.5,
          execution: 9.5,
          nepCompliance: 9.5,
          careerRelevance: 9.8,
        },
        feedback: 'Outstanding DP problem solving. Space complexity optimizations are elegant.',
        insights: [
          {
            title: 'Strengths (Optimal Substructure)',
            desc: 'Flawless transitions mapped from recursion to top-down memoization, and then to bottom-up 1D/2D arrays. Optimized space from O(N) to O(1) where possible.',
          },
          {
            title: 'Weaknesses & Room for Improvement (Boundary Cases)',
            desc: 'A small subset of extreme edge cases (negative weights, large integer limits) should be handled with standard validation checks.',
          },
          {
            title: 'NEP-2020 Compliance Diagnostic',
            desc: 'Reflects superb mastery of algorithmic principles. Directly targets advanced product development standards.',
          },
        ],
      });
      return;
    }

    // Default fallback
    res.json({
      fileName,
      selectedTaskId: selectedMissionId,
      selectedTaskName: task.title,
      isMatch: true,
      grade: 'A- (86/100)',
      scores: {
        understanding: 8.5,
        conceptualClarity: 8.0,
        execution: 9.0,
        nepCompliance: 8.5,
        careerRelevance: 9.0,
      },
      insights: [
        {
          title: 'Strengths (Accurate Execution)',
          desc: 'Excellent front-end execution using Tailwind CSS responsive viewport utilities. Viewport resizing behaviors are fully fluid and CSS component definitions show high standard of craftsmanship.',
        },
        {
          title: 'Weaknesses & Room for Improvement (Concept Gap)',
          desc: 'State persistence is incomplete. Your routing is transient and lacks server-side session hooks. Let me be clear: a dashboard without a persistent storage layer or request cache policies is not production-ready.',
        },
        {
          title: 'NEP-2020 Compliance Diagnostic',
          desc: 'Meets high competency standards of the National Credit Framework for practical integration.',
        },
      ],
    });
  } catch (err) {
    next(err);
  }
}
