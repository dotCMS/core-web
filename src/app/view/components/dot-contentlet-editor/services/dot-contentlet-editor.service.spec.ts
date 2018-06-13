import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotContentletEditorService } from './dot-contentlet-editor.service';
import { DotMenuService } from '../../../../api/services/dot-menu.service';
import { Observable } from 'rxjs/Observable';

describe('DotContentletEditorService', () => {
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
        service.editUrl$.subscribe((url: string) => {
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

        service.header$.subscribe((header: string) => {
            expect(header).toEqual('This is a header for add');
        });

        service.add({
            header: 'This is a header for add',
            data: {
                baseTypes: 'content',
                container: '123'
            },
            events: {
                load: load,
                keyDown: keyDown
            }
        });
    });

    it('should set data to edit', () => {
        service.editUrl$.subscribe((url: string) => {
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

        service.header$.subscribe((header: string) => {
            expect(header).toEqual('This is a header for edit');
        });

        service.edit({
            header: 'This is a header for edit',
            data: {
                inode: '999'
            }
        });
    });

    it('should set url to create a contentlet', () => {
        service.createUrl$.subscribe((url: string) => {
            expect(url).toEqual('hello.world.com');
        });

        service.header$.subscribe((header: string) => {
            expect(header).toEqual('This is a header for create');
        });

        service.create({
            header: 'This is a header for create',
            data: {
                url: 'hello.world.com'
            }
        });
    });

    it('should clear url and undbind', () => {
        service.addUrl$.subscribe((url: string) => {
            expect(url).toEqual('');
        });

        service.editUrl$.subscribe((url: string) => {
            expect(url).toEqual('');
        });

        service.close$.subscribe((message) => {
            expect(message).toBe(true);
        });

        service.clear();

        expect(service.loadHandler).toEqual(null);
        expect(service.keyDownHandler).toEqual(null);
    });
});
