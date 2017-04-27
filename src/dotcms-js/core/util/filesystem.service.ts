import {NotificationService} from './notification.service';
import {Injectable} from '@angular/core';

// var fs = require('fs');

/**
 * FileSystemService provides helper utilities to read and crawl the local filesystem
 */
@Injectable()
export class FileSystemService {

    constructor
    (
        private messageService: NotificationService
    ) {}

    /**
     * Utility method to help crawl a local directoy returning all folders and files underneath it
     * @param directory Local Filesystem Directory to crawl
     * @param files Can be NULL. Is a list of Strings to local File paths that will be returned.
     * @returns {String[]} List of File and Folder Paths under the passed in path added to the passed in files[]
     */
    recurseDirectory(directory: string, files: String[]): String[] {
        // let filePaths : string = fs.readdirSync(directory);
        if (files == null) {files = []; }
        // for (var i = 0; i < filePaths.length; i++) {
        //     let file = filePaths[i];
        //     if (fs.statSync(directory + '/' + file).isDirectory()) {
        //         files = this.recurseDirectory(directory + '/' + file, files);
        //     }
        //     else {
        //         files.push(file);
        //     }
        // };
        return files;
    }

    /**
     * Tests if a local file path is a directory or not
     * @param localPath local file or directory path
     * @returns {boolean}
     */
    isDirectory(localPath: string): boolean {
        let ret = false;
        // TODO : need to convert to SYNC statSYNC
        // fs.stat(localPath, function (err:any,data:any,r:any) {
        //     if (err) {
        //         this.logFileReadingError(err);
        //         throw err;
        //     }
        //     r = data.isDirectory();
        // }).toPromise().onSuccess(function(r:any) {ret = r});
        return ret;
    }

    private logFileReadingError(err: any): void {
        if (err) {
            console.log(err);
            this.messageService.displayErrorMessage('There was an error reading the file or directory; please try again');
        }
    }
}