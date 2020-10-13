import { Story, Meta } from '@storybook/angular/types-6-0';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';

export default {
  title: 'DotCMS/Form/Forms',
  parameters: {
    docs: {
      description: {
        component:
          'Text, icon, buttons and other content can be grouped next to an input.: https://primefaces.org/primeng/showcase/#/inputgroup',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        RadioButtonModule,
        RippleModule,
        BrowserAnimationsModule,
        InputTextareaModule,
        DropdownModule,
        ChipsModule,
        AutoCompleteModule,
        CalendarModule,
      ],
    }),
  ],
  args: {
    options: [
      { label: 'Select Host', value: null },
      { label: 'demo.dotcms.com', value: { id: 1, name: 'demo.dotcms.com' } },
      { label: 'System Host', value: { id: 2, name: 'System Host' } },
    ],
    actions: [
      { label: 'System Workflow', value: null },
      { label: 'Save', value: { id: 1, name: 'Save' } },
      { label: 'Publish', value: { id: 2, name: 'Publish' } },
      { label: 'Delete', value: { id: 3, name: 'Delete' } },
    ],
    values: ['hiking'],
    results: [
      { name: 'Blogs', id: 1 },
      { name: 'System Workflow', id: 2 },
    ],
    // tslint:disable-next-line: typedef
    search() {
      this.results = [
        { name: 'Blogs', id: 1 },
        { name: 'System Workflow', id: 2 },
      ];
    },
  },
} as Meta;

const TextInputDefault = `
    <div class="form__group">
      <label for="widgetName">Widget Name</label>
      <input id="name" aria-describedby="widgetName-help" pInputText />
      <small id="widgetName-help">Enter the widget name.</small>
    </div>
    <div class="form__group">
      <label for="slug">Slug</label>
      <input id="slug" aria-describedby="slug-help" class="p-invalid" pInputText />
      <small id="slug-help" class="p-invalid">Slug must be unique.</small>
    </div>
`;

const TextInputFloatingLabel = `
    <div class="form__group">
      <span class="p-float-label">
          <input id="widgetName" type="text" pInputText>
          <label for="widgetName">Widget Name</label>
      </span>
    </div>
    <div class="form__group">
      <span class="p-float-label">
          <input id="description" type="text" pInputText>
          <label for="description">Description</label>
      </span>
    </div>
`;

const InputTemplate = (input) => {
  return `<div class="p-fluid" style="width: 400px; margin: 0 auto;">
     ${input}
      <div class="form__group">
        <label for="dropdown">Site or Folder</label>
        <p-dropdown id="dropdown" [options]="options"></p-dropdown>
      </div>
      <div class="form__group">
      <label for="workflow">Workflow</label>
        <p-autoComplete
          id="workflow"
          (completeMethod)="search($event)"
          [(ngModel)]="text"
          [dropdown]="true"
          [suggestions]="results"
          field="name"
        ></p-autoComplete>
      </div>

       <div class="form__group">
        <label for="options">Default Action</label>
        <p-dropdown id="options" [options]="actions"></p-dropdown>
      </div>

      <div class="form__group">
         <label for="publishDate">Publish Date Field</label>
         <p-calendar [showTime]="true" inputId="publishDate"></p-calendar>
        </div>
      <div class="form__group">
        <label for="expireDate">Expire Date Field</label>
        <p-calendar [showTime]="true" inputId="expireDate"></p-calendar>
      </div>

      <div class="form__group">
        <label for="tags">Tags</label>
        <p-chips id="tags" [(ngModel)]="values" ></p-chips>
      </div>

    <div class="form__group">
      <label>Cities</label>

      <div class="p-field-checkbox">
        <p-checkbox name="group1" value="New York" inputId="ny"></p-checkbox>
        <label for="ny">New York</label>
      </div>
      <div class="p-field-checkbox">
        <p-checkbox name="group1" value="San Francisco" inputId="sf"></p-checkbox>
        <label for="sf">San Francisco</label>
      </div>
      <div class="p-field-checkbox">
        <p-checkbox name="group1" value="Los Angeles" inputId="la"></p-checkbox>
        <label for="la">Los Angeles</label>
      </div>
      <div class="p-field-checkbox">
        <p-checkbox name="group1" value="Chicago" inputId="ch"></p-checkbox>
        <label for="ch">Chicago</label>
      </div>
    </div>

  <div class="form__group">
    <label>Sizes</label>
    <div class="p-field-radiobutton">
      <p-radioButton name="size" value="Small" inputId="size1"></p-radioButton>
      <label for="size1">Small</label>
    </div>
    <div class="p-field-radiobutton">
      <p-radioButton name="size" value="M"edium inputId="size2"></p-radioButton>
      <label for="size2">Medium</label>
    </div>
    <div class="p-field-radiobutton">
      <p-radioButton name="size" value="Big" inputId="size3"></p-radioButton>
      <label for="size3">Big</label>
    </div>
  </div>

  <div class="form__group">
    <label for="comments">Comments</label>
    <textarea id="comments" pInputTextarea placeholder="Some placeholder" [rows]="10"></textarea>
  </div>
  </div>`;
};

export const Default: Story = (props) => {
  return {
    template: InputTemplate(TextInputDefault),
    props
  };
};

Default.parameters = {
  docs: {
    source: {
      code: InputTemplate(TextInputDefault),
    },
  },
};

export const FloatingLabel: Story = (props) => {
  return {
    template: InputTemplate(TextInputFloatingLabel),
    props
  };
};

FloatingLabel.parameters = {
  template: {},
  docs: {
    source: {
      code: InputTemplate(TextInputFloatingLabel),
    },
  },
};
