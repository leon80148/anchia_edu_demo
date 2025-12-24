
/**
 * 客户管理控制器
 * Customer Controller
 */

import { Request, Response } from 'express';
import { Customer } from '../models';

/**
 * 创建新客户
 * POST /api/customers
 */
export const createCustomer = async (req: any, res: any) => {
  try {
    const customerData = req.body;

    // 计算年龄（如果提供了出生日期）
    if (customerData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(customerData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      customerData.age = age;
    }

    // 计算 BMI（如果提供了身高和体重）
    if (customerData.height && customerData.weight) {
      const heightInMeters = customerData.height / 100;
      customerData.bmi = customerData.weight / (heightInMeters * heightInMeters);
    }

    // 生成全名
    customerData.fullName = `${customerData.lastName}${customerData.firstName}`;

    const customer = new Customer(customerData);
    await customer.save();

    return res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    console.error('创建客户失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '创建客户失败',
    });
  }
};

/**
 * 获取客户信息
 * GET /api/customers/:id
 */
export const getCustomer = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '客户未找到',
      });
    }

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    console.error('获取客户失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '获取客户失败',
    });
  }
};

/**
 * 获取所有客户列表
 * GET /api/customers
 */
export const getCustomers = async (req: any, res: any) => {
  try {
    const { limit = 20, skip = 0, search } = req.query;

    const query: any = {};

    // 搜索功能
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Customer.countDocuments(query);

    return res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    console.error('获取客户列表失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '获取客户列表失败',
    });
  }
};

/**
 * 更新客户信息
 * PUT /api/customers/:id
 */
export const updateCustomer = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 重新计算年龄和 BMI（如果相关字段被更新）
    if (updates.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(updates.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      updates.age = age;
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '客户未找到',
      });
    }

    if (updates.height || updates.weight) {
      const height = updates.height || customer.height;
      const weight = updates.weight || customer.weight;
      if (height && weight) {
        const heightInMeters = height / 100;
        updates.bmi = weight / (heightInMeters * heightInMeters);
      }
    }

    // 更新全名
    if (updates.firstName || updates.lastName) {
      const firstName = updates.firstName || customer.firstName;
      const lastName = updates.lastName || customer.lastName;
      updates.fullName = `${lastName}${firstName}`;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({
      success: true,
      data: updatedCustomer,
    });
  } catch (error: any) {
    console.error('更新客户失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '更新客户失败',
    });
  }
};

/**
 * 删除客户
 * DELETE /api/customers/:id
 */
export const deleteCustomer = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '客户未找到',
      });
    }

    return res.json({
      success: true,
      message: '客户已删除',
    });
  } catch (error: any) {
    console.error('删除客户失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '删除客户失败',
    });
  }
};
