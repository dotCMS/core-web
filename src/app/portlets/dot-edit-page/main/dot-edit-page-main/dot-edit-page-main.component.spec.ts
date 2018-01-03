import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditPageMainComponent } from './dot-edit-page-main.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DotEditPageNavModule } from '../dot-edit-page-nav/dot-edit-page-nav.module';
import { MockMessageService } from '../../../../test/message-service.mock';
import { MessageService } from '../../../../api/services/messages-service';

describe('DotEditPageMainComponent', () => {
    let component: DotEditPageMainComponent;
    let fixture: ComponentFixture<DotEditPageMainComponent>;

    const messageServiceMock = new MockMessageService({
        'editpage.toolbar.nav.content': 'Content',
        'editpage.toolbar.nav.layout': 'Layout'
    });

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                imports: [RouterTestingModule, DotEditPageNavModule],
                declarations: [DotEditPageMainComponent],
                providers: [{provide: MessageService, useValue: messageServiceMock}]
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditPageMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
