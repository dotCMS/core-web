import { DotRouterService } from './dot-router.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { async } from 'q';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'dotcms-js/core/login.service';
import { Router } from '@angular/router';

describe('DotRouterService', () => {
    let service: DotRouterService;
    let router: Router;

    beforeEach(
        async(() => {
            const testbed = DOTTestBed.configureTestingModule({
                providers: [
                    DotRouterService,
                    {
                        provide: LoginService,
                        useValue: {}
                    }
                ],
                imports: [RouterTestingModule]
            });

            service = testbed.get(DotRouterService);
            router = testbed.get(Router);
        })
    );

    describe('goToMain()', () => {
        it('should go to /', () => {
            spyOn(router, 'navigate');
            service.goToMain();

            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });

        it('should go to edit page', () => {
            spyOn(router, 'navigateByUrl');
            service.goToMain('/about/us');

            expect(router.navigateByUrl).toHaveBeenCalledWith('edit-page/content?url=/about/us', { replaceUrl: true });
        });

        it('should go to previousSavedURL', () => {
            service.previousSavedURL = 'test/fake';

            spyOn(router, 'navigate');
            service.goToMain();

            expect(router.navigate).toHaveBeenCalledWith(['test/fake']);
        });
    });
});
