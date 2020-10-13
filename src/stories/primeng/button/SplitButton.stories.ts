// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
    title: 'PrimeNG/Button/SplitButton',
    decorators: [
        moduleMetadata({
            imports: [SplitButtonModule, BrowserAnimationsModule]
        })
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'SplitButton groups a set of commands in an overlay with a default command: https://primefaces.org/primeng/showcase/#/splitbutton'
            }
        }
    },
    args: {}
} as Meta;

const BasicTemplate = `
  <p>
    <p-splitButton label="Save" icon="pi pi-check" [model]="items"></p-splitButton>
  </p>  
  <p>
    <p-splitButton label="Save" icon="pi pi-check" styleClass="p-button-secondary" [model]="items"></p-splitButton>
  </p>
  <p>
    <p-splitButton label="Save" icon="pi pi-check" styleClass="p-button-disabled"></p-splitButton>
  </p>
`;
export const Basic: Story = () => {
  return {
      template: BasicTemplate,
      props: {
          items: [
              {
                  label: 'Update',
                  icon: 'pi pi-refresh',
                  command: () => {}
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-times',
                  command: () => {}
              },
              { label: 'Angular.io', icon: 'pi pi-info', command: () => {} },
              { separator: true },
              { label: 'Setup', icon: 'pi pi-cog', command: () => {} }
          ]
      }
  };
};

Basic.parameters = {
  docs: {
    source: {
      code: BasicTemplate,
    },
  },
};