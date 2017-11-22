import { MessageService } from './../../../../api/services/messages-service';
import { MockMessageService } from './../../../../test/message-service.mock';
import { PaginatorService } from './../../../../api/services/paginator/paginator.service';
import { DotConfirmationService } from './../../../../api/services/dot-confirmation/dot-confirmation.service';
import { ContainerSelectorModule } from './../../../../view/components/container-selector/container-selector.module';
import { ContainerSelectorComponent } from './../../../../view/components/container-selector/container-selector.component';
import { ComponentFixture } from '@angular/core/testing';

import { NgGridModule } from 'angular2-grid';
import { Input, Component } from '@angular/core';

import { DotEditLayoutGridComponent } from './dot-edit-layout-grid.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';

@Component({
    selector: 'action-button',
    template: ''
})
class TestActionButtonComponent {
    @Input() command?: ($event) => void;
}

fdescribe('DotEditLayoutGridComponent', () => {
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
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(DotEditLayoutGridComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();

        addContainer = component.addContainer();
    });

    it('should show set one element in the grid of 12 columns', () => {
        component.ngOnInit();
        expect(component.gridContainers.length).toEqual(1);
        expect(component.gridContainers[0].config.sizex).toEqual(12);
    });

    it('should add one Container to the grid of 3 columns', () => {
        component.ngOnInit();
        addContainer();
        expect(component.gridContainers.length).toEqual(2);
        expect(component.gridContainers[1].config.sizex).toEqual(3);
    });

    it('should add a new Container in the same row', () => {
        component.ngOnInit();
        addContainer();
        addContainer();
        expect(component.gridContainers.length).toEqual(3);
        expect(component.gridContainers[2].config.row).toEqual(2);
    });

    it('should add a new Container in a new row, when there is no space in the last row', () => {
        component.ngOnInit();
        addContainer();
        expect(component.gridContainers.length).toEqual(2);
        expect(component.gridContainers[1].config.row).toEqual(2);
    });

    it('should remove one Container from the Grid', () => {
        // component.ngOnInit();
        // addContainer();
        // component.onRemoveContainer(1);
        // const dotConfirmationService = fixture.debugElement.injector.get(DotConfirmationService);
        // spyOn(dotConfirmationService, 'confirm').and.callFake(conf => {
        //     conf.accept();
        // });
        // expect(component.gridContainers.length).toEqual(1);
    });

    it('should create a new row with a basic configuration object', () => {
        component.ngOnInit();
        addContainer();
        expect(component.gridContainers[1].config).toBeDefined();
        expect(component.gridContainers[1].config.row).toBeDefined();
        expect(component.gridContainers[1].config.sizex).toBeDefined();
        expect(component.gridContainers[1].config.col).toBeDefined();
    });

    it('should remove the empty rows in the grid', () => {
        // component.ngOnInit();
        // addContainer();
        // addContainer();
        // component.gridContainers[0].config.row = 5;
        // component.gridContainers[1].config.row = 2;
        // component.gridContainers[2].config.row = 4;
        // component.OnDragStop();
        // expect(component.gridContainers[0].config.row).toEqual(3);
        // expect(component.gridContainers[1].config.row).toEqual(1);
        // expect(component.gridContainers[2].config.row).toEqual(2);
    });

    it('should transform the grid data to LayoutBody to export the data', () => {
        component.pageView = {
            containers: {
                '5363c6c6-5ba0-4946-b7af-cf875188ac2e': {
                    container: {
                        type: 'containers',
                        identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        name: 'Medium Column (md-1)',
                        categoryId: '9ab97328-e72f-4d7e-8be6-232f53218a93'
                    }
                },
                '56bd55ea-b04b-480d-9e37-5d6f9217dcc3': {
                    container: {
                        type: 'containers',
                        identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        name: 'Large Column (lg-1)',
                        categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f'
                    }
                },
                '6a12bbda-0ae2-4121-a98b-ad8069eaff3a': {
                    container: {
                        type: 'containers',
                        identifier: '6a12bbda-0ae2-4121-a98b-ad8069eaff3a',
                        name: 'Banner Carousel ',
                        categoryId: '427c47a4-c380-439f-a6d0-97d81deed57e'
                    }
                },
                'a6e9652b-8183-4c09-b775-26196b09a300': {
                    container: {
                        type: 'containers',
                        identifier: 'a6e9652b-8183-4c09-b775-26196b09a300',
                        name: 'Default 4 (Page Content)',
                        categoryId: '8cbcb97e-8e04-4691-8555-da82c3dc4a91'
                    }
                },
                'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea': {
                    container: {
                        type: 'containers',
                        identifier: 'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea',
                        name: 'Blank Container',
                        categoryId: '3ba890c5-670c-467d-890d-bd8e9b9bb5ef'
                    }
                }
            },
            page: null,
            layout: {
                title: 'anonymouslayout1511296039453',
                header: false,
                footer: false,
                body: {
                    rows: [
                        {
                            columns: [
                                {
                                    containers: ['56bd55ea-b04b-480d-9e37-5d6f9217dcc3'],
                                    leftOffset: 1,
                                    width: 8
                                },
                                {
                                    containers: ['5363c6c6-5ba0-4946-b7af-cf875188ac2e'],
                                    leftOffset: 9,
                                    width: 4
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    containers: [
                                        'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea',
                                        'a6e9652b-8183-4c09-b775-26196b09a300'
                                    ],
                                    leftOffset: 1,
                                    width: 3
                                },
                                {
                                    containers: ['6a12bbda-0ae2-4121-a98b-ad8069eaff3a'],
                                    leftOffset: 4,
                                    width: 3
                                }
                            ]
                        }
                    ]
                },
                sidebar: null
            }
        };
        component.ngOnInit();
        expect(component.gridContainers.length).toEqual(4);
        expect(component.gridContainers[2].containers.length).toEqual(2);
        expect(component.gridContainers[3].config.col).toEqual(4);
        expect(component.gridContainers[3].config.row).toEqual(2);
        expect(component.gridContainers[3].config.sizex).toEqual(3);
    });

    it('should transform the data from the service to the grid format', () => {
        // component.gridContainers = [
        //     {
        //         containers: [
        //             {
        //                 type: 'containers',
        //                 identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
        //                 name: 'Large Column (lg-1)',
        //                 categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f'
        //             }
        //         ],
        //         config: {
        //             fixed: true,
        //             sizex: 8,
        //             maxCols: 12,
        //             maxRows: 1,
        //             col: 1,
        //             row: 1,
        //             sizey: 1,
        //             dragHandle: null,
        //             resizeHandle: null,
        //             draggable: true,
        //             resizable: true,
        //             borderSize: 25
        //         }
        //     },
        //     {
        //         containers: [
        //             {
        //                 type: 'containers',
        //                 identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
        //                 name: 'Medium Column (md-1)',
        //                 categoryId: '9ab97328-e72f-4d7e-8be6-232f53218a93'
        //             },
        //             {
        //                 type: 'containers',
        //                 identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
        //                 name: 'Large Column (lg-1)',
        //                 categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f'
        //             }
        //         ],
        //         config: {
        //             fixed: true,
        //             sizex: 4,
        //             maxCols: 12,
        //             maxRows: 1,
        //             col: 9,
        //             row: 1,
        //             sizey: 1,
        //             dragHandle: null,
        //             resizeHandle: null,
        //             draggable: true,
        //             resizable: true,
        //             borderSize: 25
        //         }
        //     }
        // ];
        // let layoutBody = component.getLayoutBody();
        // expect(layoutBody.rows.length).toEqual(1);
        // expect(layoutBody.rows[0].columns.length).toEqual(2);
        // expect(layoutBody.rows[0].columns[1].containers.length).toEqual(2);
        // expect(layoutBody.rows[0].columns[1].leftOffset).toEqual(9);
        // expect(layoutBody.rows[0].columns[1].width).toEqual(4);

    });
});
