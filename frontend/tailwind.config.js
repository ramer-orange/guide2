/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // OSのテーマ設定に追従
  theme: {
    extend: {
      // =================================================================
      // ** Design Tokens (CSS Variables)
      // =================================================================
      // `src/styles/variables.css`で定義された変数を参照
      colors: {
        // --- Background ---
        'background-primary': 'var(--color-background-primary)',
        'background-secondary': 'var(--color-background-secondary)',
        'background-tertiary': 'var(--color-background-tertiary)',
        'background-overlay': 'var(--color-background-overlay)',
        // --- Text ---
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-placeholder': 'var(--color-text-placeholder)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-accent': 'var(--color-text-accent)',
        'text-on-accent': 'var(--color-text-on-accent)',
        'text-error': 'var(--color-text-error)',
        // --- Border ---
        'border-primary': 'var(--color-border-primary)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-focus': 'var(--color-border-focus)',
        // --- Brand / Accent ---
        'accent-primary': 'var(--color-accent-primary)',
        'accent-primary-hover': 'var(--color-accent-primary-hover)',
        'accent-primary-disabled': 'var(--color-accent-primary-disabled)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        'ui-sm': 'var(--radius-sm)',
        'ui-md': 'var(--radius-md)',
        'ui-lg': 'var(--radius-lg)',
        'ui-full': '9999px',
      },
      boxShadow: {
        'ui-sm': 'var(--shadow-sm)',
        'ui-md': 'var(--shadow-md)',
        'ui-lg': 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        'ui-ease': 'var(--ease-ui)',
      },
      transitionDuration: {
        'ui-fast': 'var(--duration-fast)',
        'ui-normal': 'var(--duration-normal)',
        'ui-slow': 'var(--duration-slow)',
      },
      keyframes: {
        // --- Animation ---
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-down': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'highlight': {
          '0%': { backgroundColor: 'var(--color-accent-primary-highlight)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--duration-normal) var(--ease-ui)',
        'fade-out': 'fade-out var(--duration-normal) var(--ease-ui)',
        'slide-in-up': 'slide-in-up var(--duration-normal) var(--ease-ui)',
        'slide-out-down': 'slide-out-down var(--duration-normal) var(--ease-ui)',
        'highlight': 'highlight 1s var(--ease-ui)',
        'fade-in-down': 'fade-in-down 0.3s ease-out',
        'fade-out-up': 'fade-out-up 0.3s ease-in',
      },
    },
  },
  plugins: [
    // focus-visibleリングを有効化
    function ({ addVariant }) {
      addVariant('focus-visible-within', '&:has(:focus-visible)');
    },
  ],
}