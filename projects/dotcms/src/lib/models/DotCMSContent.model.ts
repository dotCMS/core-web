export interface DotCMSContent {
    stName: string;
}

export interface DotCMSContentQuery {
    query: string;
    options: {
        depth?: string;
        limit?: string;
        offset?: string;
        orderBy?: string;
    };
}
