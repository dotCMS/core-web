import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DotIframeService } from '@components/_common/iframe/service/dot-iframe/dot-iframe.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotCustomEventHandlerService } from '@services/dot-custom-event-handler/dot-custom-event-handler.service';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { take, map } from 'rxjs/operators';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-component',
    styleUrls: ['./main-legacy.component.scss'],
    templateUrl: './main-legacy.component.html'
})
export class MainComponentLegacyComponent implements OnInit {
    constructor(
        public router: Router,
        private dotRouterService: DotRouterService,
        private dotIframeService: DotIframeService,
        private dotCustomEventHandlerService: DotCustomEventHandlerService,
        private dotLicense: DotLicenseService
    ) {
        router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                console.log('*****LLEGO NEW');
                this.dotLicense
                    .canAccessEnterprisePortlet(event.url)
                    .pipe(
                        take(1),
                        map((canAccess: boolean) => {
                            console.log('*****LLEGO NEW2');
                            if (!canAccess) {
                                this.dotRouterService.goToNotLicensed();
                            }
                        })
                    )
                    .subscribe();
            }
        });
    }

    ngOnInit(): void {
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';
        console.log('*****LLEGO NEW init');
        this.dotLicense
            .canAccessEnterprisePortlet(window.location.hash)
            .pipe(
                take(1),
                map((canAccess: boolean) => {
                    if (!canAccess) {
                        this.dotRouterService.goToNotLicensed();
                    }
                })
            )
            .subscribe();
    }

    /**
     * Reload content search iframe when contentlet editor close
     *
     * @memberof MainComponentLegacyComponent
     */
    onCloseContentletEditor(): void {
        this.dotIframeService.reloadData(this.dotRouterService.currentPortlet.id);
    }

    /**
     * Handle the custom events emmited by the Create Contentlet
     *
     * @param CustomEvent $event
     * @memberof MainComponentLegacyComponent
     */
    onCustomEvent($event: CustomEvent): void {
        this.dotCustomEventHandlerService.handle($event);
    }

}
