import { PlanCreateButton } from '../components/button/PlanCreateButton';

export default {
  title: 'UI/Buttons/PlanCreateButton',
  component: PlanCreateButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    handleCreate: { action: 'plan-created' },
    children: {
      control: 'text',
      description: 'ボタンに表示するテキスト',
    },
  },
};

export const Default = {
  args: {
    handleCreate: () => console.log('プラン作成'),
    children: 'プランを作成',
  },
};

export const Creating = {
  args: {
    handleCreate: () => console.log('プラン作成中...'),
    children: '作成中...',
  },
};

export const LongText = {
  args: {
    handleCreate: () => console.log('プラン作成'),
    children: '新しい旅行プランを作成する',
  },
};

export const ShortText = {
  args: {
    handleCreate: () => console.log('プラン作成'),
    children: '作成',
  },
};