import {
    Component,
    ElementRef,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    Input,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoginService, LoggerService } from 'dotcms-js/dotcms-js';
import { IframeOverlayService } from '../../../../../api/services/iframe-overlay-service';
import { Observable } from 'rxjs/Observable';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-iframe',
    styleUrls: ['./iframe.component.scss'],
    templateUrl: 'iframe.component.html'
})
export class IframeComponent implements OnInit {
    @ViewChild('iframeElement') iframeElement: ElementRef;
    @Input() src: string;

    iframeURL: SafeResourceUrl;
    loading = true;
    showOverlay = false;

    private readonly DEFAULT_LOCATION = {
        pathname: '',
        href: ''
    };

    constructor(
        private element: ElementRef,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        public iframeOverlayService: IframeOverlayService,
        private loginService: LoginService,
        private loggerService: LoggerService
    ) {}

    ngOnInit(): void {
        this.iframeOverlayService.overlay.subscribe(val => (this.showOverlay = val));
        this.element.nativeElement.style.height = this.getIframeHeight(window.innerHeight);

        Observable.fromEvent(window, 'resize')
            .debounceTime(250)
            .subscribe(($event: any) => {
                this.element.nativeElement.style.height = this.getIframeHeight($event.target.innerHeight);
            });
    }

    /**
     * Hide the loading indicator
     * @param $event
     */
    hideLoadingIndicator($event): void {
        setTimeout(() => {
            this.loading = false;
        }, 0);
    }
    /**
     * Validate if the iframe window is send to the login page after jsessionid expired
     * then logout the user from angular session
     */
    checkSessionExpired(): void {
        if (this.iframeElement && this.iframeElement.nativeElement.contentWindow) {
            const currentPath = this.iframeElement.nativeElement.contentWindow.location.pathname;

            if (currentPath.indexOf('/c/portal_public/login') !== -1) {
                this.loginService.logOutUser().subscribe(
                    data => {},
                    error => {
                        this.loggerService.error(error);
                    }
                );
            }
        }
    }

    /**
     * Reload the iframe with the current URL
     * @memberof IframeComponent
     */
    reload(): void {
        if (this.iframeElement && this.iframeElement.nativeElement.contentWindow) {
            this.loading = true;
            this.iframeElement.nativeElement.contentWindow.location.reload();
        }
    }

    getIframeHeight(height: number): string {
        // TODO there is a weird 4px bug here that make unnecessary scroll, need to look into it.
        return height - 64 + 'px';
    }

    get location(): any {
        return this.iframeElement && this.iframeElement.nativeElement.contentWindow
            ? this.iframeElement.nativeElement.contentWindow.location
            : this.DEFAULT_LOCATION;
    }
}
