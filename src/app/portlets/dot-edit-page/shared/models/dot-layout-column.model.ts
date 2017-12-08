import { DotContainersColumn } from './dot-containers-column.model';

export interface DotLayoutColumn {
    containers: DotContainersColumn[];
    leftOffset: number;
    width: number;
}
