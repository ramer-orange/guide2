import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, IconButton } from '@/components/ui/Button';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { IoCalendar, IoTime, IoPencil, IoTrash, IoLocationOutline } from 'react-icons/io5';

// 日付フォーマット関数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${month}/${day}(${dayOfWeek})`;
};

// 日数計算関数
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// ステータス判定関数
const getPlanStatus = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  if (today < start) {
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { type: 'upcoming', label: `あと${diffDays}日`, color: 'var(--primary)' };
  } else if (today >= start && today <= end) {
    return { type: 'ongoing', label: '実行中', color: 'var(--accent)' };
  } else {
    return { type: 'completed', label: '完了', color: 'var(--text-muted)' };
  }
};

export const PlanCard = ({ plan, onDelete, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // アニメーション用の表示制御
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);
  
  // 削除確認処理
  const handleDelete = async () => {
    if (!window.confirm('このプランを削除しますか？\n削除したプランは復元できません。')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(plan.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };
  
  const status = getPlanStatus(plan.start_date, plan.end_date);
  const days = calculateDays(plan.start_date, plan.end_date);
  
  return (
    <Card
      interactive
      elevation={2}
      className={`plan-card transition-all duration-200 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${isDeleting ? 'grayscale pointer-events-none' : ''}`}
    >
      <CardBody>
        {/* ヘッダー：タイトルとステータス */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight flex-1 min-w-0 rounded-md">
            {plan.title || 'タイトル未設定'}
          </h3>
          
          {/* ステータスバッジ */}
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: status.color }}
          >
            {status.label}
          </div>
        </div>
        
        {/* 日程情報 */}
        <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
          <IoCalendar size={16} aria-hidden="true" />
          <span className="text-sm">
            {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
          </span>
          <span className="ml-auto text-xs text-gray-600 dark:text-gray-400">
            {days}日間
          </span>
        </div>
        
        {/* 詳細情報 */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <IoTime size={14} aria-hidden="true" />
            <span>
              {new Date(plan.updated_at).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric'
              })}更新
            </span>
          </div>
        </div>
      </CardBody>
      
      <CardFooter>
        <div className="flex gap-2 items-center">
          {/* 編集ボタン */}
          <Link to={`/trip-plan/${plan.id}`} className="flex-1">
            <Button
              variant="primary"
              leftIcon={<IoPencil />}
              size="sm"
              isFullWidth
              isDisabled={isDeleting}
            >
              編集・詳細
            </Button>
          </Link>
          
          {/* 削除ボタン */}
          <IconButton
            icon={<IoTrash />}
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            ariaLabel={`${plan.title}を削除`}
            isDisabled={isDeleting}
            isLoading={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/10"
          />
        </div>
      </CardFooter>
    </Card>
  );
};
