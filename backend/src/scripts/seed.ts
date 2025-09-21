import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // 既存データをクリア
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.status.deleteMany();
  await prisma.equipment.deleteMany();
  
  // 機材マスタ
  const equipment = await prisma.equipment.createMany({
    data: [
      { name: 'FARO' },
      { name: 'Pro2' },
      { name: 'Pro3' },
      { name: 'RTC' },
      { name: 'BLK' },
      { name: 'L2pro' },
    ],
  });

  // ステータスマスタ
  const statuses = await prisma.status.createMany({
    data: [
      { name: '未見積', sortOrder: 1 },
      { name: '見積済', sortOrder: 2 },
      { name: '日程決', sortOrder: 3 },
      { name: '完了', sortOrder: 4 },
      { name: 'ボツ', sortOrder: 5 },
    ],
  });

  // ユーザーマスタ
  const users = await prisma.user.createMany({
    data: [
      { name: '管理者' },
      { name: '本井' },
      { name: '山根' },
      { name: '伊藤' },
      { name: '山内' },
      { name: '藤川' },
      { name: '安部' },
      { name: '吉川' },
    ],
  });

  // サンプルプロジェクト
  const projects = await prisma.project.createMany({
    data: [
      {
        status: '完了',
        companyName: 'タクマ',
        siteName: '新江東',
        equipment: JSON.stringify(['FARO']),
        photographer: '山根・伊藤',
        shootPeriod: '1/20-1/22',
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-01-22'),
        siteAddress: '東京都江東区夢の島３丁目１',
        createdBy: '管理者',
        updatedBy: '山根',
      },
      {
        status: '完了',
        companyName: 'タクマ',
        siteName: '名古屋市猪子石工場',
        equipment: JSON.stringify(['Pro3']),
        photographer: '伊藤・本井',
        shootPeriod: '2/3-2/7',
        startDate: new Date('2025-02-03'),
        endDate: new Date('2025-02-07'),
        remarks: 'pro3 ソリューション1台(1/31~2/8)',
        siteAddress: '愛知県名古屋市千種区香流橋一丁目１０１',
        createdBy: '管理者',
        updatedBy: '伊藤',
      },
      {
        status: '日程決',
        companyName: '新日本空調',
        siteName: '梅田ダイビル',
        equipment: JSON.stringify(['L2pro']),
        photographer: '伊藤・本井',
        siteAddress: '大阪府大阪市北区梅田',
        createdBy: '管理者',
        updatedBy: '管理者',
      },
    ],
  });

  console.log({ equipment, statuses, users, projects });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });