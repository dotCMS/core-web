import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotRolesService } from '@services/dot-roles/dot-roles.service';
import { take, takeUntil } from 'rxjs/operators';
import { DotRole } from '@models/dot-role/dot-role.model';
import { SelectItem } from 'primeng/api';
import { DotFormModel } from '@models/dot-form/dot-form.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

enum DotActionInputs {
    ASSIGNABLE = 'assignable',
    MOVEABLE = 'moveable'
}

@Component({
    selector: 'dot-comment-and-assign-form',
    templateUrl: './dot-comment-and-assign-form.component.html',
    styleUrls: ['./dot-comment-and-assign-form.component.scss']
})
export class DotCommentAndAssignFormComponent
    implements OnInit, DotFormModel<{ [key: string]: unknown }, { [key: string]: string }>
{
    form: FormGroup;
    @Input() data: { [key: string]: string | boolean };
    @Output() value = new EventEmitter<{ [key: string]: string }>();
    @Output() valid = new EventEmitter<boolean>();
    dotRoles: SelectItem[];

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private dotRolesService: DotRolesService, public fb: FormBuilder) {}

    ngOnInit() {
        if (this.data) {
            if (this.data[DotActionInputs.ASSIGNABLE]) {
                this.dotRolesService
                    .get(this.data.roleId as string, this.data.roleHierarchy as boolean)
                    .pipe(take(1))
                    .subscribe((items: DotRole[]) => {
                        this.dotRoles = items.map((role) => {
                            return { label: role.name, value: role.id };
                        });
                        this.initForm();
                    });
            } else {
                this.initForm();
            }
        }
    }

    /**
     * Emit if form is valid and the value.
     * @memberof DotCommentAndAssignFormComponent
     */
    emitValues(): void {
        this.valid.emit(this.form.valid);
        this.value.emit(this.form.value);
    }

    private initForm(): void {
        this.form = this.fb.group({
            assign: this.dotRoles ? this.dotRoles[0].value : '',
            comments: '',
            pathToMove: this.data[DotActionInputs.MOVEABLE] ? ['', [Validators.required]] : ''
        });
        this.emitValues();
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.emitValues());
    }
}
