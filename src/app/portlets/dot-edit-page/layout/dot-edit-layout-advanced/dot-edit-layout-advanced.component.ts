import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotMenuService } from '../../../../api/services/dot-menu.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DotPageView } from '../../shared/models/dot-page-view.model';

@Component({
    selector: 'dot-edit-layout-advanced',
    templateUrl: './dot-edit-layout-advanced.component.html',
    styleUrls: ['./dot-edit-layout-advanced.component.scss']
})
export class DotEditLayoutAdvancedComponent implements OnInit {
    @Input() templateInode: string;
    url: Observable<string>;

    constructor(private dotMenuService: DotMenuService, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.url = this.dotMenuService.getDotMenuId('templates').map((id: string) => {
            // tslint:disable-next-line:max-line-length
            return `c/portal/layout?p_l_id=${id}&p_p_id=templates&p_p_action=1&p_p_state=maximized&p_p_mode=view&_templates_struts_action=%2Fext%2Ftemplates%2Fedit_template&_templates_cmd=edit&inode=${this.templateInode}&r=0d618b02-f184-48fe-88f4-e98563ee6e9e&referer=%2Fc%2Fportal%2Flayout%3Fp_l_id%3D${id}%26p_p_id%3Dtemplates%26p_p_action%3D1%26p_p_state%3Dmaximized%26_templates_pageNumber%3D1%26_templates_struts_action%3D%252Fext%252Ftemplates%252Fview_templates`;
        });
    }
}
