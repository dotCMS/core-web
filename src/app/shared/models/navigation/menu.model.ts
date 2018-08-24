import { DotMenuItem } from './menu-item.model';

export interface DotMenu {
    id: string;
    isOpen: boolean;
    menuItems: DotMenuItem[];
    name: string;
    tabDescription: string;
    tabIcon: string;
    tabName: string;
    url: string;
}
