import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { catchError, map, pluck, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
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
        return this.request({ url });
    }

    /**
     * Creates a template
     * @returns Observable<DotTemplate[]>
     * @memberof DotTemplatesService
     */
    create(values): Observable<DotTemplate[]> {
        const url = '/api/v1/templates';

        const body = {
            title: values.title,
            body: JSON.stringify(values)
        };

        return this.request({ method: 'POST', url, body });
    }

    private request(options) {
        const response$ = this.coreWebService.requestView<DotTemplate[]>(options);
        return response$.pipe(
            pluck('entity'),
            catchError((error: HttpErrorResponse) => {
                return this.httpErrorManagerService.handle(error).pipe(
                    take(1),
                    map(() => null)
                );
            })
        );
    }
}
