import { LayoutBody } from './layout-body.model';
import { LayoutSideBar } from './layout-sidebar.model';

export interface Layout {
    body: LayoutBody;
    footer: boolean;
    header: boolean;
    sidebar: LayoutSideBar;
    title: string;
}
