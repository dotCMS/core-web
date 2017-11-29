import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { OverlayPanelModule, ButtonModule } from 'primeng/primeng';
import { DotLayoutSidebarModule } from './../dot-layout-sidebar/dot-layout-sidebar.module';
import { DotLayoutPropertiesItemModule } from './../dot-layout-properties-item/dot-layout-properties-item.module';
import { DotLayoutPropertiesComponent } from './dot-layout-properties.component';
import { MockMessageService } from './../../../../test/message-service.mock';
import { DOTTestBed } from './../../../../test/dot-test-bed';
import { MessageService } from './../../../../api/services/messages-service';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DotLayoutPropertiesComponent', () => {
    let comp: DotLayoutPropertiesComponent;
    let fixture: ComponentFixture<DotLayoutPropertiesComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const messageServiceMock = new MockMessageService({
        'editpage.toolbar.primary.action': 'Hello',
        'editpage.toolbar.secondary.action': 'World'
    });

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotLayoutPropertiesComponent],
            imports: [
                DotLayoutPropertiesItemModule,
                DotLayoutSidebarModule,
                OverlayPanelModule,
                ButtonModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(DotLayoutPropertiesComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    xit('should modify the group model', () => {
        
    });
});
