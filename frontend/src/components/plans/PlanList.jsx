import { PlanCard } from './PlanCard';
import { Loader, AlertTriangle, Info } from 'lucide-react';

// 状態表示用の汎用コンポーネント
const StateDisplay = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center text-center h-64 bg-background-secondary rounded-ui-lg">
    <div className="w-12 h-12 flex items-center justify-center bg-background-tertiary rounded-full mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-text-primary">{title}</h3>
    <p className="text-text-secondary mt-1">{message}</p>
  </div>
);

export const PlanList = ({ plans, onDelete, loading, error }) => {
  if (loading) {
    return <StateDisplay 
      icon={<Loader className="w-6 h-6 text-text-secondary animate-spin" />} 
      title="プランを読み込み中..." 
      message="少々お待ちください。"
    />;
  }

  if (error) {
    return <StateDisplay 
      icon={<AlertTriangle className="w-6 h-6 text-error" />} 
      title="プランの読み込みに失敗しました" 
      message="時間をおいて再度お試しください。"
    />;
  }

  if (!plans || plans.length === 0) {
    return <StateDisplay 
      icon={<Info className="w-6 h-6 text-text-tertiary" />} 
      title="まだプランがありません"
      message="「新しいプランを作成」から最初の旅行プランを計画しましょう。"
    />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};