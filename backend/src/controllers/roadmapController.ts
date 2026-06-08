import { Response, NextFunction } from 'express';
import Roadmap from '../models/Roadmap';
import { AuthRequest } from '../middleware/auth';

export async function getRoadmaps(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    next(err);
  }
}

export async function createRoadmap(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { goal, targetDate, level, duration, commitment } = req.body;
    if (!goal) {
      res.status(400).json({ error: 'Goal is required' });
      return;
    }

    const roadmap = await Roadmap.create({
      userId: req.user!.userId,
      goal,
      level,
      duration,
      commitment,
      steps: [],
    });

    res.status(201).json(roadmap);
  } catch (err) {
    next(err);
  }
}

export async function updateRoadmap(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!roadmap) {
      res.status(404).json({ error: 'Roadmap not found' });
      return;
    }

    res.json(roadmap);
  } catch (err) {
    next(err);
  }
}

export async function updateStepStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roadmapId, stepId } = req.params;
    const { completed } = req.body;

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user!.userId });
    if (!roadmap) {
      res.status(404).json({ error: 'Roadmap not found' });
      return;
    }

    const step = (roadmap.steps as any[]).find((s: any) => s._id.toString() === stepId);
    if (!step) {
      res.status(404).json({ error: 'Step not found' });
      return;
    }

    step.completed = completed;

    const completedSteps = roadmap.steps.filter((s: any) => s.completed).length;
    const totalSteps = roadmap.steps.length;
    roadmap.progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    next(err);
  }
}