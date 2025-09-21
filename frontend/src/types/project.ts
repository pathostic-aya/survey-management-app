// API用の型（データベース形式）
export interface ProjectAPI {
  id: number;
  status: '完了' | '日程決' | '見積済' | '未見積' | 'ボツ';
  companyName: string;
  siteName: string;
  equipment: string; // JSON文字列
  clientContact?: string;
  photographer?: string;
  shootPeriod?: string;
  startDate?: string;
  endDate?: string;
  drawingModel?: string;
  remarks?: string;
  siteAddress?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// フロントエンド用の型（表示・編集用）
export interface Project {
  id: number;
  status: '完了' | '日程決' | '見積済' | '未見積' | 'ボツ';
  companyName: string;
  siteName: string;
  equipment: string[]; // 配列形式
  clientContact?: string;
  photographer?: string;
  shootPeriod?: string;
  startDate?: string;
  endDate?: string;
  drawingModel?: string;
  remarks?: string;
  siteAddress?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Equipment {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
  sortOrder: number;
}

// 型変換ヘルパー関数
export const convertAPIToProject = (apiProject: ProjectAPI): Project => {
  return {
    ...apiProject,
    equipment: JSON.parse(apiProject.equipment || '[]')
  };
};

export const convertProjectToAPI = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Omit<ProjectAPI, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    ...project,
    equipment: JSON.stringify(project.equipment)
  };
};