export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  goal: string;
  level: string;
  commitment: number;
  duration: number;
  streak: number;
  xp: number;
}

export type TabName = 'dashboard' | 'roadmap' | 'ai-mentor' | 'evaluation' | 'progress-insights';

export interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
  lessonsCompleted?: number;
  lessonsTotal?: number;
}

export interface DailyMission {
  id: string;
  title: string;
  category: string;
  duration: string;
  status: 'DONE' | 'PENDING' | 'UPCOMING';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  code?: string;
  diagram?: boolean;
}

export interface Submission {
  id: string;
  name: string;
  size: string;
  timeAgo: string;
  type: 'doc' | 'link';
  status: 'completed' | 'pending' | 'failed';
  taskName?: string;
  overallScore?: string;
  scores?: {
    understanding: number;
    conceptualClarity: number;
    execution: number;
    nepCompliance: number;
    careerRelevance: number;
    nepRubricScore?: number;
  };
  highestArea?: string;
  lackedArea?: string;
  feedback?: string;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  desc: string;
  status: 'earned' | 'locked';
  color: string;
}
