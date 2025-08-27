import { BackToManagementButton } from '../components/button/BackToManagementButton';

export default {
  title: 'UI/Buttons/BackToManagementButton',
  component: BackToManagementButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'ボタンに表示するテキスト',
    },
  },
};

export const Default = {
  args: {
    children: '管理画面に戻る',
  },
};

export const Short = {
  args: {
    children: '戻る',
  },
};

export const Long = {
  args: {
    children: '旅行プラン管理画面に戻る',
  },
};

export const WithIcon = {
  args: {
    children: '← 管理画面に戻る',
  },
};