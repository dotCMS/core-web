import { MessageService } from './../../../../api/services/messages-service';
import { MockMessageService } from './../../../../test/message-service.mock';
import { PaginatorService } from './../../../../api/services/paginator/paginator.service';
import { DotConfirmationService } from './../../../../api/services/dot-confirmation/dot-confirmation.service';
import { ContainerSelectorModule } from './../../../../view/components/container-selector/container-selector.module';
import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { NgGridModule } from 'angular2-grid';
import { Input, Component } from '@angular/core';

import { DotEditLayoutGridComponent } from './dot-edit-layout-grid.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotEditLayoutGridService } from './dot-edit-layout-grid.service';

@Component({
    selector: 'action-button',
    template: ''
})
class TestActionButtonComponent {
    @Input() command?: ($event) => void;
}

describe('DotEditLayoutGridComponent', () => {
    let component: DotEditLayoutGridComponent;
    let fixture: ComponentFixture<DotEditLayoutGridComponent>;
    let addContainer: () => void;

    beforeEach(() => {
        const messageServiceMock = new MockMessageService({
            cancel: 'Cancel'
        });

        DOTTestBed.configureTestingModule({
            declarations: [DotEditLayoutGridComponent, TestActionButtonComponent],
            imports: [NgGridModule, ContainerSelectorModule],
            providers: [
                DotConfirmationService,
                PaginatorService,
                DotEditLayoutGridService,
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(DotEditLayoutGridComponent);
        component = fixture.componentInstance;
        addContainer = component.addContainer();
        fixture.detectChanges();
    });

    it('should show set one element in the grid of 12 columns', () => {
        expect(component.gridBoxes.length).toEqual(1);
        expect(component.gridBoxes[0].config.sizex).toEqual(12);
    });

    it('should add one Container to the grid of 3 columns', () => {
        addContainer();
        expect(component.gridBoxes.length).toEqual(2);
        expect(component.gridBoxes[1].config.sizex).toEqual(3);
    });

    it('should add a new Container in the same row', () => {
        addContainer();
        addContainer();
        expect(component.gridBoxes.length).toEqual(3);
        expect(component.gridBoxes[2].config.row).toEqual(2);
    });

    it('should add a new Container in a new row, when there is no space in the last row', () => {
        addContainer();
        expect(component.gridBoxes.length).toEqual(2);
        expect(component.gridBoxes[1].config.row).toEqual(2);
    });

    it('should remove one Container from the Grid', () => {
        addContainer();
        const dotConfirmationService = fixture.debugElement.injector.get(DotConfirmationService);
        spyOn(dotConfirmationService, 'confirm').and.callFake(conf => {
            conf.accept();
        });
        component.onRemoveContainer(1);
        expect(component.gridBoxes.length).toEqual(1);
    });

    it('should create a new row with a basic configuration object', () => {
        addContainer();
        expect(component.gridBoxes[1].config).toEqual({
            row: 2,
            sizex: 3,
            col: 1,
            fixed: true,
            maxCols: 12,
            maxRows: 1
        });
    });

    it(
        'should remove the empty rows in the grid',
        fakeAsync(() => {
            addContainer();
            addContainer();
            component.gridBoxes[0].config.row = 5;
            component.gridBoxes[0].config.sizex = 5;
            component.gridBoxes[1].config.row = 2;
            component.gridBoxes[2].config.row = 4;
            component.gridBoxes[2].config.sizex = 1;
            component.onDragStop();
            tick();
            expect(component.gridBoxes[0].config.sizex).toEqual(3);
            expect(component.gridBoxes[1].config.sizex).toEqual(1);
            expect(component.gridBoxes[2].config.sizex).toEqual(5);
        })
    );
});
