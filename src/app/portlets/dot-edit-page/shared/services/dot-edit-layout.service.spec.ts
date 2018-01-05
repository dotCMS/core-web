import { DotEditLayoutService } from './dot-edit-layout.service';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { DotLayoutGridBox } from '../../shared/models/dot-layout-grid-box.model';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { TemplateContainersCacheService } from '../../template-containers-cache.service';

describe('DotEditLayoutService', () => {

    const containers =  {
        '5363c6c6-5ba0-4946-b7af-cf875188ac2e': {
            container: {
                type: 'containers',
                identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                name: 'Medium Column (md-1)',
                categoryId: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                uuid: '5641654946'
            }
        },
        '56bd55ea-b04b-480d-9e37-5d6f9217dcc3': {
            container: {
                type: 'containers',
                identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                name: 'Large Column (lg-1)',
                categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                uuid: '9984484815'
            }
        },
        '6a12bbda-0ae2-4121-a98b-ad8069eaff3a': {
            container: {
                type: 'containers',
                identifier: '6a12bbda-0ae2-4121-a98b-ad8069eaff3a',
                name: 'Banner Carousel ',
                categoryId: '427c47a4-c380-439f-a6d0-97d81deed57e',
                uuid: '94989295498'
            }
        },
        'a6e9652b-8183-4c09-b775-26196b09a300': {
            container: {
                type: 'containers',
                identifier: 'a6e9652b-8183-4c09-b775-26196b09a300',
                name: 'Default 4 (Page Content)',
                categoryId: '8cbcb97e-8e04-4691-8555-da82c3dc4a91',
                uuid: '464984949'
            }
        },
        'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea': {
            container: {
                type: 'containers',
                identifier: 'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea',
                name: 'Blank Container',
                categoryId: '3ba890c5-670c-467d-890d-bd8e9b9bb5ef',
                uuid: '564162326'
            }
        }
    };

    let dotEditLayoutService: DotEditLayoutService;
    let templateContainersCacheService: TemplateContainersCacheService;

    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotEditLayoutService, TemplateContainersCacheService]);
        dotEditLayoutService = this.injector.get(DotEditLayoutService);
        templateContainersCacheService = this.injector.get(TemplateContainersCacheService);

        templateContainersCacheService.set(containers);
    });

    it('should transform the data from the service to the grid format ', () => {
        const dotLayoutBody: DotLayoutBody = {
            rows: [
                {
                    columns: [
                        {
                            containers: [
                                {
                                    identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                                    uuid: '9984484815'
                                }
                            ],
                            leftOffset: 1,
                            width: 8
                        },
                        {
                            containers: [
                                {
                                    identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                                    uuid: '5641654946'
                                }
                            ],
                            leftOffset: 9,
                            width: 4
                        }
                    ]
                },
                {
                    columns: [
                        {
                            containers: [
                                {
                                    identifier: 'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea',
                                    uuid: '564162326'
                                },
                                {
                                    identifier: 'a6e9652b-8183-4c09-b775-26196b09a300',
                                    uuid: '464984949'
                                }
                            ],
                            leftOffset: 1,
                            width: 3
                        },
                        {
                            containers: [
                                {
                                    identifier: '6a12bbda-0ae2-4121-a98b-ad8069eaff3a',
                                    uuid: '94989295498'
                                }
                            ],
                            leftOffset: 4,
                            width: 3
                        }
                    ]
                }
            ]
        };

        const grid: DotLayoutGridBox[] = dotEditLayoutService.getDotLayoutGridBox(dotLayoutBody);

        expect(grid.length).toEqual(4);
        expect(grid[2].containers.length).toEqual(2);
        expect(grid[3].config).toEqual({
            col: 4,
            row: 2,
            sizex: 3,
            fixed: true,
            maxCols: 12,
            maxRows: 1
        });
    });

    it('should transform the grid data to LayoutBody to export the data', () => {
        const grid: DotLayoutGridBox[] = [
            {
                containers: [
                    {
                        type: 'containers',
                        identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        name: 'Large Column (lg-1)',
                        categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        uuid: '9984484815'
                    }
                ],
                config: {
                    fixed: true,
                    sizex: 8,
                    maxCols: 12,
                    maxRows: 1,
                    col: 1,
                    row: 1,
                    sizey: 1,
                    dragHandle: null,
                    resizeHandle: null,
                    draggable: true,
                    resizable: true,
                    borderSize: 25
                }
            },
            {
                containers: [
                    {
                        type: 'containers',
                        identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        name: 'Medium Column (md-1)',
                        categoryId: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        uuid: '5641654946'
                    },
                    {
                        type: 'containers',
                        identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        name: 'Large Column (lg-1)',
                        categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        uuid: '9984484815'
                    }
                ],
                config: {
                    fixed: true,
                    sizex: 4,
                    maxCols: 12,
                    maxRows: 1,
                    col: 9,
                    row: 1,
                    sizey: 1,
                    dragHandle: null,
                    resizeHandle: null,
                    draggable: true,
                    resizable: true,
                    borderSize: 25
                }
            }
        ];
        const layoutBody: DotLayoutBody = dotEditLayoutService.getDotLayoutBody(grid);

        expect(layoutBody.rows.length).toEqual(1);
        expect(layoutBody.rows[0].columns.length).toEqual(2, 'create two columns');
        expect(layoutBody.rows[0].columns[1].containers.length).toEqual(2, 'reate two containers');
        expect(layoutBody.rows[0].columns[1].leftOffset).toEqual(9, 'set leftOffset to 9');
        expect(layoutBody.rows[0].columns[1].width).toEqual(4, 'create 4 containers for the first row');
    });

    it('should add uuid if not added in the containers object', () => {
        const grid: DotLayoutGridBox[] = [
            {
                containers: [
                    {
                        type: 'containers',
                        identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        name: 'Large Column (lg-1)',
                        uuid: '99844848156666'
                    }
                ],
                config: {
                    sizex: 8,
                    maxCols: 12,
                }
            },
            {
                containers: [
                    {
                        type: 'containers',
                        identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        name: 'Medium Column (md-1)',
                        categoryId: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        uuid: null
                    },
                    {
                        type: 'containers',
                        identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        name: 'Large Column (lg-1)',
                        uuid: '998448481544444'
                    }
                ],
                config: {
                    sizex: 4,
                    maxCols: 12,
                }
            }
        ];

        const layoutBody: DotLayoutBody = dotEditLayoutService.getDotLayoutBody(grid);
        expect(layoutBody.rows[0].columns[1].containers[0].uuid).toEqual(null);

        dotEditLayoutService.getDotLayoutGridBox(layoutBody);
        expect(layoutBody.rows[0].columns[1].containers[0].uuid).not.toEqual(null);
    });
});
