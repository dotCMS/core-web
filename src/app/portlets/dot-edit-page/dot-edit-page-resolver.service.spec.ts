import { DotRouterService } from './../../api/services/dot-router-service';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginServiceMock } from './../../test/login-service.mock';
import { LoginService, Url } from 'dotcms-js/dotcms-js';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageViewService } from './../../api/services/page-view/page-view.service';
import { TestBed, async } from '@angular/core/testing';
import { PageViewResolver } from './dot-edit-page-resolver.service';

// class PageViewServiceMock {
//     get() {}
// }

// class DotRouterServiceMock {
//     gotoPortlet() {}
// }

// const activatedRouteSnapshotMock: any = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', [
//     'toString'
// ]);
// activatedRouteSnapshotMock.queryParams = {};

// describe('ContentTypeResolver', () => {
//     let router: ActivatedRouteSnapshot;
//     let pageViewResolver: PageViewResolver;
//     let pageViewService: PageViewService;

//     beforeEach(
//         async(() => {
//             TestBed.configureTestingModule({
//                 providers: [
//                     PageViewResolver,
//                     { provide: DotRouterService, useClass: DotRouterServiceMock },
//                     { provide: LoginService, useClass: LoginServiceMock },
//                     { provide: PageViewService, useClass: PageViewServiceMock },
//                     {
//                         provide: ActivatedRouteSnapshot,
//                         useValue: activatedRouteSnapshotMock
//                     }
//                 ],
//                 imports: [RouterTestingModule]
//             });

//             router = TestBed.get(ActivatedRouteSnapshot);
//             pageViewService = TestBed.get(PageViewService);
//             pageViewResolver = TestBed.get(PageViewResolver);
//         })
//     );

//     xit('should get and return a pageView', () => {
//         activatedRouteSnapshotMock.queryParams.url = () => 'about-us';

//         spyOn(pageViewService, 'get').and.returnValue(
//             Observable.of({
//                 object: 'Fake object'
//             })
//         );

//         pageViewResolver.resolve(activatedRouteSnapshotMock).subscribe((fakeRes: any) => {
//             expect(fakeRes).toEqual({
//                 object: 'Fake object'
//             });
//         });

//         expect(pageViewService.get).toHaveBeenCalledWith('about-us');

//     });
// });
