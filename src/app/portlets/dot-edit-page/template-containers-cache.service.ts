import { Injectable } from '@angular/core';
import { DotContainer } from './shared/models/dot-container.model';

/**
 * Save into cache the containers used by the current template
 */
@Injectable()
export class TemplateContainersCacheService {
    private containers: { [key: string]: {container: DotContainer}};

    set(containers: { [key: string]: {container: DotContainer}}): void {
        for (const key in containers) {
            if (!containers[key].container.uuid) {
                containers[key].container.uuid = (new Date().getTime()).toString();
            }
        }

        this.containers = containers;
    }

    get(containerId: any): DotContainer {
        return this.containers[containerId] ? this.containers[containerId].container :  null;
    }
}
