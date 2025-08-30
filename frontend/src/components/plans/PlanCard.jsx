import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Calendar } from 'lucide-react';

// カードごとに異なるグラデーションを生成するためのヘルパー
const generateGradient = (id) => {
  const gradients = [
    'from-rose-400 to-orange-300',
    'from-sky-400 to-blue-500',
    'from-green-400 to-teal-500',
    'from-purple-400 to-indigo-500',
    'from-yellow-400 to-amber-500',
  ];
  // IDに基づいて安定したグラデーションを選択
  const index = (String(id).charCodeAt(0) || 0) % gradients.length;
  return gradients[index];
};

export function PlanCard({ plan, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '日付未設定';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });
  };

  const gradientClass = generateGradient(plan.id);

  return (
    <div className="ui-card group relative flex flex-col bg-background-primary rounded-ui-lg shadow-md border border-border-primary overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <Link to={`/trip-plan/${plan.id}`} className="block cursor-pointer">
        {/* --- Key Visual Area --- */}
        <div className={`relative aspect-video bg-gradient-to-tr ${gradientClass} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
          {/* Visual effect */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* --- Content Area --- */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="font-bold text-xl text-text-primary truncate">
            {plan.title || '無題のプラン'}
          </h3>
          <div className="flex items-center text-sm text-text-secondary mt-2">
            <Calendar className="w-4 h-4 mr-2 shrink-0" />
            <span>{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</span>
          </div>
          {/* TODO: Add more details like number of spots, etc. */}
          <div className="flex-grow"></div>
          <div className="text-right text-sm text-accent-primary font-semibold mt-4 group-hover:underline">
            プランを見る →
          </div>
        </div>
      </Link>

      {/* --- Delete Button --- */}
      <div className="absolute top-3 right-3 z-10">
        <button 
          onClick={() => onDelete(plan.id)}
          aria-label={`${plan.tripTitle || 'このプラン'}を削除`}
          className="ui-button-icon bg-background-primary/60 text-text-secondary transition-all duration-200 backdrop-blur-sm hover:bg-accent-primary hover:text-white hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
