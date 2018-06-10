import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/dotcms-js';

export interface DotPageAsset {
    template: string;
    owner: string;
    identifier: string;
    friendlyname: string;
    modDate: string;
    cachettl: string;
    pagemetadata: string;
    languageId: number;
    title: string;
    showOnMenu: string;
    inode: string;
    seodescription: string;
    folder: string;
    __DOTNAME__: string;
    sortOrder: number;
    seokeywords: string;
    modUser: string;
    host: string;
    lastReview: string;
    stInode: string;
    url: string;
}

@Injectable()
export class DotPageSelectorService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get all the pages in the folder
     *
     * @param {string} _folder
     * @returns {Observable<DotPageAsset[]>}
     * @memberof DotPageSelectorService
     */
    getPagesInFolder(_folder: string): Observable<DotPageAsset[]> {
        return Observable.of(mock);
        // return this.coreWebService.requestView({
        //     url: ''
        // }).map(() => mock);
    }
}

const mock = [
    {
        template: '8660b482-1ef6-4d00-9459-3996e703ba19',
        owner: 'dotcms.org.1',
        identifier: 'c12fe7e6-d338-49d5-973b-2d974d57015b',
        friendlyname: 'About Us',
        modDate: '2018-05-21 09:52:38.461',
        cachettl: '0',
        pagemetadata: 'dotCMS',
        languageId: 1,
        title: 'About Us',
        showOnMenu: 'true',
        inode: '5cd3b647-e465-4a6d-a78b-e834a7a7331a',
        seodescription: 'dotCMS Content Management System demo site - About Quest',
        folder: '1049e7fe-1553-4731-bdf9-ba069f1dc08b',
        __DOTNAME__: 'About Us',
        sortOrder: 0,
        seokeywords: 'dotCMS Content Management System',
        modUser: 'dotcms.org.1',
        host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
        lastReview: '2018-05-18 15:30:34.428',
        stInode: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
        url: '/about-us/index'
    },
    {
        template: 'fdb3f906-e9c4-46c4-b7e4-148201271d04',
        modDate: '2015-02-02 20:04:24.499',
        cachettl: '15',
        title: 'Location Detail',
        httpsreq: '',
        showOnMenu: '',
        inode: '56ceec3a-6e57-4158-b1f0-d8de535e0238',
        __DOTNAME__: 'Location Detail',
        seokeywords: '',
        host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
        lastReview: '2015-02-02 20:04:24.49',
        stInode: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
        owner: 'dotcms.org.1',
        identifier: 'fdeb07ff-6fc3-4237-91d9-728109bc621d',
        friendlyname: 'Location Detail',
        redirecturl: '',
        pagemetadata: '',
        languageId: 1,
        url: '/about-us/locations/location-detail',
        seodescription: '',
        folder: 'd19a2815-1037-4a17-bce5-7a36eeaa8d54',
        sortOrder: 0,
        modUser: 'dotcms.org.1'
    },
    {
        template: 'fdb3f906-e9c4-46c4-b7e4-148201271d04',
        modDate: '2015-02-02 20:03:58.436',
        cachettl: '15',
        title: 'Locations',
        httpsreq: '',
        showOnMenu: '',
        inode: '3789f592-d3c9-443f-a760-c768244ec808',
        __DOTNAME__: 'Locations',
        seokeywords: '',
        host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
        lastReview: '2015-02-02 20:03:58.426',
        stInode: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
        owner: 'dotcms.org.1',
        identifier: '8e7dccc5-928e-4c13-9044-cca0566ada23',
        friendlyname: 'Locations',
        redirecturl: '',
        pagemetadata: '',
        languageId: 1,
        url: '/about-us/locations/index',
        seodescription: '',
        folder: 'd19a2815-1037-4a17-bce5-7a36eeaa8d54',
        sortOrder: 0,
        modUser: 'dotcms.org.1'
    },
    {
        template: 'fdb3f906-e9c4-46c4-b7e4-148201271d04',
        modDate: '2015-02-02 14:05:55.195',
        cachettl: '15',
        title: 'Our Team',
        httpsreq: '',
        showOnMenu: '',
        inode: '3a48a833-975a-4f0f-bc8c-1a22d8fd5cdc',
        __DOTNAME__: 'Our Team',
        seokeywords: '',
        host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
        lastReview: '2015-02-02 14:05:55.187',
        stInode: 'c541abb1-69b3-4bc5-8430-5e09e5239cc8',
        owner: 'dotcms.org.1',
        identifier: 'f9fc55e7-557a-4047-a8be-15e5ca69fa62',
        friendlyname: 'Our Team',
        redirecturl: '',
        pagemetadata: '',
        languageId: 1,
        url: '/about-us/our-team/index',
        seodescription: '',
        folder: 'ce49e1e7-4d0f-4af2-a87c-5e9c5562278c',
        sortOrder: 0,
        modUser: 'dotcms.org.1'
    }
];
