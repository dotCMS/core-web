import { BaseComponent } from '../_common/_base/base-component';
import { Component, Output, EventEmitter, Input, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoginService, User } from 'dotcms-js/dotcms-js';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { PaginatorService } from '../../../api/services/paginator';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';
import { DotNavigationService } from '../dot-navigation/dot-navigation.service';
import { DotEventsService } from '../../../api/services/dot-events/dot-events.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-login-as',
    styleUrls: ['./login-as.scss'],
    templateUrl: 'login-as.html'
})
export class LoginAsComponent extends BaseComponent implements OnInit {
    @Output() cancel = new EventEmitter<boolean>();
    @Input() visible: boolean;
    @ViewChild('password') passwordElem: ElementRef;

    form: FormGroup;
    needPassword = false;
    userCurrentPage: User[];
    errorMessage: string;

    constructor(
        dotMessageService: DotMessageService,
        private dotEventsService: DotEventsService,
        private fb: FormBuilder,
        private loginService: LoginService,
        public paginationService: PaginatorService,
        private iframeOverlayService: IframeOverlayService,
        private dotNavigationService: DotNavigationService
    ) {
        super(
            [
                'Change',
                'cancel',
                'loginas.select.loginas.user',
                'loginas.input.loginas.password',
                'loginas.error.wrong-credentials',
                'login-as'
            ],
            dotMessageService
        );
    }

    ngOnInit(): void {
        this.paginationService.url = 'v2/users/loginAsData';
        this.getUsersList();

        this.form = this.fb.group({
            loginAsUser: new FormControl('', Validators.required),
            password: ''
        });
    }

    close(): boolean {
        this.cancel.emit(true);
        return false;
    }

    doLoginAs(): void {
        this.errorMessage = '';
        const password: string = this.form.value.password;
        const user: User = this.form.value.loginAsUser;
        this.loginService.loginAs({ user: user, password: password }).subscribe(
            (data) => {
                if (data) {
                    this.close();
                    this.iframeOverlayService.hide();
                    this.dotNavigationService.goToFirstPortlet();
                    this.dotEventsService.notify('login-as');
                }
            },
            (response) => {
                if (response.entity) {
                    this.errorMessage = response.errorsMessages;
                } else {
                    this.errorMessage = this.i18nMessages['loginas.error.wrong-credentials'];
                    this.passwordElem.nativeElement.focus();
                }
            }
        );
    }

    userSelectedHandler(user: User): void {
        this.needPassword = user.requestPassword || false;
    }

    /**
     * Call to load a new page of user.
     * @param {string} [filter='']
     * @param {number} [page=1]
     * @memberof SiteSelectorComponent
     */
    getUsersList(filter = '', offset = 0): void {
        this.paginationService.filter = filter;
        this.paginationService.getWithOffset(offset).subscribe((items) => {
            // items.splice(0) is used to return a new object and trigger the change detection in angular
            this.userCurrentPage = items.splice(0);
        });
    }

    /**
     * Call when the user global serach changed
     * @param {any} filter
     * @memberof SiteSelectorComponent
     */
    handleFilterChange(filter): void {
        this.getUsersList(filter);
    }

    /**
     * Call when the current page changed
     * @param {any} event
     * @memberof SiteSelectorComponent
     */
    handlePageChange(event): void {
        this.getUsersList(event.filter, event.first);
    }
}
