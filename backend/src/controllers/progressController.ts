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
      { $set: { ...data, userId: req.user!.userId } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(progress);
  } catch (err) {
    next(err);
  }
}

// Backwards-compatible alias
export const updateProgress = saveProgress;

/**
 * Upload a marksheet file (PDF/Image) and record its name on the progress doc.
 * POST /api/progress/upload-marksheet
 */
export async function uploadMarksheet(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = (req as any).file;
    const fileName = file?.originalname || req.body?.fileName || 'marksheet.pdf';

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user!.userId },
      {
        $set: {
          userId: req.user!.userId,
          marksheetUploaded: true,
          marksheetName: fileName,
        },
      },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (err) {
    next(err);
  }
}

/**
 * Stub for syncing against a government platform (SWAYAM/DIKSHA/NCERT).
 * Persists the last synced platform name to the progress doc.
 * POST /api/progress/sync-platform
 */
export async function syncGovernmentPlatform(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { platform } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user!.userId },
      {
        $set: {
          userId: req.user!.userId,
          marksheetUploaded: true,
          marksheetName: `${platform || 'PLATFORM'}_Academic_Snapshot_Sync.json`,
        },
      },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    next(err);
  }
}
