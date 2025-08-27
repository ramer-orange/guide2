import React from 'react';
import { PlanCard } from './PlanCard';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { IoSadOutline, IoLocationOutline } from 'react-icons/io5';

// ローディングコンポーネント
const LoadingState = () => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div 
        key={index}
        className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
      >
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-1/2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5" />
      </div>
    ))}
  </div>
);

// エラーコンポーネント
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
      <IoSadOutline size={32} className="text-red-600 dark:text-red-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      エラーが発生しました
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
      {message || 'プランの取得中に問題が発生しました。'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        再試行
      </button>
    )}
  </div>
);

// 空状態コンポーネント
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 mb-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
      <IoLocationOutline size={40} className="text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
      まだプランがありません
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
      最初の旅行プランを作成して、素晴らしい旅の計画を始めましょう。
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
        新規プラン作成
      </button>
      <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors duration-200">
        サンプルを見る
      </button>
    </div>
  </div>
);

// メインコンポーネント
export const PlanList = ({ 
  plans = [], 
  onDelete, 
  loading = false, 
  error = null 
}) => {
  const { isMobile } = useBreakpoint();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!plans || plans.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
};