import React, { useState } from 'react';
import { Project } from '../../types/project';
import { mockProjects } from '../../data/mockData';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '完了': return 'bg-green-100 text-green-800';
      case '日程決': return 'bg-blue-100 text-blue-800';
      case '見積済': return 'bg-yellow-100 text-yellow-800';
      case '未見積': return 'bg-gray-100 text-gray-800';
      case 'ボツ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = (formData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProject) {
      // 編集
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? { ...p, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
    } else {
      // 新規追加
      const newProject: Project = {
        ...formData,
        id: Math.max(...projects.map(p => p.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setProjects(prev => [...prev, newProject]);
    }
    setShowForm(false);
    setSelectedProject(null);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('このプロジェクトを削除しますか？')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">プロジェクト一覧</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          新規追加
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                進捗状況
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会社名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                現場名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                機材
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                撮影担当
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                撮影期間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.companyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.siteName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.equipment.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.photographer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.shootPeriod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    編集
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProjectForm
          project={selectedProject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">プロジェクトがありません</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;