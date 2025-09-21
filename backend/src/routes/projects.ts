import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/projects - 全プロジェクト取得
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'プロジェクトの取得に失敗しました' });
  }
});

// GET /api/projects/:id - 特定プロジェクト取得
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'プロジェクトが見つかりません' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'プロジェクトの取得に失敗しました' });
  }
});

// POST /api/projects - 新規プロジェクト作成
router.post('/', async (req, res) => {
  try {
    const {
      status,
      companyName,
      siteName,
      equipment,
      clientContact,
      photographer,
      shootPeriod,
      startDate,
      endDate,
      drawingModel,
      remarks,
      siteAddress,
      createdBy
    } = req.body;

    const project = await prisma.project.create({
      data: {
        status,
        companyName,
        siteName,
        equipment,
        clientContact,
        photographer,
        shootPeriod,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        drawingModel,
        remarks,
        siteAddress,
        createdBy,
        updatedBy: createdBy
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'プロジェクトの作成に失敗しました' });
  }
});

// PUT /api/projects/:id - プロジェクト更新
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      companyName,
      siteName,
      equipment,
      clientContact,
      photographer,
      shootPeriod,
      startDate,
      endDate,
      drawingModel,
      remarks,
      siteAddress,
      updatedBy
    } = req.body;

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        status,
        companyName,
        siteName,
        equipment,
        clientContact,
        photographer,
        shootPeriod,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        drawingModel,
        remarks,
        siteAddress,
        updatedBy
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'プロジェクトの更新に失敗しました' });
  }
});

// DELETE /api/projects/:id - プロジェクト削除
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'プロジェクトの削除に失敗しました' });
  }
});

// Excel一括インポート用の型
interface ExcelImportData {
  進捗状況: string;
  会社名: string;
  現場名: string;
  機材: string;
  撮影担当?: string;
  撮影期間?: string;
  撮影開始日?: string;
  撮影終了日?: string;
  備考?: string;
  現場住所?: string;
}

// POST /api/projects/import - Excel一括インポート
router.post('/import', async (req, res) => {
  try {
    const { projects } = req.body;
    
    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({ error: 'プロジェクトデータが無効です' });
    }

    const createdProjects = [];
    
    for (const projectData of projects) {
      try {
        const project = await prisma.project.create({
          data: {
            status: projectData.進捗状況 || '未見積',
            companyName: projectData.会社名,
            siteName: projectData.現場名,
            equipment: projectData.機材 || '[]',
            photographer: projectData.撮影担当 || null,
            shootPeriod: projectData.撮影期間 || null,
            startDate: projectData.撮影開始日 ? new Date(projectData.撮影開始日) : null,
            endDate: projectData.撮影終了日 ? new Date(projectData.撮影終了日) : null,
            remarks: projectData.備考 || null,
            siteAddress: projectData.現場住所 || null,
            createdBy: 'インポート',
            updatedBy: 'インポート'
          }
        });
        createdProjects.push(project);
      } catch (projectError) {
        console.error('プロジェクト作成エラー:', projectError);
        // 個別のプロジェクトでエラーが出ても続行
      }
    }

    res.json({ 
      message: `${createdProjects.length}件のプロジェクトをインポートしました`,
      count: createdProjects.length 
    });
  } catch (error) {
    console.error('Error importing projects:', error);
    res.status(500).json({ error: 'インポートに失敗しました' });
  }
});

// 最後の行を変更
// module.exports = router;

// 以下に変更
export default router;