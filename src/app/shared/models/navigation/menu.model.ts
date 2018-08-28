import { DotMenuItem } from './menu-item.model';

export interface DotMenu {
    url: string;
    tabName: string;
    tabIcon: string;
    tabDescription: string;
    name: string;
    menuItems: DotMenuItem[];
    isOpen: boolean;
    id: string;
    active: boolean;
}
