import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../../services/api';
import { Project } from '../../types/project';

const AnalyticsView: React.FC = () => {
  // APIからプロジェクトデータを取得
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll(),
  });

  // 機材使用回数の集計
  const equipmentUsage = useMemo(() => {
    const usage: { [key: string]: number } = {};
    
    // 利用可能な機材リストを初期化
    const availableEquipment = ['FARO', 'L2pro', 'Pro3', 'RTC', 'BLK', 'Pro2'];
    availableEquipment.forEach(eq => {
      usage[eq] = 0;
    });

    // プロジェクトごとに機材使用回数をカウント
    projects.forEach(project => {
      project.equipment.forEach(eq => {
        if (usage[eq] !== undefined) {
          usage[eq]++;
        }
      });
    });

    return Object.entries(usage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  // 進捗状況別の件数
  const statusStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    
    projects.forEach(project => {
      stats[project.status] = (stats[project.status] || 0) + 1;
    });

    return Object.entries(stats).map(([status, count]) => ({ status, count }));
  }, [projects]);

  // 月別プロジェクト数
  const monthlyStats = useMemo(() => {
    const monthly: { [key: string]: number } = {};
    
    projects.forEach(project => {
      if (project.startDate) {
        const month = new Date(project.startDate).toLocaleDateString('ja-JP', { 
          year: 'numeric', 
          month: 'long' 
        });
        monthly[month] = (monthly[month] || 0) + 1;
      }
    });

    return Object.entries(monthly)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [projects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '完了': return 'bg-green-500';
      case '日程決': return 'bg-blue-500';
      case '見積済': return 'bg-yellow-500';
      case '未見積': return 'bg-gray-500';
      case 'ボツ': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">エラーが発生しました</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">分析・集計</h2>

      {/* 概要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
          <div className="text-sm text-gray-500">総プロジェクト数</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {statusStats.find(s => s.status === '完了')?.count || 0}
          </div>
          <div className="text-sm text-gray-500">完了済み</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {statusStats.find(s => s.status === '日程決')?.count || 0}
          </div>
          <div className="text-sm text-gray-500">進行中</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">
            {statusStats.find(s => s.status === '未見積')?.count || 0}
          </div>
          <div className="text-sm text-gray-500">未見積</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 機材使用状況 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">機材使用状況</h3>
          <div className="space-y-3">
            {equipmentUsage.map(({ name, count }) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{name}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${count > 0 ? Math.max((count / Math.max(...equipmentUsage.map(e => e.count))) * 100, 5) : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 進捗状況別統計 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">進捗状況別統計</h3>
          <div className="space-y-3">
            {statusStats.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      style={{
                        width: `${count > 0 ? Math.max((count / projects.length) * 100, 5) : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 月別統計 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">月別プロジェクト開始数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlyStats.map(({ month, count }) => (
            <div key={month} className="border rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900">{month}</div>
              <div className="text-2xl font-bold text-blue-600">{count}件</div>
            </div>
          ))}
        </div>
      </div>

      {/* データエクスポート */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">データエクスポート</h3>
        <div className="flex space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Excel形式でダウンロード
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            CSV形式でダウンロード
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            PDF形式でダウンロード
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;