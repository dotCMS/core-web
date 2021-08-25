import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { DotEditLayoutService } from '../dot-edit-layout/dot-edit-layout.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface CanDeactivateGuarded {
    canDeactivate: () => Observable<boolean>;
}

/**
 *
 *  
 * @export
 * @class LayoutEditorCanDeactivateGuardService
 * @implements {CanDeactivate<CanDeactivateGuarded>}
 */
@Injectable({
    providedIn: 'root'
})
export class LayoutEditorCanDeactivateGuardService implements CanDeactivate<CanDeactivateGuarded> {
    
    constructor(private dotEditLayoutService: DotEditLayoutService) {}

    /**
     *
     *
     * @return {*}  {Observable<boolean>}
     * @memberof LayoutEditorCanDeactivateGuardService
     */
    canDeactivate(): Observable<boolean> {
        return this.dotEditLayoutService.canBeDesactivated$.pipe(
            filter((res) => {
                this.dotEditLayoutService.changeStateAlert(!res);
                return res;
            })
        );
    }
}
