import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import { DotRolesService } from '@services/dot-roles/dot-roles.service';
import { take, takeUntil } from 'rxjs/operators';
import { DotRole } from '@models/dot-role/dot-role.model';
import { SelectItem } from 'primeng/api';
import { DotFormModel } from '@models/dot-form/dot-form.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

enum DotActionInputs {
    ASSIGNABLE = 'assignable'
}

@Component({
    selector: 'dot-comment-and-assign-form',
    templateUrl: './dot-comment-and-assign-form.component.html',
    styleUrls: ['./dot-comment-and-assign-form.component.scss']
})
export class DotCommentAndAssignFormComponent
    implements AfterViewChecked,
        OnInit,
        DotFormModel<{ [key: string]: any }, { [key: string]: string }> {
    form: FormGroup;
    @Input() data: { [key: string]: any };
    @Output() value = new EventEmitter<{ [key: string]: string }>();
    @Output() valid = new EventEmitter<boolean>();
    @ViewChildren('field') fields: QueryList<ElementRef>;
    dotRoles: SelectItem[];

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private dotRolesService: DotRolesService, public fb: FormBuilder) {}

    ngOnInit() {
        if (this.data) {
            if (this.data[DotActionInputs.ASSIGNABLE]) {
                this.dotRolesService
                    .get(this.data.roleId)
                    .pipe(take(1))
                    .subscribe((items: DotRole[]) => {
                        this.dotRoles = items.map(role => {
                            return { label: role.name, value: role.id };
                        });
                        this.initForm();
                    });
            } else {
                this.initForm();
            }
        }
    }

    ngAfterViewChecked() {
        if (this.fields.first) {
            //    debugger;
            //   this.fields.first.nativeElement.focus();
        }
    }

    emitValues(): void {
        this.value.emit(this.form.value);
        this.valid.emit(this.form.status === 'VALID');
    }

    private initForm(): void {
        this.form = this.fb.group({
            assign: this.dotRoles ? this.dotRoles[0].value : '',
            comments: ''
        });
        this.emitValues();
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.emitValues());
    }
}
