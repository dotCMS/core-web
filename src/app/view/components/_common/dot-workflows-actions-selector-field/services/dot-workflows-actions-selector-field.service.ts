import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SelectItemGroup, SelectItem } from 'primeng/primeng';

import { DotWorkflowsActionsService } from '@services/dot-workflows-actions/dot-workflows-actions.service';
import { DotWorkflowAction, DotWorkflow } from 'dotcms-models';

@Injectable()
export class DotWorkflowsActionsSelectorFieldService {
    private data$: Subject<SelectItemGroup[]> = new Subject();

    constructor(private dotWorkflowsActionsService: DotWorkflowsActionsService) {}

    /**
     * Get actions grouped by workflows
     *
     * @returns {Observable<SelectItemGroup[]>}
     * @memberof DotWorkflowsActionsSelectorFieldService
     */
    get(): Observable<SelectItemGroup[]> {
        return this.data$;
    }

    /**
     * Update the actions with workflows passed
     *
     * @param {DotWorkflow[]} workflows
     * @memberof DotWorkflowsActionsSelectorFieldService
     */
    load(workflows: DotWorkflow[]): void {
        if (workflows && workflows.length) {
            this.dotWorkflowsActionsService
                .getByWorkflows(workflows)
                .pipe(
                    take(1),
                    map((actions: DotWorkflowAction[]) =>
                        this.getSelectItemGroups(workflows, actions)
                    )
                )
                .subscribe((actions: SelectItemGroup[]) => {
                    this.data$.next(actions);
                });
        } else {
            this.data$.next([]);
        }
    }

    private getSelectItemGroups(
        workflows: DotWorkflow[],
        actions: DotWorkflowAction[]
    ): SelectItemGroup[] {
        return workflows.map((workflow: DotWorkflow) => {
            const { label, value } = this.getSelectItem(workflow);

            return {
                label,
                value,
                items: this.getActionsByWorkflowId(workflow, actions).map(this.getSelectItem)
            };
        });
    }

    private getSelectItem({ name, id }: DotWorkflowAction | DotWorkflow): SelectItem {
        return {
            label: name,
            value: id
        };
    }

    private getActionsByWorkflowId(
        { id }: DotWorkflow,
        actions: DotWorkflowAction[]
    ): DotWorkflowAction[] {
        return actions.filter((action: DotWorkflowAction) => action.schemeId === id);
    }
}
