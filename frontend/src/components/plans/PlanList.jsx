import { PlanCard } from './PlanCard';

export const PlanList = ({ plans, onDelete, loading, error }) => {
  if (loading) {
    return <div className="loading">プランを読み込み中...</div>;
  }

  if (error) {
    return <div className="error">プランの読み込みに失敗しました。</div>;
  }

  if (plans.length === 0) {
    return <div className="empty">プランがありません。</div>;
  }

  return (
    <div className="plan-list">
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
