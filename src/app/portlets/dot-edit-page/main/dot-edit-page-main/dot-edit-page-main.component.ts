import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';
import { DotContentletEditorService } from '../../../../view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';

@Component({
    selector: 'dot-edit-page-main',
    templateUrl: './dot-edit-page-main.component.html',
    styleUrls: ['./dot-edit-page-main.component.scss']
})
export class DotEditPageMainComponent implements OnInit {
    pageState: Observable<DotRenderedPageState>;

    constructor(private route: ActivatedRoute, private dotContentletEditorService: DotContentletEditorService) {}

    ngOnInit() {
        this.pageState = this.route.data.pluck('content');
    }

    openProperties(buttonClicked: { inode: string; label: string }) {
        this.dotContentletEditorService.edit({
            data: {
                inode: buttonClicked.inode
            }
        });
    }
}
