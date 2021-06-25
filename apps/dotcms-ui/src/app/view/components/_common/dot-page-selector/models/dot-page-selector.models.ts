import { DotPageAsset } from '../service/dot-page-selector.service';
import { Site } from '@dotcms/dotcms-js';

export interface DotPageSelectorItem {
    label: string;
    payload: DotPageAsset | Site | DotFolder;
}

export interface DotSimpleURL {
    host: string;
    pathname: string;
}

export interface DotFolder {
    hostname: string;
    path: string;
}
