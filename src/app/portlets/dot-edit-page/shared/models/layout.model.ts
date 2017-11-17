export interface Layout {
    body: Body;
    footer: boolean;
    header: boolean;
    layout: string;
    pageWidth: string;
    sidebar: boolean;
    title: string;
    width: string;
}

interface Body {
    containers: object;
    location: object;
    preview: boolean;
    rows: Array<any>;
    sidebar: boolean;
    type: string;
    width: string;
    widthPercent: number;
}
