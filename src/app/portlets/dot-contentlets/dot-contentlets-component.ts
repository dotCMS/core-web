import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Folder } from 'dotcms-js/core/treeable/shared/folder.model';
import { FileService, FolderService, SiteBrowserState, SiteDatagridComponent } from 'dotcms-js/dotcms-js';
import { FileUpload } from 'primeng/primeng';
import { DotContentletEditorService } from '../../view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { DotEditContentHtmlService } from '../dot-edit-page/content/services/dot-edit-content-html/dot-edit-content-html.service';
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
        public dotEditContentHtmlService: DotEditContentHtmlService,
        private dotNavigationService: DotNavigationService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.dotNavigationService.goToFirstPortlet();
        this.dotContentletEditorService.edit({
            data: {
                inode: this.route.snapshot.params.inode//'5cd3b647-e465-4a6d-a78b-e834a7a7331a'
            },
            events: {
                load: (event) => {
                    event.target.contentWindow.ngEditContentletEvents = this.dotEditContentHtmlService.contentletEvents$;
                }
            }
        });
    }
}
