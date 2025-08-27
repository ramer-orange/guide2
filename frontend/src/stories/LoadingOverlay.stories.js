import { LoadingOverlay } from '../components/Map/LoadingOverlay';

export default {
  title: 'UI/Feedback/LoadingOverlay',
  component: LoadingOverlay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'ローディング表示の表示/非表示',
    },
    message: {
      control: 'text',
      description: 'ローディング時に表示するメッセージ',
    },
  },
};

export const Default = {
  args: {
    isVisible: true,
    message: 'スポット情報を更新中...',
  },
};

export const Hidden = {
  args: {
    isVisible: false,
    message: 'スポット情報を更新中...',
  },
};

export const CustomMessage = {
  args: {
    isVisible: true,
    message: 'データを読み込んでいます...',
  },
};

export const LongMessage = {
  args: {
    isVisible: true,
    message: '大量のデータを処理中です。しばらくお待ちください...',
  },
};

export const NoMessage = {
  args: {
    isVisible: true,
  },
};