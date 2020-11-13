import { catchError, map, pluck, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CoreWebService, DotRequestOptionsArgs } from 'dotcms-js';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';

/**
 * Provide util methods to handle templates in the system.
 * @export
 * @class DotTemplatesService
 */
@Injectable()
export class DotTemplatesService {
    constructor(
        private coreWebService: CoreWebService,
        private httpErrorManagerService: DotHttpErrorManagerService
    ) {}

    /**
     * Return a list of templates.
     * @returns Observable<DotTemplate[]>
     * @memberof DotTemplatesService
     */
    get(): Observable<DotTemplate[]> {
        const url = '/api/v1/templates';
        return this.coreWebService
            .requestView<DotTemplate[]>({
                url
            })
            .pipe(pluck('entity'));
    }

    /**
     * Get template by inode
     *
     * @param {string} inode
     * @returns {Observable<DotTemplate>}
     * @memberof DotTemplatesService
     */
    getByInode(inode: string): Observable<DotTemplate> {
        const url = `/api/v1/templates/${inode}`;

        return this.request<DotTemplate>({
            url
        }).pipe(
            map((template: DotTemplate) => {
                const containers = Object.keys(template.containers).reduce((acc, item) => {
                    return {
                        ...acc,
                        [item]: {
                            container: template.containers[item]
                        }
                    };
                }, {});

                return {
                    ...template,
                    containers
                };
            })
        );
    }

    /**
     * Creates a template
     * @returns Observable<DotTemplate>
     * @memberof DotTemplatesService
     */
    create(values: DotTemplate): Observable<DotTemplate> {
        const url = '/api/v1/templates';

        return this.request<DotTemplate>({ method: 'POST', url, body: values });
    }

    /**
     * Updates a template
     * @returns Observable<DotTemplate>
     * @memberof DotTemplatesService
     */
    update(values: DotTemplate): Observable<DotTemplate> {
        console.log(JSON.stringify(values));
        const url = '/api/v1/templates';

        return this.request<DotTemplate>({ method: 'PUT', url, body: values });
    }

    /**
     * Delete a template
     * @param {string[]} inodes
     * @returns ???
     * @memberof DotTemplatesService
     */
    delete(inodes: string[]): Observable<boolean> {
        const url = `/api/v1/templates/`;
        return this.request<boolean>({ method: 'DELETE', url,  body: inodes });
    }

    /**
     * Unarchive a template
     * @param {string} inode
     * @returns ???
     * @memberof DotTemplatesService
     */
    unarchive(inode: string): Observable<any> {
        const url = `/api/v1/templates/${inode}/_unarchive`;
        return this.request<any>({ method: 'PUT', url });
    }

    /**
     * Archive a template
     * @param {string} inode
     * @returns ???
     * @memberof DotTemplatesService
     */
    archive(inode: string): Observable<any> {
        const url = `/api/v1/templates/${inode}/_archive`;
        return this.request<any>({ method: 'PUT', url });
    }

    /**
     * Unpublish a template
     * @param {string[]} inodes
     * @returns ???
     * @memberof DotTemplatesService
     */
    unPublish(inodes: string[]): Observable<any> {
        const url = `/api/v1/templates/_unpublish`;
        return this.request<any>({ method: 'PUT', url, body: inodes });
    }

    /**
     * Publish a template
     * @param {string[]} inodes
     * @returns ???
     * @memberof DotTemplatesService
     */
    publish(inodes: string[]): Observable<any> {
        const url = `/api/v1/templates/_publish`;
        return this.request<any>({ method: 'PUT', url, body: inodes });
    }

    /**
     * Copy a template
     * @param {string} inode
     * @returns ???
     * @memberof DotTemplatesService
     */
    copy(inode: string): Observable<any> {
        const url = `/api/v1/templates/${inode}/_copy`;
        return this.request<any>({ method: 'PUT', url });
    }

    /**
     * Unlock a template
     * @param {string} inode
     * @returns ???
     * @memberof DotTemplatesService
     */
    unlock(inode: string): Observable<any> {
        const url = `/api/v1/templates/${inode}/_unlock`;
        return this.request<any>({ method: 'PUT', url });
    }

    private request<T>(options: DotRequestOptionsArgs): Observable<T> {
        const response$ = this.coreWebService.requestView<T>(options);
        return response$.pipe(
            pluck('entity'),
            catchError((error: HttpErrorResponse) => {
                return this.httpErrorManagerService.handle(error).pipe(take(1), map(() => null));
            })
        );
    }
}
