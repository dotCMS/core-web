import { Injectable } from '@angular/core';
import { CoreWebService, DotRequestOptionsArgs } from 'dotcms-js';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Injectable()
export class DotTemplatesService {
    constructor(private coreWebService: CoreWebService) {}

    getByInode(inode: string) {
        const url = `/api/v1/templates/${inode}`;
        return this.coreWebService
            .requestView({
                url
            })
            .pipe(
                pluck('entity'),
                map((template) => {
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
    create(values): Observable<any> {
        const url = '/api/v1/templates';

        return this.request<any>({ method: 'POST', url, body: values });
    }

    /**
     * Updates a template
     * @returns Observable<DotTemplate>
     * @memberof DotTemplatesService
     */
    update(values): Observable<any> {
        console.log(values);
        const url = '/api/v1/templates';

        return this.request<any>({ method: 'PUT', url, body: JSON.stringify(values) });
    }

    private request<T>(options: DotRequestOptionsArgs): Observable<T> {
        const response$ = this.coreWebService.requestView<T>(options);
        return response$.pipe(pluck('entity'));
    }
}
