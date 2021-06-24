import { DotPageAsset } from '../service/dot-page-selector.service';
import { Site } from '@dotcms/dotcms-js';
import { Observable } from 'rxjs';

export interface DotPageSelectorItem {
    label: string;
    payload: DotPageAsset | Site | DotFolder;
}

export interface DotPageSelectorResults {
    data: Observable<DotPageSelectorItem[]>;
    type: string;
    query: string;
}

export interface DotSimpleURL {
    host: string;
    pathname: string;
}

export interface DotFolder {
    hostname: string;
    path: string;
}
