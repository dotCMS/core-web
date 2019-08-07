import { DotSystemActionMappings } from '../dot-workflow-action';
import { DotWorkflow } from '../dot-workflow';

export interface DotCMSContentType {
    baseType: string;
    clazz: string;
    defaultType: boolean;
    description?: string;
    detailPage?: string;
    expireDateVar?: string;
    fields: DotCMSContentTypeField[];
    fixed: boolean;
    folder: string;
    host: string;
    iDate: number;
    id: string;
    layout: DotCMSContentTypeLayoutRow[];
    modDate: number;
    multilingualable: boolean;
    nEntries: number;
    name: string;
    owner?: string;
    publishDateVar?: string;
    system: boolean;
    urlMapPattern?: string;
    variable: string;
    versionable: boolean;
    workflows: DotWorkflow[];
    systemActionMappings?: DotSystemActionMappings;
}

export interface DotCMSContentTypeField {
    categories?: DotCMSContentTypeFieldCategories;
    clazz: string;
    contentTypeId: string;
    dataType: string;
    defaultValue?: string;
    fieldType: string;
    fieldTypeLabel: string;
    fieldVariables: FieldVariable[];
    fixed: boolean;
    hint?: string;
    iDate: number;
    id: string;
    indexed: boolean;
    listed: boolean;
    modDate: number;
    name: string;
    readOnly: boolean;
    regexCheck?: string;
    relationships?: Relationships;
    required: boolean;
    searchable: boolean;
    sortOrder: number;
    unique: boolean;
    values?: string;
    variable: string;
}

export interface DotCMSContentTypeLayoutRow {
    columns?: DotCMSContentTypeLayoutColumn[];
    divider: DotCMSContentTypeField;
}

export interface DotCMSContentTypeLayoutColumn {
    columnDivider: DotCMSContentTypeField;
    fields: DotCMSContentTypeField[];
}

export interface DotCMSContentTypeFieldCategories {
    categoryName: string;
    description?: string;
    inode: string;
    key: string;
    keywords?: string;
    sortOrder: number;
}

/** @private */
interface Relationships {
    cardinality: number;
    velocityVar: string;
}

/** @private */
interface FieldVariable {
    clazz: string;
    fieldId: string;
    id: string;
    key: string;
    value: string;
}
