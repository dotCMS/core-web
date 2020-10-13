import { Story, Meta } from '@storybook/angular/types-6-0';
import { EditorModule, Editor} from 'primeng/editor';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'PrimeNG/Form/Editor',
  component: Editor,
  parameters: {
    docs: {
      description: {
        component:
          'Editor is rich text editor component based on Quill.: https://primefaces.org/primeng/showcase/#/editor',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [EditorModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    text: 'Placeholder text',
  },
} as Meta;

const EditorTemplate = `<p-editor [(ngModel)]="text" [style]="{'height':'130px'}"></p-editor>`;

const Template: Story<Editor> = (props: Editor) => {
  const template = EditorTemplate;
  return {
    props,
    template,
  };
};

export const Primary: Story = Template.bind({});

Primary.args = {
  text: 'Placeholder text'
};

Primary.argTypes = {
  text: {
    name: 'text',
    description: 'Text to be entered in the editor',
  },
};

Primary.parameters = {
  docs: {
    source: {
      code: EditorTemplate,
    },
  },
};
