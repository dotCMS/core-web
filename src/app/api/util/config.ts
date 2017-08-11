import {Injectable} from '@angular/core';
import {HttpRequestUtils} from './httpRequestUtils';
import { environment } from '../../../environments/environment';

const DEV_MODE_PARAM = 'devMode';

/**
 * Encapsulates generic configuration, such as the dev mode, etc.
 * @author jsanca
 */
@Injectable()
export class Config {

    private httpRequestUtils: HttpRequestUtils;

    constructor() {
        this.httpRequestUtils = new HttpRequestUtils();
    }

    /**
     * Determine if angular is running in a Production way
     * @returns {boolean}
     */
    isProduction(): boolean {

        let runningMode: string = environment.name;
        const devMode: string = this.httpRequestUtils.getQueryStringParam(DEV_MODE_PARAM);

        if (devMode) {
            // This service load before LoggerService, so we can't use it here.
            // tslint:disable-next-line:no-console
            console.log('Found a parameter in the url with a devMode: ', devMode);
            runningMode = devMode === 'on' ? 'DEV' : 'PROD';
        }

        return runningMode === 'PROD';
    } // isProduction.
} // E:O:F:Config
