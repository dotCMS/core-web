import { LayoutRow } from './layout-row.model';

export interface LayoutBody {
    containers: string[];
    rows: LayoutRow[];
    width: string;
}
