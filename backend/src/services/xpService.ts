import User from '../models/User';

const XP_RULES: Record<string, number> = {
  easy_task: 10,
  medium_task: 25,
  hard_task: 50,
  quiz_passed: 40,
  study_session: 20,
};

export const addXP = async (userId: string, action: string): Promise<{ xp: number; level: number; leveledUp: boolean }> => {
  const xpReward = XP_RULES[action];
  if (!xpReward) {
    throw new Error(`Unknown action: ${action}`);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.xp += xpReward;

  // Calculate level based on XP formula: XP_required = 100 × Level
  const newLevel = Math.floor(user.xp / 100) + 1;
  const leveledUp = newLevel > user.level;
  user.level = newLevel;

  await user.save();

  return { xp: user.xp, level: user.level, leveledUp };
};

export const getLevelProgress = (xp: number): { currentLevel: number; xpForNextLevel: number; progress: number } => {
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpForNextLevel = 100 * currentLevel;
  const currentLevelXp = (currentLevel - 1) * 100;
  const progress = ((xp - currentLevelXp) / (xpForNextLevel - currentLevelXp)) * 100;

  return { currentLevel, xpForNextLevel, progress: Math.min(progress, 100) };
};