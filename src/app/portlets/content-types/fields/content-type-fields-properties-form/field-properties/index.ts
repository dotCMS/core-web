import { FieldType } from '../../index';
export *  from './categories-property/';
export *  from './checkbox-property/';
export *  from './data-type-property/';
export *  from './default-value-property/';
export *  from './hint-property/';
export *  from './name-property/';
export *  from './regex-check-property/';
export *  from './values-property/';

import { CategoriesPropertyComponent } from './categories-property/';
import { CheckboxPropertyComponent }  from './checkbox-property/';
import { DataTypePropertyComponent }  from './data-type-property/';
import { DefaultValuePropertyComponent }  from './default-value-property/';
import { HintPropertyComponent }  from './hint-property/';
import { NamePropertyComponent }  from './name-property/';
import { RegexCheckPropertyComponent }  from './regex-check-property/';
import { ValuesPropertyComponent }  from './values-property/';

export const PROPERTY_INFO = {
    categories: CategoriesPropertyComponent,
    dataType: DataTypePropertyComponent,
    defaultValue: DefaultValuePropertyComponent,
    hint: HintPropertyComponent,
    indexed: CheckboxPropertyComponent,
    listed: CheckboxPropertyComponent,
    name: NamePropertyComponent,
    regexCheck: RegexCheckPropertyComponent,
    required: CheckboxPropertyComponent,
    searchable: CheckboxPropertyComponent,
    unique: CheckboxPropertyComponent,
    vaues: ValuesPropertyComponent,
};