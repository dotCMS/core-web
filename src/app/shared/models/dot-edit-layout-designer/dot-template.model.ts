import { DotContainerMap } from '@shared/models/container/dot-container.model';
import { DotLayout } from './dot-layout.model';

export interface DotTemplate {
    anonymous: boolean;
    archived?: boolean;
    body?: string;
    categoryId?: string;
    countAddContainer?: number;
    countContainers?: number;
    deleted?: boolean;
    drawed?: boolean;
    drawedBody?: string;
    friendlyName: string;
    iDate?: Date;
    identifier: string;
    image?: string;
    inode: string;
    locked?: boolean;
    modDate?: Date;
    name: string;
    permissionId?: string;
    permissionType?: string;
    showOnMenu?: boolean;
    sortOrder?: number;
    theme?: string;
    title?: string;
    type: string;
    versionType: string;
}

// Extra properties from renderHTML
export interface DotTemplate {
    canEdit: boolean;
    containers?: DotContainerMap;
    layout: DotLayout;
}
