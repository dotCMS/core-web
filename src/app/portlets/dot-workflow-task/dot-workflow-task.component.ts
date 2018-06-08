import { Component, AfterViewInit } from '@angular/core';
import { DotWorkflowTaskDetailService } from '../../view/components/dot-workflow-task-detail/services/dot-workflow-task-detail.service';
import { DotNavigationService } from '../../view/components/dot-navigation/dot-navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    providers: [],
    selector: 'dot-workflow-task',
    template: '<dot-workflow-task-detail (close)="onCloseWorkflowTaskEditor()"></dot-workflow-task-detail>'
})
export class DotWorkflowTaskComponent implements AfterViewInit {
    constructor(
        private dotWorkflowTaskDetailService: DotWorkflowTaskDetailService,
        private dotNavigationService: DotNavigationService,
        private route: ActivatedRoute
    ) {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.dotWorkflowTaskDetailService.view({
                header: 'Task Detail',
                id: this.route.snapshot.params.id
            });
        }, 0);
    }

    /**
     * Handle close event from the iframe
     *
     * @memberof DotWorkflowTaskComponent
     */
    onCloseWorkflowTaskEditor(): void {
        this.dotNavigationService.goToFirstPortlet();
    }
}
