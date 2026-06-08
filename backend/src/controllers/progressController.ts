import { Response, NextFunction } from 'express';
import Progress from '../models/Progress';
import { AuthRequest } from '../middleware/auth';

export async function getProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    let progress = await Progress.findOne({ userId: req.user!.userId });
    if (!progress) {
      // Return empty progress if none exists
      res.json({});
      return;
    }
    res.json(progress);
  } catch (err) {
    next(err);
  }
}

export async function saveProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user!.userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(progress);
  } catch (err) {
    next(err);
  }
}