import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotTemplateSelectorComponent } from './dot-template-selector.component';
import { DotMessagePipeModule } from '@pipes/dot-message/dot-message-pipe.module';
import { DebugElement } from '@angular/core';

const messageServiceMock = new MockDotMessageService({
    'templates.template.selector.label.designer': 'Designer',
    'templates.template.selector.label.advanced': 'Advanced',
    'templates.template.selector.design':
        '<b>Template Designer</b> allows you to create templates seamlessly with a set of tools lorem ipsum.',
    'templates.template.selector.advanced':
        '<b>Template Advanced</b> allows you to create templates using HTML code'
});

fdescribe('DotTemplateSelectorComponent', () => {
    let component: DotTemplateSelectorComponent;
    let fixture: ComponentFixture<DotTemplateSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotTemplateSelectorComponent],
            providers: [
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                },
                {
                    provide: DynamicDialogRef,
                    useValue: {
                        close: () => {}
                    }
                }
            ],
            imports: [DotMessagePipeModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotTemplateSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('html', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });
});
