import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../../services/api';
import { Project } from '../../types/project';
import ProjectForm from './ProjectForm';
import ImportDialog from './ImportDialog';

const ProjectList: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const [showImportDialog, setShowImportDialog] = useState(false);

  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll(),
  });

  // プロジェクト作成
  const createProjectMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowForm(false);
      setSelectedProject(null);
    },
  });

  // プロジェクト更新
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) => 
      projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowForm(false);
      setSelectedProject(null);
    },
  });

  // プロジェクト削除
  const deleteProjectMutation = useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

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
      updateProjectMutation.mutate({
        id: selectedProject.id,
        data: { ...formData, updatedBy: '管理者' }
      });
    } else {
      // 新規追加
      createProjectMutation.mutate({
        ...formData,
        createdBy: '管理者',
        updatedBy: '管理者'
      });
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('このプロジェクトを削除しますか？')) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  if (isLoading) {
    return <div className="text-center py-12">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">エラーが発生しました</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">プロジェクト一覧</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowImportDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Excelインポート
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            新規追加
          </button>
        </div>
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

      {showImportDialog && (
        <ImportDialog
          isOpen={showImportDialog}
          onClose={() => setShowImportDialog(false)}
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