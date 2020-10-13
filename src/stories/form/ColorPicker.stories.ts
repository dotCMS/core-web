import { Story, Meta } from '@storybook/angular/types-6-0';
import { ColorPickerModule, ColorPicker } from 'primeng/colorpicker';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'PrimeNG/Form/ColorPicker',
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component:
          'ColorPicker is an input component to select a color.: https://primefaces.org/primeng/showcase/#/colorpicker',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ColorPickerModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    color: 'red',
    inline: false
  },
} as Meta;

const ColorPickerTemplate = `<p-colorPicker [(ngModel)]="color" [inline]="true"></p-colorPicker>`;

const Template: Story<ColorPicker> = (props: ColorPicker) => {
  const template = ColorPickerTemplate;
  return {
    props,
    template,
  };
};

export const Primary: Story = Template.bind({});

Primary.args = {
  inline: true,
  color: 'red'
}

Primary.argTypes = {
  color: {
    name: 'color',
    description: 'The color selected',
  },
  inline: {
    name: 'inline',
    description: 'If true the color picker will be set inline',
  },
};

Primary.parameters = {
  docs: {
    source: {
      code: ColorPickerTemplate,
    },
  },
};
