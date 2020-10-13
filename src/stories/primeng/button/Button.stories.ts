// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';

export default {
  title: 'PrimeNG/Button/Button',

  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'All the buttons, more information: https://primefaces.org/primeng/showcase/#/button',
      },
    },
  },
} as Meta;

const BasicTemplate = `
<p>
  <p-button label="Submit"></p-button>
</p>
<p>
  <button pButton type="button" label="Search" class="p-button-outlined"></button>
</p>
<p>
  <p-button label="Disabled" disabled="true"></p-button>
</p>
`;
export const Basic: Story = () => {
  return {
    template: BasicTemplate,
  };
};
Basic.parameters = {
  docs: {
    source: {
      code: BasicTemplate,
    },
  },
};

const SecondaryTemplate = `
  <button pButton type="button" label="Primary" class="p-button-outlined"></button>
  <button pButton type="button" label="Secondary" class="p-button-outlined p-button-secondary"></button>
  <button pButton type="button" label="Success" class="p-button-outlined p-button-success"></button>
  <button pButton type="button" label="Info" class="p-button-outlined p-button-info"></button>
  <button pButton type="button" label="Warning" class="p-button-outlined p-button-warning"></button>
  <button pButton type="button" label="Help" class="p-button-outlined p-button-help"></button>
  <button pButton type="button" label="Danger" class="p-button-outlined p-button-danger"></button>
`;
export const Secondary: Story = () => {
  return {
    template: SecondaryTemplate,
  };
};
Secondary.parameters = {
  docs: {
    source: {
      code: SecondaryTemplate,
    },
  },
};



const IconsTemplate = `
  <p>
    <p-button icon="pi pi-check"></p-button>
    <p-button label="Submit" icon="pi pi-check"></p-button>
    <p-button label="Submit" icon="pi pi-check" iconPos="right"></p-button>
  </p>
  <p>
    <button pButton type="button" icon="pi pi-check" class="p-button-rounded"></button>
    <button pButton type="button" icon="pi pi-bookmark" class="p-button-rounded p-button-secondary"></button>
    <button pButton type="button" icon="pi pi-search" class="p-button-rounded p-button-success"></button>
    <button pButton type="button" icon="pi pi-user" class="p-button-rounded p-button-info"></button>
    <button pButton type="button" icon="pi pi-bell" class="p-button-rounded p-button-warning"></button>
    <button pButton type="button" icon="pi pi-heart" class="p-button-rounded p-button-help"></button>
    <button pButton type="button" icon="pi pi-times" class="p-button-rounded p-button-danger"></button>
  </p>
  <p>
    <button pButton type="button" icon="pi pi-check" class="p-button-rounded p-button-text"></button>
    <button pButton type="button" icon="pi pi-bookmark" class="p-button-rounded p-button-secondary p-button-text"></button>
    <button pButton type="button" icon="pi pi-search" class="p-button-rounded p-button-success p-button-text"></button>
    <button pButton type="button" icon="pi pi-user" class="p-button-rounded p-button-info p-button-text"></button>
    <button pButton type="button" icon="pi pi-bell" class="p-button-rounded p-button-warning p-button-text"></button>
    <button pButton type="button" icon="pi pi-heart" class="p-button-rounded p-button-help p-button-text"></button>
    <button pButton type="button" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"></button>
    <button pButton type="button" icon="pi pi-filter" class="p-button-rounded p-button-text p-button-plain"></button>
  </p>
`;
export const Icons: Story = () => {
  return {
    template: IconsTemplate,
  };
};
Icons.parameters = {
  docs: {
    source: {
      code: IconsTemplate,
    },
  },
};

const SeveritiesTemplate = `
<button pButton pRipple type="button" label="Success" class="p-button-success"></button>
<button pButton pRipple type="button" label="Info" class="p-button-info"></button>
<button pButton pRipple type="button" label="Warning" class="p-button-warning"></button>
<button pButton pRipple type="button" label="Help" class="p-button-help"></button>
<button pButton pRipple type="button" label="Danger" class="p-button-danger"></button>
`;
export const Severities: Story = () => {
  return {
    template: SeveritiesTemplate,
  };
};
Severities.parameters = {
  docs: {
    source: {
      code: SeveritiesTemplate,
    },
  },
};


const TextTemplate = `
<button pButton pRipple type="button" label="Primary" class="p-button-text"></button>
<button pButton pRipple type="button" label="Secondary" class="p-button-secondary p-button-text"></button>
<button pButton pRipple type="button" label="Success" class="p-button-success p-button-text"></button>
<button pButton pRipple type="button" label="Info" class="p-button-info p-button-text"></button>
<button pButton pRipple type="button" label="Warning" class="p-button-warning p-button-text"></button>
<button pButton pRipple type="button" label="Help" class="p-button-help p-button-text"></button>
<button pButton pRipple type="button" label="Danger" class="p-button-danger p-button-text"></button>
<button pButton pRipple type="button" label="Plain" class="p-button-text p-button-plain"></button>
`;
export const Text: Story = () => {
  return {
    template: TextTemplate,
  };
};
Text.parameters = {
  docs: {
    source: {
      code: TextTemplate,
    },
  },
};
