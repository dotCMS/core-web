import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import {CoreWebService} from 'dotcms-js/dotcms-js';
import {RequestMethod} from '@angular/http';

/**
 * Provide util methods to get the Devices & dimensions.
 * @export
 * @class DotDevicesService
 */
@Injectable()
export class DotDevicesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Return available devices.
     * @returns {Observable<DotDevice[]>}
     * @memberof DotDevicesService
     */
    get(): Observable<DotDevice[]> {
        // TODO: This need to be changed to call the actual endpoint.

        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'content/render/false/query/+contentType:previewDevice'
            })
            .pluck('contentlets');
        // return Observable.of([
        //     { id: '0', label: 'Desktop', width: '100%', height: '100%' },
        //     { id: '1', label: 'iPhone', width: '375px', height: '667px' },
        //     { id: '2', label: 'iPad Pro', width: '1024px', height: '1366px' },
        //     { id: '3', label: 'iPad 3, 4, Air, Air2', width: '768px', height: '1024px' }
        // ]);
    }
}
