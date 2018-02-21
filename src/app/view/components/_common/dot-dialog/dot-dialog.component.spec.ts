import { LoginServiceMock } from './../../../../test/login-service.mock';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotDialogComponent } from './dot-dialog.component';
import { async, ComponentFixture } from '@angular/core/testing';

fdescribe('DotDialogComponent', () => {
    let component: DotDialogComponent;
    let fixture: ComponentFixture<DotDialogComponent>;

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                declarations: [DotDialogComponent],
                providers: [{
                    provide: LoginService,
                    useClass: LoginServiceMock
                }]
            });

            fixture = DOTTestBed.createComponent(DotDialogComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        })
    );


    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
