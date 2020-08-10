import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { DotContainerReferenceDirective } from '@directives/dot-container-reference/dot-container-reference.directive';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { ComponentRef } from '@angular/core/src/linker/component_factory';
import { Dialog } from 'primeng/dialog';
import { DotWizardStep } from '@models/dot-wizard-step/dot-wizard-step.model';
import { DotWizardService } from '@services/dot-wizard/dot-wizard.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'dot-wizard',
    templateUrl: './dot-wizard.component.html',
    styleUrls: ['./dot-wizard.component.scss']
})
export class DotWizardComponent implements OnInit, AfterViewInit, OnDestroy {
    wizardData: { [key: string]: string };
    dialogActions: DotDialogActions;
    transform = '';

    @Input() steps: DotWizardStep[] = [];
    @ViewChildren(DotContainerReferenceDirective)
    formHosts: QueryList<DotContainerReferenceDirective>;
    @ViewChild('dialog') dialog: Dialog;

    private currentStep = 0;
    private componentsHost: DotContainerReferenceDirective[];
    private stepsValidation: boolean[];
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private dotMessageService: DotMessageService,
        private dotWizardService: DotWizardService
    ) {}

    ngOnInit() {
        this.dotWizardService.showDialog$.subscribe(data => {
            this.steps = data;
            setTimeout(() => {
                this.loadComponents();
                this.setDialogActions();
            }, 0);
        });
    }

    ngAfterViewInit() {}

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    close(): void {
        this.dialog.visible = false;
        this.steps = [];
        this.currentStep = 0;
        this.updateTransform();
    }

    private loadComponents(): void {
        this.componentsHost = this.formHosts.toArray();
        this.stepsValidation = [];
        // this.loadComponent(0);

        this.steps.forEach((step, index: number) => {
            const comp = this.componentFactoryResolver.resolveComponentFactory(step.component);
            const viewContainerRef = this.componentsHost[index].viewContainerRef;
            viewContainerRef.clear();
            const componentRef: ComponentRef<any> = viewContainerRef.createComponent(comp);
            componentRef.instance.data = step.data;
            componentRef.instance.value
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => this.consolidateValues(data, index));
            componentRef.instance.valid.pipe(takeUntil(this.destroy$)).subscribe(valid => {
                this.setValid(valid, index);
            });
        });
    }

    // private loadComponent(index: number): void {
    //     if (this.stepsValidation[index] === undefined) {
    //         const comp = this.componentFactoryResolver.resolveComponentFactory(
    //             this.steps[index].component
    //         );
    //         const viewContainerRef = this.componentsHost[index].viewContainerRef;
    //         // viewContainerRef.clear();
    //         const componentRef: ComponentRef<any> = viewContainerRef.createComponent(comp);
    //         componentRef.instance.data = this.steps[index].data;
    //         componentRef.instance.value.pipe(takeUntil(this.destroy$)).subscribe(data => this.consolidateValues(data));
    //         componentRef.instance.valid.pipe(takeUntil(this.destroy$)).subscribe(valid => {
    //             this.setValid(valid, index);
    //         });
    //     }
    // }

    private consolidateValues(data: { [key: string]: string }, step: number): void {
        if (this.stepsValidation[step] === true) {
            this.wizardData = { ...this.wizardData, ...data };
        }
    }

    private setDialogActions(): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    this.getAcceptAction();
                },
                label: this.isLastStep()
                    ? this.dotMessageService.get('send')
                    : this.dotMessageService.get('next'),
                disabled: true
            },
            cancel: {
                action: () => {
                    this.loadNextStep(-1);
                },
                label: this.dotMessageService.get('previous'),
                disabled: true
            }
        };
    }

    private loadNextStep(next: number) {
        this.currentStep += next;
        // this.loadComponent(this.currentStep);
        this.updateTransform();
        if (this.isLastStep()) {
            this.dialogActions.accept.label = this.dotMessageService.get('send');
            this.dialogActions.cancel.disabled = false;
        } else if (this.isFirstStep()) {
            this.dialogActions.cancel.disabled = true;
            this.dialogActions.accept.label = this.dotMessageService.get('next');
        } else {
            this.dialogActions.cancel.disabled = false;
            this.dialogActions.accept.label = this.dotMessageService.get('next');
        }
        this.dialogActions.accept.disabled = !this.stepsValidation[this.currentStep];
    }

    private getAcceptAction(): void {
        this.isLastStep() ? this.sendValue() : this.loadNextStep(1);
    }

    private isLastStep(): boolean {
        return this.currentStep === this.componentsHost.length - 1;
    }

    private isFirstStep(): boolean {
        return this.currentStep === 0;
    }

    private setValid(valid: boolean, step: number): void {
        this.stepsValidation[step] = valid;
        if (this.currentStep === step) {
            this.dialogActions.accept.disabled = !valid;
        }
    }

    private sendValue(): void {
        this.dotWizardService.output$(this.wizardData);
        this.close();
    }

    private updateTransform(): void {
        this.transform = `translateX(${this.currentStep * 400 * -1}px)`;
    }
}
