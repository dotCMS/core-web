import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient } from './http.service';
import { NotificationService } from './notification.service';
import { Response } from '@angular/http';
import { Inject, Injectable, NgModule } from '@angular/core';
import { Folder } from '../treeable/shared/folder.model';
import { map, catchError } from 'rxjs/operators';

/**
 * Service allows opertions against dotCMS Folder Endpoints and Operations
 */
@Injectable()
@Inject('httpClient')
@Inject('notificationService')
export class FolderService {
    constructor(private notificationService: NotificationService, private httpClient: HttpClient) {}

    /**
     * Load a folder from the remote dotCMS server based on site and path
     * @param String siteName The site name for the uri/folder
     * @param String uri The folder path
     */
    loadFolderByURI(siteName: String, uri: String): Observable<Folder | string> {
        return this.httpClient.get('/api/v1/folder/sitename/' + siteName + '/uri/' + uri).pipe(
            map((res: Response) => this.extractDataFilter(res)),
            catchError((error) => this.handleError(error))
        );
    }

    private extractDataFilter(res: Response): Folder {
        const obj = JSON.parse(res.text());
        const result: Folder = Object.assign(new Folder(), obj.entity);
        return result;
    }

    private handleError(error: any): Observable<string> {
        const errMsg = error.message
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : 'Server error';
        if (errMsg) {
            this.notificationService.displayErrorMessage(
                'There was an error; please try again : ' + errMsg
            );
            return observableThrowError(errMsg);
        }
    }
}

@NgModule({
    providers: [FolderService, HttpClient, NotificationService]
})
export class DotFolderModule {}
