import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'dot-edit-page-main',
    templateUrl: './dot-edit-page-main.component.html',
    styleUrls: ['./dot-edit-page-main.component.scss']
})
export class DotEditPageMainComponent implements OnInit, OnDestroy {
    pageState: Observable<DotRenderedPageState>;
    private routeEventsSub: Subscription;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.listenRouteChanges();
    }

    ngOnDestroy(): void {
        this.routeEventsSub.unsubscribe();
    }

    private listenRouteChanges(): void {
        this.getResolverContent();
        this.routeEventsSub = this.router.events
            .pipe(filter((anyEvent: any) => event instanceof NavigationEnd && event.url.indexOf('/edit-page/content') > -1))
            .subscribe((navigationEvent: NavigationEnd) => {
                this.getResolverContent();
            });
    }

    private getResolverContent(): void {
        this.pageState = this.route.data.pluck('content');
    }
}
