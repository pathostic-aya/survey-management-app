import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 基本ルート
app.get('/', (req, res) => {
  res.json({ message: '測量工程表管理システム API' });
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// プロジェクト関連ルート
import projectRoutes from './routes/projects';
app.use('/api/projects', projectRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});