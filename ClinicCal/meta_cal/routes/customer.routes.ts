/**
 * 客户管理路由
 * Customer Routes
 */

import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import * as assessmentController from '../controllers/assessment.controller';

const router = Router();

// 客户管理
router.post('/', customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// 获取客户的评估记录
router.get('/:customerId/assessments', assessmentController.getCustomerAssessments);

export default router;
