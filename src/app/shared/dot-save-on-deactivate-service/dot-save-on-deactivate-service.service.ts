import { Injectable } from '@angular/core';
import { OnSaveDeactivate } from './save-on-deactivate';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DotDialogService } from '../../api/services/dot-dialog/dot-dialog.service';

@Injectable()
export class DotSaveOnDeactivateServiceService implements CanDeactivate<OnSaveDeactivate> {
    constructor(private dotDialogService: DotDialogService) {}

    canDeactivate(component: OnSaveDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (component.modelChanged()) {
            return Observable.create((observer: Observer<boolean>) => {
                this.dotDialogService.confirm({
                    accept: () => {
                        component.onDeactivateSave().subscribe(val => {
                            observer.next(true);
                            observer.complete();
                        });
                    },
                    reject: () => {
                        observer.next(true);
                        observer.complete();
                    },
                    header: component.saveWarningMessages().header,
                    message: component.saveWarningMessages().message
                });
            });
        } else {
            return Observable.of(true);
        }
    }
}
