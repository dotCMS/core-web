import { Story, Meta } from '@storybook/angular/types-6-0';
import { InputNumberModule } from 'primeng/inputnumber';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'PrimeNG/Form/InputNumber',
  component: InputNumberModule,
  parameters: {
    docs: {
      description: {
        component:
          'Textarea is a multi-line text input element.: https://primefaces.org/primeng/showcase/#/inputtext',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [InputNumberModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    checked: false,
  },
} as Meta;

const InputNumberTemplate = `
  <p-inputNumber [(ngModel)]="val" mode="decimal"></p-inputNumber>
`;


const Template: Story<any> = (props: any) => {
  const template = InputNumberTemplate;
  return {
    props,
    template,
  };
};

export const Basic: Story = Template.bind({});

Basic.parameters = {
  docs: {
    source: {
      code: InputNumberTemplate,
    },
  },
};
