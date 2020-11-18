import { catchError, map, pluck, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CoreWebService, DotRequestOptionsArgs } from 'dotcms-js';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';


export const TEMPLATE_API_URL = '/api/v1/templates/';
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
        return this.request<DotTemplate[]>({ url: TEMPLATE_API_URL });
    }

    /**
     * Get template by inode
     *
     * @param {string} inode
     * @returns {Observable<DotTemplate>}
     * @memberof DotTemplatesService
     */
    getByInode(inode: string): Observable<DotTemplate> {
        const url = `${TEMPLATE_API_URL}${inode}`;

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
     *
     * @param {DotTemplate} values
     * @return Observable<DotTemplate>
     * @memberof DotTemplatesService
     */
    create(values: DotTemplate): Observable<DotTemplate> {
        return this.request<DotTemplate>({ method: 'POST', url: TEMPLATE_API_URL, body: values });
    }

    /**
     * Updates a template
     * @returns Observable<DotTemplate>
     * @memberof DotTemplatesService
     */
    update(values: DotTemplate): Observable<DotTemplate> {
        console.log(JSON.stringify(values));
        return this.request<DotTemplate>({ method: 'PUT', url: TEMPLATE_API_URL, body: values });
    }

    /**
     * Delete a template
     * @param {string[]} identifiers
     * @returns ???
     * @memberof DotTemplatesService
     */
    delete(identifiers: string[]): Observable<boolean> {
        return this.request<boolean>({ method: 'DELETE', url: TEMPLATE_API_URL,  body: identifiers });
    }

    /**
     * Unarchive a template
     * @param {string[]} identifiers
     * @returns ???
     * @memberof DotTemplatesService
     */
    unArchive(identifiers: string[]): Observable<any> {
        const url = `${TEMPLATE_API_URL}_unarchive`;
        return this.request<any>({ method: 'PUT', url, body: identifiers });
    }

    /**
     * Archive a template
     * @param {string[]} identifiers
     * @returns ???
     * @memberof DotTemplatesService
     */
    archive(identifiers: string[]): Observable<any> {
        const url = `${TEMPLATE_API_URL}_archive`;
        return this.request<any>({ method: 'PUT', url, body: identifiers });
    }

    /**
     * Unpublish a template
     * @param {string[]} identifiers
     * @returns ???
     * @memberof DotTemplatesService
     */
    unPublish(identifiers: string[]): Observable<any> {
        const url = `${TEMPLATE_API_URL}_unpublish`;
        return this.request<any>({ method: 'PUT', url, body: identifiers });
    }

    /**
     * Publish a template
     * @param {string[]} identifiers
     * @returns ???
     * @memberof DotTemplatesService
     */
    publish(identifiers: string[]): Observable<any> {
        const url = `${TEMPLATE_API_URL}_publish`;
        return this.request<any>({ method: 'PUT', url, body: identifiers });
    }

    /**
     * Copy a template
     * @param {string} identifier
     * @returns ???
     * @memberof DotTemplatesService
     */
    copy(identifier: string): Observable<any> {
        const url = `${TEMPLATE_API_URL}${identifier}/_copy`;
        return this.request<any>({ method: 'PUT', url });
    }

    /**
     * Unlock a template
     * @param {string} identifier
     * @returns ???
     * @memberof DotTemplatesService
     */
    unlock(identifier: string): Observable<any> {
        const url = `${TEMPLATE_API_URL}${identifier}/_unlock`;
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
