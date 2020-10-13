import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'primeng/tooltip';

export default {
  title: 'PrimeNG/Overlay/Tooltip',
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip directive provides advisory information for a component.: https://primefaces.org/primeng/showcase/#/tooltip',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [TooltipModule, BrowserAnimationsModule],
    }),
  ],
  args: {},
} as Meta;

const TooltipTemplate = `<input type="text" pTooltip="Enter your username">`;

const Template: Story<any> = (props: any) => {
  const template = TooltipTemplate;
  return {
    props,
    template,
  };
};

export const Basic: Story = Template.bind({});

Basic.parameters = {
  docs: {
    source: {
      code: TooltipTemplate,
    },
  },
};
