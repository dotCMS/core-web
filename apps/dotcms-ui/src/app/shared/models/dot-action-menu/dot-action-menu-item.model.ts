import { MenuItem } from 'primeng/api';

export interface DotActionMenuItem {
    shouldShow?: (x?: unknown) => boolean;
    menuItem: MenuItem;
}
