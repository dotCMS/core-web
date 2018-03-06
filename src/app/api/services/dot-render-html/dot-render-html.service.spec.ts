import { LoginServiceMock } from '../../../test/login-service.mock';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DotRouterService } from '../dot-router/dot-router.service';
import { MockBackend } from '@angular/http/testing';
import { ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotRenderedPage } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page.model';
import { DotEditPageState } from '../../../shared/models/dot-edit-page-state/dot-edit-page-state.model';
import { DotPageState } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { RouterTestingModule } from '@angular/router/testing';
import { DotRenderHTMLService } from './dot-render-html.service';
import { PageMode } from '../../../portlets/dot-edit-page/shared/models/page-mode.enum';
import { mockDotRenderPage } from '../../../test/dot-rendered-page.mock';

describe('EditPageService', () => {
    let editPageService: DotRenderHTMLService;
    let backend: MockBackend;
    let lastConnection;
    let injector;

    beforeEach(() => {
        lastConnection = [];

        injector = DOTTestBed.configureTestingModule({
            providers: [DotRenderHTMLService, DotRouterService, {
                provide: LoginService,
                useClass: LoginServiceMock
            }],
            imports: [RouterTestingModule]
        });

        editPageService = injector.get(DotRenderHTMLService);

        backend = injector.get(ConnectionBackend) as MockBackend;
        backend.connections.subscribe((connection: any) => {
            lastConnection.push(connection);
        });
    });

    it('should get a rendered page in edit mode', () => {
        let result: DotRenderedPage;
        editPageService.getEdit('about-us').subscribe((renderedPage: DotRenderedPage) => (result = renderedPage));

        lastConnection[0].mockRespond(
            new Response(
                new ResponseOptions({
                    body: mockDotRenderPage
                })
            )
        );
        expect(lastConnection[0].request.url).toContain('/api/v1/page/renderHTML/about-us?mode=EDIT_MODE');
        expect(result).toEqual(mockDotRenderPage);
    });

    it('should get a rendered page in preview mode', () => {
        let result: DotRenderedPage;
        editPageService.getPreview('about-us').subscribe((renderedPage: DotRenderedPage) => (result = renderedPage));

        lastConnection[0].mockRespond(
            new Response(
                new ResponseOptions({
                    body: mockDotRenderPage
                })
            )
        );
        expect(lastConnection[0].request.url).toContain('/api/v1/page/renderHTML/about-us?mode=PREVIEW_MODE');
        expect(result).toEqual(mockDotRenderPage);
    });

    it('should get a rendered page in live mode', () => {
        let result: DotRenderedPage;
        editPageService.getLive('about-us').subscribe((renderedPage: DotRenderedPage) => result = renderedPage);

        lastConnection[0].mockRespond(new Response(new ResponseOptions({
            body: mockDotRenderPage
        })));
        expect(lastConnection[0].request.url).toContain('/api/v1/page/renderHTML/about-us?mode=LIVE');
        expect(result).toEqual(mockDotRenderPage);
    });
});
