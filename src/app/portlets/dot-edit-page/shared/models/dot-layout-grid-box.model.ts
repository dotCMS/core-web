import { NgGridItemConfig } from 'angular2-grid';
import { DotContainer } from './dot-container.model';
import { DotContainerColumnBox } from './dot-container-column-box.model';

export interface DotLayoutGridBox {
    config: NgGridItemConfig;
    containers: DotContainerColumnBox[];
}
