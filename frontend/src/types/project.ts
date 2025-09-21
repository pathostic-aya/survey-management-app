export interface Project {
  id: number;
  status: '完了' | '日程決' | '見積済' | '未見積' | 'ボツ';
  companyName: string;
  siteName: string;
  equipment: string[];
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