import { DotLayout } from './dot-layout.model';
import { DotPage } from './dot-page.model';
import { DotTemplate } from './dot-template.model';
import { DotEditPageViewAs } from '@models/dot-edit-page-view-as/dot-edit-page-view-as.model';

export interface DotPageRender {
    layout?: DotLayout;
    page: DotPage;
    containers?: any;
    template?: DotTemplate;
    canCreateTemplate: boolean;
    viewAs: DotEditPageViewAs;
    haveContent: boolean;
}
