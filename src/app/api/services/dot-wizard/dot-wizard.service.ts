import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DotWizardStep } from '@models/dot-wizard-step/dot-wizard-step.model';

@Injectable()
export class DotWizardService {
    private input: Subject<DotWizardStep[]> = new Subject<DotWizardStep[]>();
    private output: Subject<{ [key: string]: string }> = new Subject<{ [key: string]: string }>();

    get showDialog$(): Observable<DotWizardStep[]> {
        return this.input.asObservable();
    }

    /**
     * Notify the data collected in wizard.
     * @param {{ [key: string]: string }} form
     * @memberof DotWizardService
     */
    output$(form: { [key: string]: string }): void {
        this.output.next(form);
    }

    /**
     * Send the steps to in input subscription and waits for the output
     * @param {DotWizardStep[]} steps
     * @returns Observable<{ [key: string]: string }>
     * @memberof DotWizardService
     */
    open(steps: DotWizardStep[]): Observable<{ [key: string]: string }> {
        this.input.next(steps);
        return this.output.asObservable();
    }
}
