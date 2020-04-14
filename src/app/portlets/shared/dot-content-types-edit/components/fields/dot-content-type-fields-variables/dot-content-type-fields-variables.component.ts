import { Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DotFieldVariablesService } from './services/dot-field-variables.service';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotFieldVariable } from './models/dot-field-variable.interface';
import { ResponseView } from 'dotcms-js';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { DotCMSContentTypeField } from 'dotcms-models';
import { DotKeyValueSaveData } from '@shared/models/dot-key-value/dot-key-value.model';

@Component({
    selector: 'dot-content-type-fields-variables',
    styleUrls: ['./dot-content-type-fields-variables.component.scss'],
    templateUrl: './dot-content-type-fields-variables.component.html'
})
export class DotContentTypeFieldsVariablesComponent implements OnChanges, OnDestroy {
    @Input()
    field: DotCMSContentTypeField;

    fieldVariables: DotFieldVariable[] = [];
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private fieldVariablesService: DotFieldVariablesService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.field.currentValue) {
            this.initTableData();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle Delete event doing a Delete to the Backend
     * @param {number} fieldIndex
     * @memberof DotContentTypeFieldsVariablesComponent
     */
    deleteExistingVariable(fieldIndex: number): void {
        this.fieldVariablesService
            .delete(this.field, this.fieldVariables[fieldIndex])
            .pipe(take(1))
            .subscribe(
                () => {
                    this.fieldVariables = this.fieldVariables.filter(
                        (_item: DotFieldVariable, index: number) => index !== fieldIndex
                    );
                },
                (err: ResponseView) => {
                    this.dotHttpErrorManagerService.handle(err).pipe(take(1)).subscribe();
                }
            );
    }

    /**
     * Handle Save event doing a Post to the Backend
     * @param {DotKeyValueSaveData} { variable, index }:
     * @memberof DotContentTypeFieldsVariablesComponent
     */
    updateExistingVariable({ variable, index }: DotKeyValueSaveData): void {
        this.fieldVariablesService
            .save(this.field, variable)
            .pipe(take(1))
            .subscribe(
                (savedVariable: DotFieldVariable) => {
                    this.fieldVariables = this.updateVariableCollection(
                        savedVariable,
                        index
                    );
                    this.addEmptyVariable();
                },
                (err: ResponseView) => {
                    this.dotHttpErrorManagerService.handle(err).pipe(take(1)).subscribe();
                }
            );
    }

    private initTableData(): void {
        this.fieldVariablesService
            .load(this.field)
            .pipe(takeUntil(this.destroy$))
            .subscribe((fieldVariables: DotFieldVariable[]) => {
                this.fieldVariables = fieldVariables;
                this.addEmptyVariable();
            });
    }

    private addEmptyVariable(): void {
        if (this.fieldVariables.length === 0 || this.isEmptyVariableNotAdded()) {
            const emptyVariable: DotFieldVariable = {
                key: '',
                value: ''
            };
            this.fieldVariables = [].concat(emptyVariable, this.fieldVariables);
        }
    }

    private isEmptyVariableNotAdded(): boolean {
        return this.fieldVariables.length > 0 && this.fieldVariables[0].key !== '';
    }

    private updateVariableCollection(
        savedVariable: DotFieldVariable,
        variableIndex: number
    ): DotFieldVariable[] {
        return this.fieldVariables.map((item, index) => {
            if (index === variableIndex) {
                item = savedVariable;
            }
            return item;
        });
    }
}
