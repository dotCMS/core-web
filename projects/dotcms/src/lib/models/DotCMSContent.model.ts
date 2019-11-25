export interface DotCMSContent {
    stName: string;
}

export interface DotCMSContentQuery {
    depth?: string;
    limit?: string;
    offset?: string;
    orderBy?: string;
    query: string;
}
