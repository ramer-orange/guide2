import { AddSpot } from '../components/button/AddSpot';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'UI/Buttons/AddSpot',
  component: AddSpot,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    onAddSpot: { action: 'spot-added' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    onAddSpot: () => console.log('スポット追加ボタンがクリックされました'),
  },
};

export const WithCustomHandler = {
  args: {
    onAddSpot: (spotData) => {
      console.log('カスタムハンドラー:', spotData);
      alert('スポットが追加されました！');
    },
  },
};