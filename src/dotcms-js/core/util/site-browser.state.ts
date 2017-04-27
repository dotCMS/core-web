import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Treeable} from '../treeable/shared/treeable.model';

/**
 * Manages the state of objects in dotcms-js so compoents can Observe changes and reload as needed
 */
@Injectable()
export class SiteBrowserState {

    currentFolder: Observable<string>;
    currentSetingsUpdated: Observable<boolean>;
    currentSite: Observable<string>;
    currentTreeable: Observable<Treeable>;
    currentURI: Observable<string>;
    private currentSiteSubject: BehaviorSubject<string>;
    private currentFolderSubject: BehaviorSubject<string>;
    private currentURISubject: BehaviorSubject<string>;
    private currentTreeableSubject: BehaviorSubject<Treeable>;
    private currentSettingsUpdatedSubject: BehaviorSubject<boolean>;
    constructor() {
        this.currentFolder = this.currentFolderSubject.asObservable();
        this.currentSetingsUpdated = this.currentSettingsUpdatedSubject.asObservable();
        this.currentSite = this.currentSiteSubject.asObservable();
        this.currentTreeable = this.currentTreeableSubject.asObservable();
        this.currentURI = this.currentURISubject.asObservable();
    }

    changeSite(siteName: string): void {
        this.currentSiteSubject.next(siteName);
    }

    getSelectedSite(): string {
        return <string>this.currentSiteSubject.getValue();
    }

    changeFolder(folderName: string): void {
        this.currentFolderSubject.next(folderName);
    }

    getSelectedFolder(): string {
        return <string>this.currentFolderSubject.getValue();
    }

    changeURI(uri: string): void {
        this.currentURISubject.next(uri);
    }
    getURI(): string {
        return <string>this.currentURISubject.getValue();
    }

    changeTreeable(treeable: Treeable): void {
        this.currentTreeableSubject.next(treeable);
    }

    getSelectedTreeable(): Treeable {
        return <Treeable>this.currentTreeableSubject.getValue();
    }

    changeSettingsUpdated(settingsUpdated: boolean): void {
        this.currentSettingsUpdatedSubject.next(settingsUpdated);
    }

    getSettingsUpdated(): boolean {
        return <boolean>this.currentSettingsUpdatedSubject.getValue();
    }

}