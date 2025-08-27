import React, { forwardRef } from 'react';

// ボタンのバリアント定義
const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary', 
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success'
};

// ボタンのサイズ定義
const SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

// バリアント別スタイル
const getVariantClasses = (variant) => {
  switch (variant) {
    case VARIANTS.PRIMARY:
      return "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800";
    case VARIANTS.SECONDARY:
      return "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700";
    case VARIANTS.OUTLINE:
      return "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/10";
    case VARIANTS.GHOST:
      return "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800";
    case VARIANTS.DANGER:
      return "bg-red-600 text-white hover:bg-red-700 active:bg-red-800";
    case VARIANTS.SUCCESS:
      return "bg-green-600 text-white hover:bg-green-700 active:bg-green-800";
    default:
      return "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800";
  }
};

// サイズ別スタイル
const getSizeClasses = (size) => {
  switch (size) {
    case SIZES.XS:
      return "h-8 px-3 text-xs min-h-[32px]";
    case SIZES.SM:
      return "h-9 px-4 text-sm min-h-[36px]";
    case SIZES.MD:
      return "h-11 px-5 text-base min-h-[44px]";
    case SIZES.LG:
      return "h-12 px-6 text-lg min-h-[48px]";
    case SIZES.XL:
      return "h-14 px-8 text-xl min-h-[56px]";
    default:
      return "h-11 px-5 text-base min-h-[44px]";
  }
};

// LoadingSpinner コンポーネント
const LoadingSpinner = ({ size = 16 }) => (
  <div
    className="animate-spin rounded-full border-2 border-transparent border-t-current"
    style={{ width: size, height: size }}
    aria-hidden="true"
  />
);

// ボタンコンポーネント
export const Button = forwardRef(({
  variant = VARIANTS.PRIMARY,
  size = SIZES.MD,
  children,
  leftIcon,
  rightIcon,
  isLoading = false,
  isDisabled = false,
  isFullWidth = false,
  className = '',
  loadingText,
  ariaLabel,
  ...props
}, ref) => {
  const spinnerSize = {
    [SIZES.XS]: 12,
    [SIZES.SM]: 14,
    [SIZES.MD]: 16,
    [SIZES.LG]: 20,
    [SIZES.XL]: 24,
  };

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const gapClasses = leftIcon || rightIcon || isLoading ? "gap-2" : "";
  const widthClasses = isFullWidth ? "w-full" : "";

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${gapClasses} ${widthClasses} ${className}`.trim()}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={spinnerSize[size]} />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          {children && <span>{children}</span>}
          {rightIcon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

// IconButton - アイコンのみのボタン用
export const IconButton = forwardRef(({
  icon,
  children,
  size = SIZES.MD,
  variant = VARIANTS.GHOST,
  isRound = false,
  ariaLabel,
  className = '',
  ...props
}, ref) => {
  const iconSize = {
    [SIZES.XS]: 14,
    [SIZES.SM]: 16,
    [SIZES.MD]: 20,
    [SIZES.LG]: 24,
    [SIZES.XL]: 28
  };

  const sizeClasses = {
    [SIZES.XS]: "w-8 h-8",
    [SIZES.SM]: "w-9 h-9", 
    [SIZES.MD]: "w-11 h-11",
    [SIZES.LG]: "w-12 h-12",
    [SIZES.XL]: "w-14 h-14",
  };

  const roundClasses = isRound ? "rounded-full" : "";

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      ariaLabel={ariaLabel}
      className={`${sizeClasses[size]} ${roundClasses} ${className}`.trim()}
      {...props}
    >
      {React.cloneElement(icon, { 
        size: iconSize[size],
        'aria-hidden': 'true'
      })}
      {children && <span className="sr-only">{children}</span>}
    </Button>
  );
});

// FloatingActionButton - 浮遊ボタン用  
export const FloatingActionButton = forwardRef(({
  icon,
  position = 'bottom-right',
  offset = 6,
  size = SIZES.LG,
  variant = VARIANTS.PRIMARY,
  className = '',
  ...props
}, ref) => {
  const positionClasses = {
    'bottom-right': `fixed bottom-6 right-6`,
    'bottom-left': `fixed bottom-6 left-6`,
    'top-right': `fixed top-6 right-6`,
    'top-left': `fixed top-6 left-6`
  };

  return (
    <IconButton
      ref={ref}
      icon={icon}
      size={size}
      variant={variant}
      isRound={true}
      className={`${positionClasses[position]} z-50 shadow-lg hover:shadow-xl transition-shadow duration-150 ${className}`.trim()}
      {...props}
    />
  );
});

// エクスポート
Button.displayName = 'Button';
IconButton.displayName = 'IconButton';
FloatingActionButton.displayName = 'FloatingActionButton';

export { VARIANTS, SIZES };
export default Button;