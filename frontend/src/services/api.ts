import axios from 'axios';
import { ProjectAPI, Project, convertAPIToProject, convertProjectToAPI } from '../types/project';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// プロジェクト API
export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<ProjectAPI[]>('/api/projects');
    return response.data.map(convertAPIToProject);
  },
  
  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<ProjectAPI>(`/api/projects/${id}`);
    return convertAPIToProject(response.data);
  },
  
  create: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const apiData = convertProjectToAPI(data);
    const response = await apiClient.post<ProjectAPI>('/api/projects', apiData);
    return convertAPIToProject(response.data);
  },
  
  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const apiData = data.equipment ? { ...data, equipment: JSON.stringify(data.equipment) } : data;
    const response = await apiClient.put<ProjectAPI>(`/api/projects/${id}`, apiData);
    return convertAPIToProject(response.data);
  },
  
  delete: (id: number) => apiClient.delete(`/api/projects/${id}`),
};