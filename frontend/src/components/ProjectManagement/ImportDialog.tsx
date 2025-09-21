import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (importData: any[]) => {
      console.log('インポートデータ:', importData);
      const response = await apiClient.post('/api/projects/import', { projects: importData });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert(`インポートが完了しました: ${data.count}件`);
      setIsProcessing(false);
      onClose();
    },
    onError: (error: any) => {
      console.error('Import error:', error);
      alert(`インポートに失敗しました: ${error?.response?.data?.error || error.message}`);
      setIsProcessing(false);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    // テスト用のサンプルデータでインポート
    const sampleData = [
      {
        進捗状況: '完了',
        会社名: 'テスト会社1',
        現場名: 'テスト現場1',
        機材: '["FARO"]',
        撮影担当: 'テスト担当者',
        撮影期間: '2025-01-01 - 2025-01-05',
        撮影開始日: '2025-01-01',
        撮影終了日: '2025-01-05',
        備考: 'インポートテスト',
        現場住所: '東京都'
      }
    ];

    setIsProcessing(true);
    importMutation.mutate(sampleData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Excelデータインポート（テスト版）
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excelファイルを選択
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            {file && (
              <div className="text-sm text-gray-600">
                選択ファイル: {file.name}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              ※ 現在はテスト用サンプルデータをインポートします
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleImport}
              disabled={isProcessing}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? '処理中...' : 'テストインポート実行'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDialog;