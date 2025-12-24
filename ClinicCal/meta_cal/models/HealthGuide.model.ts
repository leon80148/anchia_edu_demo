/**
 * HealthGuide (健康指导报告) MongoDB 模型
 * 对应 Java 的 demo.reactAdmin.crud.entities.HealthGuide
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthGuide extends Document {
  guideId: string;
  customerId: mongoose.Types.ObjectId;
  assessmentId: string;
  reportTitle: string;
  reportContent?: string; // HTML 或纯文本
  reportTemplate: string;
  generatedDocUrl?: string; // 生成的 DOCX 文件 URL
  createdAt: Date;
  updatedAt: Date;
}

const HealthGuideSchema: Schema = new Schema(
  {
    guideId: { type: String, required: true, unique: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    assessmentId: { type: String, required: true, index: true },
    reportTitle: { type: String, required: true },
    reportContent: { type: String },
    reportTemplate: { type: String, default: 'guideTemp.docx' },
    generatedDocUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

// 索引
HealthGuideSchema.index({ guideId: 1 });
HealthGuideSchema.index({ customerId: 1, createdAt: -1 });
HealthGuideSchema.index({ assessmentId: 1 });

export const HealthGuide = mongoose.model<IHealthGuide>('HealthGuide', HealthGuideSchema);
