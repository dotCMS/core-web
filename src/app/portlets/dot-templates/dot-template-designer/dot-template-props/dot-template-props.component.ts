import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dot-dot-template-props',
    templateUrl: './dot-template-props.component.html',
    styleUrls: ['./dot-template-props.component.scss']
})
export class DotTemplatePropsComponent implements OnInit {
    form: FormGroup;

    isFormValid$: Observable<boolean>;

    constructor(private config: DynamicDialogConfig, private fb: FormBuilder) {}

    ngOnInit(): void {
        const { title, description } = this.config.data.template;

        this.form = this.fb.group({
            title: [title, Validators.required],
            description
        });

        this.isFormValid$ = this.form.valueChanges.pipe(
            map(() => {
                // this is not working
                console.log(
                    JSON.stringify(this.form.value),
                    JSON.stringify({ title: title, description: description })
                );
                return (
                    JSON.stringify(this.form.value) !== JSON.stringify({ title, description }) &&
                    this.form.valid
                );
            })
        );
    }
}
