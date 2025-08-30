import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function BackButton({ variant = "ghost", to = "/management", children = "管理画面へ戻る", ...props }) {
  const baseClasses = "inline-flex items-center justify-center h-10 rounded-full font-semibold transition-all duration-200 ease-in-out group";
  const iconClasses = "w-4 h-4 transition-colors";
  const textClasses = "ml-2 text-sm transition-colors";

  const variantClasses = {
    ghost: `
      border-2 border-transparent text-text-secondary
      hover:bg-accent-primary/10 hover:text-accent-primary
      dark:text-text-secondary dark:hover:bg-accent-primary/10 dark:hover:text-accent-primary
    `,
    soft: `
      border border-border-primary bg-background-secondary text-text-primary
      hover:bg-background-tertiary hover:border-border-secondary
      dark:border-border-primary dark:bg-background-secondary dark:text-text-primary
      dark:hover:bg-background-tertiary dark:hover:border-border-secondary
    `,
  };

  // ピンク等の色面上でも埋もれないためのコントラスト調整ルール
  // border/背景の不透明度で調整
  const contrastAdjustedClasses = {
    ghost: `
      hover:bg-accent-primary/10 dark:hover:bg-accent-primary/10
    `,
    soft: `
      bg-background-secondary/80 border-border-primary/80
      dark:bg-background-secondary/80 dark:border-border-primary/80
    `,
  };

  return (
    <Link to={to} aria-label={typeof children === 'string' ? children : "戻る"} {...props}>
      <button
        type="button"
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${contrastAdjustedClasses[variant]}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus focus-visible:ring-offset-background-primary
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <ChevronLeft className={iconClasses} />
        <span className={textClasses}>{children}</span>
      </button>
    </Link>
  );
}
