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
        debugger;
        this.dotWizardService.showDialog$.subscribe(data => {
            debugger;
            this.steps = data;
            this.loadComponents();
            this.setDialogActions();
        });
    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.loadComponents();
        //     this.setDialogActions();
        // }, 0);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    close(): void {
        this.dialog.visible = false;
    }

    private loadComponents(): void {
        this.componentsHost = this.formHosts.toArray();
        this.stepsValidation = [];
        this.steps.forEach((step, index: number) => {
            const comp = this.componentFactoryResolver.resolveComponentFactory(step.component);
            const viewContainerRef = this.componentsHost[index].viewContainerRef;
            viewContainerRef.clear();
            const componentRef: ComponentRef<any> = viewContainerRef.createComponent(comp);
            componentRef.instance.data = step.data;
            componentRef.instance.value.subscribe(data => this.consolidateValues(data));
            componentRef.instance.valid.subscribe(valid => {
                this.setValid(valid, index);
            });
        });
    }

    private consolidateValues(data: { [key: string]: string }): void {
        this.wizardData = { ...this.wizardData, ...data };
        console.log(this.wizardData);
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
        this.updateTransform();
        if (this.isLastStep()) {
            this.dialogActions.accept.label = this.dotMessageService.get('send');
            this.dialogActions.cancel.disabled = false;
        } else if (this.isFirstStep()) {
            this.dialogActions.cancel.disabled = true;
        } else {
            this.dialogActions.cancel.disabled = false;
            this.dialogActions.accept.label = this.dotMessageService.get('next');
        }
        this.dialogActions.accept.disabled = !this.stepsValidation[this.currentStep];
        console.log(this.currentStep);
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
        this.steps = [];
        console.log('data: ', this.wizardData);
        // TODO: send value to service.
    }

    private updateTransform(): void {
        this.transform = `translateX(${this.currentStep * 400 * -1}px)`;
    }
}
