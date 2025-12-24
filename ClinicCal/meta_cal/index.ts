
/**
 * 主应用程序入口
 * Main Application Entry Point
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import routes from './routes';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app: Application = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(helmet() as any); // 安全头
app.use(cors() as any); // 跨域
app.use(express.json({ limit: '10mb' }) as any); // JSON 解析
app.use(express.urlencoded({ extended: true, limit: '10mb' }) as any); // URL 编码

// 请求日志
app.use((req: any, res: any, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 根路由
app.get('/', (req: any, res: any) => {
  res.json({
    message: '慢性病風險評估平台 API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      customers: '/api/customers',
      assessments: '/api/assessments',
    },
  });
});

// API 路由
app.use('/api', routes);

// 404 处理
app.use((req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: '路由未找到',
    path: req.path,
  });
});

// 错误处理
app.use((err: Error, req: any, res: any, next: NextFunction) => {
  console.error('错误:', err);
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误',
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDatabase();

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏥  慢性病風險評估平台 - Meta Risk Calculator           ║
║                                                            ║
║   🚀 Server is running on http://localhost:${PORT}         ║
║   📊 API Documentation: http://localhost:${PORT}/api       ║
║   ✅ Health Check: http://localhost:${PORT}/api/health     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 启动服务器失败:', error);
    (process as any).exit(1);
  }
};

// 启动应用
startServer();

export default app;
