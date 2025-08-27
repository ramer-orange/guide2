import React, { forwardRef } from 'react';

// バリアント別スタイル
const getVariantClasses = (variant) => {
  switch (variant) {
    case 'elevated':
      return "bg-white dark:bg-gray-800 border-0";
    case 'outlined':
      return "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700";
    case 'filled':
      return "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
    default: // 'default'
      return "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700";
  }
};

// エレベーション（影）
const getElevationClasses = (elevation) => {
  const elevations = {
    0: "",
    1: "shadow-sm",
    2: "shadow-md", 
    3: "shadow-lg",
    4: "shadow-xl"
  };
  return elevations[elevation] || elevations[1];
};

// パディング
const getPaddingClasses = (padding) => {
  const paddings = {
    none: "p-0",
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8"
  };
  return paddings[padding] || paddings.md;
};

// 角丸
const getRadiusClasses = (radius) => {
  const radiuses = {
    none: "rounded-none",
    sm: "rounded-sm",
    default: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full"
  };
  return radiuses[radius] || radiuses.default;
};

// Cardコンポーネント
export const Card = forwardRef(({
  children,
  variant = 'default',
  elevation = 1,
  padding = 'md',
  radius = 'default',
  interactive = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  
  const baseClasses = "relative block w-full transition-all duration-150 ease-out outline-none";
  const variantClasses = getVariantClasses(variant);
  const elevationClasses = getElevationClasses(elevation);
  const paddingClasses = getPaddingClasses(padding);
  const radiusClasses = getRadiusClasses(radius);
  
  const interactiveClasses = interactive || onClick 
    ? "cursor-pointer select-none hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
    : "";

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      ref={ref}
      className={`
        ${baseClasses}
        ${variantClasses}
        ${elevationClasses}
        ${paddingClasses}
        ${radiusClasses}
        ${interactiveClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      onClick={onClick}
      tabIndex={interactive || onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

// CardHeader サブコンポーネント
export const CardHeader = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

// CardBody サブコンポーネント  
export const CardBody = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`flex-1 ${className}`}
    {...props}
  >
    {children}
  </div>
));

// CardFooter サブコンポーネント
export const CardFooter = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`mt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

// CardImage サブコンポーネント
export const CardImage = forwardRef(({
  src,
  alt,
  aspectRatio = '16/9',
  objectFit = 'cover',
  placeholder,
  onLoad,
  onError,
  className = '',
  ...props
}, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleLoad = (e) => {
    setImageLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setImageError(true);
    onError?.(e);
  };

  return (
    <div
      className={`relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}
      style={{ aspectRatio }}
      {...props}
    >
      {!imageError && src && (
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-${objectFit} transition-opacity duration-200 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      
      {/* スケルトンローディング */}
      {!imageLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          aria-hidden="true"
        >
          {placeholder || (
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg opacity-50 animate-pulse" />
          )}
        </div>
      )}

      {/* エラー状態 */}
      {imageError && (
        <div
          className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-sm"
          aria-label="画像の読み込みに失敗しました"
        >
          {placeholder || '画像なし'}
        </div>
      )}
    </div>
  );
});

// displayName設定
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardImage.displayName = 'CardImage';

export default Card;