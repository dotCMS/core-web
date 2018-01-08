import { NgGridItemConfig } from 'angular2-grid';
import { DotContainer } from './dot-container.model';
import { DotContainersColumnBox } from './dot-containers-column-box.model';

export interface DotLayoutGridBox {
    config: NgGridItemConfig;
    containers: DotContainersColumnBox[];
}
