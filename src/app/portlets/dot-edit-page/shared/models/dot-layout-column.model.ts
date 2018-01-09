import { DotContainerColumn } from './dot-container-column.model';

export interface DotLayoutColumn {
    containers: DotContainerColumn[];
    leftOffset: number;
    width: number;
}
