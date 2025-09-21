import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../../services/api';
import { Project } from '../../types/project';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    companyName: string;
    siteName: string;
    photographer: string;
    equipment: string[];
    status: string;
  };
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');

  // APIからプロジェクトデータを取得
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll(),
  });

  // プロジェクトデータをカレンダーイベントに変換
  const events: CalendarEvent[] = useMemo(() => {
    return projects
      .filter(project => project.startDate && project.endDate)
      .map(project => ({
        id: project.id,
        title: `${project.companyName} - ${project.siteName}`,
        start: new Date(project.startDate!),
        end: new Date(project.endDate!),
        resource: {
          companyName: project.companyName,
          siteName: project.siteName,
          photographer: project.photographer || '',
          equipment: project.equipment,
          status: project.status,
        },
      }));
  }, [projects]);

  // イベントのスタイルを設定
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.resource.status) {
      case '完了':
        backgroundColor = '#10b981'; // green
        break;
      case '日程決':
        backgroundColor = '#3b82f6'; // blue
        break;
      case '見積済':
        backgroundColor = '#f59e0b'; // yellow
        break;
      case '未見積':
        backgroundColor = '#6b7280'; // gray
        break;
      case 'ボツ':
        backgroundColor = '#ef4444'; // red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '3px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  // カスタムイベントコンポーネント
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="text-xs">
      <div className="font-semibold">{event.resource.companyName}</div>
      <div>{event.resource.siteName}</div>
      <div>{event.resource.photographer}</div>
      <div>{event.resource.equipment.join(', ')}</div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-12">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">エラーが発生しました</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">カレンダー表示</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 rounded text-sm ${
              view === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            月表示
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 rounded text-sm ${
              view === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            週表示
          </button>
        </div>
      </div>

      {/* ステータス凡例 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-2">進捗状況の色分け</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>完了</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>日程決</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>見積済</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
            <span>未見積</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>ボツ</span>
          </div>
        </div>
      </div>

      {/* カレンダー */}
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          messages={{
            next: '次へ',
            previous: '前へ',
            today: '今日',
            month: '月',
            week: '週',
            day: '日',
            agenda: 'アジェンダ',
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;