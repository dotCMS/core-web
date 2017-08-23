import {
    CategoriesPropertyComponent,
    DataTypePropertyComponent,
    DefaultValuePropertyComponent,
    HintPropertyComponent,
    CheckboxPropertyComponent,
    NamePropertyComponent,
    RegexCheckPropertyComponent,
    ValuesPropertyComponent
} from '../content-type-fields-properties-form/field-properties';

export const PROPERTY_INFO = {
    categories: {
        component: CategoriesPropertyComponent,
        defaultValue: '',
        order: 2,
        required: true
    },
    dataType: {
        component: DataTypePropertyComponent,
        defaultValue: '',
        order: 1,
        disabledInEdit: true
    },
    defaultValue: {
        component: DefaultValuePropertyComponent,
        defaultValue: '',
        order: 4
    },
    hint: {
        component: HintPropertyComponent,
        defaultValue: '',
        order: 5
    },
    indexed: {
        component: CheckboxPropertyComponent,
        defaultValue: false,
        order: 9
    },
    listed: {
        component: CheckboxPropertyComponent,
        defaultValue: false,
        order: 10
    },
    name: {
        component: NamePropertyComponent,
        defaultValue: '',
        order: 0,
        required: true,
        disabledInEdit: true
    },
    regexCheck: {
        component: RegexCheckPropertyComponent,
        defaultValue: '',
        order: 6
    },
    required: {
        component: CheckboxPropertyComponent,
        defaultValue: false,
        order: 7
    },
    searchable: {
        component: CheckboxPropertyComponent,
        defaultValue: false,
        order: 8
    },
    unique: {
        component: CheckboxPropertyComponent,
        defaultValue: false,
        order: 11
    },
    values: {
        component: ValuesPropertyComponent,
        defaultValue: '',
        order: 3,
        required: true
    }
};
