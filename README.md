# 測量工程表管理システム

社内で使用している測量工程表をWeb化するプロジェクト

## 技術スタック

- **フロントエンド**: React + TypeScript + Tailwind CSS
- **バックエンド**: Node.js + Express + TypeScript  
- **データベース**: PostgreSQL + Prisma
- **デプロイ**: Vercel (フロント) + Render.com (バック)

## 機能

- [x] プロジェクト管理（CRUD）
- [x] カレンダー表示
- [x] リアルタイム同期
- [x] データ集計・分析

## 開発スケジュール

- Week 1: 基盤学習 + セットアップ
- Week 2: MVP開発  
- Week 3: カレンダー + デプロイ

## セットアップ
```bash
# クローン
git clone https://github.com/pathostic-aya/survey-management-app.git
cd survey-management-app

# フロントエンド
cd frontend
npm install
npm start

# バックエンド  
cd ../backend
npm install
npm run dev