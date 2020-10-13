// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';

export default {
    title: 'PrimeNG/Button/Button',

    decorators: [
        moduleMetadata({
            imports: [ButtonModule]
        })
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'All the buttons, more information: https://primefaces.org/primeng/showcase/#/button'
            }
        }
    }
} as Meta;

const BasicTemplate = `
  <p-button label="Submit"></p-button>
`;

const SecondaryTemplate = `
  <button pButton type="button" label="Cancel" class="p-button-outlined"></button>
  <button pButton pRipple type="button" icon="pi pi-check" class="p-button-rounded p-button-text"></button>
`;
const TextTemplate = `
  <button pButton type="button" label="Refresh" class="p-button-text"></button>
`;
const DisabledTemplate = `
 <p-button label="Disabled" disabled="true"></p-button>
`;

export const Basic: Story = () => {
    return {
        template: BasicTemplate
    };
};

Basic.parameters = {
    docs: {
        source: {
            code: BasicTemplate
        }
    }
};

export const Secondary: Story = () => {
    return {
        template: SecondaryTemplate
    };
};
Secondary.parameters = {
    docs: {
        source: {
            code: SecondaryTemplate
        }
    }
};

const IconsTemplate = `
  <p><p-button label="Submit" icon="pi pi-check"></p-button></p>
  <p><p-button label="Submit" icon="pi pi-check" iconPos="right"></p-button></p>
`;
export const Icons: Story = () => {
    return {
        template: IconsTemplate
    };
};
Icons.parameters = {
    docs: {
        source: {
            code: IconsTemplate
        }
    }
};

export const Text: Story = () => {
    return {
        template: TextTemplate
    };
};

Text.parameters = {
    docs: {
        source: {
            code: TextTemplate
        }
    }
};

export const Disabled: Story = () => {
    return {
        template: DisabledTemplate
    };
};

Disabled.parameters = {
    docs: {
        source: {
            code: DisabledTemplate
        }
    }
};
