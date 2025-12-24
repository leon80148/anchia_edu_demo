/**
 * 风险评估类型定义
 * Risk Assessment Type Definitions
 */

/**
 * 性别枚举 / Gender Enum
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * 风险等级枚举 / Risk Level Enum
 */
export enum RiskLevel {
  LOW = 'LOW',           // 低风险
  MEDIUM = 'MEDIUM',     // 中风险
  HIGH = 'HIGH',         // 高风险
  VERY_HIGH = 'VERY_HIGH', // 极高风险
}

/**
 * 疾病类型枚举 / Disease Type Enum
 */
export enum DiseaseType {
  DIABETES = 'DIABETES',           // 糖尿病
  HYPERTENSION = 'HYPERTENSION',   // 高血压
  STROKE = 'STROKE',               // 中风
  MACE = 'MACE',                   // 主要心血管不良事件
  HEART_DISEASE = 'HEART_DISEASE', // 心脏病
}

/**
 * 输入数据接口 / Input Data Interface
 * 对应 Java 的 InputData.class
 */
export interface InputData {
  // 基本信息 / Basic Information
  age: number;                    // 年龄
  gender: Gender;                 // 性别
  height?: number;                // 身高 (cm)
  weight?: number;                // 体重 (kg)
  bmi?: number;                   // 身体质量指数 BMI

  // 生命体征 / Vital Signs
  systolicBP?: number;            // 收缩压 (mmHg)
  diastolicBP?: number;           // 舒张压 (mmHg)
  heartRate?: number;             // 心率 (bpm)

  // 实验室指标 / Laboratory Values
  fastingGlucose?: number;        // 空腹血糖 (mg/dL)
  hba1c?: number;                 // 糖化血红蛋白 (%)
  totalCholesterol?: number;      // 总胆固醇 (mg/dL)
  ldlCholesterol?: number;        // 低密度脂蛋白胆固醇 (mg/dL)
  hdlCholesterol?: number;        // 高密度脂蛋白胆固醇 (mg/dL)
  triglycerides?: number;         // 甘油三酯 (mg/dL)
  creatinine?: number;            // 肌酐 (mg/dL)

  // 病史 / Medical History
  hasDiabetes?: boolean;          // 是否有糖尿病
  hasHypertension?: boolean;      // 是否有高血压
  hasHeartDisease?: boolean;      // 是否有心脏病
  hasStroke?: boolean;            // 是否有中风史
  familyHistoryDiabetes?: boolean; // 糖尿病家族史
  familyHistoryHeartDisease?: boolean; // 心脏病家族史
  familyHistoryStroke?: boolean;  // 中风家族史

  // 生活方式 / Lifestyle Factors
  isSmoker?: boolean;             // 是否吸烟
  smokeYears?: number;            // 吸烟年数
  smokesPerDay?: number;          // 每日吸烟量
  alcoholConsumption?: number;    // 饮酒量 (drinks/week)
  exerciseMinutesPerWeek?: number; // 每周运动时间 (分钟)

  // 用药情况 / Medications
  onHypertensionMeds?: boolean;   // 是否服用降压药
  onDiabetesMeds?: boolean;       // 是否服用降糖药
  onStatins?: boolean;            // 是否服用他汀类药物
}

/**
 * 单个疾病风险评估结果 / Individual Disease Risk Result
 */
export interface DiseaseRiskResult {
  diseaseType: DiseaseType;       // 疾病类型
  riskScore: number;              // 风险分数 (0-100)
  riskPercentage: number;         // 风险百分比 (%)
  riskLevel: RiskLevel;           // 风险等级
  tenYearRisk?: number;           // 10年风险 (%)
  factors: RiskFactor[];          // 风险因素列表
  recommendations: string[];      // 建议列表
}

/**
 * 风险因素 / Risk Factor
 */
export interface RiskFactor {
  name: string;                   // 因素名称
  value: number | string | boolean; // 因素值
  weight: number;                 // 权重/影响程度 (0-1)
  description: string;            // 描述
}

/**
 * 输出数据接口 / Output Data Interface
 * 对应 Java 的 OutputData.class
 */
export interface OutputData {
  // 基本信息
  assessmentId: string;           // 评估 ID
  assessmentDate: Date;           // 评估日期

  // 输入数据引用
  inputData: InputData;           // 原始输入数据

  // 各项疾病风险评估结果
  diabetesRisk?: DiseaseRiskResult;     // 糖尿病风险
  hypertensionRisk?: DiseaseRiskResult; // 高血压风险
  strokeRisk?: DiseaseRiskResult;       // 中风风险
  maceRisk?: DiseaseRiskResult;         // MACE 风险
  heartDiseaseRisk?: DiseaseRiskResult; // 心脏病风险

  // 综合评估
  overallRiskLevel: RiskLevel;    // 总体风险等级
  overallRiskScore: number;       // 总体风险分数 (0-100)

  // 建议和指导
  generalRecommendations: string[]; // 总体建议
  lifestyleModifications: string[]; // 生活方式改善建议
  medicalFollowUp: string[];        // 医疗随访建议

  // 元数据
  calculationVersion: string;     // 计算算法版本 (e.g., "v4")
  metadata?: Record<string, any>; // 其他元数据
}

/**
 * 批量评估命令 / Batch Assessment Command
 */
export interface BatchCommand {
  commandId: string;              // 命令 ID
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRecords: number;           // 总记录数
  processedRecords: number;       // 已处理记录数
  failedRecords: number;          // 失败记录数
  inputFile?: string;             // 输入文件路径
  outputFile?: string;            // 输出文件路径
  createdAt: Date;                // 创建时间
  completedAt?: Date;             // 完成时间
  errorMessage?: string;          // 错误信息
}

/**
 * 健康指导报告 / Health Guidance Report
 */
export interface HealthGuide {
  guideId: string;                // 指导 ID
  customerId: string;             // 客户 ID
  assessmentId: string;           // 评估 ID
  outputData: OutputData;         // 评估输出数据
  reportTemplate: string;         // 报告模板名称
  generatedReport?: string;       // 生成的报告内容 (HTML/DOCX)
  createdAt: Date;                // 创建时间
}
