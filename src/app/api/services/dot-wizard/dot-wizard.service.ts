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

    output$(form: { [key: string]: string }): void {
        this.output.next(form);
    }

    open(steps: DotWizardStep[]): Observable<{ [key: string]: string }> {
        this.input.next(steps);
        return this.output.asObservable();
    }
}
