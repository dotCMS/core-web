import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbModule } from 'primeng/breadcrumb';

export default {
  title: 'PrimeNG/Menu/Breadcrumbs',
  parameters: {
    docs: {
      description: {
        component:
          'Breadcrumb provides contextual information about page hierarchy.: https://primefaces.org/primeng/showcase/#/breadcrumb',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    items: [
      { label: 'Categories' },
      { label: 'Sports' },
      { label: 'Football' },
      { label: 'Countries' },
      { label: 'Spain' },
      { label: 'F.C. Barcelona' },
      { label: 'Squad' },
      {
        label: 'Lionel Messi',
        url: 'https://en.wikipedia.org/wiki/Lionel_Messi',
      },
    ],
  },
} as Meta;

const BreadcrumbTemplate = `<p-breadcrumb [model]="items"></p-breadcrumb>`;

const Template: Story<any> = (props: any) => {
  const template = BreadcrumbTemplate;
  return {
    props,
    template,
  };
};

export const Basic: Story = Template.bind({});

Basic.parameters = {
  docs: {
    source: {
      code: BreadcrumbTemplate,
    },
  },
};
