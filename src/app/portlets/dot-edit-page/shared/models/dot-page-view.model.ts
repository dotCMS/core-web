import { Layout} from './dot-layout.model';
import { Page } from './page.model';

export interface PageView {
    layout: Layout;
    page: Page;
    containers?: any
    site?:any
    template?:any
}
