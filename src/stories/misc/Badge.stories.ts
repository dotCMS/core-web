import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';

export default {
  title: 'PrimeNG/Misc/Badge',
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip directive provides advisory information for a component.: https://primefaces.org/primeng/showcase/#/tooltip',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
} as Meta;

const TooltipTemplate = `
  <h5>Numbers</h5>
<div class="badges">
    <span class="p-badge">2</span>
    <span class="p-badge p-badge-success">8</span>
    <span class="p-badge p-badge-info">4</span>
    <span class="p-badge p-badge-warning">12</span>
    <span class="p-badge p-badge-danger">3</span>
</div>

<h5>Tags</h5>
<div class="badges">
    <span class="p-tag">Primary</span>
    <span class="p-tag p-tag-success">Success</span>
    <span class="p-tag p-tag-info">Info</span>
    <span class="p-tag p-tag-warning">Warning</span>
    <span class="p-tag p-tag-danger">Danger</span>
</div>

<h5>Pills</h5>
<div class="badges">
    <span class="p-tag p-tag-rounded">Primary</span>
    <span class="p-tag p-tag-rounded p-tag-success">Success</span>
    <span class="p-tag p-tag-rounded p-tag-info">Info</span>
    <span class="p-tag p-tag-rounded p-tag-warning">Warning</span>
    <span class="p-tag p-tag-rounded p-tag-danger">Danger</span>
</div>

<h5>Positioned Badge</h5>
<span class="p-overlay-badge p-mr-5">
    <i class="pi pi-bell" style="font-size: 2em"></i>
    <span class="p-badge">2</span>
</span>

<span class="p-overlay-badge">
    <p-button label="New"></p-button>
    <span class="p-badge p-badge-warning">5</span>
</span>

<h5>Inline Button Badge</h5>
<p-button label="Emails" badge="8" styleClass="p-mr-2" ></p-button>
<p-button label="Messages" icon="pi pi-users" styleClass="p-button-warning" badge="8" badgeClass="p-badge-danger" ></p-button>

<h5>Sizes</h5>
<div class="badges">
    <span class="p-badge">2</span>
    <span class="p-badge p-badge-lg p-badge-sucess">4</span>
    <span class="p-badge p-badge-xl p-badge-warning">6</span>
</div>
`;

const Template: Story<any> = (props: any) => {
  const template = TooltipTemplate;
  return {
    props,
    template,
  };
};

export const Basic: Story = Template.bind({});

Basic.parameters = {
  docs: {
    source: {
      code: TooltipTemplate,
    },
  },
};
