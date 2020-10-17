import { moduleMetadata } from '@storybook/angular';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SelectButtonModule, SelectButton } from 'primeng/selectbutton';

export default {
    title: 'PrimeNG/Form/SelectButton',
    decorators: [
        moduleMetadata({
            imports: [SelectButtonModule]
        })
    ],
    args: {
        options: [
            { label: 'Push', value: 'push' },
            { label: 'Remove', value: 'remove' },
            { label: 'Push Publish', value: 'push-publish' }
        ]
    },
    parameters: {
        docs: {
            description: {
                component:
                    'SelectButton is a form component to choose a value from a list of options using button elements: https://primefaces.org/primeng/showcase/#/selectbutton'
            }
        }
    }
} as Meta;

const TabbedTemplate = `
  <p-selectButton [options]="options" [(ngModel)]="selectedOption" class="p-button-tabbed">
    <ng-template let-item>
        <span>{{item.label}}</span>
    </ng-template>
</p-selectButton>
`;

const DisabledTemplate = `
  <p-selectButton [options]="options" disabled="true" class="p-button-tabbed">
    <ng-template let-item>
        <span>{{item.label}}</span>
    </ng-template>
</p-selectButton>
`;

export const Tabbed: Story<SelectButton> = () => {
  return {
      template: TabbedTemplate,
      props: {
          options: [
              { label: 'Push', value: 'push' },
              { label: 'Remove', value: 'remove' },
              { label: 'Push Publish', value: 'push-publish' }
          ],
          selectedOption: 'push'
      }
  };
};


Tabbed.parameters = {
    docs: {
        source: {
            code: TabbedTemplate
        }
    }
};

export const Disabled: Story<SelectButton> = () => {
  return {
      template: DisabledTemplate,
      props: {
          options: [
              { label: 'Push', value: 'push' },
              { label: 'Remove', value: 'remove' },
              { label: 'Push Publish', value: 'push-publish' }
          ]
      }
  };
};


Disabled.parameters = {
  docs: {
    source: {
      code: DisabledTemplate,
    },
  },
};