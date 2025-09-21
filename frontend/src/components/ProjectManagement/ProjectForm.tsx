import React, { useState, useEffect } from 'react';
import { Project } from '../../types/project';
import { mockEquipment, mockStatuses } from '../../data/mockData';

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    status: '未見積' as Project['status'],
    companyName: '',
    siteName: '',
    equipment: [] as string[],
    clientContact: '',
    photographer: '',
    shootPeriod: '',
    startDate: '',
    endDate: '',
    drawingModel: '',
    remarks: '',
    siteAddress: '',
    createdBy: '管理者',
    updatedBy: '管理者',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        status: project.status,
        companyName: project.companyName,
        siteName: project.siteName,
        equipment: project.equipment,
        clientContact: project.clientContact || '',
        photographer: project.photographer || '',
        shootPeriod: project.shootPeriod || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        drawingModel: project.drawingModel || '',
        remarks: project.remarks || '',
        siteAddress: project.siteAddress || '',
        createdBy: project.createdBy,
        updatedBy: '管理者',
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleEquipmentChange = (equipmentName: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipmentName]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        equipment: prev.equipment.filter(eq => eq !== equipmentName)
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {project ? 'プロジェクト編集' : '新規プロジェクト追加'}
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 進捗状況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">進捗状況</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {mockStatuses.map(status => (
                  <option key={status.id} value={status.name}>{status.name}</option>
                ))}
              </select>
            </div>

            {/* 会社名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">会社名</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* 現場名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">現場名</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* 撮影担当 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">撮影担当</label>
              <input
                type="text"
                value={formData.photographer}
                onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* 撮影開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">撮影開始日</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* 撮影終了日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">撮影終了日</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 使用機材 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">使用機材</label>
            <div className="grid grid-cols-3 gap-2">
              {mockEquipment.map(equipment => (
                <label key={equipment.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.equipment.includes(equipment.name)}
                    onChange={(e) => handleEquipmentChange(equipment.name, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{equipment.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 現場住所 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">現場住所</label>
            <input
              type="text"
              value={formData.siteAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, siteAddress: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">備考</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {project ? '更新' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;