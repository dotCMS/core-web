import {
    Component,
    Input,
    SimpleChanges,
    OnChanges,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { DotKeyValue, DotKeyValueSaveData } from '@shared/models/dot-key-value/dot-key-value.model';

@Component({
    selector: 'dot-key-value',
    styleUrls: ['./dot-key-value.component.scss'],
    templateUrl: './dot-key-value.component.html'
})
export class DotKeyValueComponent implements OnInit, OnChanges {
    @Input() variables: DotKeyValue[] = [];
    @Output() delete: EventEmitter<number> = new EventEmitter(false);
    @Output() save: EventEmitter<DotKeyValueSaveData> = new EventEmitter(false);

    variablesBackup: DotKeyValue[] = [];
    messages: { [key: string]: string } = {};

    constructor(public dotMessageService: DotMessageService) {}

    ngOnInit(): void {
        this.dotMessageService
            .getMessages([
                'keyValue.key_header.label',
                'keyValue.value_header.label',
                'keyValue.actions_header.label',
                'keyValue.value_no_rows.label'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
            });
    }

    ngOnChanges(_changes: SimpleChanges): void {
        this.variablesBackup = _.cloneDeep(this.variables);
    }

    /**
     * Handle Delete event, emitting the index be handled by a parent smart component
     * @param {number} fieldIndex
     * @memberof DotKeyValueComponent
     */
    deleteVariable(fieldIndex: number): void {
        this.delete.emit(fieldIndex);
    }

    /**
     * Handle Save event, emitting the variable be handled by a parent smart component
     * @param {number} fieldIndex
     * @memberof DotKeyValueComponent
     */
    saveVariable(fieldIndex: number): void {
        this.save.emit({
            variable: this.variablesBackup[fieldIndex],
            variableIndex: fieldIndex
        });
    }

    /**
     * Handle Cancel event, restoring the original value of the variable
     * @param {number} fieldIndex
     * @memberof DotKeyValueComponent
     */
    onCancel(fieldIndex: number): void {
        this.variablesBackup[fieldIndex] = _.cloneDeep(this.variables[fieldIndex]);
    }
}
