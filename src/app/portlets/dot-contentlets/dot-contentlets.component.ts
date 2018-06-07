import { Component, OnInit } from '@angular/core';
import { DotContentletEditorService } from '../../view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { DotNavigationService } from '../../view/components/dot-navigation/dot-navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    providers: [],
    selector: 'dot-contentlets',
    template: ''
})
export class DotContentletsComponent implements OnInit {

    constructor(
        private dotContentletEditorService: DotContentletEditorService,
        private dotNavigationService: DotNavigationService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // Fix "Error: ExpressionChangedAfterItHasBeenCheckedError" & modal not loading from New Tab
        // Todo: Change timeOut for a proper impletation

        setTimeout(() => {
            this.dotContentletEditorService.edit({
                data: {
                    inode: this.route.snapshot.params.inode
                }
            });
        }, 500);

        setTimeout(() => {
            this.dotNavigationService.goToFirstPortlet();
        }, 1000);
    }
}
