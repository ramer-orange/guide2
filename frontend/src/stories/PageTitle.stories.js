import { PageTitle } from '../components/PageTitle/PageTitle';

export default {
  title: 'UI/Typography/PageTitle',
  component: PageTitle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '表示するタイトルテキスト',
    },
  },
};

export const Default = {
  args: {
    title: 'ページタイトル',
  },
};

export const ShortTitle = {
  args: {
    title: '短いタイトル',
  },
};

export const LongTitle = {
  args: {
    title: 'とても長いページタイトルでレイアウトの確認をする場合のサンプル',
  },
};

export const JapaneseTitle = {
  args: {
    title: '日本語のページタイトル例',
  },
};

export const EnglishTitle = {
  args: {
    title: 'English Page Title Example',
  },
};