import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// POST /api/tasks - Create a new task (protected)
router.post('/', authenticateJWT, createTask);

// GET /api/tasks - Get all tasks for user (protected)
router.get('/', authenticateJWT, getTasks);

// PUT /api/tasks/:id - Update a task (protected)
router.put('/:id', authenticateJWT, updateTask);

// DELETE /api/tasks/:id - Delete a task (protected)
router.delete('/:id', authenticateJWT, deleteTask);

export default router;