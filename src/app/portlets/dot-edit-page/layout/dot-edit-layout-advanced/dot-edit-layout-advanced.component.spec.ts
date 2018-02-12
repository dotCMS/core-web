import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginService } from 'dotcms-js/dotcms-js';

import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotEditLayoutAdvancedComponent } from './dot-edit-layout-advanced.component';
import { DotMenuService } from '../../../../api/services/dot-menu.service';
import { IFrameModule } from '../../../../view/components/_common/iframe';
import { LoginServiceMock } from '../../../../test/login-service.mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

class DotMenuServiceMock {
    getDotMenuId(id: string): Observable<string> {
        return Observable.of('123');
    }
}

describe('DotEditLayoutAdvancedComponent', () => {
    let component: DotEditLayoutAdvancedComponent;
    let fixture: ComponentFixture<DotEditLayoutAdvancedComponent>;
    let de: DebugElement;

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                imports: [IFrameModule, RouterTestingModule],
                declarations: [DotEditLayoutAdvancedComponent],
                providers: [
                    {
                        provide: LoginService,
                        useClass: LoginServiceMock
                    },
                    {
                        provide: DotMenuService,
                        useClass: DotMenuServiceMock
                    }
                ]
            });
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditLayoutAdvancedComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        component.templateInode = '456';
        fixture.detectChanges();
    });

    it('should have dot-iframe component', () => {
        const dotIframe = de.query(By.css('dot-iframe'));
        expect(dotIframe).toBeTruthy();
    });

    it('should set the dot-iframe url correctly', () => {
        let result: string;
        component.url.subscribe(url => {
            result = url;
        });
        // tslint:disable-next-line:max-line-length
        expect(result).toEqual('c/portal/layout?p_l_id=123&p_p_id=templates&p_p_action=1&p_p_state=maximized&p_p_mode=view&_templates_struts_action=%2Fext%2Ftemplates%2Fedit_template&_templates_cmd=edit&inode=456&r=0d618b02-f184-48fe-88f4-e98563ee6e9e&referer=%2Fc%2Fportal%2Flayout%3Fp_l_id%3D123%26p_p_id%3Dtemplates%26p_p_action%3D1%26p_p_state%3Dmaximized%26_templates_pageNumber%3D1%26_templates_struts_action%3D%252Fext%252Ftemplates%252Fview_templates');
    });
});
