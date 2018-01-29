import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { SelectItem, MenuItem, SplitButton, InputSwitch } from 'primeng/primeng';
import { Workflow } from '../../../../shared/models/workflow/workflow.model';
import { DotRenderedPage } from '../../../dot-edit-page/shared/models/dot-rendered-page.model';
import { DotEditPageState } from '../../../../shared/models/dot-edit-page-state/dot-edit-page-state.model';

export enum PageMode {
    EDIT,
    PREVIEW,
    LIVE
}

@Component({
    selector: 'dot-edit-page-toolbar',
    templateUrl: './dot-edit-page-toolbar.component.html',
    styleUrls: ['./dot-edit-page-toolbar.component.scss']
})
export class DotEditPageToolbarComponent implements OnInit {
    @Input() canSave: boolean;
    @Input() pageWorkflows: Workflow[];
    @Input() page: DotRenderedPage;

    @Output() changeState = new EventEmitter<DotEditPageState>();
    @Output() save = new EventEmitter<MouseEvent>();

    states: SelectItem[] = [];
    stateSelected: PageMode;
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
                    { label: res['editpage.toolbar.edit.page'], value: PageMode.EDIT },
                    { label: res['editpage.toolbar.preview.page'], value: PageMode.PREVIEW },
                    { label: res['editpage.toolbar.live.page'], value: PageMode.LIVE }
                ];
            });

        if (this.pageWorkflows) {
            this.workflowsActions = this.pageWorkflows.map((workflow: Workflow) => {
                return {
                    label: workflow.name
                };
            });
        }

        this.stateSelected = this.page.locked ? PageMode.EDIT : PageMode.PREVIEW;
    }

    /**
     * Copy url to clipboard
     *
     * @returns {boolean}
     * @memberof DotEditPageToolbarComponent
     */
    copyUrlToClipboard(): boolean {
        /*
            Aparently this is the only crossbrowser solution so far. If we do this in another place we might have
            to include an npm module.
        */
        const txtArea = document.createElement('textarea');

        txtArea.style.position = 'fixed';
        txtArea.style.top = '0';
        txtArea.style.left = '0';
        txtArea.style.opacity = '0';
        txtArea.value = this.page.pageUri;
        document.body.appendChild(txtArea);
        txtArea.select();

        try {
            return document.execCommand('copy');
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(txtArea);

        return false;
    }

    /**
     * Handler locker change event
     *
     * @param {any} $event
     * @memberof DotEditPageToolbarComponent
     */
    lockPageHandler($event): void {
        const state: DotEditPageState = {
            lock: this.page.locked,
            mode: null
        };

        if (!this.page.locked && this.stateSelected === PageMode.EDIT) {
            this.stateSelected = PageMode.PREVIEW;
            state.mode = this.stateSelected;
        } else if (this.page.locked && this.stateSelected === PageMode.PREVIEW) {
            this.stateSelected = PageMode.EDIT;
            state.mode = this.stateSelected;
        }

        this.changeState.emit(state);
    }

    /**
     * Handle state selector change event
     *
     * @param {any} $event
     * @memberof DotEditPageToolbarComponent
     */
    stateSelectorHandler(pageState: PageMode): void {
        const state: DotEditPageState = {
            lock: null,
            mode: pageState
        };

        if (!this.page.locked && pageState === PageMode.EDIT) {
            this.page.locked = pageState === PageMode.EDIT;
            state.lock = this.page.locked;
        }

        this.changeState.emit(state);
    }
}
