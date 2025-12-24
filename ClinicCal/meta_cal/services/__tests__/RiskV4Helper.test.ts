
/**
 * RiskV4Helper 单元测试
 * RiskV4Helper Unit Tests
 */

import { RiskV4Helper } from '../RiskV4Helper';
import { InputData, Gender, RiskLevel, DiseaseType } from '../../types/risk.types';

// Declare Jest globals to fix TypeScript errors when @types/jest is missing
declare var describe: (name: string, callback: () => void) => void;
declare var it: (name: string, callback: () => void) => void;
declare var expect: {
  (actual: any): any;
  extend(matchers: any): void;
};

describe('RiskV4Helper', () => {
  describe('calculateRisk', () => {
    it('应该为低风险患者返回低风险评估', () => {
      const input: InputData = {
        age: 30,
        gender: Gender.MALE,
        height: 175,
        weight: 70,
        systolicBP: 110,
        diastolicBP: 70,
        fastingGlucose: 85,
        hba1c: 5.0,
        totalCholesterol: 170,
        ldlCholesterol: 90,
        hdlCholesterol: 60,
        isSmoker: false,
        exerciseMinutesPerWeek: 200,
      };

      const result = RiskV4Helper.calculateRisk(input);

      expect(result.overallRiskLevel).toBe(RiskLevel.LOW);
      expect(result.overallRiskScore).toBeLessThan(50);
      expect(result.assessmentId).toBeDefined();
      expect(result.calculationVersion).toBe('v4.0.0');
    });

    it('应该为高风险患者返回高风险评估', () => {
      const input: InputData = {
        age: 65,
        gender: Gender.MALE,
        height: 170,
        weight: 90,
        systolicBP: 160,
        diastolicBP: 100,
        fastingGlucose: 140,
        hba1c: 7.0,
        totalCholesterol: 270,
        ldlCholesterol: 180,
        hdlCholesterol: 35,
        triglycerides: 230,
        isSmoker: true,
        smokeYears: 30,
        hasHypertension: true,
        familyHistoryDiabetes: true,
        familyHistoryHeartDisease: true,
        exerciseMinutesPerWeek: 0,
      };

      const result = RiskV4Helper.calculateRisk(input);

      expect(result.overallRiskLevel).toBeIn([RiskLevel.HIGH, RiskLevel.VERY_HIGH]);
      expect(result.overallRiskScore).toBeGreaterThan(50);
    });

    it('应该计算 BMI 如果未提供', () => {
      const input: InputData = {
        age: 40,
        gender: Gender.FEMALE,
        height: 160,
        weight: 60,
      };

      const result = RiskV4Helper.calculateRisk(input);

      expect(result.inputData.bmi).toBeDefined();
      expect(result.inputData.bmi).toBeCloseTo(23.4, 1);
    });

    it('应该为已确诊糖尿病患者返回极高糖尿病风险', () => {
      const input: InputData = {
        age: 50,
        gender: Gender.MALE,
        hasDiabetes: true,
      };

      const result = RiskV4Helper.calculateRisk(input);

      expect(result.diabetesRisk?.riskLevel).toBe(RiskLevel.VERY_HIGH);
      expect(result.diabetesRisk?.riskScore).toBe(100);
    });

    it('应该抛出错误如果年龄无效', () => {
      const input: InputData = {
        age: 150,
        gender: Gender.MALE,
      };

      expect(() => RiskV4Helper.calculateRisk(input)).toThrow('年龄必须在 0-120 之间');
    });

    it('应该抛出错误如果性别未提供', () => {
      const input: any = {
        age: 40,
      };

      expect(() => RiskV4Helper.calculateRisk(input)).toThrow('性别为必填项');
    });
  });

  describe('calculateDiabetesRisk', () => {
    it('应该考虑年龄因素', () => {
      const youngInput: InputData = {
        age: 30,
        gender: Gender.MALE,
      };

      const oldInput: InputData = {
        age: 70,
        gender: Gender.MALE,
      };

      const youngResult = RiskV4Helper.calculateRisk(youngInput);
      const oldResult = RiskV4Helper.calculateRisk(oldInput);

      expect(oldResult.diabetesRisk!.riskScore).toBeGreaterThan(
        youngResult.diabetesRisk!.riskScore
      );
    });

    it('应该考虑 BMI 因素', () => {
      const normalWeight: InputData = {
        age: 40,
        gender: Gender.MALE,
        height: 175,
        weight: 70,
      };

      const obese: InputData = {
        age: 40,
        gender: Gender.MALE,
        height: 175,
        weight: 100,
      };

      const normalResult = RiskV4Helper.calculateRisk(normalWeight);
      const obeseResult = RiskV4Helper.calculateRisk(obese);

      expect(obeseResult.diabetesRisk!.riskScore).toBeGreaterThan(
        normalResult.diabetesRisk!.riskScore
      );
    });

    it('应该考虑血糖因素', () => {
      const normalGlucose: InputData = {
        age: 40,
        gender: Gender.MALE,
        fastingGlucose: 90,
      };

      const highGlucose: InputData = {
        age: 40,
        gender: Gender.MALE,
        fastingGlucose: 130,
      };

      const normalResult = RiskV4Helper.calculateRisk(normalGlucose);
      const highResult = RiskV4Helper.calculateRisk(highGlucose);

      expect(highResult.diabetesRisk!.riskScore).toBeGreaterThan(
        normalResult.diabetesRisk!.riskScore
      );
    });
  });

  describe('calculateHypertensionRisk', () => {
    it('应该为已确诊高血压返回极高风险', () => {
      const input: InputData = {
        age: 50,
        gender: Gender.MALE,
        hasHypertension: true,
      };

      const result = RiskV4Helper.calculateRisk(input);

      expect(result.hypertensionRisk?.riskLevel).toBe(RiskLevel.VERY_HIGH);
      expect(result.hypertensionRisk?.riskScore).toBe(100);
    });

    it('应该考虑血压水平', () => {
      const normalBP: InputData = {
        age: 40,
        gender: Gender.MALE,
        systolicBP: 110,
        diastolicBP: 70,
      };

      const highBP: InputData = {
        age: 40,
        gender: Gender.MALE,
        systolicBP: 150,
        diastolicBP: 95,
      };

      const normalResult = RiskV4Helper.calculateRisk(normalBP);
      const highResult = RiskV4Helper.calculateRisk(highBP);

      expect(highResult.hypertensionRisk!.riskScore).toBeGreaterThan(
        normalResult.hypertensionRisk!.riskScore
      );
    });
  });

  describe('calculateStrokeRisk', () => {
    it('应该考虑高血压作为主要风险因素', () => {
      const noHypertension: InputData = {
        age: 60,
        gender: Gender.MALE,
        systolicBP: 120,
        diastolicBP: 80,
      };

      const withHypertension: InputData = {
        age: 60,
        gender: Gender.MALE,
        systolicBP: 160,
        diastolicBP: 100,
        hasHypertension: true,
      };

      const normalResult = RiskV4Helper.calculateRisk(noHypertension);
      const hypertensionResult = RiskV4Helper.calculateRisk(withHypertension);

      expect(hypertensionResult.strokeRisk!.riskScore).toBeGreaterThan(
        normalResult.strokeRisk!.riskScore
      );
    });

    it('应该考虑年龄因素', () => {
      const young: InputData = {
        age: 40,
        gender: Gender.MALE,
      };

      const elderly: InputData = {
        age: 80,
        gender: Gender.MALE,
      };

      const youngResult = RiskV4Helper.calculateRisk(young);
      const elderlyResult = RiskV4Helper.calculateRisk(elderly);

      expect(elderlyResult.strokeRisk!.riskScore).toBeGreaterThan(
        youngResult.strokeRisk!.riskScore
      );
    });
  });

  describe('calculateMACERisk', () => {
    it('应该考虑多重危险因素', () => {
      const singleRisk: InputData = {
        age: 50,
        gender: Gender.MALE,
        hasDiabetes: true,
      };

      const multipleRisks: InputData = {
        age: 50,
        gender: Gender.MALE,
        hasDiabetes: true,
        hasHypertension: true,
        isSmoker: true,
        ldlCholesterol: 180,
      };

      const singleResult = RiskV4Helper.calculateRisk(singleRisk);
      const multipleResult = RiskV4Helper.calculateRisk(multipleRisks);

      expect(multipleResult.maceRisk!.riskScore).toBeGreaterThan(
        singleResult.maceRisk!.riskScore
      );
    });

    it('应该考虑性别和年龄的交互作用', () => {
      const youngMale: InputData = {
        age: 40,
        gender: Gender.MALE,
      };

      const olderMale: InputData = {
        age: 55,
        gender: Gender.MALE,
      };

      const youngFemale: InputData = {
        age: 40,
        gender: Gender.FEMALE,
      };

      const olderFemale: InputData = {
        age: 60,
        gender: Gender.FEMALE,
      };

      const youngMaleResult = RiskV4Helper.calculateRisk(youngMale);
      const olderMaleResult = RiskV4Helper.calculateRisk(olderMale);
      const youngFemaleResult = RiskV4Helper.calculateRisk(youngFemale);
      const olderFemaleResult = RiskV4Helper.calculateRisk(olderFemale);

      // 年龄增加应该提高风险
      expect(olderMaleResult.maceRisk!.riskScore).toBeGreaterThan(
        youngMaleResult.maceRisk!.riskScore
      );
      expect(olderFemaleResult.maceRisk!.riskScore).toBeGreaterThan(
        youngFemaleResult.maceRisk!.riskScore
      );
    });
  });

  describe('generateRecommendations', () => {
    it('应该为高风险患者生成更多建议', () => {
      const lowRisk: InputData = {
        age: 30,
        gender: Gender.MALE,
        height: 175,
        weight: 70,
      };

      const highRisk: InputData = {
        age: 70,
        gender: Gender.MALE,
        height: 170,
        weight: 95,
        systolicBP: 170,
        diastolicBP: 105,
        fastingGlucose: 150,
        isSmoker: true,
        hasHypertension: true,
        hasDiabetes: true,
      };

      const lowRiskResult = RiskV4Helper.calculateRisk(lowRisk);
      const highRiskResult = RiskV4Helper.calculateRisk(highRisk);

      expect(highRiskResult.generalRecommendations.length).toBeGreaterThanOrEqual(
        lowRiskResult.generalRecommendations.length
      );
    });

    it('应该为吸烟者包含戒烟建议', () => {
      const input: InputData = {
        age: 50,
        gender: Gender.MALE,
        isSmoker: true,
      };

      const result = RiskV4Helper.calculateRisk(input);

      const hasQuitSmokingRecommendation = result.lifestyleModifications.some((rec) =>
        rec.includes('戒烟')
      );
      expect(hasQuitSmokingRecommendation).toBe(true);
    });

    it('应该为缺乏运动者包含运动建议', () => {
      const input: InputData = {
        age: 50,
        gender: Gender.MALE,
        exerciseMinutesPerWeek: 50,
      };

      const result = RiskV4Helper.calculateRisk(input);

      const hasExerciseRecommendation = result.lifestyleModifications.some((rec) =>
        rec.includes('运动')
      );
      expect(hasExerciseRecommendation).toBe(true);
    });
  });
});

// 自定义 Jest matcher
expect.extend({
  toBeIn(received: any, array: any[]) {
    const pass = array.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be in array ${array}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in array ${array}`,
        pass: false,
      };
    }
  },
});
