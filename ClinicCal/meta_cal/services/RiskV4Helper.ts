/**
 * RiskV4Helper - 风险评估计算引擎 (版本 4)
 * Risk Assessment Calculation Engine (Version 4)
 *
 * 对应 Java 的 demo.reactAdmin.nhri.RiskV4Helper
 *
 * 基于常见的慢性病风险评估算法：
 * - Framingham Risk Score (心血管风险)
 * - ASCVD Risk Calculator (动脉粥样硬化性心血管疾病)
 * - UKPDS Risk Engine (糖尿病并发症)
 * - JNC/ACC/AHA Guidelines (高血压风险)
 */

import {
  InputData,
  OutputData,
  DiseaseRiskResult,
  DiseaseType,
  RiskLevel,
  RiskFactor,
  Gender,
} from '../types/risk.types';
import { v4 as uuidv4 } from 'uuid';

export class RiskV4Helper {
  private static readonly CALCULATION_VERSION = 'v4.0.0';

  /**
   * 主要的风险评估计算方法
   * Main risk assessment calculation method
   */
  public static calculateRisk(input: InputData): OutputData {
    // 验证输入数据
    this.validateInput(input);

    // 计算 BMI（如果未提供）
    const bmi = input.bmi || this.calculateBMI(input.height, input.weight);

    // 创建增强的输入数据
    const enrichedInput: InputData = {
      ...input,
      bmi,
    };

    // 计算各项疾病风险
    const diabetesRisk = this.calculateDiabetesRisk(enrichedInput);
    const hypertensionRisk = this.calculateHypertensionRisk(enrichedInput);
    const strokeRisk = this.calculateStrokeRisk(enrichedInput);
    const maceRisk = this.calculateMACERisk(enrichedInput);
    const heartDiseaseRisk = this.calculateHeartDiseaseRisk(enrichedInput);

    // 计算总体风险
    const overallRiskScore = this.calculateOverallRisk([
      diabetesRisk,
      hypertensionRisk,
      strokeRisk,
      maceRisk,
      heartDiseaseRisk,
    ]);

    const overallRiskLevel = this.scoreToRiskLevel(overallRiskScore);

    // 生成建议
    const generalRecommendations = this.generateGeneralRecommendations(
      enrichedInput,
      overallRiskLevel
    );
    const lifestyleModifications = this.generateLifestyleModifications(enrichedInput);
    const medicalFollowUp = this.generateMedicalFollowUp(
      enrichedInput,
      overallRiskLevel
    );

    // 构建输出数据
    const output: OutputData = {
      assessmentId: uuidv4(),
      assessmentDate: new Date(),
      inputData: enrichedInput,
      diabetesRisk,
      hypertensionRisk,
      strokeRisk,
      maceRisk,
      heartDiseaseRisk,
      overallRiskLevel,
      overallRiskScore,
      generalRecommendations,
      lifestyleModifications,
      medicalFollowUp,
      calculationVersion: this.CALCULATION_VERSION,
    };

    return output;
  }

  /**
   * 计算糖尿病风险
   * Calculate Diabetes Risk
   */
  private static calculateDiabetesRisk(input: InputData): DiseaseRiskResult {
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    // 如果已经有糖尿病，风险为100%
    if (input.hasDiabetes) {
      return {
        diseaseType: DiseaseType.DIABETES,
        riskScore: 100,
        riskPercentage: 100,
        riskLevel: RiskLevel.VERY_HIGH,
        tenYearRisk: 100,
        factors: [{ name: '已确诊糖尿病', value: true, weight: 1, description: '现有糖尿病诊断' }],
        recommendations: ['继续按医嘱服药', '定期监测血糖', '控制饮食', '规律运动'],
      };
    }

    // 年龄因素 (0-30分)
    let ageScore = 0;
    if (input.age >= 45 && input.age < 55) ageScore = 10;
    else if (input.age >= 55 && input.age < 65) ageScore = 20;
    else if (input.age >= 65) ageScore = 30;

    if (ageScore > 0) {
      factors.push({
        name: '年龄',
        value: input.age,
        weight: ageScore / 100,
        description: `${input.age}岁属于${input.age >= 65 ? '高' : input.age >= 55 ? '中高' : '中'}风险年龄段`,
      });
      riskScore += ageScore;
    }

    // BMI 因素 (0-25分)
    if (input.bmi) {
      let bmiScore = 0;
      if (input.bmi >= 24 && input.bmi < 28) bmiScore = 10; // 超重
      else if (input.bmi >= 28 && input.bmi < 32) bmiScore = 20; // 肥胖
      else if (input.bmi >= 32) bmiScore = 25; // 重度肥胖

      if (bmiScore > 0) {
        factors.push({
          name: 'BMI',
          value: input.bmi.toFixed(1),
          weight: bmiScore / 100,
          description: `BMI ${input.bmi.toFixed(1)} - ${input.bmi >= 32 ? '重度肥胖' : input.bmi >= 28 ? '肥胖' : '超重'}`,
        });
        riskScore += bmiScore;
      }
    }

    // 空腹血糖因素 (0-30分)
    if (input.fastingGlucose) {
      let glucoseScore = 0;
      if (input.fastingGlucose >= 100 && input.fastingGlucose < 126) {
        glucoseScore = 20; // 糖尿病前期
      } else if (input.fastingGlucose >= 126) {
        glucoseScore = 30; // 糖尿病范围
      }

      if (glucoseScore > 0) {
        factors.push({
          name: '空腹血糖',
          value: `${input.fastingGlucose} mg/dL`,
          weight: glucoseScore / 100,
          description: input.fastingGlucose >= 126 ? '达到糖尿病诊断标准' : '糖尿病前期',
        });
        riskScore += glucoseScore;
      }
    }

    // HbA1c 因素 (0-30分)
    if (input.hba1c) {
      let hba1cScore = 0;
      if (input.hba1c >= 5.7 && input.hba1c < 6.5) {
        hba1cScore = 20; // 糖尿病前期
      } else if (input.hba1c >= 6.5) {
        hba1cScore = 30; // 糖尿病范围
      }

      if (hba1cScore > 0) {
        factors.push({
          name: '糖化血红蛋白',
          value: `${input.hba1c}%`,
          weight: hba1cScore / 100,
          description: input.hba1c >= 6.5 ? '达到糖尿病诊断标准' : '糖尿病前期',
        });
        riskScore += hba1cScore;
      }
    }

    // 家族史 (0-15分)
    if (input.familyHistoryDiabetes) {
      factors.push({
        name: '糖尿病家族史',
        value: true,
        weight: 0.15,
        description: '一级亲属有糖尿病史',
      });
      riskScore += 15;
    }

    // 高血压史 (0-10分)
    if (input.hasHypertension) {
      factors.push({
        name: '高血压史',
        value: true,
        weight: 0.1,
        description: '高血压增加糖尿病风险',
      });
      riskScore += 10;
    }

    // 生活方式因素
    if (input.exerciseMinutesPerWeek !== undefined && input.exerciseMinutesPerWeek < 150) {
      factors.push({
        name: '缺乏运动',
        value: `${input.exerciseMinutesPerWeek} 分钟/周`,
        weight: 0.1,
        description: '运动不足增加糖尿病风险',
      });
      riskScore += 10;
    }

    // 限制最高分数为100
    riskScore = Math.min(riskScore, 100);
    const riskLevel = this.scoreToRiskLevel(riskScore);
    const tenYearRisk = this.calculateTenYearDiabetesRisk(input, riskScore);

    const recommendations = this.generateDiabetesRecommendations(input, riskLevel);

    return {
      diseaseType: DiseaseType.DIABETES,
      riskScore,
      riskPercentage: riskScore,
      riskLevel,
      tenYearRisk,
      factors,
      recommendations,
    };
  }

  /**
   * 计算高血压风险
   * Calculate Hypertension Risk
   */
  private static calculateHypertensionRisk(input: InputData): DiseaseRiskResult {
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    // 如果已经有高血压，风险为100%
    if (input.hasHypertension) {
      return {
        diseaseType: DiseaseType.HYPERTENSION,
        riskScore: 100,
        riskPercentage: 100,
        riskLevel: RiskLevel.VERY_HIGH,
        factors: [{ name: '已确诊高血压', value: true, weight: 1, description: '现有高血压诊断' }],
        recommendations: ['按医嘱服药', '定期监测血压', '限制钠摄入', '保持健康体重'],
      };
    }

    // 血压分级评分
    if (input.systolicBP && input.diastolicBP) {
      let bpScore = 0;
      let bpCategory = '';

      if (input.systolicBP >= 140 || input.diastolicBP >= 90) {
        bpScore = 40; // 高血压范围
        bpCategory = '高血压范围';
      } else if (input.systolicBP >= 130 || input.diastolicBP >= 85) {
        bpScore = 30; // 高值血压
        bpCategory = '高值血压';
      } else if (input.systolicBP >= 120 || input.diastolicBP >= 80) {
        bpScore = 20; // 正常高值
        bpCategory = '正常高值';
      }

      if (bpScore > 0) {
        factors.push({
          name: '血压',
          value: `${input.systolicBP}/${input.diastolicBP} mmHg`,
          weight: bpScore / 100,
          description: bpCategory,
        });
        riskScore += bpScore;
      }
    }

    // 年龄因素
    let ageScore = 0;
    if (input.age >= 40 && input.age < 55) ageScore = 15;
    else if (input.age >= 55 && input.age < 65) ageScore = 25;
    else if (input.age >= 65) ageScore = 35;

    if (ageScore > 0) {
      factors.push({
        name: '年龄',
        value: input.age,
        weight: ageScore / 100,
        description: `年龄增加高血压风险`,
      });
      riskScore += ageScore;
    }

    // BMI 因素
    if (input.bmi && input.bmi >= 24) {
      const bmiScore = input.bmi >= 28 ? 20 : 15;
      factors.push({
        name: 'BMI',
        value: input.bmi.toFixed(1),
        weight: bmiScore / 100,
        description: '超重/肥胖增加高血压风险',
      });
      riskScore += bmiScore;
    }

    // 家族史
    if (input.familyHistoryHeartDisease) {
      factors.push({
        name: '心血管疾病家族史',
        value: true,
        weight: 0.15,
        description: '家族史增加高血压风险',
      });
      riskScore += 15;
    }

    // 生活方式
    if (input.isSmoker) {
      factors.push({
        name: '吸烟',
        value: true,
        weight: 0.1,
        description: '吸烟显著增加心血管疾病风险',
      });
      riskScore += 10;
    }

    if (input.alcoholConsumption && input.alcoholConsumption > 14) {
      factors.push({
        name: '饮酒过量',
        value: `${input.alcoholConsumption} 饮品/周`,
        weight: 0.1,
        description: '过量饮酒增加高血压风险',
      });
      riskScore += 10;
    }

    riskScore = Math.min(riskScore, 100);
    const riskLevel = this.scoreToRiskLevel(riskScore);

    return {
      diseaseType: DiseaseType.HYPERTENSION,
      riskScore,
      riskPercentage: riskScore,
      riskLevel,
      factors,
      recommendations: this.generateHypertensionRecommendations(input, riskLevel),
    };
  }

  /**
   * 计算中风风险
   * Calculate Stroke Risk
   */
  private static calculateStrokeRisk(input: InputData): DiseaseRiskResult {
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    // 既往中风史
    if (input.hasStroke) {
      return {
        diseaseType: DiseaseType.STROKE,
        riskScore: 100,
        riskPercentage: 100,
        riskLevel: RiskLevel.VERY_HIGH,
        factors: [{ name: '既往中风史', value: true, weight: 1, description: '曾发生过中风' }],
        recommendations: ['严格控制血压', '服用抗血小板药物', '控制血脂', '定期复查'],
      };
    }

    // 高血压因素 (最重要)
    if (input.hasHypertension || (input.systolicBP && input.systolicBP >= 140)) {
      factors.push({
        name: '高血压',
        value: true,
        weight: 0.35,
        description: '高血压是中风的首要危险因素',
      });
      riskScore += 35;
    }

    // 年龄因素
    let ageScore = 0;
    if (input.age >= 55 && input.age < 65) ageScore = 15;
    else if (input.age >= 65 && input.age < 75) ageScore = 25;
    else if (input.age >= 75) ageScore = 35;

    if (ageScore > 0) {
      factors.push({
        name: '年龄',
        value: input.age,
        weight: ageScore / 100,
        description: '年龄是中风的重要危险因素',
      });
      riskScore += ageScore;
    }

    // 糖尿病
    if (input.hasDiabetes) {
      factors.push({
        name: '糖尿病',
        value: true,
        weight: 0.2,
        description: '糖尿病增加中风风险',
      });
      riskScore += 20;
    }

    // 心脏病
    if (input.hasHeartDisease) {
      factors.push({
        name: '心脏病',
        value: true,
        weight: 0.2,
        description: '心脏病增加缺血性中风风险',
      });
      riskScore += 20;
    }

    // 吸烟
    if (input.isSmoker) {
      factors.push({
        name: '吸烟',
        value: true,
        weight: 0.15,
        description: '吸烟显著增加中风风险',
      });
      riskScore += 15;
    }

    // 血脂异常
    if (input.totalCholesterol && input.totalCholesterol >= 240) {
      factors.push({
        name: '高胆固醇',
        value: `${input.totalCholesterol} mg/dL`,
        weight: 0.1,
        description: '高胆固醇增加动脉粥样硬化风险',
      });
      riskScore += 10;
    }

    // 家族史
    if (input.familyHistoryStroke) {
      factors.push({
        name: '中风家族史',
        value: true,
        weight: 0.1,
        description: '一级亲属有中风史',
      });
      riskScore += 10;
    }

    riskScore = Math.min(riskScore, 100);
    const riskLevel = this.scoreToRiskLevel(riskScore);
    const tenYearRisk = this.calculateTenYearStrokeRisk(input, riskScore);

    return {
      diseaseType: DiseaseType.STROKE,
      riskScore,
      riskPercentage: riskScore,
      riskLevel,
      tenYearRisk,
      factors,
      recommendations: this.generateStrokeRecommendations(input, riskLevel),
    };
  }

  /**
   * 计算 MACE (主要心血管不良事件) 风险
   * Calculate MACE Risk
   */
  private static calculateMACERisk(input: InputData): DiseaseRiskResult {
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    // 既往心血管事件
    if (input.hasHeartDisease || input.hasStroke) {
      riskScore += 40;
      factors.push({
        name: '既往心血管事件',
        value: true,
        weight: 0.4,
        description: '曾发生过心血管事件',
      });
    }

    // 年龄和性别交互作用
    if (input.gender === Gender.MALE) {
      if (input.age >= 45) riskScore += 20;
      else if (input.age >= 35) riskScore += 10;
    } else {
      if (input.age >= 55) riskScore += 20;
      else if (input.age >= 45) riskScore += 10;
    }

    if (riskScore > 0) {
      factors.push({
        name: '年龄性别因素',
        value: `${input.age}岁 ${input.gender === Gender.MALE ? '男性' : '女性'}`,
        weight: riskScore / 100,
        description: '年龄和性别影响心血管风险',
      });
    }

    // 多重危险因素聚集
    let riskFactorCount = 0;
    if (input.hasDiabetes) riskFactorCount++;
    if (input.hasHypertension) riskFactorCount++;
    if (input.isSmoker) riskFactorCount++;
    if (input.ldlCholesterol && input.ldlCholesterol >= 160) riskFactorCount++;

    if (riskFactorCount >= 2) {
      const multiFactorScore = riskFactorCount * 10;
      factors.push({
        name: '多重危险因素',
        value: riskFactorCount,
        weight: multiFactorScore / 100,
        description: `${riskFactorCount}个主要危险因素`,
      });
      riskScore += multiFactorScore;
    }

    // LDL 胆固醇
    if (input.ldlCholesterol) {
      let ldlScore = 0;
      if (input.ldlCholesterol >= 160) ldlScore = 20;
      else if (input.ldlCholesterol >= 130) ldlScore = 15;
      else if (input.ldlCholesterol >= 100) ldlScore = 10;

      if (ldlScore > 0) {
        factors.push({
          name: 'LDL胆固醇',
          value: `${input.ldlCholesterol} mg/dL`,
          weight: ldlScore / 100,
          description: 'LDL胆固醇升高',
        });
        riskScore += ldlScore;
      }
    }

    // HDL 胆固醇（保护因素）
    if (input.hdlCholesterol && input.hdlCholesterol < 40) {
      factors.push({
        name: 'HDL胆固醇过低',
        value: `${input.hdlCholesterol} mg/dL`,
        weight: 0.1,
        description: 'HDL胆固醇过低增加风险',
      });
      riskScore += 10;
    }

    riskScore = Math.min(riskScore, 100);
    const riskLevel = this.scoreToRiskLevel(riskScore);
    const tenYearRisk = this.calculateTenYearMACERisk(input, riskScore);

    return {
      diseaseType: DiseaseType.MACE,
      riskScore,
      riskPercentage: riskScore,
      riskLevel,
      tenYearRisk,
      factors,
      recommendations: this.generateMACERecommendations(input, riskLevel),
    };
  }

  /**
   * 计算心脏病风险
   * Calculate Heart Disease Risk
   */
  private static calculateHeartDiseaseRisk(input: InputData): DiseaseRiskResult {
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    if (input.hasHeartDisease) {
      return {
        diseaseType: DiseaseType.HEART_DISEASE,
        riskScore: 100,
        riskPercentage: 100,
        riskLevel: RiskLevel.VERY_HIGH,
        factors: [{ name: '已确诊心脏病', value: true, weight: 1, description: '现有心脏病诊断' }],
        recommendations: ['规律服药', '心脏康复', '控制危险因素', '定期心脏检查'],
      };
    }

    // 年龄因素
    let ageScore = 0;
    if (input.gender === Gender.MALE) {
      if (input.age >= 45) ageScore = 25;
      else if (input.age >= 35) ageScore = 15;
    } else {
      if (input.age >= 55) ageScore = 25;
      else if (input.age >= 45) ageScore = 15;
    }

    if (ageScore > 0) {
      factors.push({
        name: '年龄',
        value: input.age,
        weight: ageScore / 100,
        description: '年龄是心脏病的重要危险因素',
      });
      riskScore += ageScore;
    }

    // 家族史（一级亲属早发心脏病）
    if (input.familyHistoryHeartDisease) {
      factors.push({
        name: '心脏病家族史',
        value: true,
        weight: 0.2,
        description: '一级亲属有早发心脏病史',
      });
      riskScore += 20;
    }

    // 高血压
    if (input.hasHypertension) {
      factors.push({
        name: '高血压',
        value: true,
        weight: 0.15,
        description: '高血压增加心脏负担',
      });
      riskScore += 15;
    }

    // 糖尿病
    if (input.hasDiabetes) {
      factors.push({
        name: '糖尿病',
        value: true,
        weight: 0.2,
        description: '糖尿病增加冠心病风险',
      });
      riskScore += 20;
    }

    // 吸烟
    if (input.isSmoker) {
      const smokeScore = input.smokeYears && input.smokeYears > 10 ? 20 : 15;
      factors.push({
        name: '吸烟',
        value: input.smokeYears ? `${input.smokeYears}年` : true,
        weight: smokeScore / 100,
        description: '吸烟严重损害心血管健康',
      });
      riskScore += smokeScore;
    }

    // 血脂异常
    if (input.totalCholesterol && input.totalCholesterol >= 240) {
      factors.push({
        name: '高胆固醇',
        value: `${input.totalCholesterol} mg/dL`,
        weight: 0.15,
        description: '高胆固醇导致动脉粥样硬化',
      });
      riskScore += 15;
    }

    // 甘油三酯
    if (input.triglycerides && input.triglycerides >= 200) {
      factors.push({
        name: '高甘油三酯',
        value: `${input.triglycerides} mg/dL`,
        weight: 0.1,
        description: '甘油三酯升高',
      });
      riskScore += 10;
    }

    riskScore = Math.min(riskScore, 100);
    const riskLevel = this.scoreToRiskLevel(riskScore);
    const tenYearRisk = this.calculateTenYearHeartDiseaseRisk(input, riskScore);

    return {
      diseaseType: DiseaseType.HEART_DISEASE,
      riskScore,
      riskPercentage: riskScore,
      riskLevel,
      tenYearRisk,
      factors,
      recommendations: this.generateHeartDiseaseRecommendations(input, riskLevel),
    };
  }

  /**
   * 辅助方法：计算 BMI
   */
  private static calculateBMI(height?: number, weight?: number): number | undefined {
    if (!height || !weight) return undefined;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  /**
   * 辅助方法：将风险分数转换为风险等级
   */
  private static scoreToRiskLevel(score: number): RiskLevel {
    if (score < 25) return RiskLevel.LOW;
    if (score < 50) return RiskLevel.MEDIUM;
    if (score < 75) return RiskLevel.HIGH;
    return RiskLevel.VERY_HIGH;
  }

  /**
   * 辅助方法：计算总体风险
   */
  private static calculateOverallRisk(results: DiseaseRiskResult[]): number {
    const scores = results.map((r) => r.riskScore);
    return Math.max(...scores); // 使用最高风险作为总体风险
  }

  /**
   * 辅助方法：验证输入数据
   */
  private static validateInput(input: InputData): void {
    if (!input.age || input.age < 0 || input.age > 120) {
      throw new Error('年龄必须在 0-120 之间');
    }
    if (!input.gender) {
      throw new Error('性别为必填项');
    }
  }

  /**
   * 辅助方法：计算10年糖尿病风险
   */
  private static calculateTenYearDiabetesRisk(input: InputData, baseScore: number): number {
    // 简化的10年风险模型
    let risk = baseScore * 0.15; // 基础转换
    if (input.age >= 45) risk *= 1.5;
    if (input.familyHistoryDiabetes) risk *= 1.3;
    return Math.min(risk, 100);
  }

  /**
   * 辅助方法：计算10年中风风险
   */
  private static calculateTenYearStrokeRisk(input: InputData, baseScore: number): number {
    let risk = baseScore * 0.12;
    if (input.age >= 65) risk *= 2;
    if (input.hasHypertension) risk *= 1.5;
    return Math.min(risk, 100);
  }

  /**
   * 辅助方法：计算10年MACE风险
   */
  private static calculateTenYearMACERisk(input: InputData, baseScore: number): number {
    let risk = baseScore * 0.2;
    if (input.age >= 55) risk *= 1.8;
    if (input.isSmoker) risk *= 1.4;
    return Math.min(risk, 100);
  }

  /**
   * 辅助方法：计算10年心脏病风险
   */
  private static calculateTenYearHeartDiseaseRisk(input: InputData, baseScore: number): number {
    let risk = baseScore * 0.18;
    if (input.gender === Gender.MALE && input.age >= 45) risk *= 1.6;
    if (input.gender === Gender.FEMALE && input.age >= 55) risk *= 1.6;
    return Math.min(risk, 100);
  }

  /**
   * 生成总体建议
   */
  private static generateGeneralRecommendations(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === RiskLevel.LOW) {
      recommendations.push('继续保持健康的生活方式');
      recommendations.push('定期进行健康检查（每1-2年）');
    } else if (riskLevel === RiskLevel.MEDIUM) {
      recommendations.push('建议每年进行一次全面健康检查');
      recommendations.push('积极改善生活方式，控制危险因素');
      recommendations.push('考虑咨询医生进行个性化风险评估');
    } else if (riskLevel === RiskLevel.HIGH) {
      recommendations.push('强烈建议尽快咨询医生');
      recommendations.push('需要密切监测健康指标（每3-6个月）');
      recommendations.push('可能需要药物干预');
      recommendations.push('必须立即改善生活方式');
    } else {
      recommendations.push('立即就医，需要专业医疗干预');
      recommendations.push('需要制定综合治疗方案');
      recommendations.push('定期复诊和监测（每1-3个月）');
    }

    return recommendations;
  }

  /**
   * 生成生活方式改善建议
   */
  private static generateLifestyleModifications(input: InputData): string[] {
    const modifications: string[] = [];

    if (input.bmi && input.bmi >= 24) {
      modifications.push('控制体重：目标BMI < 24');
    }

    if (!input.exerciseMinutesPerWeek || input.exerciseMinutesPerWeek < 150) {
      modifications.push('增加运动：每周至少150分钟中等强度有氧运动');
    }

    if (input.isSmoker) {
      modifications.push('戒烟：这是降低心血管风险最重要的措施');
    }

    if (input.alcoholConsumption && input.alcoholConsumption > 14) {
      modifications.push('限制饮酒：男性每天不超过2个标准饮品，女性不超过1个');
    }

    modifications.push('健康饮食：多吃蔬菜水果，减少盐、糖和饱和脂肪摄入');
    modifications.push('充足睡眠：每晚7-8小时');
    modifications.push('压力管理：学习放松技巧，保持心理健康');

    return modifications;
  }

  /**
   * 生成医疗随访建议
   */
  private static generateMedicalFollowUp(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const followUp: string[] = [];

    if (riskLevel === RiskLevel.VERY_HIGH || riskLevel === RiskLevel.HIGH) {
      followUp.push('血压监测：每周至少2-3次');
      followUp.push('血糖监测：如有糖尿病风险，定期检测空腹血糖和HbA1c');
      followUp.push('血脂检查：每3-6个月检查一次');
    } else {
      followUp.push('血压监测：每月1-2次');
      followUp.push('血糖血脂检查：每年1次');
    }

    followUp.push('心电图检查：根据医生建议');
    followUp.push('眼底检查：如有糖尿病或高血压');

    return followUp;
  }

  /**
   * 生成糖尿病建议
   */
  private static generateDiabetesRecommendations(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === RiskLevel.VERY_HIGH || riskLevel === RiskLevel.HIGH) {
      recommendations.push('立即咨询内分泌科医生');
      recommendations.push('进行口服葡萄糖耐量试验（OGTT）');
    }

    recommendations.push('控制碳水化合物摄入，选择低血糖指数食物');
    recommendations.push('定期监测血糖');
    recommendations.push('保持健康体重');
    recommendations.push('增加体育活动');

    return recommendations;
  }

  /**
   * 生成高血压建议
   */
  private static generateHypertensionRecommendations(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push('限制钠摄入（每日 < 6克盐）');
    recommendations.push('采用DASH饮食（富含蔬菜、水果、低脂乳制品）');
    recommendations.push('定期监测血压');
    recommendations.push('规律运动');
    recommendations.push('保持健康体重');

    if (riskLevel === RiskLevel.VERY_HIGH || riskLevel === RiskLevel.HIGH) {
      recommendations.push('可能需要降压药物治疗，请咨询医生');
    }

    return recommendations;
  }

  /**
   * 生成中风建议
   */
  private static generateStrokeRecommendations(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push('严格控制血压至目标值');
    recommendations.push('控制血糖（如有糖尿病）');
    recommendations.push('控制血脂');

    if (input.isSmoker) {
      recommendations.push('立即戒烟');
    }

    if (riskLevel === RiskLevel.VERY_HIGH || riskLevel === RiskLevel.HIGH) {
      recommendations.push('考虑服用阿司匹林等抗血小板药物（需医生评估）');
      recommendations.push('定期进行颈动脉超声检查');
    }

    recommendations.push('识别中风预警信号（FAST：面部、手臂、语言、时间）');

    return recommendations;
  }

  /**
   * 生成MACE建议
   */
  private static generateMACERecommendations(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === RiskLevel.VERY_HIGH || riskLevel === RiskLevel.HIGH) {
      recommendations.push('强烈建议咨询心血管专科医生');
      recommendations.push('可能需要他汀类药物降低LDL胆固醇');
      recommendations.push('考虑服用阿司匹林（需医生评估）');
      recommendations.push('定期进行心脏检查（心电图、超声心动图等）');
    }

    recommendations.push('控制所有心血管危险因素');
    recommendations.push('健康饮食：减少饱和脂肪和反式脂肪');
    recommendations.push('规律运动');
    recommendations.push('保持健康体重');

    return recommendations;
  }

  /**
   * 生成心脏病建议
   */
  private static generateHeartDiseaseRecommendations(
    input: InputData,
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push('采用心脏健康饮食');
    recommendations.push('规律进行有氧运动');
    recommendations.push('控制血压和血脂');

    if (riskLevel === RiskLevel.VERY_HIGH || riskLevel === RiskLevel.HIGH) {
      recommendations.push('咨询心脏专科医生');
      recommendations.push('可能需要负荷试验或冠脉造影');
      recommendations.push('考虑药物治疗（他汀类、β受体阻滞剂等）');
    }

    recommendations.push('学习识别心脏病发作症状');
    recommendations.push('制定应急计划');

    return recommendations;
  }
}
