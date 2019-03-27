/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface DotCheckbox {
    'hint': string;
    'label': string;
    'options': string;
    'value': string;
  }
  interface DotCheckboxAttributes extends StencilHTMLAttributes {
    'hint'?: string;
    'label'?: string;
    'onOnCallback'?: (event: CustomEvent) => void;
    'options'?: string;
    'value'?: string;
  }

  interface DotDropdown {
    'hint': string;
    'label': string;
    'options': string;
    'value': string;
  }
  interface DotDropdownAttributes extends StencilHTMLAttributes {
    'hint'?: string;
    'label'?: string;
    'onOnCallback'?: (event: CustomEvent) => void;
    'options'?: string;
    'value'?: string;
  }

  interface DotTextfield {
    'hint': string;
    'label': string;
    'placeholder': string;
    'readOnly': string;
    'regexcheck': string;
    'required': boolean;
    'value': string;
  }
  interface DotTextfieldAttributes extends StencilHTMLAttributes {
    'hint'?: string;
    'label'?: string;
    'onOnCallback'?: (event: CustomEvent) => void;
    'placeholder'?: string;
    'readOnly'?: string;
    'regexcheck'?: string;
    'required'?: boolean;
    'value'?: string;
  }

  interface MyComponent {
    /**
    * The first name
    */
    'first': string;
    /**
    * The last name
    */
    'last': string;
    /**
    * The middle name
    */
    'middle': string;
  }
  interface MyComponentAttributes extends StencilHTMLAttributes {
    /**
    * The first name
    */
    'first'?: string;
    /**
    * The last name
    */
    'last'?: string;
    /**
    * The middle name
    */
    'middle'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'DotCheckbox': Components.DotCheckbox;
    'DotDropdown': Components.DotDropdown;
    'DotTextfield': Components.DotTextfield;
    'MyComponent': Components.MyComponent;
  }

  interface StencilIntrinsicElements {
    'dot-checkbox': Components.DotCheckboxAttributes;
    'dot-dropdown': Components.DotDropdownAttributes;
    'dot-textfield': Components.DotTextfieldAttributes;
    'my-component': Components.MyComponentAttributes;
  }


  interface HTMLDotCheckboxElement extends Components.DotCheckbox, HTMLStencilElement {}
  var HTMLDotCheckboxElement: {
    prototype: HTMLDotCheckboxElement;
    new (): HTMLDotCheckboxElement;
  };

  interface HTMLDotDropdownElement extends Components.DotDropdown, HTMLStencilElement {}
  var HTMLDotDropdownElement: {
    prototype: HTMLDotDropdownElement;
    new (): HTMLDotDropdownElement;
  };

  interface HTMLDotTextfieldElement extends Components.DotTextfield, HTMLStencilElement {}
  var HTMLDotTextfieldElement: {
    prototype: HTMLDotTextfieldElement;
    new (): HTMLDotTextfieldElement;
  };

  interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {}
  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };

  interface HTMLElementTagNameMap {
    'dot-checkbox': HTMLDotCheckboxElement
    'dot-dropdown': HTMLDotDropdownElement
    'dot-textfield': HTMLDotTextfieldElement
    'my-component': HTMLMyComponentElement
  }

  interface ElementTagNameMap {
    'dot-checkbox': HTMLDotCheckboxElement;
    'dot-dropdown': HTMLDotDropdownElement;
    'dot-textfield': HTMLDotTextfieldElement;
    'my-component': HTMLMyComponentElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
