/**
 * Assessment (风险评估记录) MongoDB 模型
 * 存储风险评估的 OutputData
 */

import mongoose, { Document, Schema } from 'mongoose';
import { OutputData, RiskLevel, DiseaseType } from '../types/risk.types';

export interface IAssessment extends Document {
  assessmentId: string;
  customerId: mongoose.Types.ObjectId;
  outputData: OutputData;
  overallRiskLevel: RiskLevel;
  overallRiskScore: number;
  calculationVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    assessmentId: { type: String, required: true, unique: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    outputData: { type: Schema.Types.Mixed, required: true },
    overallRiskLevel: {
      type: String,
      enum: Object.values(RiskLevel),
      required: true,
    },
    overallRiskScore: { type: Number, required: true, min: 0, max: 100 },
    calculationVersion: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// 索引
AssessmentSchema.index({ assessmentId: 1 });
AssessmentSchema.index({ customerId: 1, createdAt: -1 });
AssessmentSchema.index({ overallRiskLevel: 1 });
AssessmentSchema.index({ createdAt: -1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
