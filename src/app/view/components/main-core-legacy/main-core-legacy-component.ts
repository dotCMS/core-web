import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
    DotLicenseService,
    UnlicensedPortletData
} from '@services/dot-license/dot-license.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-core-component',
    template:
        `<router-outlet *ngIf="canAccessEnterprisePortlet"></router-outlet>
        <dot-unlicensed-porlet
            *ngIf="unlicenseData && !canAccessEnterprisePortlet"
            [data]="unlicenseData">
        </dot-unlicensed-porlet>`
})
export class MainCoreLegacyComponent implements OnInit, OnDestroy {
    public canAccessEnterprisePortlet: boolean;
    public unlicenseData: UnlicensedPortletData;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(public router: Router, private dotLicense: DotLicenseService) {
        console.log('*****LLEGO OLD constr');
    }

    ngOnInit(): void {
        console.log('*****LLEGO OLD init');
        this.dotLicense
            .canAccessEnterprisePortlet(window.location.hash)
            .then((canAccess: boolean) => {
                this.canAccessEnterprisePortlet = canAccess;
                this.unlicenseData = this.dotLicense.getUnlicensedPortletData();
            });
    }

    ngOnDestroy(): void {
        console.log('*****DESTRUDIIIIII');
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
