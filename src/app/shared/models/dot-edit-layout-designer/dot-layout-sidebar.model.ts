import { DotPageContainer } from '@portlets/dot-edit-page/shared/models';

export interface DotLayoutSideBar {
    location?: string;
    containers?: DotPageContainer[];
    width?: string;
    widthPercent?: number;
    preview?: boolean;
}
