import Streak from '../models/Streak';
import User from '../models/User';

export const updateStreak = async (userId: string): Promise<{ currentStreak: number; longestStreak: number }> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await Streak.findOne({ userId });

  if (!streak) {
    streak = await Streak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
    });

    // Update user streak field
    await User.findByIdAndUpdate(userId, { streak: 1 });
    return { currentStreak: 1, longestStreak: 1 };
  }

  const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive && lastActive.getTime() === today.getTime()) {
    // Already active today, no change needed
    return { currentStreak: streak.currentStreak, longestStreak: streak.longestStreak };
  }

  if (lastActive && lastActive.getTime() === yesterday.getTime()) {
    // Consecutive day - increment streak
    streak.currentStreak += 1;
    streak.graceDaysUsed = 0; // reset grace days on consecutive activity
  } else if (lastActive && lastActive.getTime() < yesterday.getTime()) {
    // Missed a day - check grace days
    if (streak.graceDaysUsed < streak.graceDaysLimit) {
      streak.graceDaysUsed += 1;
      // Streak continues with grace day
    } else {
      // Reset streak
      streak.currentStreak = 1;
      streak.graceDaysUsed = 0;
    }
  }

  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastActiveDate = today;
  await streak.save();

  // Update user streak field
  await User.findByIdAndUpdate(userId, { streak: streak.currentStreak });

  return { currentStreak: streak.currentStreak, longestStreak: streak.longestStreak };
};

export const getStreak = async (userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  graceDaysUsed: number;
  graceDaysLimit: number;
}> => {
  let streak = await Streak.findOne({ userId });

  if (!streak) {
    streak = await Streak.create({ userId });
  }

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    graceDaysUsed: streak.graceDaysUsed,
    graceDaysLimit: streak.graceDaysLimit,
  };
};