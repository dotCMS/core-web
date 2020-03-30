import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    AfterContentChecked
} from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
    selector: 'dot-apps-configuration-detail-form',
    templateUrl: './dot-apps-configuration-detail-form.component.html',
    styleUrls: ['./dot-apps-configuration-detail-form.component.scss']
})
export class DotAppsConfigurationDetailFormComponent implements OnInit, AfterContentChecked {
    @ViewChild('form') public form: NgForm;
    @Input() formFields: any[];
    @Output() data = new EventEmitter<FormGroup>();
    @Output() valid = new EventEmitter<boolean>();
    myFormGroup: FormGroup;

    constructor() {}

    ngOnInit() {
        const group = {};
        this.formFields.forEach((field) => {
            group[field.name] = new FormControl(
                field.value || '',
                field.required ? Validators.required : null
            );
        });
        this.myFormGroup = new FormGroup(group);

        this.myFormGroup.valueChanges.subscribe(() => {
            this.data.emit(this.myFormGroup.value);
            this.valid.emit(this.form.valid);
        });
    }

    ngAfterContentChecked(): void {
        this.data.emit(this.myFormGroup.value);
        this.valid.emit(this.form.valid);
    }
}
