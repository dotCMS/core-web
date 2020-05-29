import { pluck, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';

export interface UnlicensedPortletData {
    icon: string;
    titleKey: string;
    url: string;
}

const enterprisePorlets: UnlicensedPortletData[] = [
    {
        icon: 'tune',
        titleKey: 'com.dotcms.repackage.javax.portlet.title.rules',
        url: '/rules'
    },
    {
        icon: 'cloud_upload',
        titleKey: 'com.dotcms.repackage.javax.portlet.title.publishing-queue',
        url: '/c/publishing-queue'
    },
    {
        icon: 'find_in_page',
        titleKey: 'com.dotcms.repackage.javax.portlet.title.site-search',
        url: '/c/site-search'
    },
    {
        icon: 'update',
        titleKey: 'com.dotcms.repackage.javax.portlet.title.time-machine',
        url: '/c/time-machine'
    },
    {
        icon: 'device_hub',
        titleKey: 'com.dotcms.repackage.javax.portlet.title.workflow-schemes',
        url: '/c/workflow-schemes'
    },
    {
        icon: 'find_in_page',
        titleKey: 'com.dotcms.repackage.javax.portlet.title.es-search',
        url: '/c/es-search'
    },
    {
        icon: 'business',
        titleKey: 'Forms-and-Form-Builder',
        url: '/forms'
    }
];

/**
 * Handle license information of current logged in user
 * @export
 * @class DotLicenseService
 */
@Injectable()
export class DotLicenseService {
    private licenseURL: string;
    private unlicenseCurrentIndex = 0;

    constructor(private coreWebService: CoreWebService) {
        this.licenseURL = 'v1/appconfiguration';
    }

    /**
     * Gets if current user has an enterprise license
     *
     * @returns Observable<boolean>
     * @memberof DotLicenseService
     */
    isEnterprise(): Observable<boolean> {
        return this.getLicense().pipe(
            take(1),
            map((license) => license['level'] >= 200)
        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    async canAccessEnterprisePortlet(url: string): Promise<boolean> {
        let urlMatch = false;
        const isEnterpriseUser = await this.isEnterprise().toPromise();

        for (let i = 0, total = enterprisePorlets.length; i < total; i++) {
            if (url.indexOf(enterprisePorlets[i].url) >= 0) {
                urlMatch = true;
                this.unlicenseCurrentIndex = i;
                break;
            }
        }
        console.log('++++++++canAccessEnterprisePortlet', url, urlMatch, isEnterpriseUser);
        return urlMatch ? urlMatch && isEnterpriseUser : true;
    }

    getUnlicensedPortletData(): UnlicensedPortletData {
        return enterprisePorlets[this.unlicenseCurrentIndex];
    }

    private getLicense(): Observable<any> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: this.licenseURL
            })
            .pipe(take(1), pluck('entity', 'config', 'license'));
    }
}
