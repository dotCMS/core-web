import { Component, OnInit } from '@angular/core';
import { DotWorkflowTaskDetailService } from '../../view/components/dot-workflow-task-detail/services/dot-workflow-task-detail.service';
import { DotNavigationService } from '../../view/components/dot-navigation/dot-navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    providers: [],
    selector: 'dot-workflow-task',
    template: ''
})
export class DotWorkflowTaskComponent implements OnInit {
    constructor(
        private dotWorkflowTaskDetailService: DotWorkflowTaskDetailService,
        private dotNavigationService: DotNavigationService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Fix "Error: ExpressionChangedAfterItHasBeenCheckedError" & modal not loading from New Tab
        // Todo: Change timeOut for a proper impletation

        setTimeout(() => {
            this.dotWorkflowTaskDetailService.view({
                id: this.route.snapshot.params.id
            });
        }, 500);

        setTimeout(() => {
            this.dotNavigationService.goToFirstPortlet();
        }, 1000);
    }
}
