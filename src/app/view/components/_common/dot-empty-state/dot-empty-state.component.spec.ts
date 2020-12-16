import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { By } from '@angular/platform-browser';

import { DotEmptyStateComponent } from './dot-empty-state.component';
import { ButtonModule } from 'primeng/button';

const messageServiceMock = new MockDotMessageService({
    'message.template.empty.title': 'Your template list is empty',
    'message.template.empty.content':
        "You haven't added anything yet, start by clicking the button below",
    'message.template.empty.button.label': 'Add New Template'
});

describe('DotEmptyStateComponent', () => {
    let component: DotEmptyStateComponent;
    let fixture: ComponentFixture<DotEmptyStateComponent>;
    let de: DebugElement;
    let dotMessageService: DotMessageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotEmptyStateComponent],
            providers: [{ provide: DotMessageService, useValue: messageServiceMock }],
            imports: [DotPipesModule, ButtonModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEmptyStateComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        dotMessageService = de.injector.get(DotMessageService);

        component.title = dotMessageService.get('message.template.empty.title');
        component.content = dotMessageService.get('message.template.empty.content');
        component.buttonLabel = dotMessageService.get('message.template.empty.button.label');
        component.rows = 10;
        component.checkBoxWidth = 3.5;
        component.colsTextWidth = [60, 50, 60, 80];
        component.columnWidth = `${
            (100 - component.checkBoxWidth) / component.colsTextWidth.length
        }%`;
        component.icon = 'web';

        fixture.detectChanges();
    });

    it('should have correct number of rows', () => {
        const rows = de.queryAll(By.css('[data-testid="dot-empty-state"] > tbody > tr'));
        expect(rows.length).toEqual(10);
    });

    it('should have all correct attributes', () => {
        const checkbox = de.query(By.css('[data-testid="checkbox"]'));
        const tableCell = de.queryAll(By.css('[data-testid="dummy-text-td"]'));
        const icon = de.query(By.css('.material-icons'));

        tableCell.forEach((node) => {
            expect(node.nativeElement.style.width).toEqual('24.125%');
        });

        expect(icon.nativeElement.innerText).toBe('web');
        expect(checkbox.nativeElement.style.width).toEqual('3.5%', 'correct checkbox width');
    });

    it('should have the correct message keys', () => {
        const title = de.query(By.css('.dot-empty-container__title'));
        const content = de.query(By.css('.dot-empty-container__content'));
        const button = de.query(By.css('.dot-empty-container__notice > button'));

        expect(title.nativeElement.innerText).toEqual('Your template list is empty');
        expect(content.nativeElement.innerText).toEqual(
            "You haven't added anything yet, start by clicking the button below"
        );
        expect(button.nativeElement.innerText).toEqual('ADD NEW TEMPLATE');
    });
});
