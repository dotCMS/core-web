import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'PrimeNG/Form/FloatLabel',
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
      imports: [BrowserAnimationsModule],
    }),
  ],
  args: {
    checked: false,
  },
} as Meta;

const FloatLabelTemplate = `
  <span class="p-float-label">
    <input type="text" id="inputtext" pInputText [(ngModel)]="value1"> 
    <label for="inputtext">Enter Name</label>
  </span>
`;


const Template: Story<any> = (props: any) => {
  const template = FloatLabelTemplate;
  return {
    props,
    template,
  };
};

export const Basic: Story = Template.bind({});

Basic.parameters = {
  docs: {
    source: {
      code: FloatLabelTemplate,
    },
  },
};
