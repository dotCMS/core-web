import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotSecurePasswordComponent } from '@dotcms/app/view/components/_common/dot-secure-password/dot-secure-password.component';

interface DotDynamicDialogContent<T> {
    component: T;
    data: { [key: string]: any };
}

@Injectable()
export class DotDynamicDialogService {
    private input: Subject<DotDynamicDialogContent<any>> = new Subject<DotDynamicDialogContent<any>>();

    private dialogContentComponents = {
        'generate-secure-password': (data: any): DotDynamicDialogContent<any> => {
            data = {
                ...data,
                header: this.dotMessageService.get('dot.generate.secure.password')
            };
            return { component: DotSecurePasswordComponent, data };
        }
    };

    constructor(private dotMessageService: DotMessageService) {}

    get showDialog$(): Observable<any> {
        return this.input.asObservable();
    }

    open(dialogContent: string, data?: any) {
        this.input.next(this.dialogContentComponents[dialogContent](data));
    }
}
