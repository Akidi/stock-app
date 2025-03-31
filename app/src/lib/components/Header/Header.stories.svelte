<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Header from './Header.svelte';

  const { Story } = defineMeta({
    component: Header,
    title: 'UI/Header',
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
      argTypes: {
        title: { control: 'text', },
      },
    },
  });
</script>

<Story name="Default" args={{ title: 'AppName' }} />
