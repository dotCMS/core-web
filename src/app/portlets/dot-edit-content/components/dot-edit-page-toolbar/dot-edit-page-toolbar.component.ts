import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { SelectItem, MenuItem, SplitButton, InputSwitch } from 'primeng/primeng';
import { Workflow } from '../../../../shared/models/workflow/workflow.model';

@Component({
    selector: 'dot-edit-page-toolbar',
    templateUrl: './dot-edit-page-toolbar.component.html',
    styleUrls: ['./dot-edit-page-toolbar.component.scss']
})
export class DotEditPageToolbarComponent implements OnInit {
    @ViewChild('actionsButton') actionsButton: SplitButton;
    @ViewChild('locker') locker: InputSwitch;

    @Input() canSave: boolean;
    @Input() pageLocked: boolean;
    @Input() pageTitle: string;
    @Input() pageUrl: string;
    @Input() pageWorkflows: Workflow[];

    @Output() lockPage = new EventEmitter<boolean>();
    @Output() pageState = new EventEmitter<string>();
    @Output() save = new EventEmitter<MouseEvent>();

    states: SelectItem[] = [];
    stateSelected = 'preview';
    workflowsActions: MenuItem[] = [];

    constructor(public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'editpage.toolbar.primary.action',
                'editpage.toolbar.edit.page',
                'editpage.toolbar.preview.page',
                'editpage.toolbar.live.page',
                'editpage.toolbar.primary.workflow.actions'
            ])
            .subscribe((res) => {
                this.states = [
                    { label: res['editpage.toolbar.edit.page'], value: 'edit' },
                    { label: res['editpage.toolbar.preview.page'], value: 'preview' },
                    { label: res['editpage.toolbar.live.page'], value: 'live' }
                ];
            });

        if (this.pageWorkflows) {
            this.workflowsActions = this.pageWorkflows.map((workflow: Workflow) => {
                return {
                    label: workflow.name
                };
            });
        }
    }

    /**
     * Handler locker change event
     *
     * @param {any} $event
     * @memberof DotEditPageToolbarComponent
     */
    lockPageHandler($event): void {
        this.pageLocked = $event.checked;
        this.lockPage.emit(this.pageLocked);

        if (!this.pageLocked && this.stateSelected === 'edit') {
            this.stateSelected = 'preview';
            this.pageState.emit(this.stateSelected);
        }

        if (this.pageLocked && this.stateSelected === 'preview') {
            this.stateSelected = 'edit';
            this.pageState.emit(this.stateSelected);
        }
    }

    /**
     * Handle state selector change event
     *
     * @param {any} $event
     * @memberof DotEditPageToolbarComponent
     */
    stateSelectorHandler(state: string): void {
        this.stateSelected = state;
        this.pageState.emit(this.stateSelected);

        if (!this.pageLocked) {
            console.log('emit');
            this.pageLocked = state === 'edit';
            this.lockPage.emit(this.pageLocked);
        }
    }
}
