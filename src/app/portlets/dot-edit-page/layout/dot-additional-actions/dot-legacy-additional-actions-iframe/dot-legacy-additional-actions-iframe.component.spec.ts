import { DotLegacyAdditionalActionsComponent } from './dot-legacy-additional-actions-iframe.component';
import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { IFrameModule } from '../../../../../view/components/_common/iframe/iframe.module';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'dot-iframe',
    template: ''
})
class MockDotIframeComponent {
    @Input() src: string;
}

describe('DotLegacyAdditionalActionsComponent', () => {

    let component: DotLegacyAdditionalActionsComponent;
    let fixture: ComponentFixture<DotLegacyAdditionalActionsComponent>;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                DotLegacyAdditionalActionsComponent,
                MockDotIframeComponent
            ],
            providers: [
                DotMenuService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                      params: Observable.of({ id: '1', tabName: 'properties' })
                    }
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotLegacyAdditionalActionsComponent);
        component = fixture.componentInstance;
    });

    it('should set additionalPropertiesURL right', () => {
        const dotMenuService: DotMenuService = fixture.debugElement.injector.get(DotMenuService);
        spyOn(dotMenuService, 'getDotMenuId').and.returnValue(Observable.of('2'));

        fixture.detectChanges();
        console.log('component.additionalPropertiesURL', component.additionalPropertiesURL);
        expect(dotMenuService.getDotMenuId).toHaveBeenCalledWith('templates');
        // tslint:disable-next-line:max-line-length
        expect(component.additionalPropertiesURL)
            .toEqual(`c/portal/layout?p_l_id=2&p_p_id=templates&p_p_action=1&p_p_state=maximized&p_p_mode=view&_templates_struts_action=%2Fext%2Ftemplates%2Fedit_template&_templates_cmd=edit&inode=1&drawed=false&selectedTab=properties`);
    });
});
