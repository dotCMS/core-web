// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SplitButtonModule } from 'primeng/splitbutton';

export default {
  title: 'PrimeNG/Button/SplitButton',
  decorators: [
    moduleMetadata({
      imports: [SplitButtonModule],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'SplitButton groups a set of commands in an overlay with a default command: https://primefaces.org/primeng/showcase/#/splitbutton',
      },
    },
  },
} as Meta;

const BasicTemplate = `
  <p>
    <p-splitButton label="Save" icon="pi pi-check"></p-splitButton>
  </p>  
  <p>
    <p-splitButton label="Save" icon="pi pi-check" styleClass="p-button-secondary"></p-splitButton>
  </p>
  <p>
    <p-splitButton label="Save" icon="pi pi-check" styleClass="p-button-disabled"></p-splitButton>
  </p>
`;
export const Basic: Story = () => {
  return {
    template: BasicTemplate,
  };
};

Basic.parameters = {
  docs: {
    source: {
      code: BasicTemplate,
    },
  },
};