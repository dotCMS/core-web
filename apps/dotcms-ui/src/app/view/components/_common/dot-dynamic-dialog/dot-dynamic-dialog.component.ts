import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { DotContainerReferenceDirective } from '@dotcms/app/view/directives/dot-container-reference/dot-container-reference.directive';
import { DotDynamicDialogService } from '@services/dot-dynamic-dialog/dot-dynamic-dialog.service';

import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';

@Component({
    selector: 'dot-dynamic-dialog',
    templateUrl: './dot-dynamic-dialog.component.html'
    // styleUrls: ['./dot-download-bundle-dialog.component.scss']
})
export class DotDynamicDialogComponent implements OnInit, OnDestroy {
    @ViewChild(DotContainerReferenceDirective)
    dotContainerReference!: DotContainerReferenceDirective;

    dialogActions: DotDialogActions;
    showDialog = false;
    header = '';

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotMessageService: DotMessageService,
        private dotDynamicDialogService: DotDynamicDialogService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnInit() {
        this.dotDynamicDialogService.showDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ component, data }) => {
                console.log('***', component, data);

                this.header = data.header;

                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
                    component
                );

                const viewContainerRef = this.dotContainerReference.viewContainerRef;
                viewContainerRef.clear();

                const componentRef = viewContainerRef.createComponent<any>(componentFactory);
                componentRef.instance.data = data;

                componentRef.instance.dialogActions.subscribe((data) => {
                    console.log('+++++data', data);
                    // data.data.password = 'kk';
                    setTimeout(() => {
                        this.dialogActions = {...this.dialogActions, ...data}
                    }, 0);
                    //this.changeEmit.emit(data)
                });

                this.showDialog = true;

            });

        this.dialogActions = {
            cancel: {
                action: () => (this.close()),
                label: 'Cancel'
            }
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * hide the dialog
     * @memberof DotDynamicDialogComponent
     */
    close(): void {
        this.showDialog = false;
    }
}
