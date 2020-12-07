import { TestBed } from '@angular/core/testing';
import { UrlSegment } from '@angular/router';
import { DotRouterService } from '@services/dot-router/dot-router.service';

import { DotTemplateGuard } from './dot-template.guard';

describe('DotTemplateGuard', () => {
    let guard: DotTemplateGuard;
    let dotRouterService: DotRouterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DotTemplateGuard,
                {
                    provide: DotRouterService,
                    useValue: {
                        gotoPortlet: jasmine.createSpy()
                    }
                }
            ]
        });
        guard = TestBed.inject(DotTemplateGuard);
        dotRouterService = TestBed.inject(DotRouterService);
    });

    it('should be return when path is /advanced', () => {
        const segment = new UrlSegment('advanced', null);
        expect(guard.canLoad(null, [null, segment])).toBe(true);
    });

    it('should be return when path is /designer', () => {
        const segment = new UrlSegment('designer', null);
        expect(guard.canLoad(null, [null, segment])).toBe(true);
    });

    it('should be return false and redirect with invalid path', () => {
        const segment = new UrlSegment('xxxx', null);
        expect(guard.canLoad(null, [null, segment])).toBe(false);
        expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('templates');
    });
});
