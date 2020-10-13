import { Story, Meta } from '@storybook/angular/types-6-0';
import { InputTextModule, InputText } from 'primeng/inputtext';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'PrimeNG/Form/InputText',
  component: InputText,
  parameters: {
    docs: {
      description: {
        component:
          'InputText renders a text field to enter data.: https://primefaces.org/primeng/showcase/#/inputtext',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [InputTextModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    checked: false,
  },
} as Meta;

const InputTextTemplate = `
  <div class="form-control">
    <input type="text" class="p-inputtext-sm" placeholder="Small" pInputText /> <br />
    <input type="text" placeholder="Normal" pInputText /> <br />
    <input type="text" class="p-inputtext-lg" placeholder="Large"  pInputText />
  </div>
`;

const Template: Story<InputText> = (props: InputText) => {
  const template = InputTextTemplate;
  return {
    props,
    template,
  };
};

export const Basic: Story = Template.bind({});

Basic.parameters = {
  docs: {
    source: {
      code: InputTextTemplate,
    },
  },
};
