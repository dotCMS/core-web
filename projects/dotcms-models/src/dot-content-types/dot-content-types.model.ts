export interface ContentType {
    baseType?: string;
    clazz: string;
    defaultType: boolean;
    description?: string;
    detailPage?: string;
    expireDateVar?: string;
    fields?: Array<DotContentTypeField>;
    fixed: boolean;
    folder: string;
    host: string;
    iDate?: Date;
    id?: string;
    modDate?: Date;
    name: string;
    owner: string;
    publishDateVar?: string;
    system: boolean;
    urlMapPattern?: string;
    variable?: string;
    workflow?: string;
    layout?: DotContentTypeLayoutDivider[];
}

export interface DotContentTypeField {
    clazz?: string;
    contentTypeId?: string;
    fixed?: boolean;
    id?: string;
    indexed?: boolean;
    listed?: boolean;
    name?: string;
    readOnly?: boolean;
    required?: boolean;
    searchable?: boolean;
    sortOrder?: number;
    dataType?: string;
    hint?: string;
    fieldTypeLabel?: string;
    variable?: string;
}

export interface DotContentTypeLayoutDivider {
    divider: DotContentTypeField;
    columns?: DotContentTypeColumn[];
}

export interface DotContentTypeColumn {
    fields: DotContentTypeField[];
    columnDivider: DotContentTypeField;
}


