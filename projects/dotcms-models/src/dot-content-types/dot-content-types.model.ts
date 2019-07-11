export interface DotCMSContentType {
    baseType?: string;
    clazz: string;
    defaultType: boolean;
    description?: string;
    detailPage?: string;
    expireDateVar?: string;
    fields?: DotCMSContentTypeField[];
    fixed: boolean;
    folder: string;
    host: string;
    iDate?: Date;
    id?: string;
    layout?: DotCMSContentTypeLayoutRow[];
    modDate?: Date;
    name: string;
    owner: string;
    publishDateVar?: string;
    system: boolean;
    urlMapPattern?: string;
    variable?: string;
    workflow?: string;
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
    description?: any;
    inode: string;
    key: string;
    keywords?: any;
    sortOrder: number;
}

interface Relationships {
    cardinality: number;
    velocityVar: string;
}

interface FieldVariable {
    clazz: string;
    fieldId: string;
    id: string;
    key: string;
    value: string;
}
