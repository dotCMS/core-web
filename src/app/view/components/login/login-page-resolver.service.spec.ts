import { async } from '@angular/core/testing';
import { DOTTestBed } from '@tests/dot-test-bed';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotPageStateService } from '@portlets/dot-edit-page/content/services/dot-page-state/dot-page-state.service';
import { DotEditPageResolver } from '@portlets/dot-edit-page/shared/services/dot-edit-page-resolver/dot-edit-page-resolver.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock } from '@tests/login-service.mock';
import { DotEditPageDataService } from '@portlets/dot-edit-page/shared/services/dot-edit-page-resolver/dot-edit-page-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DotRouterService } from '@services/dot-router/dot-router.service';

const route: any = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', [
    'toString'
]);

route.queryParams = {};

describe('LoginPageResolver', () => {
    beforeEach(
        async(() => {
            const testbed = DOTTestBed.configureTestingModule({
                providers: [{ provide: LoginService, useClass: LoginServiceMock }],
                imports: [RouterTestingModule]
            });

            resolver = testbed.get(DotEditPageResolver);
            dotPageStateService = testbed.get(DotPageStateService);
            dotHttpErrorManagerService = testbed.get(DotHttpErrorManagerService);
            dotRouterService = testbed.get(DotRouterService);
            dotEditPageDataService = testbed.get(DotEditPageDataService);
        })
    );
});
