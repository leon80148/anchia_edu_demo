/**
 * 风险评估路由
 * Assessment Routes
 */

import { Router } from 'express';
import * as assessmentController from '../controllers/assessment.controller';

const router = Router();

// 创建新的风险评估
router.post('/', assessmentController.createAssessment);

// 获取评估结果
router.get('/:assessmentId', assessmentController.getAssessment);

// 生成健康指导报告
router.post('/:assessmentId/guide', assessmentController.generateHealthGuide);

export default router;
