import { DotMenuItem } from './menu-item.model';

export interface DotMenu {
    id: string;
    name: string;
    tabDescription: string;
    label: string;
    url: string;
    menuItems: DotMenuItem[];
    isOpen: boolean;
}
