import { Component, OnInit, Input } from '@angular/core';
import { NgGridConfig, NgGridItemConfig } from 'angular2-grid';
import _ from 'lodash';
import { DotConfirmationService } from '../../../../api/services/dot-confirmation/dot-confirmation.service';

//Final Object need to be defined.
interface DotLayoutContainer {
    id: string;
    config: NgGridItemConfig;
}

/**
 * Component in charge of update the model that will be used be the NgGrid to display containers
 *
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-layout-grid',
    templateUrl: './dot-edit-layout-grid.component.html',
    styleUrls: ['./dot-edit-layout-grid.component.scss']
})
export class DotEditLayoutGridComponent implements OnInit {
    @Input() gridContainers: DotLayoutContainer[];
    private static MAX_COLUMNS: number = 12;
    private static NEW_ROW_TEMPLATE: NgGridItemConfig = { fixed: true, sizex: 3, maxCols: 12, maxRows: 1 };
    private static DEFAULT_EMPTY_GRID_ROWS: NgGridItemConfig = {
        fixed: true,
        sizex: 12,
        maxCols: 12,
        maxRows: 1,
        col: 1,
        row: 1
    };
    gridConfig: NgGridConfig = <NgGridConfig>{
        margins: [6, 6, 0, 0],
        draggable: true,
        resizable: true,
        max_cols: DotEditLayoutGridComponent.MAX_COLUMNS,
        max_rows: 0,
        visible_cols: DotEditLayoutGridComponent.MAX_COLUMNS,
        // 'visible_rows': 12,
        min_cols: 1,
        min_rows: 1,
        col_width: 90,
        row_height: 206,
        cascade: 'up',
        min_width: 40,
        min_height: 206,
        fix_to_grid: true,
        auto_style: true,
        auto_resize: true,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false,
        limit_to_screen: true
    };

    constructor(private dotConfirmationService: DotConfirmationService) {}

    ngOnInit() {
        // if (!this.gridContainers) {
        //     this.gridContainers = [
        //         {
        //             id: Math.random().toString(),
        //             config: Object.assign({}, DotEditLayoutGridComponent.DEFAULT_EMPTY_GRID_ROWS)
        //         }
        //     ];
        // }
        //TODO: Replace this with real data.
        this.gridContainers = this.tranformData(this.serverobj);

    }

    /**
     * Add new container to the gridContainers Arrray.
     */
    addContainer(): () => void {
        //TODO: This will change when Action Button get fixed.
        return () => {
            let conf: NgGridItemConfig = this.setConfigOfNewContainer();
            this.gridContainers.push({ id: Math.random().toString(), config: conf });
        };
    }

    /**
     * Removes the given index to the gridContainers Array after the user confirms.
     * @param {number} index
     */
    onRemoveContainer(index: number): void {
        this.dotConfirmationService.confirm({
            accept: () => {
                this.removeContainer(index);
            },
            header: `Place Holder`,
            message: `Place Holder
                        '${this.gridContainers[index].id}'?
                        <span>Place Holder</span>`,
            footerLabel: {
                acceptLabel: 'Place Holder',
                rejectLabel: 'Place Holder'
            }
        });
    }


    private removeContainer(index: number): void {
        if (this.gridContainers[index]) {
            this.gridContainers.splice(index, 1);
            this.deleteEmptyRows();
        }
    }

    /**
     * Event fired when the grad of a container ends, remove empty rows if any.
     * @constructor
     */
    OnDragStop(): void {
        this.deleteEmptyRows();
    }

    private setConfigOfNewContainer(): NgGridItemConfig {
        let lastContainer;
        let newRow: NgGridItemConfig = Object.assign({}, DotEditLayoutGridComponent.NEW_ROW_TEMPLATE);
        let busyColumns: number = DotEditLayoutGridComponent.NEW_ROW_TEMPLATE.sizex;
        if (this.gridContainers.length) {
            // check last row && last column in last row
            lastContainer = this.gridContainers.reduce(
                (currentContainer: DotLayoutContainer, nextContainer: DotLayoutContainer) => {
                    return currentContainer.config.row > currentContainer.config.row
                        ? currentContainer
                        : currentContainer.config.row == nextContainer.config.row
                          ? currentContainer.config.col > nextContainer.config.col ? currentContainer : nextContainer
                          : nextContainer;
                }
            );
            busyColumns += lastContainer.config.col - 1 + lastContainer.config.sizex;
            if (busyColumns <= DotEditLayoutGridComponent.MAX_COLUMNS) {
                newRow.row = lastContainer.config.row;
                newRow.col = lastContainer.config.col + lastContainer.config.sizex;
            } else {
                newRow.row = lastContainer.config.row + 1;
                newRow.col = 1;
            }
        }
        return newRow;
    }

    private deleteEmptyRows(): void {
        //TODO: Find a solution to remove setTimeOut
        setTimeout(() => {
            this.gridContainers = _.chain(this.gridContainers)
                .sortBy('config.row')
                .groupBy('config.row')
                .values()
                .map(this.updateContainerIndex)
                .flatten()
                .value();
        }, 0);
    }

    private updateContainerIndex(rowArray, index) {
        if (rowArray[0].row != index + 1) {
            return rowArray.map(container => {
                container.config.row = index + 1;
                return container;
            });
        }
        return rowArray;
    }

    private tranformData(resp): any {
        let grid = [];
        resp.layout.body.rows.forEach((row, rowIndex) => {
            row.columns.forEach(column => {
                grid.push({
                    containers: column.containers.map(containerId => resp.containers[containerId].container),
                    config: Object.assign({}, DotEditLayoutGridComponent.NEW_ROW_TEMPLATE, {
                        sizex: column.width,
                        col: column.leftIndex,
                        row: rowIndex + 1
                    })
                });
            });
        });
        return grid;
    }

    private safedata(): any {}
    private serverobj = {
        site: {
            map: {
                hostName: 'demo.dotcms.com',
                googleMap: 'AIzaSyDXvD7JA5Q8S5VgfviI8nDinAq9x5Utmu0',
                modDate: 1488846089000,
                keywords: 'CMS, Web Content Management, Open Source, Java, J2EE',
                description: 'dotCMS starter site was designed to demonstrate what you can do with dotCMS.',
                type: 'host',
                title: 'demo.dotcms.com',
                inode: 'f7c74bb2-eb6f-4859-b660-9e39b718f9a7',
                hostname: 'demo.dotcms.com',
                __DOTNAME__: 'demo.dotcms.com',
                addThis: 'ra-4e02119211875e7b',
                childrenFoldersCount: 14,
                disabledWYSIWYG: [],
                permissions: [1, 2, 4, 8, 16],
                host: 'SYSTEM_HOST',
                lastReview: 1488846089000,
                stInode: '855a2d72-f2f3-4169-8b04-ac5157c4380c',
                owner: 'dotcms.org.1',
                identifier: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                runDashboard: false,
                languageId: 1,
                childrenFolders: [
                    {
                        identifier: '5381b311-a97c-4f04-ae7f-db0005183f3e',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        childrenFolders: [
                            {
                                identifier: '9ac5703f-d954-48ca-8f7e-c0fe261f91bb',
                                filesMasks: '',
                                parent: '1049e7fe-1553-4731-bdf9-ba069f1dc08b',
                                modDate: 1395411078793,
                                hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                                childrenFolders: [],
                                type: 'folder',
                                title: 'Locations',
                                showOnMenu: true,
                                inode: 'd19a2815-1037-4a17-bce5-7a36eeaa8d54',
                                path: '/about-us/locations/',
                                defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                                permissions: [1, 2, 4, 8, 16],
                                sortOrder: 2,
                                name: 'locations',
                                open: true,
                                selected: true,
                                iDate: 1352925349059
                            },
                            {
                                identifier: '84927f50-2cff-42e0-be37-777e619f477e',
                                filesMasks: '',
                                parent: '1049e7fe-1553-4731-bdf9-ba069f1dc08b',
                                modDate: 1395411078793,
                                hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                                type: 'folder',
                                title: 'Our Team',
                                showOnMenu: true,
                                inode: 'ce49e1e7-4d0f-4af2-a87c-5e9c5562278c',
                                path: '/about-us/our-team/',
                                defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                                permissions: [1, 2, 4, 8, 16],
                                sortOrder: 3,
                                name: 'our-team',
                                open: false,
                                selected: false,
                                iDate: 1309281306169
                            }
                        ],
                        type: 'folder',
                        title: 'About Us',
                        showOnMenu: true,
                        inode: '1049e7fe-1553-4731-bdf9-ba069f1dc08b',
                        path: '/about-us/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 1,
                        name: 'about-us',
                        open: true,
                        selected: false,
                        iDate: 1309277726846
                    },
                    {
                        identifier: '81f17c44-d2e2-49fb-a24e-a65ca8c6d9de',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Application',
                        showOnMenu: false,
                        inode: '83bb5752-4264-43c4-84c8-28176603431a',
                        path: '/application/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'application',
                        open: false,
                        selected: false,
                        iDate: 1330627788711
                    },
                    {
                        identifier: '29b8f7fc-16b3-4b4b-a8a1-7d3aab6e296c',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1411663443716,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Bear Mountain',
                        showOnMenu: false,
                        inode: 'ed74082a-dd0c-48c0-86f2-853701810cc5',
                        path: '/bear-mountain/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'bear-mountain',
                        open: false,
                        selected: false,
                        iDate: 1411663443712
                    },
                    {
                        identifier: '3d765e9c-5267-4c5c-839c-4120cffe58f5',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'blogs',
                        showOnMenu: false,
                        inode: 'fa455fb5-b961-4d0c-9e63-e79a8ba8622a',
                        path: '/blogs/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'blogs',
                        open: false,
                        selected: false,
                        iDate: 1314298912907
                    },
                    {
                        identifier: 'f2626d92-4c45-41aa-b749-769aff8f2d99',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Contact Us',
                        showOnMenu: false,
                        inode: '9c5e78a9-62ce-48e0-99ce-6817b0f5c2f3',
                        path: '/contact-us/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'contact-us',
                        open: false,
                        selected: false,
                        iDate: 1309281340788
                    },
                    {
                        identifier: 'f18fe175-dfba-4059-a71c-60494d765034',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1412084980055,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Demos',
                        showOnMenu: true,
                        inode: 'e06cd11f-40ad-4228-ad5e-9c40aac4078c',
                        path: '/demos/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 5,
                        name: 'demos',
                        open: false,
                        selected: false,
                        iDate: 1412084950498
                    },
                    {
                        identifier: '7bb0585d-5c62-4ea6-aaf0-31bd537ba902',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1489165387010,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'go-quest',
                        showOnMenu: false,
                        inode: 'cb6c1020-b9e2-4b64-8c68-52f790cbf4d8',
                        path: '/go-quest/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'go-quest',
                        open: false,
                        selected: false,
                        iDate: 1489165387007
                    },
                    {
                        identifier: '303c6685-2405-4ebd-9043-b2cc26cce624',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Home',
                        showOnMenu: false,
                        inode: 'a1ea5a05-2460-4544-ae6a-f25f37a11db1',
                        path: '/home/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'home',
                        open: false,
                        selected: false,
                        iDate: 1265746948000
                    },
                    {
                        identifier: '8ddef32b-89f3-47ab-80bb-a46ec89046db',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Images',
                        showOnMenu: false,
                        inode: '2ad0dd36-5b07-41ac-b9f5-c7c54085ac58',
                        path: '/images/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'images',
                        open: false,
                        selected: false,
                        iDate: 1352413510289
                    },
                    {
                        identifier: '01f64a4e-d5af-4da2-94fc-b4fa4cc18aa3',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'intranet',
                        showOnMenu: false,
                        inode: '88051711-96d3-4f0b-997d-cc414daded48',
                        path: '/intranet/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'intranet',
                        open: false,
                        selected: false,
                        iDate: 1340638464846
                    },
                    {
                        identifier: '7d6186b0-92a2-4ef3-be4d-58b70fb7fb89',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'News & Events',
                        showOnMenu: true,
                        inode: 'e4266fcb-f47c-457b-a992-9f5462541df8',
                        path: '/news-events/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 4,
                        name: 'news-events',
                        open: false,
                        selected: false,
                        iDate: 1309882349910
                    },
                    {
                        identifier: 'b8473948-b953-40ca-b31a-2dad39ecfab6',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Products',
                        showOnMenu: true,
                        inode: '966b155a-eb6f-4be6-9047-4f41f2c8efbb',
                        path: '/products/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 2,
                        name: 'products',
                        open: false,
                        selected: false,
                        iDate: 1309277750436
                    },
                    {
                        identifier: '6486802b-902f-49f2-84f0-3d6b04e9b66c',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1395411078793,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Resources',
                        showOnMenu: true,
                        inode: 'b37bed19-b1fd-497d-be5e-f8cc33c3fb8d',
                        path: '/resources/',
                        defaultFileType: 'd8262b9f-84ea-46f9-88c4-0c8959271d67',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 3,
                        name: 'resources',
                        open: false,
                        selected: false,
                        iDate: 1309281278767
                    },
                    {
                        identifier: 'a16fa53e-7b34-458f-ab15-6ec814533515',
                        filesMasks: '',
                        parent: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        modDate: 1488579880971,
                        hostId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                        type: 'folder',
                        title: 'Services',
                        showOnMenu: true,
                        inode: 'ca1e91b2-6d8c-47fd-a410-462da6fa7ecf',
                        path: '/services/',
                        defaultFileType: '33888b6f-7a8e-4069-b1b6-5c1aa9d0a48d',
                        permissions: [1, 2, 4, 8, 16],
                        sortOrder: 0,
                        name: 'services',
                        open: false,
                        selected: false,
                        iDate: 1309281251867
                    }
                ],
                isDefault: true,
                folder: 'SYSTEM_FOLDER',
                googleAnalytics: 'UA-9877660-3',
                tagStorage: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                isSystemHost: false,
                sortOrder: 0,
                modUser: 'dotcms.org.1',
                open: true
            },
            lowIndexPriority: false,
            inode: 'f7c74bb2-eb6f-4859-b660-9e39b718f9a7',
            structureInode: '855a2d72-f2f3-4169-8b04-ac5157c4380c',
            aliases: null,
            versionType: 'host',
            systemHost: false,
            parent: true,
            hostname: 'demo.dotcms.com',
            hostThumbnail: null,
            tagStorage: '48190c8c-42c4-46af-8d1a-0cd5db894797',
            default: true,
            name: 'demo.dotcms.com',
            owner: 'dotcms.org.1',
            permissionId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
            permissionType: 'com.dotmarketing.portlets.contentlet.model.Contentlet',
            modDate: 1488846089000,
            identifier: '48190c8c-42c4-46af-8d1a-0cd5db894797',
            type: 'contentlet',
            archived: false,
            folder: 'SYSTEM_FOLDER',
            languageId: 1,
            categoryId: 'f7c74bb2-eb6f-4859-b660-9e39b718f9a7',
            contentTypeId: '855a2d72-f2f3-4169-8b04-ac5157c4380c',
            sortOrder: 0,
            disabledWysiwyg: [],
            title: 'demo.dotcms.com',
            versionId: '48190c8c-42c4-46af-8d1a-0cd5db894797',
            lastReview: 1488846089000,
            nextReview: null,
            reviewInterval: null,
            modUser: 'dotcms.org.1',
            working: true,
            htmlpage: false,
            fileAsset: false,
            host: 'SYSTEM_HOST',
            vanityUrl: false,
            keyValue: false,
            contentType: {
                clazz: 'com.dotcms.contenttype.model.type.ImmutableSimpleContentType',
                name: 'Host',
                id: '855a2d72-f2f3-4169-8b04-ac5157c4380c',
                description: 'System hosts information',
                defaultType: false,
                detailPage: null,
                fixed: true,
                iDate: 1459192214085,
                system: true,
                versionable: true,
                multilingualable: false,
                variable: 'Host',
                urlMapPattern: null,
                publishDateVar: null,
                expireDateVar: null,
                owner: null,
                modDate: 1510808491000,
                host: 'SYSTEM_HOST',
                folder: 'SYSTEM_FOLDER'
            },
            locked: false,
            live: true
        },
        template: {
            iDate: 1412108461645,
            type: 'template',
            owner: null,
            inode: 'cc1f0d74-8356-4035-925a-5c792d7b386f',
            identifier: '8660b482-1ef6-4d00-9459-3996e703ba19',
            title: 'Quest - 2 Column (Right Bar)',
            friendlyName: 'Quest - 2 Column (Right Bar)',
            modDate: 1412108461663,
            modUser: 'dotcms.org.1',
            sortOrder: 0,
            showOnMenu: false,
            body:
                '<html>\n <head>\n  #dotParse(\'//demo.dotcms.com/application/themes/quest/html_head.vtl\')\n  <link rel="stylesheet" type="text/css" href="/html/css/template/reset-fonts-grids.css" />\n </head>\n <body>\n  <div id="resp-template" name="globalContainer">\n   <div id="hd-template">\n    #dotParse(\'//demo.dotcms.com/application/themes/quest/header.vtl\')\n   </div>\n   <div id="bd-template">\n    <div id="yui-main-template">\n     <div class="yui-b-template" id="splitBody0">\n      <div class="yui-gc-template" id="yui-gc-template">\n       <div class="yui-u-template first" id="0_yui-u-grid-1">\n        #parseContainer(\'56bd55ea-b04b-480d-9e37-5d6f9217dcc3\')\n       </div>\n       <div class="yui-u-template" id="0_yui-u-grid-2">\n        #parseContainer(\'5363c6c6-5ba0-4946-b7af-cf875188ac2e\')\n       </div>\n      </div>\n     </div>\n    </div>\n   </div>\n   <div id="ft-template">\n    #dotParse(\'//demo.dotcms.com/application/themes/quest/footer.vtl\')\n   </div>\n  </div>\n </body>\n</html>',
            selectedimage: null,
            image: '61799a7b-84ad-485d-b0d4-3dc06fe711f1',
            drawed: true,
            drawedBody:
                '<div id="resp-template" name="globalContainer"><div id="hd-template"><h1>Header</h1></div><div id="bd-template"><div id="yui-main-template"><div class="yui-b-template" id="splitBody0"><div class="yui-gc-template" id="yui-gc-template"><div class="yui-u-template first" id="0_yui-u-grid-1"><div class="addContainerSpan"><a href="javascript: showAddContainerDialog(\'0_yui-u-grid-1\');" title="Add Container"><span class="plusBlueIcon"></span>Add Container</a></div><span class="titleContainerSpan" id="0_yui-u-grid-1_span_56bd55ea-b04b-480d-9e37-5d6f9217dcc3" title="container_56bd55ea-b04b-480d-9e37-5d6f9217dcc3"><div class="removeDiv"><a href="javascript: removeDrawedContainer(\'0_yui-u-grid-1\',\'56bd55ea-b04b-480d-9e37-5d6f9217dcc3\');" title="Remove Container"><span class="minusIcon"></span>Remove Container</a></div><div class="clear"></div><h2>Container: Large Column (lg-1)</h2><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></span><div style="display: none;" title="container_56bd55ea-b04b-480d-9e37-5d6f9217dcc3" id="0_yui-u-grid-1_div_56bd55ea-b04b-480d-9e37-5d6f9217dcc3">#parseContainer(\'56bd55ea-b04b-480d-9e37-5d6f9217dcc3\')\r\n</div></div><div class="yui-u-template" id="0_yui-u-grid-2"><div class="addContainerSpan"><a href="javascript: showAddContainerDialog(\'0_yui-u-grid-2\');" title="Add Container"><span class="plusBlueIcon"></span>Add Container</a></div><span class="titleContainerSpan" id="0_yui-u-grid-2_span_5363c6c6-5ba0-4946-b7af-cf875188ac2e" title="container_5363c6c6-5ba0-4946-b7af-cf875188ac2e"><div class="removeDiv"><a href="javascript: removeDrawedContainer(\'0_yui-u-grid-2\',\'5363c6c6-5ba0-4946-b7af-cf875188ac2e\');" title="Remove Container"><span class="minusIcon"></span>Remove Container</a></div><div class="clear"></div><h2>Container: Medium Column (md-1)</h2><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></span><div style="display: none;" title="container_5363c6c6-5ba0-4946-b7af-cf875188ac2e" id="0_yui-u-grid-2_div_5363c6c6-5ba0-4946-b7af-cf875188ac2e">#parseContainer(\'5363c6c6-5ba0-4946-b7af-cf875188ac2e\')\r\n</div></div></div></div></div></div><div id="ft-template"><h1>Footer</h1></div></div>',
            countAddContainer: 2,
            countContainers: 2,
            headCode: null,
            theme: '79479e0e-87d0-4260-9c12-3f05e303adcc',
            themeName: 'quest',
            header: null,
            footer: null,
            archived: false,
            versionId: '8660b482-1ef6-4d00-9459-3996e703ba19',
            versionType: 'template',
            deleted: false,
            working: true,
            permissionId: '8660b482-1ef6-4d00-9459-3996e703ba19',
            locked: true,
            name: 'Quest - 2 Column (Right Bar)',
            map: {
                identifier: '8660b482-1ef6-4d00-9459-3996e703ba19',
                modDate: 1412108461663,
                type: 'template',
                title: 'Quest - 2 Column (Right Bar)',
                showOnMenu: false,
                inode: 'cc1f0d74-8356-4035-925a-5c792d7b386f',
                modUserName: 'Admin User',
                hasLiveVersion: true,
                deleted: false,
                modUser: 'dotcms.org.1',
                sortOrder: 0,
                working: true,
                locked: true,
                friendlyName: 'Quest - 2 Column (Right Bar)',
                live: true,
                iDate: 1412108461645
            },
            live: true,
            permissionType: 'com.dotmarketing.portlets.templates.model.Template',
            categoryId: 'cc1f0d74-8356-4035-925a-5c792d7b386f',
            idate: 1412108461645,
            new: false
        },
        containers: {
            '56bd55ea-b04b-480d-9e37-5d6f9217dcc3': {
                container: {
                    iDate: 1423842551078,
                    type: 'containers',
                    owner: null,
                    inode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                    identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                    title: 'Large Column (lg-1)',
                    friendlyName: 'Large body column container',
                    modDate: 1424206866107,
                    modUser: 'dotcms.org.1',
                    sortOrder: 0,
                    showOnMenu: false,
                    code: '',
                    maxContentlets: 25,
                    useDiv: false,
                    sortContentletsBy: '',
                    preLoop: '<div class="large-column">',
                    postLoop: '</div>',
                    staticify: false,
                    luceneQuery: '',
                    notes:
                        '    Large Column:\r\n    - Blog\r\n    - Events\r\n    - Generic\r\n    - Location\r\n    - Media\r\n    - News\r\n    - Documents\r\n    - Products',
                    archived: false,
                    versionId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                    versionType: 'containers',
                    deleted: false,
                    working: true,
                    permissionId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                    locked: false,
                    name: 'Large Column (lg-1)',
                    map: {
                        identifier: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        modDate: 1424206866107,
                        type: 'containers',
                        title: 'Large Column (lg-1)',
                        showOnMenu: false,
                        inode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        modUserName: 'Admin User',
                        hasLiveVersion: true,
                        deleted: false,
                        modUser: 'dotcms.org.1',
                        sortOrder: 0,
                        working: true,
                        locked: false,
                        friendlyName: 'Large body column container',
                        live: true,
                        iDate: 1423842551078
                    },
                    live: true,
                    permissionType: 'com.dotmarketing.portlets.containers.model.Container',
                    categoryId: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                    idate: 1423842551078,
                    new: false
                },
                containerStructures: [
                    {
                        id: 'eec4f9cb-e088-4adc-b405-8b6226eff7b3',
                        structureId: '2182e848-0240-4931-b63d-824962b66007',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<div class="row">\r\n    <div class="col-sm-7">\r\n\t\t<span class="label label-default pull-right">Media</span>\r\n    \t<div class="media-heading">$!{title}</div>\r\n    \t<div class="risk-system risk$!{averageRating}" style="float: none;" title="$!{averageRating}"></div>\r\n    \t$!{description}\r\n\t</div>\r\n\r\n\t<div class="col-sm-5">\r\n\t\t\t    #if ($UtilMethods.isSet(${fileBinaryFileURI}))\r\n\t\t\t      #set ($filePath = $!{fileBinaryFileURI} + \'/\' + $!{fileBinaryFileTitle})\r\n\t\t\t    #else\r\n\t\t\t      #set ($filePath = $url)\r\n\t\t\t    #end\r\n\t\t\t    #if ($UtilMethods.getFileExtension($filePath) != \'mp3\')\r\n\t\t\t\r\n\t\t\t      #if ($UtilMethods.isImage($filePath))\r\n\t\t\t        <article>\r\n\t\t\t          <a href="${filePath}" class="js-fancybox-img thumb image-thumb" title="$!{title}">\r\n\t\t\t            #if ($UtilMethods.isImage($file))\r\n\t\t\t              <img src="/contentAsset/resize-image/${ContentIdentifier}/file/w/325" alt="$!{title}" />\r\n\t\t\t            #else\r\n\t\t\t              <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/325" alt="$!{title}" />\r\n\t\t\t            #end\r\n\t\t\t          </a>\r\n\t\t\t        </article>\r\n\t\t\t      #else\r\n\t\t\t        #if ($UtilMethods.isSet(${fileBinaryFileURI}))\r\n\t\t\t          <article>\r\n\t\t\t            <a href="#$!{ContentIdentifier}" class="js-fancybox-media-file thumb media-thumb" title="$!{title}">\r\n\t\t\t              #if ($UtilMethods.isSet(${thumbnailBinaryFileURI}))\r\n\t\t\t                <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/325" alt="$!{title}" />\r\n\t\t\t              #else\r\n\t\t\t                $!{title}\r\n\t\t\t              #end\r\n\t\t\t            </a>\r\n\t\t\t            <div class="hidden">\r\n\t\t\t              <video id="$!{ContentIdentifier}" class="video-js vjs-default-skin vjs-big-play-centered"\r\n\t\t\t                controls preload="auto" width="640" height="480"\r\n\t\t\t                poster="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/640"\r\n\t\t\t                data-setup=\'{ "controls": true, "autoplay": false, "preload": "metadata" }\'>\r\n\t\t\t                <source src="$!{filePath}" type=\'video/$!{UtilMethods.getFileExtension($filePath)}\' />\r\n\t\t\t              </video>\r\n\t\t\t            </div>\r\n\t\t\t          </article>\r\n\t\t\t        #else\r\n\t\t\t          <article>\r\n\t\t\t            <a href="$!{filePath}" class="js-fancybox-media-link thumb media-thumb" title="$!{title}">\r\n\t\t\t              #if ($UtilMethods.isSet(${thumbnailBinaryFileURI}))\r\n\t\t\t                <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/325" alt="$!{title}" />\r\n\t\t\t              #else\r\n\t\t\t                $!{title}\r\n\t\t\t              #end\r\n\t\t\t            </a>\r\n\t\t\t          </article>\r\n\t\t\t        #end\r\n\t\t\t      #end\r\n\t\t\t\r\n\t\t\t    #else\r\n\t\t\t      <article>\r\n\t\t\t        <a href="#$!{ContentIdentifier}" class="js-fancybox-media-file thumb media-thumb" title="$!{title}">\r\n\t\t\t          #if ($UtilMethods.isSet(${thumbnailBinaryFileURI}))\r\n\t\t\t            <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/325" alt="$!{title}" />\r\n\t\t\t          #else\r\n\t\t\t            $!{title}\r\n\t\t\t          #end\r\n\t\t\t        </a>\r\n\t\t\t        <div class="hidden">\r\n\t\t\t          <audio id="$!{ContentIdentifier}" class="video-js vjs-default-skin vjs-big-play-centered"\r\n\t\t\t            controls preload="auto" width="640" height="480">\r\n\t\t\t            <source src="$!{filePath}" type=\'audio/$!{UtilMethods.getFileExtension($filePath)}\' />\r\n\t\t\t          </audio>\r\n\t\t\t        </div>\r\n\t\t\t      </article>\r\n\t\t\t    #end\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: 'a1198f41-00b0-4253-9239-d1b7dd82900c',
                        structureId: '799f176a-d32e-4844-a07c-1b5fcd107578',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<span class="label label-default pull-right">Blog</span>\r\n<a href="/blogs/$urlTitle">\r\n    <div class="media-heading">$title</div>\r\n</a>\r\n<div class="media-subheading">\r\n    <time datetime="$date.format(\'yyyy-MM-dd\',$sysPublishDate)T$date.format(\'hh:mm:ss\',$sysPublishDate)" class="date">$date.format(\'MMM dd yyyy\', $sysPublishDate) at $date.format(\'HH:mm z\', $sysPublishDate)</time>\r\n    <span class="author">$author</span>\r\n    <span class="comments">\r\n      <a href="#comments">\r\n        #if($math.toInteger(${commentscount}) > 0)\r\n          $commentscount Comments\r\n        #else\r\n          No Comments\r\n        #end\r\n      </a>\r\n    </span>\r\n</div>\r\n<div class="blog-description">\r\n    ## This trims the HTML and shorts the description field 200 character\r\n\t#set($y = $body.replaceAll("<[^>]*>", ""))\r\n\t#set($y = $UtilMethods.prettyShortenString("$y",300))\r\n\t<p>$y</p>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: '62028eff-4824-4361-befd-3bf3a50bbf9f',
                        structureId: '28039964-5615-4ccf-bb96-ded62adbcc6a',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<div class="media">\r\n    #if ($UtilMethods.isSet(${imageBinaryFileURI})) \r\n        <a class="pull-left" href="/news/$urlTitle">\r\n    \t\t<div class="media-badge">\r\n\t\t\t\t<img src=\'/contentAsset/image/${ContentInode}/image/byInode/1/filter/Resize/resize_w/150\' alt="$!{con.title}" />\r\n\t\t\t\t#if($UtilMethods.isSet(${caption}))\r\n\t\t\t\t\t<span class="news-detail-caption">$!{caption}</span>\r\n\t\t\t\t#end\r\n\t\t\t</div>\r\n\t\t</a>\r\n\t#end\r\n\t<div class="media-body">\r\n        <span class="label label-default pull-right">News</span>\r\n    \t<div class="media-heading"><a href="/news/$urlTitle">$title</a></div>\r\n    \t<div class="media-subheading">\r\n            <time datetime="$date.format(\'yyyy-MM-dd\',$!{sysPublishDate})" class="date">$date.format(\'MMM dd yyyy\', ${sysPublishDate}) at $date.format(\'HH:mm z\', $!{sysPublishDate})</time>\r\n    \t\t<span class="comments">\r\n    \t\t\t#if($math.toInteger(${commentscount}) > 0)\r\n    \t\t\t\t${commentscount} Comments\r\n    \t\t\t#else\r\n    \t\t\t\tNo Comments\r\n    \t\t\t#end\r\n    \t\t</span>\r\n        </div>\r\n\t\t<div class="news-descriotion">\r\n\t\t\t## This trims the HTML and shorts the description field 200 character\r\n\t\t\t#set($y = $story.replaceAll("<[^>]*>", ""))\r\n\t\t\t#set($y = $UtilMethods.prettyShortenString("$y", 200))\r\n\t\t\t<p>\r\n\t\t\t\t$y <a href="/news/$urlTitle">READ MORE</a>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: '52fd0033-2f32-41c5-bf27-7533e13c58d5',
                        structureId: '2a3e91e4-fbbf-4876-8c5b-2233c1739b05',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code: '#dotedit($CONTENT_INODE, $body)\r\n'
                    },
                    {
                        id: '4aaf2572-891c-4471-8e1d-6e863de03ff3',
                        structureId: 'f6259cc9-5d78-453e-8167-efd7b72b2e96',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<div class="media">\r\n    <a class="pull-left" href="/news-events/events/$urlTitle">\r\n\t\t<div class="date-badge">\r\n      \t\t<span class="date-month">$date.format(\'MMMM\', ${startDate})</span>\r\n      \t\t<span class="date-day">$date.format(\'d\', ${startDate})</span>\r\n      \t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Event</span>\r\n    \t<div class="media-heading"><a href="/news-events/events/$urlTitle">$title</a></div>\r\n\t\t<div class="media-subheading" datetime="$date.format(\'yyyy-M-dd\',$event.startDate)">\r\n\t\t\t#set($startDateV = $date.format(\'MMMM d, h:mm a\', ${startDate}))\r\n\t\t\t#set($endDateV = $date.format(\'MMMM d, h:mm a\', ${endDate}))\r\n\t\t\t\r\n\t\t\t#if($startDate == $endDate)\r\n\t\t\t\t<time>$startDateV</time>\r\n\t\t\t#elseif($date.format(\'EEE, MMMM d yyyy\',$startDateV) == $date.format(\'EEE, MMMM d yyyy\',$endDateV))\r\n\t\t\t\t#if($date.format(\'h:mm a\',$startDate) == \'12:00 AM\' && $date.format(\'h:mm a\',$endDate) == \'11:59 PM\' )\r\n\t\t\t\t\t$date.format(\'MMMM d\', ${endDate}) (all day event)\r\n\t\t\t\t#else\r\n\t\t\t\t\t$startDateV - $date.format(\'h:mm a\',$endDate)\r\n\t\t\t\t#end\r\n\t\t\t#else\r\n\t\t\t\t$startDateV - $endDateV\r\n\t\t\t#end\r\n\t\t</div>\r\n\t\r\n\r\n\t\t## This trims the HTML and shorts the description field 200 character\r\n\t\t#set($y = $description.replaceAll("<[^>]*>", ""))\r\n\t\t#set($y = $UtilMethods.prettyShortenString("$y", 200))\r\n\t\t<p>$y</p>\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: '226cc505-c9b2-4b81-bbae-2826857f6b62',
                        structureId: '9ea36ae1-7775-48ae-99fe-f4ebca03a3de',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<script>\r\n    $(document).ready(function() {\r\n\r\n\t    jQuery.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22$!{tickerSymbol}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?",\r\n\t    function(data) {\r\n\t      var q = (data.query.results.quote.PreviousClose);\r\n\t      var x = (data.query.results.quote.Change);\r\n\t      var y = (data.query.results.quote.PercentChange);\r\n\t\r\n\t      jQuery("#price$!{tickerSymbol}LG").append(q);\r\n\t\r\n\t      if (x.indexOf("-") != -1) {\r\n\t        var x = "<span class=\\"down\\">&nbsp;" + x + "&nbsp;(" + y + ")</span>";\r\n\t      } else if (x.indexOf("+") != -1) {\r\n\t        var x = "<span class=\\"up\\">&nbsp;" + x + "&nbsp;(" + y + ")</span>";\r\n\t      } else {\r\n\t        var x = "<span>&nbsp;" + x + "&nbsp;(" + y + ")</span>";\r\n\t      }\r\n\t      jQuery("#change$!{tickerSymbol}LG").append(x);\r\n\t    });\r\n\r\n\t});\r\n</script>\r\n<div class="row">\r\n    <div class="col-sm-6">\r\n\t\t<img src="http://chart.finance.yahoo.com/c/5b/v/$!{tickerSymbol}?lang=en-US&region=US&width=300&height=180" alt="Chart for $!{tickerSymbol}" width="100%">\r\n\t</div>\r\n\t<div class="col-sm-6">\r\n\t\t<div class="media-body">\r\n\t\t\t<span class="label label-default pull-right">Product</span>\r\n\t    \t<div class="media-heading"><a href="/products/$urlTitle">$title ($!{tickerSymbol})</a></div>\r\n\t\t\t<table class="table product-info">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>Price:</td>\r\n\t\t\t\t\t<td class="price" id="price$!{tickerSymbol}LG"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>Change:</td>\r\n\t\t\t\t\t<td><span id="change$!{tickerSymbol}LG"></span></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>Asset Class:</td>\r\n\t\t\t\t\t<td>$!{assetClass}</td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: '16fb4667-2874-4038-aaab-85dae5677ab2',
                        structureId: 'd8262b9f-84ea-46f9-88c4-0c8959271d67',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<div class="media">\r\n    <div class="media-badge pull-left">\r\n\t\t## IF IMAGE\r\n\t    #if ($UtilMethods.isSet(${fileAssetBinaryFileURI})) \r\n\t      <a href="/contentAsset/resize-image/${ContentIdentifier}/fileAsset?w=560" class="thumb image-thumb js-fancybox-img" title="${title}">\r\n\t        <img src="/contentAsset/resize-image/${ContentIdentifier}/fileAsset?w=150" />\r\n\t      </a>\r\n\t    #end\r\n\t</div>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Document</span>\r\n    \t<div class="media-heading">${title}</div>\r\n\t    #if ($UtilMethods.isSet($description1))\r\n\t      <p>$description1</p>\r\n\t    #end\r\n\t\t#if ($UtilMethods.isSet($sysPublishDate) || $topic.size() > 0 || $UtilMethods.isSet($tags))\r\n\t\t\t<dl class="dl-horizontal document-detail-meta">\r\n\t\t\t\t#if ($UtilMethods.isSet($sysPublishDate))\r\n\t\t\t\t\t<div class="item-line">\r\n\t\t\t\t\t\t<dt>Publish on:</dt>\r\n\t\t\t\t\t\t<dd><time>$date.format(\'MM/dd/yyyy\',$sysPublishDate)</time></dd>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t#end\r\n\t\t\t</dl>\r\n\t\t#end\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: '07a7c966-ad64-41f2-86cc-3aa38d028955',
                        structureId: 'd2a77f80-2628-4819-bfe9-e9916eb6ba70',
                        containerInode: 'dde0b865-6cea-4ff0-8582-85e5974cf94f',
                        containerId: '56bd55ea-b04b-480d-9e37-5d6f9217dcc3',
                        code:
                            '<div class="media">\r\n    <a class="pull-left" href="/locations/$urlTitle">\r\n    \t<div class="media-badge">\r\n\t\t\t#if ($UtilMethods.isSet(${imageBinaryFileURI})) \r\n\t   \t\t\t<img src="/contentAsset/image/${ContentIdentifier}/image/filter/Resize/resize_w/150" />\r\n\t      \t#else\r\n\t      \t\t<div class="thumb" style="width: 150px;height:120px;">\r\n\t\t      \t\tNo Pic\r\n\t\t\t\t</div>\r\n\t      \t#end\r\n\t\t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n        <span class="label label-default pull-right">Location</span>\r\n    \t<div class="media-heading"><a href="/locations/$urlTitle">$title</a></div>\r\n    \t<address>\r\n\t\t\t$address1<br/>\r\n\t\t\t#if ($UtilMethods.isSet($address2))\r\n\t\t\t\t$address2<br/>\r\n\t\t\t#end\r\n\t\t\t$city, \r\n\t\t\t$state $zip\r\n\t\t\t#if($country != "United States" && $country != "Canada")\r\n\t\t\t\t$country\r\n\t\t\t#end\r\n\t\t</address>\r\n\t</div>\r\n</div>\r\n<div class="location-description">\r\n\t## This trims the HTML and shorts the description field 200 character\r\n\t#set($y = $description.replaceAll("<[^>]*>", ""))\r\n\t#set($y = $UtilMethods.prettyShortenString("$y", 200))\r\n\t<p>$y</p>\r\n</div>\r\n\r\n<hr>'
                    }
                ],
                rendered:
                    "<div class=\"large-column\">     <span class='dotContentletInlineEditSpan dotContentletInline07bd30ce-482f-4bfa-b547-dc83cc1a0d17' id='editable-07bd30ce-482f-4bfa-b547-dc83cc1a0d17body' title='body'  contenteditable=\"true\" onkeydown=\"parent._dotChangeEditContentEditControl('07bd30ce-482f-4bfa-b547-dc83cc1a0d17', 'body')\"  onfocus=\"parent._dotChangeEditContentEditControl('07bd30ce-482f-4bfa-b547-dc83cc1a0d17', 'body')\"><p><img src=\"/dA/7de092d3-d051/700w/custom-house.jpg\" class=\"img-responsive\" /></p>\n<p>Neque sit amet fermentum vulputate, arcu augue eleifend diam, malesuada molestie quam nibh at neque. In non risus at felis adipiscing molestie ac sed diam. Vivamus sit amet purus at libero pellentesque sagittis. Integer a enim turpis, vitae dignissim dui. Nulla eu leo id sapien facilisis pulvinar non quis justo. Morbi tempor, est quis elementum euismod, nibh metus faucibus enim, a viverra mi massa sit amet dui. Aenean id sapien mi, vel dapibus enim. Duis diam erat, malesuada sed fringilla non, rhoncus eget mauris. Praesent sit amet orci purus. Mauris hendrerit lectus ut justo aliquam eleifend. Curabitur bibendum congue luctus.</p>\n<blockquote>Nulla rutrum facilisis odio sed interdum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus risus libero, cursus nec iaculis eget, pretium et augue. Proin ultricies dapibus elit et ornare. Phasellus feugiat suscipit leo. Morbi eu mi volutpat quam aliquam fringilla vitae vitae libero. Duis convallis dapibus molestie. In egestas lorem vitae eros varius adipiscing. &mdash;&nbsp;Timothy Brigham, CEO Quest Financial</blockquote>\n<p>Nulla rutrum facilisis odio sed interdum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus risus libero, cursus nec iaculis eget, pretium et augue. Proin ultricies dapibus elit et ornare. Phasellus feugiat suscipit leo. Morbi eu mi volutpat quam aliquam fringilla vitae vitae libero. Duis convallis dapibus molestie. In egestas lorem vitae eros varius adipiscing. Nulla accumsan tincidunt blandit. Duis elementum sapien at turpis pellentesque faucibus. Pellentesque rhoncus lobortis vulputate. Nullam placerat fringilla tincidunt.</p></span>        </div> "
            },
            '5363c6c6-5ba0-4946-b7af-cf875188ac2e': {
                container: {
                    iDate: 1494619103690,
                    type: 'containers',
                    owner: null,
                    inode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                    identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                    title: 'Medium Column (md-1)',
                    friendlyName: 'Medium body column container',
                    modDate: 1494619103722,
                    modUser: 'dotcms.org.1',
                    sortOrder: 0,
                    showOnMenu: false,
                    code: '',
                    maxContentlets: 25,
                    useDiv: false,
                    sortContentletsBy: '',
                    preLoop: '<div class="medium-column">',
                    postLoop: '</div>',
                    staticify: false,
                    luceneQuery: '',
                    notes:
                        '    Medium Column:\r\n    - Blog\r\n    - Events\r\n    - Generic\r\n    - Location\r\n    - Media\r\n    - News\r\n    - Documents\r\n    - Products',
                    archived: false,
                    versionId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                    versionType: 'containers',
                    deleted: false,
                    working: true,
                    permissionId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                    locked: true,
                    name: 'Medium Column (md-1)',
                    map: {
                        identifier: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        modDate: 1494619103722,
                        type: 'containers',
                        title: 'Medium Column (md-1)',
                        showOnMenu: false,
                        inode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        modUserName: 'Admin User',
                        hasLiveVersion: true,
                        deleted: false,
                        modUser: 'dotcms.org.1',
                        sortOrder: 0,
                        working: true,
                        locked: true,
                        friendlyName: 'Medium body column container',
                        live: true,
                        iDate: 1494619103690
                    },
                    live: true,
                    permissionType: 'com.dotmarketing.portlets.containers.model.Container',
                    categoryId: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                    idate: 1494619103690,
                    new: false
                },
                containerStructures: [
                    {
                        id: 'f7ffca2d-9039-4e3f-8686-f70f72a395b8',
                        structureId: 'd8262b9f-84ea-46f9-88c4-0c8959271d67',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '<div class="media">\r\n    <span class="label label-default pull-right">Document</span>\r\n\r\n    <div class="media-heading">\r\n        #if ($UtilMethods.isSet(${fileAssetBinaryFileURI})) \r\n    \t\t<a href="$!{fileAssetBinaryFileURI}?force_download=1&filename=$!{fileAssetBinaryFileTitle}">${title}</a> \r\n\t\t#end \r\n    </div>\r\n    #if ($UtilMethods.isSet($description1))\r\n      <div class="media-subheading">$UtilMethods.prettyShortenString("$description1", 125)</div>\r\n    #end\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: 'ecd59ee2-f257-46e2-b6e0-c50e737f9069',
                        structureId: '9ea36ae1-7775-48ae-99fe-f4ebca03a3de',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '<script>\r\n    $(document).ready(function() {\r\n\r\n        jQuery.getJSON("//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22$!{tickerSymbol}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?",\r\n\t    function(data) {\r\n\t      var q = (data.query.results.quote.PreviousClose);\r\n\t      var x = (data.query.results.quote.Change);\r\n\t      var y = (data.query.results.quote.PercentChange);\r\n\t\r\n\t      jQuery("#price$!{tickerSymbol}MD").append(q);\r\n\t\r\n\t      if (x.indexOf("-") != -1) {\r\n\t        var x = "<span class=\\"down\\">&nbsp;" + x + "&nbsp;(" + y + ")</span>";\r\n\t      } else if (x.indexOf("+") != -1) {\r\n\t        var x = "<span class=\\"up\\">&nbsp;" + x + "&nbsp;(" + y + ")</span>";\r\n\t      } else {\r\n\t        var x = "<span>&nbsp;" + x + "&nbsp;(" + y + ")</span>";\r\n\t      }\r\n\t      jQuery("#change$!{tickerSymbol}MD").append(x);\r\n\t    });\r\n\r\n\t});\r\n</script>\r\n<div class="row">\r\n    <div class="col-sm-12">\r\n    \t<span class="label label-default pull-right">Product</span>\r\n\t    <div class="media-heading"><a href="/products/$urlTitle">$title ($!{tickerSymbol})</a></div>\r\n\t\t<img src="//chart.finance.yahoo.com/c/5b/v/$!{tickerSymbol}?lang=en-US&region=US&width=300&height=180" alt="Chart for $!{tickerSymbol}" width="100%">\r\n\t</div>\r\n</div>\r\n<div class="row">\r\n\t<div class="col-sm-12">\r\n\t\t<div class="media-body">\r\n\t\t\t<table class="table product-info">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>$!{tickerSymbol}</td>\r\n\t\t\t\t\t<td><span class="price" id="price$!{tickerSymbol}MD"></span></td>\r\n                    <td><span id="change$!{tickerSymbol}MD"></span></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: 'e703b0db-04bb-4443-8207-7435fff0508e',
                        structureId: '2182e848-0240-4931-b63d-824962b66007',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '<div class="media">\r\n    #if ($UtilMethods.isSet(${fileBinaryFileURI}))\r\n      #set ($filePath = $!{fileBinaryFileURI} + \'/\' + $!{fileBinaryFileTitle})\r\n    #else\r\n      #set ($filePath = $url)\r\n    #end\r\n    #if ($UtilMethods.getFileExtension($filePath) != \'mp3\')\r\n\r\n      #if ($UtilMethods.isImage($filePath))\r\n          <a href="${filePath}" class="js-fancybox-img thumb image-thumb" title="$!{title}">\r\n            #if ($UtilMethods.isImage($file))\r\n              <img src="/contentAsset/resize-image/${ContentIdentifier}/file/w/400" alt="$!{title}" />\r\n            #else\r\n              <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/400" alt="$!{title}" />\r\n            #end\r\n          </a>\r\n      #else\r\n        #if ($UtilMethods.isSet(${fileBinaryFileURI}))\r\n            <a href="#$!{ContentIdentifier}" class="js-fancybox-media-file thumb media-thumb" title="$!{title}">\r\n              #if ($UtilMethods.isSet(${thumbnailBinaryFileURI}))\r\n                <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/400" alt="$!{title}" />\r\n              #else\r\n                $!{title}\r\n              #end\r\n            </a>\r\n            <div class="hidden">\r\n              <video id="$!{ContentIdentifier}" class="video-js vjs-default-skin vjs-big-play-centered"\r\n                controls preload="auto" width="640" height="480"\r\n                poster="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/640"\r\n                data-setup=\'{ "controls": true, "autoplay": false, "preload": "metadata" }\'>\r\n                <source src="$!{filePath}" type=\'video/$!{UtilMethods.getFileExtension($filePath)}\' />\r\n              </video>\r\n            </div>\r\n        #else\r\n            <a href="$!{filePath}" class="js-fancybox-media-link thumb media-thumb" title="$!{title}">\r\n              #if ($UtilMethods.isSet(${thumbnailBinaryFileURI}))\r\n                <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/400" alt="$!{title}" />\r\n              #else\r\n                $!{title}\r\n              #end\r\n            </a>\r\n        #end\r\n      #end\r\n\r\n    #else\r\n        <a href="#$!{ContentIdentifier}" class="js-fancybox-media-file thumb media-thumb" title="$!{title}">\r\n          #if ($UtilMethods.isSet(${thumbnailBinaryFileURI}))\r\n            <img src="/contentAsset/resize-image/${ContentIdentifier}/thumbnail/w/400" alt="$!{title}" />\r\n          #else\r\n            $!{title}\r\n          #end\r\n        </a>\r\n        <div class="hidden">\r\n          <audio id="$!{ContentIdentifier}" class="video-js vjs-default-skin vjs-big-play-centered"\r\n            controls preload="auto" width="640" height="480">\r\n            <source src="$!{filePath}" type=\'audio/$!{UtilMethods.getFileExtension($filePath)}\' />\r\n          </audio>\r\n        </div>\r\n    #end\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: 'b96e9b03-db83-47e5-b3c7-45de7f4f6e48',
                        structureId: '28039964-5615-4ccf-bb96-ded62adbcc6a',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '<div class="media">\r\n    <div class="media-body">\r\n        <span class="label label-default pull-right">News</span>\r\n    \t<div class="media-heading"><a href="/news/$urlTitle">$title</a></div>\r\n    \t<div class="media-subheading">\r\n            <time datetime="$date.format(\'yyyy-MM-dd\',$!{sysPublishDate})">$date.format(\'MMM dd yyyy\', ${sysPublishDate}) at $date.format(\'HH:mm z\', $!{sysPublishDate})</time>\r\n        </div>\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: 'ad6c5f6e-5408-4ace-8d81-09a88296acfe',
                        structureId: 'f6259cc9-5d78-453e-8167-efd7b72b2e96',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '#if($UtilMethods.isSet($recurrenceStartDate) && $UtilMethods.isSet($recurrenceEndDate))\r\n    #set($vcalendarUrl = "/dotCMS/downloadVCalendar?id=$ContentIdentifier&recurrenceStartDate=$date.format(\'dd/MM/yyyy HH:mm:ss\',$startDate)&recurrenceEndDate=$date.format(\'dd/MM/yyyy HH:mm:ss\',$endDate)")\r\n#else\r\n    #set($vcalendarUrl = "/dotCMS/downloadVCalendar?id=${content.ContentIdentifier}")\r\n#end\r\n\r\n\r\n<div class="media">\r\n    <a class="pull-left" href="/news-events/events/$urlTitle">\r\n          <div class="date-badge">\r\n      \t\t<span class="date-month">$date.format(\'MMM\', ${startDate})</span>\r\n      \t\t<span class="date-day">$date.format(\'d\', ${startDate})</span>\r\n      \t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Event</span>\r\n    \t<div class="media-heading"><a href="/news-events/events/$urlTitle">$title</a></div>\r\n\t\t<div class="media-subheading" datetime="$date.format(\'yyyy-M-dd\',$event.startDate)">\r\n\t\t\t#set($startDateV = $date.format(\'MMMM d, h:mm a\', ${startDate}))\r\n\t\t\t#set($endDateV = $date.format(\'MMMM d, h:mm a\', ${endDate}))\r\n\t\t\t\r\n\t\t\t#if($startDate == $endDate)\r\n\t\t\t\t<time>$startDateV</time>\r\n\t\t\t#elseif($date.format(\'EEE, MMMM d yyyy\',$startDateV) == $date.format(\'EEE, MMMM d yyyy\',$endDateV))\r\n\t\t\t\t#if($date.format(\'h:mm a\',$startDate) == \'12:00 AM\' && $date.format(\'h:mm a\',$endDate) == \'11:59 PM\' )\r\n\t\t\t\t\t$date.format(\'MMMM d\', ${endDate}) (all day event)\r\n\t\t\t\t#else\r\n\t\t\t\t\t$startDateV - $date.format(\'h:mm a\',$endDate)\r\n\t\t\t\t#end\r\n\t\t\t#else\r\n\t\t\t\t$startDateV - $endDateV\r\n\t\t\t#end\r\n\t\t</div>\r\n\t\t<!-- $UtilMethods.prettyShortenString("$description", 200) -->\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: 'a0c52e07-9d0b-4b5c-ade2-c2ca8c2ada69',
                        structureId: '2a3e91e4-fbbf-4876-8c5b-2233c1739b05',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code: '#dotedit($CONTENT_INODE, $body)'
                    },
                    {
                        id: '2b306b13-4142-4126-9e9e-0026197588b1',
                        structureId: '799f176a-d32e-4844-a07c-1b5fcd107578',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '<span class="label label-default pull-right">Blog</span>\r\n<a href="/blogs/$urlTitle" class="media-heading">$title</a>\r\n<div class="media-subheading">\r\n    <time datetime="$date.format(\'yyyy-MM-dd\',$sysPublishDate)T$date.format(\'hh:mm:ss\',$sysPublishDate)" class="date">$date.format(\'MMM dd yyyy\', $sysPublishDate)</time>\r\n    <span class="author">by: $author</span>\r\n</div>\r\n\r\n<hr>'
                    },
                    {
                        id: '27e92b33-ab80-42da-9389-d20c602a4ef9',
                        structureId: 'd2a77f80-2628-4819-bfe9-e9916eb6ba70',
                        containerInode: '9ab97328-e72f-4d7e-8be6-232f53218a93',
                        containerId: '5363c6c6-5ba0-4946-b7af-cf875188ac2e',
                        code:
                            '<div class="media">\r\n    <span class="label label-default pull-right">Location</span>\r\n    <a href="/locations/$urlTitle" class="pull-left icon-badge">\r\n        <i class="fa fa-map-marker fa-3x"></i>\r\n    </a>\r\n    <div class="media-body">\r\n        <a href="/locations/$urlTitle">\r\n        \t<div class="media-heading">$!{title}</div>\r\n\t\t</a>\r\n\t\t<address>\r\n\t\t\t$address1\r\n\t\t\t#if ($UtilMethods.isSet($address2))\r\n\t\t\t\t$address2<br/>\r\n\t\t\t#end\r\n\t\t\t$city, \r\n\t\t\t$state $zip\r\n\t\t\t#if($country != "United States" && $country != "Canada")\r\n\t\t\t\t$country\r\n\t\t\t#end\r\n\t\t</address>\r\n\t</div>\r\n</div>\r\n\r\n<hr>'
                    }
                ],
                rendered:
                    '<div class="medium-column">    \n<h3>Management Team</h3>\n<ul class="media-list employee-management-team">\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="Robert Anderson" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">Robert Anderson</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Risk Officer</li>\n            <li class="phone">978-594-5555 ext 270</li>\n            <li class="email"><a href="mailto:robert.anderson@questfake.com">robert.anderson@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="Tony Johnson" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">Tony Johnson</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Financial Officer</li>\n            <li class="phone">408-555-3424 etx: 4324</li>\n            <li class="email"><a href="mailto:tony.johnson@questfake.com">tony.johnson@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="Timothy Martinez" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">Timothy Martinez</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Executive Officer</li>\n            <li class="phone">786-594-5555 ext 270</li>\n            <li class="email"><a href="mailto:timothy.martinez@questfake.com">timothy.martinez@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="David White" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">David White</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Information Officer</li>\n            <li class="phone">843-555-8228 ext:217</li>\n            <li class="email"><a href="mailto:david.white@questfake.com">david.white@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n  </ul>            \r\n\r\n<div class="media">\r\n    <a class="pull-left" href="/news-events/events/technology-job-fair">\r\n          <div class="date-badge">\r\n      \t\t<span class="date-month">Aug</span>\r\n      \t\t<span class="date-day">1</span>\r\n      \t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Event</span>\r\n    \t<div class="media-heading"><a href="/news-events/events/technology-job-fair">Technology Job Fair</a></div>\r\n\t\t<div class="media-subheading" datetime="$date.format(\'yyyy-M-dd\',$event.startDate)">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\tAugust 1, 9:00 AM - 7:00 PM\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t<!-- <p>Technological skills are always in demand - our advanced technology and information systems job fairs are targeted specifically toward qualified candidates and the high-tech industry professionals ... -->\r\n\t</div>\r\n</div>\r\n\r\n<hr>            \r\n\r\n<div class="media">\r\n    <a class="pull-left" href="/news-events/events/wealth-management-annual-client-meeting">\r\n          <div class="date-badge">\r\n      \t\t<span class="date-month">Nov</span>\r\n      \t\t<span class="date-day">10</span>\r\n      \t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Event</span>\r\n    \t<div class="media-heading"><a href="/news-events/events/wealth-management-annual-client-meeting">Wealth Management Annual Client Meeting</a></div>\r\n\t\t<div class="media-subheading" datetime="$date.format(\'yyyy-M-dd\',$event.startDate)">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\tNovember 10, 12:00 PM - 1:00 PM\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t<!-- <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, ... -->\r\n\t</div>\r\n</div>\r\n\r\n<hr>        </div> '
            }
        },
        page: {
            map: {
                metadata: 'dotCMS',
                cachettl: '0',
                contentEditable: true,
                mimeType: 'application/dotpage',
                type: 'htmlpage',
                httpsRequired: false,
                inode: 'cc2cdf9c-a20d-4862-9454-2a76c1132123',
                permissions: [1, 2, 4, 8, 16],
                seokeywords: 'dotCMS Content Management System',
                isLocked: true,
                host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                lastReview: 1459255808976,
                locked: true,
                stInode: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
                identifier: 'c12fe7e6-d338-49d5-973b-2d974d57015b',
                friendlyname: 'About Us',
                pagemetadata: 'dotCMS',
                languageCode: 'en',
                languageFlag: 'en_US',
                folder: '1049e7fe-1553-4731-bdf9-ba069f1dc08b',
                rendered:
                    '    \n<!doctype html>\n<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->\n<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->\n<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->\n<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->\n\n<head>\n            \n<title>About Us</title>\n<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n<meta charset="UTF-8">\n<meta name="application-name" content="dotCMS dotcms.com">\n<meta name="description" content="dotCMS Content Management System demo site - About Quest">\n<meta name="keywords" content="dotCMS Content Management System">\n<meta name="author" content="dotCMS">\n<meta name="lastModifiedDate" content="2016-03-29 08:50:09.014">\n<meta name="application-name" content="dotcms.com" />\n<meta name="generator" content="dotCMS" />\n<link rel="canonical" href="//demo.dotcms.com" />\n\n\n<link rel="shortcut icon" href="http://dotcms.com/favicon.ico" type="image/x-icon">\n<link href=\'//fonts.googleapis.com/css?family=Kameron|Oxygen:300,400,700\' rel=\'stylesheet\' type=\'text/css\'>\n<link rel="stylesheet" href="/DOTLESS/application/themes/quest/less/main.css">\n\n<!--[if lt IE 9]>\n    <script src="_bower_components/respond/respond.min.js"></script>\n    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>\n<![endif]-->\n\n<!-- Load jQuery from Google CDN -->\n<script src="//code.jquery.com/jquery.min.js"></script>\n<!-- Load jQuery from a local copy if loading from Google fails -->\n<script type="text/javascript">window.jQuery || document.write(\'<script type="text/javascript" src="/application/themes/quest/_bower_components/jquery/jquery.min.js"><\\/script>\')</script>\n\n<script src="//ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>\n<script>\n\tWebFont.load({\n\t\tgoogle : {\n\t\t\tfamilies : [\'Open Sans:300,700\', \'Roboto Slab:100,500,700\']\n\t\t}\n\t});\n</script>    </head>\n\n\n<body class="quest-2-column-right-bar about-us">\n\n            <header id="header" class="header-wrap">\n    <div class="header-tools hidden-sm hidden-xs">\n        <div class="container">\n            <div class="col-md-12">\n                <div class="header-tools-wrapper">\n                    <form id="searchForm" name="searchForm" action="/home/site-search" class="searchForm-header pull-right">\n                        <input id="search-input" name="q" type="text" autocomplete="off" placeholder="Site Search" />\n                        <input class="btn btn-small btn-primary" type="submit" alt="Search" value="Search" name="search" />\n                    </form>\n                    <ul class="nav nav-pills pull-right">\n                                                    <li class="hidden-xs"><a href="/application/login/login.html?referrer=/intranet/&native=true"><i class="fa fa-angle-right"></i> Login</a></li>\n                                                <li class="hidden-xs"><a href="/about-us/locations/"><i class="fa fa-angle-right"></i> Find A Branch</a></li>\n                        <li class="hidden-xs"><a href="/contact-us/"><i class="fa fa-angle-right"></i> Contact Us</a></li>\n                        <li><a href="tel:13059002001"><i class="fa fa-phone"></i> (305) 900-2001</a></li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="navbar" role="banner">\n        <div class="container header-navbar">\n            <div class="navbar-header">\n                 <div class="col-xs-9 col-md-12">\n                     <a class="header-logo navbar-brand" href="/"><img src="/dA/82ad305a-621d/200w/quest-logo.png" alt="Quest | dotCMS Starter Site"></a>\n                </div>\n                <div class="col-xs-3 col-md-12">\n                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n                        <span class="icon-bar"></span>\n                        <span class="icon-bar"></span>\n                        <span class="icon-bar"></span>\n                    </button>\n                </div>\n            </div><!-- navbar-header -->\n            <nav class="navbar-collapse bs-navbar-collapse collapse" role="navigation" style="height: 1px;">\n                <ul class="nav navbar-nav">\n                    \n                                                                                            <li class="dropdown ">\n                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Services <b class="caret"></b></a>\n                                <ul class="dropdown-menu">\n                                                                            <li ><a href=\'/services/first-time-investors\' target=\'_self\'>First Time Investors</a></li>\n                                                                            <li ><a href=\'/services/retirees\' target=\'_self\'>Retirees</a></li>\n                                                                            <li ><a href=\'/services/global-investors\' target=\'_self\'>Global Investors</a></li>\n                                                                            <li ><a href=\'/services/wealth-managers\' target=\'_self\'>Wealth Managers</a></li>\n                                                                    </ul>\n                            </li>\n                                                                                                <li class="dropdown ">\n                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">About Us <b class="caret"></b></a>\n                                <ul class="dropdown-menu">\n                                                                            <li ><a href=\'/about-us/index\' target=\'_self\'>About Us</a></li>\n                                                                            <li ><a href=\'/about-us/locations\' target=\'_self\'>Locations</a></li>\n                                                                            <li ><a href=\'/about-us/our-team\' target=\'_self\'>Our Team</a></li>\n                                                                    </ul>\n                            </li>\n                                                                                                <li class=""><a href=\'/products\' target=\'_self\'>Products</a></li>\n                                                                                                <li class="dropdown ">\n                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Resources <b class="caret"></b></a>\n                                <ul class="dropdown-menu">\n                                                                            <li ><a href=\'/resources/index\' target=\'_self\'>Documents</a></li>\n                                                                            <li ><a href=\'/resources/videos\' target=\'_self\'>Videos</a></li>\n                                                                            <li ><a href=\'/resources/images\' target=\'_self\'>Photos</a></li>\n                                                                            <li ><a href=\'/blogs/\' target=\'\'>Blog</a></li>\n                                                                            <li ><a href=\'/intranet/\' target=\'\'>Intranet</a></li>\n                                                                    </ul>\n                            </li>\n                                                                                                <li class="dropdown ">\n                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">News & Events <b class="caret"></b></a>\n                                <ul class="dropdown-menu">\n                                                                            <li ><a href=\'/news-events/news\' target=\'_self\'>News</a></li>\n                                                                            <li ><a href=\'/news-events/events\' target=\'_self\'>Events</a></li>\n                                                                    </ul>\n                            </li>\n                                                                                                <li class="dropdown ">\n                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Demos <b class="caret"></b></a>\n                                <ul class="dropdown-menu">\n                                                                            <li ><a href=\'/demos/containers\' target=\'_self\'>Multi-Containers</a></li>\n                                                                            <li ><a href=\'/demos/mobile-apps\' target=\'_self\'>Mobile Apps</a></li>\n                                                                            <li ><a href=\'/demos/rest-content-save\' target=\'_self\'>REST Content Save</a></li>\n                                                                            <li ><a href=\'/bear-mountain/\' target=\'\'>One-Pagers</a></li>\n                                                                            <li ><a href=\'/demos/remote-widget\' target=\'_self\'>Remote Widget</a></li>\n                                                                            <li ><a href=\'/demos/content-geolocation\' target=\'_self\'>Content Geolocation</a></li>\n                                                                    </ul>\n                            </li>\n                                                            </ul>\n                \n                                            </nav><!-- nav-collapse -->\n        </div><!-- container -->\n    </div><!-- navbar -->\n</header>    \n    <div class="content-wrap">\n        <div class="container">\n        \n        \n                                        \n        \t\t\n                                \n\n\t\t\t\t\n        \n                        \n                                                                        <div class="row-wrapper-1">\n                        <div class="row">\n                    \n                                                            \n                    <div class="col-sm-8">\n                                                <div class="large-column">     <span class=\'dotContentletInlineEditSpan dotContentletInline07bd30ce-482f-4bfa-b547-dc83cc1a0d17\' id=\'editable-07bd30ce-482f-4bfa-b547-dc83cc1a0d17body\' title=\'body\'  contenteditable="true" onkeydown="parent._dotChangeEditContentEditControl(\'07bd30ce-482f-4bfa-b547-dc83cc1a0d17\', \'body\')"  onfocus="parent._dotChangeEditContentEditControl(\'07bd30ce-482f-4bfa-b547-dc83cc1a0d17\', \'body\')"><p><img src="/dA/7de092d3-d051/700w/custom-house.jpg" class="img-responsive" /></p>\n<p>Neque sit amet fermentum vulputate, arcu augue eleifend diam, malesuada molestie quam nibh at neque. In non risus at felis adipiscing molestie ac sed diam. Vivamus sit amet purus at libero pellentesque sagittis. Integer a enim turpis, vitae dignissim dui. Nulla eu leo id sapien facilisis pulvinar non quis justo. Morbi tempor, est quis elementum euismod, nibh metus faucibus enim, a viverra mi massa sit amet dui. Aenean id sapien mi, vel dapibus enim. Duis diam erat, malesuada sed fringilla non, rhoncus eget mauris. Praesent sit amet orci purus. Mauris hendrerit lectus ut justo aliquam eleifend. Curabitur bibendum congue luctus.</p>\n<blockquote>Nulla rutrum facilisis odio sed interdum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus risus libero, cursus nec iaculis eget, pretium et augue. Proin ultricies dapibus elit et ornare. Phasellus feugiat suscipit leo. Morbi eu mi volutpat quam aliquam fringilla vitae vitae libero. Duis convallis dapibus molestie. In egestas lorem vitae eros varius adipiscing. &mdash;&nbsp;Timothy Brigham, CEO Quest Financial</blockquote>\n<p>Nulla rutrum facilisis odio sed interdum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus risus libero, cursus nec iaculis eget, pretium et augue. Proin ultricies dapibus elit et ornare. Phasellus feugiat suscipit leo. Morbi eu mi volutpat quam aliquam fringilla vitae vitae libero. Duis convallis dapibus molestie. In egestas lorem vitae eros varius adipiscing. Nulla accumsan tincidunt blandit. Duis elementum sapien at turpis pellentesque faucibus. Pellentesque rhoncus lobortis vulputate. Nullam placerat fringilla tincidunt.</p></span>        </div> \n                    </div><!--/span-->\n\n                                                        \n                                                            \n                    <div class="col-sm-4">\n                                                <div class="medium-column">    \n<h3>Management Team</h3>\n<ul class="media-list employee-management-team">\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="Robert Anderson" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">Robert Anderson</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Risk Officer</li>\n            <li class="phone">978-594-5555 ext 270</li>\n            <li class="email"><a href="mailto:robert.anderson@questfake.com">robert.anderson@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="Tony Johnson" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">Tony Johnson</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Financial Officer</li>\n            <li class="phone">408-555-3424 etx: 4324</li>\n            <li class="email"><a href="mailto:tony.johnson@questfake.com">tony.johnson@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="Timothy Martinez" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">Timothy Martinez</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Executive Officer</li>\n            <li class="phone">786-594-5555 ext 270</li>\n            <li class="email"><a href="mailto:timothy.martinez@questfake.com">timothy.martinez@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n      \t\t    <li class="media">\n      <article>\n        <a class="pull-left" href="#">\n                      <img src="/images/icons/profile-male.png" alt="David White" width="75" />\n                  </a>\n        <div class="media-body">\n          <h4 class="media-heading name">David White</h4>\n          <ul class="member-info">\n            <li class="job-title">Chief Information Officer</li>\n            <li class="phone">843-555-8228 ext:217</li>\n            <li class="email"><a href="mailto:david.white@questfake.com">david.white@questfake.com</a></li>\n          </ul>\n        </div>\n      </article>\n    </li>\n  </ul>            \r\n\r\n<div class="media">\r\n    <a class="pull-left" href="/news-events/events/technology-job-fair">\r\n          <div class="date-badge">\r\n      \t\t<span class="date-month">Aug</span>\r\n      \t\t<span class="date-day">1</span>\r\n      \t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Event</span>\r\n    \t<div class="media-heading"><a href="/news-events/events/technology-job-fair">Technology Job Fair</a></div>\r\n\t\t<div class="media-subheading" datetime="$date.format(\'yyyy-M-dd\',$event.startDate)">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\tAugust 1, 9:00 AM - 7:00 PM\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t<!-- <p>Technological skills are always in demand - our advanced technology and information systems job fairs are targeted specifically toward qualified candidates and the high-tech industry professionals ... -->\r\n\t</div>\r\n</div>\r\n\r\n<hr>            \r\n\r\n<div class="media">\r\n    <a class="pull-left" href="/news-events/events/wealth-management-annual-client-meeting">\r\n          <div class="date-badge">\r\n      \t\t<span class="date-month">Nov</span>\r\n      \t\t<span class="date-day">10</span>\r\n      \t</div>\r\n\t</a>\r\n\t<div class="media-body">\r\n\t\t<span class="label label-default pull-right">Event</span>\r\n    \t<div class="media-heading"><a href="/news-events/events/wealth-management-annual-client-meeting">Wealth Management Annual Client Meeting</a></div>\r\n\t\t<div class="media-subheading" datetime="$date.format(\'yyyy-M-dd\',$event.startDate)">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\tNovember 10, 12:00 PM - 1:00 PM\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t<!-- <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, ... -->\r\n\t</div>\r\n</div>\r\n\r\n<hr>        </div> \n                    </div><!--/span-->\n\n                                            </div><!--/row-->\n                    </div><!-- /row-wrapper-->\n                                                        \n\n\n                                \n        </div><!-- /container-->\n\n    </div>\n\n            \t<div class="call-to-action" style="background-image: url(\'/contentAsset/image/56c0e696-901e-4440-accf-fc4988f5b8c3/image/byInode/1/filter/Resize/resize_w/900\');">\n\t\t<div class="container">\n\t\t\t<div class="col-sm-10 col-sm-offset-1">\n\t\t\t\t<div class="call-out text-center">\n\t\t\t\t\t<h2>Own The World. You Desire It!</h2>\n\t\t\t\t\t<p>Let us help you turn your millions into billions.</p>\n\t\t\t\t\t<a href="/contact-us/" class="btn btn-lg btn-warning">Learn More</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n<div class="footer-social">\n\t<div class="container">\n\t\t<div class="col-xs-12">\n\t        <a class="social-icon fa fa-rss" href="//dotcms.com/community/rss-feeds.html" target="_blank">RSS Feed</a>\n\t        <a class="social-icon fa fa-twitter" href="//twitter.com/#!/dotcms" target="_blank">Follow us on Twitter</a>\n\t        <a class="social-icon fa fa-facebook" href="//www.facebook.com/dotCMS" target="_blank">Follow us on Facebook</a>\n\t        <a class="social-icon fa fa-envelope" href="//www.addthis.com/bookmark.php">Send to a Friend</a>\n\t        <a class="social-icon fa fa-plus" href="//www.addthis.com/bookmark.php">Add This</a>\n\t    </div>\n\t</div>\n</div>\n\n<footer class="footer-wrapper">\n    <div class="container">\n        <div class="row footer-nav">\n            <div class="col-sm-2 hidden-xs">\n                <h4>Our Company</h4>\n                <ul>\n                    <li><a href="/about-us/">About Us</a></li>\n                    <li><a href="/about-us/our-team/">Our Team</a></li>\n                    <li><a href="/about-us/locations/">Locations</a></li>\n                    <li><a href="/contact-us/">Contact Us</a></li>\n                </ul>\n            </div>\n            <div class="col-sm-2 hidden-xs">\n                <h4>News & Events</h4>\n                <ul>\n                <li><a href="/news-events/news/">Recent News</a></li>\n                <li><a href="/news-events/events/">Upcoming Events</a></li>\n                <li><a href="/blogs/">Insight Blog</a></li>\n                </ul>\n            </div>\n\n            <div class="col-sm-4 hidden-xs">\n                <h4>For Clients</h4>\n                <ul>\n                    <li><a href="/application/login?referrer=/intranet/">Intranet</a></li>\n                    <li><a href="/resources/">Resources</a></li>\n                    <li><a href="/resources/videos">Videos</a></li>\n                    <li><a href="/demos/mobile-apps" target="_blank">Mobile App</a></li>\n                </ul>\n            </div>\n            <div class="col-sm-4 col-xs-10">\n                <h4>Newsletter Sign Up</h4>\n                <form id="newsletter-form" class="footer-newsletter-form" method="post" action="http://visitor.r20.constantcontact.com/manage/optin/ea?v=0014YAKv_Pymb9rFwL2BMSlaMcAXEwuIDzDQX9RGoGjK5rLzQoHHlEMPfpgvdUwnRjS">\n                    <input type="hidden" name="ref" value="http://dotcms.com/">\n                    <input id="emailAddr" name="emailAddr" type="text">\n                    <a class="footer-newsletter-btn" onclick="document.getElementById(\'newsletter-form\').submit()">Subscribe</a>\n                    <p><a href="#" onclick="document.getElementById(\'newsletter-form\').submit()" class="footer-newsletter-unsubscribe">Unsubscribe</a></p>\n                </form>\n                <div class="copyright">\n\t                Powered By: <a href="//www.dotcms.com" target="_blank">dotCMS</a> â€” Â© 2017  All rights reserved.\n\t            </div>\n            </div>\n            \n        </div>\n    </div>\n</footer>\n\n<!-- Include User Information Tab -->\n<div id="userInfo" class="user-info hidden-xs">\n  <div class="controle">\n  \t<a class="trigger">MORE <i class="fa fa-caret-right"></i></a>\n  \t<div class="persona-selector">\n  \t\t  \t\t\t<a href="?com.dotmarketing.persona.id=0">\n  \t\t  \t\t\t<img src="/html/images/persona/default-persona.png" style="width:50px;background: #fff;" class="img-circle" data-toggle="tooltip" data-placement="top" title="Defualt">\n  \t\t</a>\n  \t\t\n\t\t\t\t\t\t\t\t\t<a href="?com.dotmarketing.persona.id=34c720cd-4b46-4a67-9e4b-2117071d01f1">\n\t\t\t\n\n              <img src="/dA/3ffaff2c-3b82-4bd6-8622-ec2637cc0ac6/photo/50w/young-professional.jpg" class="img-circle" data-toggle="tooltip" data-placement="top" title="First Time Investor">\n      \t\t\t\t\n\t\t\t</a>\n\t\t\t\t\t\t\t\t\t<a href="?com.dotmarketing.persona.id=1c56ba62-1f41-4b81-bd62-b6eacff3ad23">\n\t\t\t\n\n              <img src="/dA/f30e6dc9-e951-4f71-bb1c-a98b49238806/photo/50w/b98222bde2f74867c98b577738829ae45ba03fba.jpg" class="img-circle" data-toggle="tooltip" data-placement="top" title="Global Investor">\n      \t\t\t\t\n\t\t\t</a>\n\t\t\t\t\t\t\t\t\t<a href="?com.dotmarketing.persona.id=914c93c2-800a-4638-8832-349c221cc87a">\n\t\t\t\n\n              <img src="/dA/02bd14a0-4139-4535-a746-8389ae716981/photo/50w/retired-couple.jpg" class="img-circle" data-toggle="tooltip" data-placement="top" title="Retiree">\n      \t\t\t\t\n\t\t\t</a>\n\t\t\t\t\t\t\t\t\t<a href="?com.dotmarketing.persona.id=d4ffa84f-8746-46f8-ac29-1f8ca2c7eaeb">\n\t\t\t\n\n              <img src="/dA/d475422a-e9f0-4ef5-8797-147f630df47d/photo/50w/wealthy-man-with-jet.jpg" class="img-circle" data-toggle="tooltip" data-placement="top" title="Wealthy Prospect">\n      \t\t\t\t\n\t\t\t</a>\n\t\t\t</div>\n  </div>\n  <span id="userInfoData"></span>\n</div>\n\n<!-- Google Analytics: Set your site\'s ID in the host verable. -->\n<script>\n\t(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n\t(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n\tm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n\t})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');\n\n\tga(\'create\', \'UA-9877660-3\', \'auto\');\n\t\n\t\t\tga(\'send\', \'pageview\', {\'dimension1\': \'Defualt\'});\n\t</script>\n\n\n<!--\nBootstrap v3.1.1, contains all the jQuery plugins.\nMore information at: http://getbootstrap.com/javascript/\n-->\n<script src="/application/themes/quest/js/vendors/bootstrap.js"></script>\n\n<!--\nUnderscore.js (1.6.0) is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects\nMore information at: http://underscorejs.org/\n-->\n<script src="/application/themes/quest/js/vendors/underscore.js"></script>\n\n<!--\nfancyBox 2.1.5 is a tool that offers a nice and elegant way to add zooming functionality for images, html content and multi-media on your webpages.\nMore information at: http://fancyapps.com/fancybox/\n-->\n<script src="/application/themes/quest/js/vendors/fancybox.js"></script>\n\n<!--\nVideo.js - open source HTML5 & Flash video player\nMore information at: http://www.videojs.com\n-->\n<script src="/application/themes/quest/js/vendors/video.js"></script>\n\n<!--\nTableSorter 2.14.5 - Client-side table sorting with ease!\nMore information at: https://github.com/Mottie/tablesorter\n-->\n<script src="/application/themes/quest/js/vendors/jquery.tablesorter.js"></script>\n\n<!--\nChosen, a Select Box Enhancer for jQuery and Prototype\nMore information at: https://github.com/harvesthq/chosen\n-->\n<script src="/application/themes/quest/js/vendors/chosen.jquery.js"></script>\n\n<!--\nA jQuery Flickr Feed Plugin\nMore information at: http://www.newmediacampaigns.com/page/jquery-flickr-plugin\n-->\n<script src="/application/themes/quest/js/vendors/jflickrfeed.js"></script>\n\n<!--\njQuery HC-Sticky\nMore information at: https://github.com/somewebmedia/hc-sticky\n-->\n<script src="/application/themes/quest/js/vendors/jquery.hc-sticky.min.js"></script>\n\n\n<script src="/application/themes/quest/js/main.js"></script>    \n\t<a href="http://www.dotcms.com" class="powered-by">Powered by dotCMS - The Leading Open Source Java Content Management System</a>\n</body>\n</html>\n\n',
                sortOrder: 0,
                name: 'index',
                template: '8660b482-1ef6-4d00-9459-3996e703ba19',
                modDate: 1459255809014,
                extension: 'page',
                wfMandatoryWorkflow: false,
                pageURI: '/about-us/index',
                description: 'About Us',
                httpsreq: '',
                title: 'About Us',
                showOnMenu: 'true',
                disabledWYSIWYG: [],
                countryCode: 'US',
                working: true,
                friendlyName: 'About Us',
                live: true,
                owner: 'dotcms.org.1',
                redirect: '',
                redirecturl: '',
                isContentlet: true,
                wfActionMapList: [],
                canonicalUrl: '',
                languageId: 1,
                url: 'index',
                seodescription: 'dotCMS Content Management System demo site - About Quest',
                modUserName: 'Admin User',
                hasLiveVersion: true,
                deleted: false,
                modUser: 'dotcms.org.1',
                pageUrl: 'index'
            },
            lowIndexPriority: false,
            title: 'About Us',
            metadata: 'dotCMS',
            cacheTTL: 0,
            seoKeywords: 'dotCMS Content Management System',
            seoDescription: 'dotCMS Content Management System demo site - About Quest',
            pageUrl: 'index',
            httpsRequired: false,
            redirect: '',
            templateId: '8660b482-1ef6-4d00-9459-3996e703ba19',
            friendlyName: 'About Us',
            showOnMenu: true,
            menuOrder: 0,
            content: true,
            uri: '/about-us/index',
            inode: 'cc2cdf9c-a20d-4862-9454-2a76c1132123',
            identifier: 'c12fe7e6-d338-49d5-973b-2d974d57015b',
            languageId: 1,
            archived: false,
            versionId: 'c12fe7e6-d338-49d5-973b-2d974d57015b',
            versionType: 'content',
            modDate: 1459255809014,
            modUser: 'dotcms.org.1',
            working: true,
            locked: true,
            live: true,
            owner: 'dotcms.org.1',
            permissionId: 'c12fe7e6-d338-49d5-973b-2d974d57015b',
            permissionType: 'com.dotmarketing.portlets.contentlet.model.Contentlet',
            name: 'About Us',
            type: 'contentlet',
            folder: '1049e7fe-1553-4731-bdf9-ba069f1dc08b',
            structureInode: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
            categoryId: 'cc2cdf9c-a20d-4862-9454-2a76c1132123',
            contentTypeId: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
            sortOrder: 0,
            disabledWysiwyg: [],
            lastReview: 1459255808976,
            nextReview: null,
            reviewInterval: null,
            htmlpage: true,
            fileAsset: false,
            host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
            systemHost: false,
            vanityUrl: false,
            keyValue: false,
            contentType: {
                clazz: 'com.dotcms.contenttype.model.type.ImmutablePageContentType',
                name: 'Page Asset',
                id: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
                description: 'Default Structure for Pages',
                defaultType: false,
                detailPage: null,
                fixed: true,
                iDate: 1432826794750,
                system: false,
                versionable: true,
                multilingualable: false,
                variable: 'htmlpageasset',
                urlMapPattern: null,
                publishDateVar: null,
                expireDateVar: null,
                owner: 'system',
                modDate: 1510808490000,
                host: 'SYSTEM_HOST',
                folder: 'SYSTEM_FOLDER'
            }
        },
        layout: {
            pageWidth: 'resp-template',
            width: 'responsive',
            layout: 'none',
            title: 'quest--2-column-right-bar',
            header: true,
            footer: true,
            body: {
                preview: false,
                type: 'body',
                location: null,
                containers: null,
                widthPercent: null,
                width: null,
                rows: [
                    {
                        identifier: 0,
                        value: 'yui-gc-template',
                        id: 'select_splitBody',
                        columnsCount: 2,
                        gridWidths: [66, 33],
                        columns: [
                            {
                                preview: false,
                                type: 'column',
                                location: null,
                                containers: ['56bd55ea-b04b-480d-9e37-5d6f9217dcc3'],
                                widthPercent: 66,
                                width: 4,
                                leftIndex: 1,
                                rows: null,
                                sidebar: false
                            },
                            {
                                preview: false,
                                type: 'column',
                                location: null,
                                containers: ['5363c6c6-5ba0-4946-b7af-cf875188ac2e'],
                                widthPercent: 3,
                                width: 6,
                                leftIndex: 6,
                                rows: null,
                                sidebar: false
                            }
                        ]
                    }
                ],
                sidebar: false
            },
            sidebar: null
        }
    };

}
