import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotRolesService } from '@services/dot-roles/dot-roles.service';
import { take } from 'rxjs/operators';
import { DotRole } from '@models/dot-role/dot-role.model';
import { SelectItem } from 'primeng/api';
import { DotFormModel } from '@models/dot-form/dot-form.model';

@Component({
    selector: 'dot-assignee-form',
    templateUrl: './dot-assignee-form.component.html',
    styleUrls: ['./dot-assignee-form.component.scss']
})
export class DotAssigneeFormComponent
    implements OnInit, DotFormModel<{ [key: string]: string }, { [key: string]: string }> {
    @Input() data: { [key: string]: string };
    @Output() value = new EventEmitter<{ [key: string]: string }>();
    @Output() valid = new EventEmitter<boolean>();

    options: SelectItem[];

    constructor(private dotRolesService: DotRolesService) {}

    ngOnInit() {
        this.dotRolesService
            .get(this.data.roleId)
            .pipe(take(1))
            .subscribe((roles: DotRole[]) => {
                this.options = roles.map(role => {
                    return { label: role.name, value: role.id };
                });
                this.emit(this.options[0]);
            });
    }

    emit(option: SelectItem) {
        this.value.emit({ assignee: option.value });
        this.valid.emit(true);
    }
}
