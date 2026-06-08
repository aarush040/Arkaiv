import { Response, NextFunction } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tasks = await Task.find({ userId: req.user!.userId }).sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, description, category, difficulty, duration, dueDate } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const count = await Task.countDocuments({ userId: req.user!.userId });
    const task = await Task.create({
      userId: req.user!.userId,
      title,
      description,
      category,
      difficulty: difficulty || 'medium',
      duration,
      dueDate,
      order: count,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}