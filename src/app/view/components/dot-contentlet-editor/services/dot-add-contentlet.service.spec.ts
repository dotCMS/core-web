import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotContentletEditorService, DotAddContentLet, DotEditContentlet } from './dot-add-contentlet.service';
import { DotMenuService } from '../../../../api/services/dot-menu.service';
import { Observable } from 'rxjs/Observable';

describe('DotAddContentletService', () => {
    const load = () => {};
    const keyDown = () => {};
    let service: DotContentletEditorService;
    let dotMenuService: DotMenuService;
    let injector;

    beforeEach(() => {
        injector = DOTTestBed.configureTestingModule({
            providers: [DotContentletEditorService, DotMenuService]
        });

        service = injector.get(DotContentletEditorService);
        dotMenuService = injector.get(DotMenuService);
        spyOn(dotMenuService, 'getDotMenuId').and.returnValue(Observable.of('456'));
    });

    it('should set data to add', () => {
        service.add$.subscribe((url: string) => {
            expect(url).toEqual(`/html/ng-contentlet-selector.jsp?ng=true&container_id=123&add=content`);
        });

        service.add({
            type: 'content',
            container: '123',
            events: {
                load: load,
                keyDown: keyDown
            }
        });
    });

    it('should set data to edit', () => {
        service.edit$.subscribe((url: string) => {
            expect(url).toEqual(
                [
                    `/c/portal/layout`,
                    `?p_l_id=456`,
                    `&p_p_id=content`,
                    `&p_p_action=1`,
                    `&p_p_state=maximized`,
                    `&p_p_mode=view`,
                    `&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet`,
                    `&_content_cmd=edit&inode=999`
                ].join('')
            );
        });

        service.edit({
            inode: '999'
        });
    });

    it('should clear url and undbind', () => {
        service.add$.subscribe((url: string) => {
            expect(url).toEqual('');
        });

        service.edit$.subscribe((url: string) => {
            expect(url).toEqual('');
        });

        service.clear();

        expect(service.load).toEqual(null);
        expect(service.keyDown).toEqual(null);
    });
});
