import User from '../models/User';

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForLevel = (level: number): number => {
  return level * 100;
};

export const getLevelInfo = async (userId: string): Promise<{
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  xpProgress: number;
}> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const currentLevel = user.level;
  const xpForNextLevel = getXPForLevel(currentLevel);
  const currentLevelXp = (currentLevel - 1) * 100;
  const xpProgress = ((user.xp - currentLevelXp) / (xpForNextLevel - currentLevelXp)) * 100;

  return {
    currentLevel,
    currentXP: user.xp,
    xpForNextLevel,
    xpProgress: Math.min(xpProgress, 100),
  };
};