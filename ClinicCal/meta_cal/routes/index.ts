/**
 * 路由索引
 * Routes Index
 */

import { Router } from 'express';
import customerRoutes from './customer.routes';
import assessmentRoutes from './assessment.routes';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/assessments', assessmentRoutes);

// 健康检查端点
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Meta Risk Calculator API',
  });
});

export default router;
