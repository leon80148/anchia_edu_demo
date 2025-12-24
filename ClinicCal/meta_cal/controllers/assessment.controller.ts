
/**
 * 风险评估控制器
 * Assessment Controller
 */

import { Request, Response } from 'express';
import { RiskV4Helper } from '../services/RiskV4Helper';
import { Customer, Assessment, HealthGuide } from '../models';
import { InputData } from '../types/risk.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 为客户创建新的风险评估
 * POST /api/assessments
 */
export const createAssessment = async (req: any, res: any) => {
  try {
    const { customerId, inputData } = req.body as {
      customerId?: string;
      inputData: InputData;
    };

    // 如果提供了 customerId，从数据库获取客户数据
    let customer;
    let finalInputData: InputData = inputData;

    if (customerId) {
      customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: '客户未找到',
        });
      }

      // 合并客户数据和输入数据
      const customerInputData = customer.toInputData();
      finalInputData = { ...customerInputData, ...inputData };

      // 更新客户的最后评估日期
      customer.lastAssessmentDate = new Date();
      await customer.save();
    }

    // 执行风险评估计算
    const outputData = RiskV4Helper.calculateRisk(finalInputData);

    // 保存评估结果到数据库
    const assessment = new Assessment({
      assessmentId: outputData.assessmentId,
      customerId: customerId || null,
      outputData,
      overallRiskLevel: outputData.overallRiskLevel,
      overallRiskScore: outputData.overallRiskScore,
      calculationVersion: outputData.calculationVersion,
    });

    await assessment.save();

    return res.status(201).json({
      success: true,
      data: {
        assessmentId: assessment.assessmentId,
        outputData,
      },
    });
  } catch (error: any) {
    console.error('创建评估失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '创建评估失败',
    });
  }
};

/**
 * 获取评估结果
 * GET /api/assessments/:assessmentId
 */
export const getAssessment = async (req: any, res: any) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findOne({ assessmentId }).populate('customerId');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: '评估未找到',
      });
    }

    return res.json({
      success: true,
      data: assessment,
    });
  } catch (error: any) {
    console.error('获取评估失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '获取评估失败',
    });
  }
};

/**
 * 获取客户的所有评估记录
 * GET /api/customers/:customerId/assessments
 */
export const getCustomerAssessments = async (req: any, res: any) => {
  try {
    const { customerId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const assessments = await Assessment.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Assessment.countDocuments({ customerId });

    return res.json({
      success: true,
      data: assessments,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    console.error('获取客户评估记录失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '获取评估记录失败',
    });
  }
};

/**
 * 生成健康指导报告
 * POST /api/assessments/:assessmentId/guide
 */
export const generateHealthGuide = async (req: any, res: any) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findOne({ assessmentId }).populate('customerId');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: '评估未找到',
      });
    }

    // 生成报告内容
    const reportContent = generateReportContent(assessment.outputData);

    // 创建健康指导记录
    const healthGuide = new HealthGuide({
      guideId: uuidv4(),
      customerId: assessment.customerId,
      assessmentId: assessment.assessmentId,
      reportTitle: `健康风险评估报告 - ${new Date().toLocaleDateString('zh-CN')}`,
      reportContent,
      reportTemplate: 'guideTemp.docx',
    });

    await healthGuide.save();

    return res.status(201).json({
      success: true,
      data: healthGuide,
    });
  } catch (error: any) {
    console.error('生成健康指导报告失败:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '生成报告失败',
    });
  }
};

/**
 * 辅助函数：生成报告内容
 */
function generateReportContent(outputData: any): string {
  let content = '<h1>慢性病风险评估报告</h1>\n';
  content += `<p>评估日期：${new Date(outputData.assessmentDate).toLocaleDateString('zh-CN')}</p>\n`;
  content += `<p>评估ID：${outputData.assessmentId}</p>\n`;

  content += '\n<h2>总体风险评估</h2>\n';
  content += `<p>总体风险等级：<strong>${getRiskLevelText(outputData.overallRiskLevel)}</strong></p>\n`;
  content += `<p>总体风险分数：${outputData.overallRiskScore}/100</p>\n`;

  // 各疾病风险
  if (outputData.diabetesRisk) {
    content += '\n<h2>糖尿病风险</h2>\n';
    content += formatDiseaseRisk(outputData.diabetesRisk);
  }

  if (outputData.hypertensionRisk) {
    content += '\n<h2>高血压风险</h2>\n';
    content += formatDiseaseRisk(outputData.hypertensionRisk);
  }

  if (outputData.strokeRisk) {
    content += '\n<h2>中风风险</h2>\n';
    content += formatDiseaseRisk(outputData.strokeRisk);
  }

  if (outputData.maceRisk) {
    content += '\n<h2>主要心血管不良事件风险</h2>\n';
    content += formatDiseaseRisk(outputData.maceRisk);
  }

  if (outputData.heartDiseaseRisk) {
    content += '\n<h2>心脏病风险</h2>\n';
    content += formatDiseaseRisk(outputData.heartDiseaseRisk);
  }

  // 建议
  content += '\n<h2>总体建议</h2>\n<ul>\n';
  outputData.generalRecommendations.forEach((rec: string) => {
    content += `  <li>${rec}</li>\n`;
  });
  content += '</ul>\n';

  content += '\n<h2>生活方式改善建议</h2>\n<ul>\n';
  outputData.lifestyleModifications.forEach((mod: string) => {
    content += `  <li>${mod}</li>\n`;
  });
  content += '</ul>\n';

  content += '\n<h2>医疗随访建议</h2>\n<ul>\n';
  outputData.medicalFollowUp.forEach((follow: string) => {
    content += `  <li>${follow}</li>\n`;
  });
  content += '</ul>\n';

  return content;
}

function formatDiseaseRisk(risk: any): string {
  let content = `<p>风险等级：<strong>${getRiskLevelText(risk.riskLevel)}</strong></p>\n`;
  content += `<p>风险分数：${risk.riskScore}/100</p>\n`;
  if (risk.tenYearRisk) {
    content += `<p>10年风险：${risk.tenYearRisk.toFixed(1)}%</p>\n`;
  }

  content += '<h3>风险因素</h3>\n<ul>\n';
  risk.factors.forEach((factor: any) => {
    content += `  <li>${factor.name}：${factor.value} - ${factor.description}</li>\n`;
  });
  content += '</ul>\n';

  content += '<h3>建议</h3>\n<ul>\n';
  risk.recommendations.forEach((rec: string) => {
    content += `  <li>${rec}</li>\n`;
  });
  content += '</ul>\n';

  return content;
}

function getRiskLevelText(level: string): string {
  const levelMap: Record<string, string> = {
    LOW: '低风险',
    MEDIUM: '中风险',
    HIGH: '高风险',
    VERY_HIGH: '极高风险',
  };
  return levelMap[level] || level;
}
