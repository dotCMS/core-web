// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SelectButton } from 'primeng/selectbutton';

export default {
  title: 'PrimeNG/Form/SelectButton',
  component: SelectButton,
  args: {
    options: [
      { label: 'Off', value: 'off' },
      { label: 'On', value: 'on' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'SelectButton is a form component to choose a value from a list of options using button elements: https://primefaces.org/primeng/showcase/#/selectbutton',
      },
    },
  }
} as Meta;

const Template: Story<SelectButton> = (args: SelectButton) => ({
  component: SelectButton,
  props: args,
});

export const Primary = Template.bind({});
Primary.parameters = {
  docs: {
    source: {
      code: `<p-multiSelect [options]="cities1"></p-multiSelect>`,
    },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
Disabled.parameters = {
  docs: {
    source: {
      code: `<p-multiSelect disabled="true" [options]="cities1"></p-multiSelect>`,
    },
  },
};

