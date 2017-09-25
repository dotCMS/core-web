import { MenuItem } from './menu-item.model';

export interface Menu {
    tabDescription: string;
    tabName: string;
    url: string;
    menuItems: MenuItem[];
    isOpen: boolean;
}
