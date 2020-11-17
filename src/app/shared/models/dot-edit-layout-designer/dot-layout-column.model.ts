import { DotPageContainer } from '@portlets/dot-edit-page/shared/models';

export interface DotLayoutColumn {
    containers: DotPageContainer[];
    leftOffset: number;
    width: number;
    styleClass?: string;
}
