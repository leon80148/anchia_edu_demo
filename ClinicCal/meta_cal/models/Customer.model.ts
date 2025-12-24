/**
 * Customer (客户/患者) MongoDB 模型
 * 对应 Java 的 demo.reactAdmin.crud.entities.Customer
 */

import mongoose, { Document, Schema } from 'mongoose';
import { InputData, Gender } from '../types/risk.types';

export interface ICustomer extends Document {
  // 基本信息
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth: Date;
  age: number;
  gender: Gender;

  // 身体测量
  height?: number;
  weight?: number;
  bmi?: number;

  // 生命体征
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;

  // 实验室指标
  fastingGlucose?: number;
  hba1c?: number;
  totalCholesterol?: number;
  ldlCholesterol?: number;
  hdlCholesterol?: number;
  triglycerides?: number;
  creatinine?: number;

  // 病史
  hasDiabetes?: boolean;
  hasHypertension?: boolean;
  hasHeartDisease?: boolean;
  hasStroke?: boolean;
  familyHistoryDiabetes?: boolean;
  familyHistoryHeartDisease?: boolean;
  familyHistoryStroke?: boolean;

  // 生活方式
  isSmoker?: boolean;
  smokeYears?: number;
  smokesPerDay?: number;
  alcoholConsumption?: number;
  exerciseMinutesPerWeek?: number;

  // 用药情况
  onHypertensionMeds?: boolean;
  onDiabetesMeds?: boolean;
  onStatins?: boolean;

  // 元数据
  createdAt: Date;
  updatedAt: Date;
  lastAssessmentDate?: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },

    // 身体测量
    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    bmi: { type: Number, min: 0 },

    // 生命体征
    systolicBP: { type: Number, min: 0 },
    diastolicBP: { type: Number, min: 0 },
    heartRate: { type: Number, min: 0 },

    // 实验室指标
    fastingGlucose: { type: Number, min: 0 },
    hba1c: { type: Number, min: 0 },
    totalCholesterol: { type: Number, min: 0 },
    ldlCholesterol: { type: Number, min: 0 },
    hdlCholesterol: { type: Number, min: 0 },
    triglycerides: { type: Number, min: 0 },
    creatinine: { type: Number, min: 0 },

    // 病史
    hasDiabetes: { type: Boolean, default: false },
    hasHypertension: { type: Boolean, default: false },
    hasHeartDisease: { type: Boolean, default: false },
    hasStroke: { type: Boolean, default: false },
    familyHistoryDiabetes: { type: Boolean, default: false },
    familyHistoryHeartDisease: { type: Boolean, default: false },
    familyHistoryStroke: { type: Boolean, default: false },

    // 生活方式
    isSmoker: { type: Boolean, default: false },
    smokeYears: { type: Number, min: 0 },
    smokesPerDay: { type: Number, min: 0 },
    alcoholConsumption: { type: Number, min: 0 },
    exerciseMinutesPerWeek: { type: Number, min: 0 },

    // 用药情况
    onHypertensionMeds: { type: Boolean, default: false },
    onDiabetesMeds: { type: Boolean, default: false },
    onStatins: { type: Boolean, default: false },

    lastAssessmentDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// 索引
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ createdAt: -1 });

// 虚拟字段：将 Customer 转换为 InputData
CustomerSchema.methods.toInputData = function (): InputData {
  return {
    age: this.age,
    gender: this.gender,
    height: this.height,
    weight: this.weight,
    bmi: this.bmi,
    systolicBP: this.systolicBP,
    diastolicBP: this.diastolicBP,
    heartRate: this.heartRate,
    fastingGlucose: this.fastingGlucose,
    hba1c: this.hba1c,
    totalCholesterol: this.totalCholesterol,
    ldlCholesterol: this.ldlCholesterol,
    hdlCholesterol: this.hdlCholesterol,
    triglycerides: this.triglycerides,
    creatinine: this.creatinine,
    hasDiabetes: this.hasDiabetes,
    hasHypertension: this.hasHypertension,
    hasHeartDisease: this.hasHeartDisease,
    hasStroke: this.hasStroke,
    familyHistoryDiabetes: this.familyHistoryDiabetes,
    familyHistoryHeartDisease: this.familyHistoryHeartDisease,
    familyHistoryStroke: this.familyHistoryStroke,
    isSmoker: this.isSmoker,
    smokeYears: this.smokeYears,
    smokesPerDay: this.smokesPerDay,
    alcoholConsumption: this.alcoholConsumption,
    exerciseMinutesPerWeek: this.exerciseMinutesPerWeek,
    onHypertensionMeds: this.onHypertensionMeds,
    onDiabetesMeds: this.onDiabetesMeds,
    onStatins: this.onStatins,
  };
};

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
