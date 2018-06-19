import { Injectable } from '@angular/core';
import { OnSaveDeactivate } from './save-on-deactivate';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DotDialogService } from '../../api/services/dot-dialog/dot-dialog.service';

@Injectable()
export class DotSaveOnDeactivateService implements CanDeactivate<OnSaveDeactivate> {
    constructor(private dotDialogService: DotDialogService) {}

    canDeactivate(component: OnSaveDeactivate, _route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
        if (component.shouldSaveBefore()) {
            return Observable.create((observer: Observer<boolean>) => {
                this.dotDialogService.confirm({
                    accept: () => {
                        component.onDeactivateSave().subscribe( res => {
                            observer.next(res);
                            observer.complete();
                        });
                    },
                    reject: () => {
                        observer.next(true);
                        observer.complete();
                    },
                    header: component.getSaveWarningMessages().header,
                    message: component.getSaveWarningMessages().message
                });
            });
        } else {
            return Observable.of(true);
        }
    }
}
