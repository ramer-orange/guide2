import React, { useState, useEffect } from 'react';
import { IoStar, IoTime, IoLocation, IoAdd } from 'react-icons/io5';
import { Card, CardImage, CardBody } from './Card';
import { Button, FloatingActionButton } from './Button';

// カテゴリアイコンマッピング
const getCategoryIcon = (category) => {
  // Google Places APIのカテゴリに基づいたアイコン
  const categoryMap = {
    restaurant: '🍽️',
    tourist_attraction: '🏛️',
    lodging: '🏨',
    shopping_mall: '🛍️',
    park: '🌳',
    museum: '🏛️',
    church: '⛪',
    hospital: '🏥',
    school: '🏫',
    bank: '🏦',
    gas_station: '⛽',
    pharmacy: '💊'
  };
  
  return categoryMap[category] || '📍';
};

// 営業時間の表示用フォーマット
const formatOpeningHours = (openingHours, isOpenNow) => {
  if (!openingHours || !openingHours.weekday_text) return null;
  
  const today = new Date().getDay();
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const todayHours = openingHours.weekday_text[today === 0 ? 6 : today - 1];
  
  return {
    todayHours,
    isOpenNow,
    status: isOpenNow ? '営業中' : '休業中'
  };
};

// 距離の表示用フォーマット
const formatDistance = (distance) => {
  if (!distance) return null;
  
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
};

// PlaceCardコンポーネント
export const PlaceCard = ({
  place,
  onAddToPlan,
  distance,
  isSelected = false,
  isFloatingButton = false,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // アニメーション用の表示制御
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!place) return null;

  // データの整理
  const {
    name,
    rating,
    user_ratings_total,
    photos,
    formatted_address,
    types,
    opening_hours,
    price_level,
    place_id
  } = place;

  const mainPhoto = photos?.[0];
  const photoUrl = mainPhoto ? 
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${mainPhoto.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}` : 
    null;

  const primaryCategory = types?.[0] || 'establishment';
  const categoryIcon = getCategoryIcon(primaryCategory);
  const hoursInfo = formatOpeningHours(opening_hours, opening_hours?.open_now);
  const formattedDistance = formatDistance(distance);

  // 価格レベル表示
  const priceDisplay = price_level ? '¥'.repeat(price_level) : null;

  // カード内のボタン（デスクトップ用）
  const AddButton = () => (
    <Button
      variant="primary"
      size="sm"
      leftIcon={<IoAdd />}
      onClick={(e) => {
        e.stopPropagation();
        onAddToPlan?.(place);
      }}
      className="add-button"
      style={{
        position: 'absolute',
        bottom: 'var(--space-3)',
        right: 'var(--space-3)',
        zIndex: 2
      }}
      ariaLabel={`${name}をプランに追加`}
    >
      プランに追加
    </Button>
  );

  // フローティングボタン（モバイル用）
  const FloatingAddButton = () => (
    <FloatingActionButton
      icon={<IoAdd />}
      onClick={() => onAddToPlan?.(place)}
      position="bottom-right"
      variant="primary"
      ariaLabel={`${name}をプランに追加`}
    />
  );

  const cardContent = (
    <>
      {/* 画像セクション */}
      <CardImage
        src={!imageError ? photoUrl : null}
        alt={name}
        aspectRatio="4/3"
        onError={() => setImageError(true)}
        placeholder={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-3xl)',
              color: 'var(--text-muted)'
            }}
          >
            {categoryIcon}
          </div>
        }
        style={{
          position: 'relative'
        }}
      />

      {/* コンテンツ */}
      <CardBody style={{ position: 'relative', paddingBottom: isFloatingButton ? 'var(--space-4)' : 'var(--space-16)' }}>
        {/* 基本情報 */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <h3
            style={{
              margin: 0,
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text)',
              lineHeight: 'var(--line-height-tight)',
              marginBottom: 'var(--space-1)'
            }}
          >
            {name}
          </h3>
          
          {/* 評価とカテゴリ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)',
              flexWrap: 'wrap'
            }}
          >
            {rating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)'
                }}
              >
                <IoStar 
                  size={16} 
                  style={{ color: 'var(--warning)' }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--text)'
                  }}
                >
                  {rating.toFixed(1)}
                </span>
                {user_ratings_total && (
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    ({user_ratings_total.toLocaleString()})
                  </span>
                )}
              </div>
            )}
            
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}
            >
              <span>{categoryIcon}</span>
              <span>{primaryCategory.replace(/_/g, ' ')}</span>
            </div>

            {priceDisplay && (
              <div
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--accent)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                {priceDisplay}
              </div>
            )}
          </div>
        </div>

        {/* 営業時間 */}
        {hoursInfo && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)'
            }}
          >
            <IoTime 
              size={14} 
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: hoursInfo.isOpenNow ? 'var(--accent)' : 'var(--danger)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              {hoursInfo.status}
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {hoursInfo.todayHours?.split(': ')[1]}
            </span>
          </div>
        )}

        {/* 住所と距離 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)'
          }}
        >
          <IoLocation 
            size={14} 
            style={{ 
              color: 'var(--text-muted)',
              flexShrink: 0,
              marginTop: '2px'
            }}
            aria-hidden="true"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--line-height-normal)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {formatted_address}
            </div>
            {formattedDistance && (
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--primary)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginTop: 'var(--space-1)'
                }}
              >
                約 {formattedDistance}
              </div>
            )}
          </div>
        </div>

        {/* デスクトップ用の追加ボタン */}
        {!isFloatingButton && onAddToPlan && (
          <div className="desktop-only">
            <AddButton />
          </div>
        )}
      </CardBody>

      {/* アニメーション用スタイル */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(12px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .add-button {
            display: none !important;
          }
        }
        
        @media (min-width: 641px) {
          .floating-add-button {
            display: none !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          @keyframes slideInRight {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>
    </>
  );

  return (
    <>
      <Card
        variant="elevated"
        elevation={isSelected ? 3 : 2}
        interactive
        className={`place-card ${isSelected ? 'place-card--selected' : ''} ${className}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(12px)',
          transition: 'all var(--duration-normal) var(--ease-out)',
          maxWidth: '360px',
          border: isSelected ? '2px solid var(--primary)' : undefined,
          ...props.style
        }}
        {...props}
      >
        {cardContent}
      </Card>

      {/* モバイル用フローティングボタン */}
      {isFloatingButton && onAddToPlan && (
        <div className="mobile-only floating-add-button">
          <FloatingAddButton />
        </div>
      )}
    </>
  );
};

// PlaceCardSkeleton - ローディング用
export const PlaceCardSkeleton = ({ className = '' }) => (
  <Card
    variant="elevated"
    elevation={1}
    className={`place-card-skeleton ${className}`}
    style={{ maxWidth: '360px' }}
  >
    {/* 画像スケルトン */}
    <div
      style={{
        width: '100%',
        aspectRatio: '4/3',
        backgroundColor: 'var(--outline)',
        borderRadius: 'var(--radius)',
        marginBottom: 'var(--space-4)',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite'
      }}
    />
    
    {/* コンテンツスケルトン */}
    <div style={{ padding: 'var(--space-4)' }}>
      {/* タイトル */}
      <div
        style={{
          height: '20px',
          backgroundColor: 'var(--outline)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-2)',
          width: '80%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite'
        }}
      />
      
      {/* 評価行 */}
      <div
        style={{
          height: '16px',
          backgroundColor: 'var(--outline)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-3)',
          width: '60%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite'
        }}
      />
      
      {/* 住所 */}
      <div
        style={{
          height: '14px',
          backgroundColor: 'var(--outline)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-1)',
          width: '100%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite'
        }}
      />
      <div
        style={{
          height: '14px',
          backgroundColor: 'var(--outline)',
          borderRadius: 'var(--radius-sm)',
          width: '70%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite'
        }}
      />
    </div>

    <style jsx>{`
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
      }
      
      @media (prefers-reduced-motion: reduce) {
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.5; }
        }
      }
    `}</style>
  </Card>
);

export default PlaceCard;