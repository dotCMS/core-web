import { NgGridItemConfig } from 'angular2-grid';
import { Container } from './container.model';

export interface LayoutGridBox {
    config: NgGridItemConfig;
    containers: Container[];
}
