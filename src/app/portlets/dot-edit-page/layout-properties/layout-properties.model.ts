import { FormGroup } from '@angular/forms/src/model';

export interface DotGlobal {
    header: boolean;
    footer: boolean;
    sidebar: FormGroup;
}

export interface DotSidebar {
    containers: Array<any>;
    location: string;
    width: number;
    widthPercent: number;
    preview: boolean;
}
