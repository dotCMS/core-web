import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotContainerSelectorModule } from '../../../../../view/components/dot-container-selector/dot-container-selector.module';
import { DotEditLayoutSidebarComponent } from './dot-edit-layout-sidebar.component';
import { DotEditLayoutService } from '../../../shared/services/dot-edit-layout.service';
import { DotEventsService } from '../../../../../api/services/dot-events/dot-events.service';
import { DotLayoutSideBar } from '../../../shared/models/dot-layout-sidebar.model';
import { FormControl, FormGroup } from '@angular/forms';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { TemplateContainersCacheService } from '../../../template-containers-cache.service';
import { DotSidebarPropertiesModule } from '../dot-sidebar-properties/dot-sidebar-properties.module';
import { mockDotContainers } from '../../../../../test/dot-rendered-page.mock';

let fakeValue: DotLayoutSideBar;

@Component({
    selector: 'dot-test-host-component',
    template: `<form [formGroup]="form">
                    <dot-edit-layout-sidebar formControlName="sidebar"></dot-edit-layout-sidebar>
                </form>`
})
class TestHostComponent {
    form: FormGroup;
    constructor() {
        this.form = new FormGroup({
            sidebar: new FormControl(fakeValue)
        });
    }
}

describe('DotEditLayoutSidebarComponent', () => {
    let component: DotEditLayoutSidebarComponent;
    let de: DebugElement;
    let hostComponentfixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        fakeValue = {
            containers: [],
            location: 'left',
            width: 'small'
        };

        const messageServiceMock = new MockDotMessageService({
            'editpage.layout.designer.sidebar': 'Sidebar'
        });

        DOTTestBed.configureTestingModule({
            declarations: [DotEditLayoutSidebarComponent, TestHostComponent],
            imports: [DotContainerSelectorModule, BrowserAnimationsModule, DotSidebarPropertiesModule],
            providers: [
                DotEditLayoutService,
                TemplateContainersCacheService,
                { provide: DotMessageService, useValue: messageServiceMock }
            ]
        });

        hostComponentfixture = DOTTestBed.createComponent(TestHostComponent);
        de = hostComponentfixture.debugElement.query(By.css('dot-edit-layout-sidebar'));
        component = hostComponentfixture.debugElement.query(By.css('dot-edit-layout-sidebar')).componentInstance;
        hostComponentfixture.detectChanges();
    });

    it('should have the right header for the Sidebar Header', () => {
        const headerSelector = de.query(By.css('h6'));
        expect(headerSelector.nativeElement.outerText).toBe('Sidebar');
    });

    it('should transform containers raw data into proper data to be saved in the BE', () => {
        const transformedValue = {
            containers: [
                {
                    identifier: mockDotContainers[0].container.identifier,
                    uuid: undefined
                },
                {
                    identifier: mockDotContainers[1].container.identifier,
                    uuid: undefined
                }
            ],
            location: 'left',
            width: 'small'
        };

        spyOn(component, 'propagateChange');
        component.updateContainers(mockDotContainers);
        expect(component.propagateChange).toHaveBeenCalledWith(transformedValue);
    });

});
