/**
 * 数据库配置
 * Database Configuration
 */

import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/risk_calculator';

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB 连接成功');

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB 已断开连接');
    });

    (process as any).on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB 连接已关闭（应用程序终止）');
      (process as any).exit(0);
    });
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    (process as any).exit(1);
  }
};