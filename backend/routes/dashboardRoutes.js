import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { getLogs } from '../controllers/logController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const dashboardRoutes = express.Router();
const logsRouter = express.Router();

dashboardRoutes.get('/', protect, admin, getDashboardMetrics);
logsRouter.get('/', protect, admin, getLogs);

export { dashboardRoutes, logsRouter };
