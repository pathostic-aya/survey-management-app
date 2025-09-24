import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 10000;

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// メモリ内データストア（テスト用）
let projects: any[] = [
  {
    id: 1,
    status: '完了',
    companyName: 'テスト会社',
    siteName: 'テスト現場',
    equipment: 'FARO',
    photographer: '山田太郎',
    shootPeriod: '1/20-1/22',
    startDate: '2025-01-20',
    endDate: '2025-01-22',
    siteAddress: '東京都千代田区',
    remarks: 'テストデータ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// ルート定義
app.get('/', (req: any, res: any) => {
  res.json({ 
    message: '測量工程表管理システム API',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req: any, res: any) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// プロジェクトAPI
app.get('/api/projects', (req: any, res: any) => {
  console.log('GET /api/projects called');
  res.json({
    data: projects,
    count: projects.length,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/projects', (req: any, res: any) => {
  console.log('POST /api/projects called', req.body);
  const newProject = {
    id: Math.max(...projects.map(p => p.id)) + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req: any, res: any) => {
  const id = parseInt(req.params.id);
  console.log(`PUT /api/projects/${id} called`, req.body);
  
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { 
      ...projects[index], 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    };
    res.json(projects[index]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/projects/:id', (req: any, res: any) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /api/projects/${id} called`);
  
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== id);
  
  if (projects.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// マスタデータAPI（フロントエンド用）
app.get('/api/status-options', (req: any, res: any) => {
  res.json(['完了', '日程決', '見積済', '未見積', 'ボツ']);
});

app.get('/api/equipment-options', (req: any, res: any) => {
  res.json(['FARO', 'L2pro', 'Pro3', 'その他']);
});

// エラーハンドリング
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404ハンドリング
app.use('*', (req: any, res: any) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});