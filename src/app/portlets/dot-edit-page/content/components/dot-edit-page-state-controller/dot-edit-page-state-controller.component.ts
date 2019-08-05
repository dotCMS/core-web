import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SelectItem } from 'primeng/primeng';

import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotEditPageLockInfoComponent } from './components/dot-edit-page-lock-info/dot-edit-page-lock-info.component';
import { DotMessageService } from '@services/dot-messages-service';
import { DotPageStateService } from '../../services/dot-page-state/dot-page-state.service';
import {
    DotRenderedPageState,
    PageMode,
    DotPageState
} from '@portlets/dot-edit-page/shared/models';
import { DotPersonalizeService } from '@services/dot-personalize/dot-personalize.service';

enum DotConfirmationType {
    LOCK,
    PERSONALIZATION
}

interface DotConfirmationResponse {
    type: DotConfirmationType;
    state: DotPageState;
}

@Component({
    selector: 'dot-edit-page-state-controller',
    templateUrl: './dot-edit-page-state-controller.component.html',
    styleUrls: ['./dot-edit-page-state-controller.component.scss']
})
export class DotEditPageStateControllerComponent implements OnInit, OnChanges {
    @ViewChild('pageLockInfo') pageLockInfo: DotEditPageLockInfoComponent;

    @Input() pageState: DotRenderedPageState;

    lock: boolean;
    mode: PageMode;
    options$: Observable<SelectItem[]>;

    private messages: { [key: string]: string } = {};

    constructor(
        private dotAlertConfirmService: DotAlertConfirmService,
        private dotMessageService: DotMessageService,
        private dotPageStateService: DotPageStateService,
        private dotPersonalizeService: DotPersonalizeService
    ) {}

    ngOnInit() {
        this.options$ = this.dotMessageService
            .getMessages([
                'editpage.toolbar.edit.page',
                'editpage.toolbar.live.page',
                'editpage.toolbar.preview.page',
                'editpage.content.steal.lock.confirmation.message.header',
                'editpage.content.steal.lock.confirmation.message'
            ])
            .pipe(
                tap((messages: { [key: string]: string }) => {
                    this.messages = messages;
                }),
                map(() => this.getStateModeOptions(this.pageState))
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setFieldsModels(changes.pageState.currentValue);
    }

    /**
     * Handler locker change event
     *
     * @memberof DotEditPageToolbarComponent
     */
    lockPageHandler(): void {
        if (this.shouldAskToLock()) {
            this.showLockConfirmDialog().then(() => {
                this.setLockerState();
            });
        } else {
            this.setLockerState();
        }
    }

    /**
     * Handle the click to the locker switch
     *
     * @memberof DotEditPageStateControllerComponent
     */
    onLockerClick(): void {
        if (!this.pageState.page.canLock) {
            this.pageLockInfo.blinkLockMessage();
        }
    }

    /**
     * Handle state selector change event
     *
     * @param {PageMode} mode
     * @memberof DotEditPageStateControllerComponent
     */
    // tslint:disable-next-line: cyclomatic-complexity
    stateSelectorHandler(mode: PageMode): void {
        if (mode === PageMode.EDIT && this.shouldShowConfirmation()) {
            this.lock = true;
            this.showConfirmation().then(({ type, state }: DotConfirmationResponse) => {
                if (type === DotConfirmationType.PERSONALIZATION) {
                    this.dotPersonalizeService
                        .personalized(
                            this.pageState.page.identifier,
                            this.pageState.viewAs.persona.keyTag
                        )
                        .pipe(take(1))
                        .subscribe(() => {
                            this.updatePageState(state);
                        });
                } else {
                    this.updatePageState(state);
                }
            });
        } else {
            this.updatePageState({
                mode: this.mode
            });
        }
    }

    private showConfirmation(): Promise<DotConfirmationResponse> {
        return new Promise((resolve) => {
            if (this.shouldAskToLock()) {
                this.showLockConfirmDialog().then(() => {
                    resolve({
                        type: DotConfirmationType.LOCK,
                        state: {
                            mode: this.mode,
                            locked: this.lock
                        }
                    });
                });
            }

            if (this.shouldAskPersonalization()) {
                this.showPersonalizationConfirmDialog().then(() => {
                    resolve({
                        type: DotConfirmationType.PERSONALIZATION,
                        state: {
                            mode: this.mode
                        }
                    });
                });
            }
        });
    }

    private canTakeLock(pageState: DotRenderedPageState): boolean {
        return pageState.page.canLock && pageState.state.lockedByAnotherUser;
    }

    private getModeOption(mode: string, pageState: DotRenderedPageState): SelectItem {
        const disabled = {
            edit: !pageState.page.canEdit || !pageState.page.canLock,
            preview: !pageState.page.canRead,
            live: !pageState.page.liveInode
        };

        return {
            label: this.messages[`editpage.toolbar.${mode}.page`],
            value: PageMode[mode.toLocaleUpperCase()],
            disabled: disabled[mode]
        };
    }

    private isPersonalized(): boolean {
        return this.pageState.viewAs.persona && this.pageState.viewAs.persona.personalized;
    }

    private getStateModeOptions(pageState: DotRenderedPageState): SelectItem[] {
        return ['edit', 'preview', 'live'].map((mode: string) =>
            this.getModeOption(mode, pageState)
        );
    }

    private setFieldsModels(pageState: DotRenderedPageState): void {
        this.lock = pageState.state.locked && !this.canTakeLock(pageState);
        this.mode = pageState.state.mode;
    }

    private setLockerState() {
        if (!this.lock && this.mode === PageMode.EDIT) {
            this.mode = PageMode.PREVIEW;
        }

        this.updatePageState({
            mode: this.mode,
            locked: this.lock
        });
    }

    private shouldAskToLock(): boolean {
        return this.pageState.page.canLock && this.pageState.state.lockedByAnotherUser;
    }

    private shouldAskPersonalization(): boolean {
        return this.pageState.viewAs.persona && !this.isPersonalized();
    }


    private shouldShowConfirmation(): boolean {
        return this.shouldAskToLock() || this.shouldAskPersonalization();
    }

    private showLockConfirmDialog(): Promise<any> {
        return new Promise((resolve) => {
            this.dotAlertConfirmService.confirm({
                accept: resolve,
                reject: () => {
                    this.lock = this.pageState.state.locked;
                    this.mode = this.pageState.state.mode;
                },
                header: this.messages['editpage.content.steal.lock.confirmation.message.header'],
                message: this.messages['editpage.content.steal.lock.confirmation.message']
            });
        });
    }

    private showPersonalizationConfirmDialog(): Promise<any> {
        return new Promise((resolve) => {
            this.dotAlertConfirmService.confirm({
                accept: resolve,
                reject: () => {
                    this.lock = this.pageState.state.locked;
                    this.mode = this.pageState.state.mode;
                },
                header: 'Personalization',
                message: this.getPersonalizationConfirmMessage()
            });
        });
    }

    private getPersonalizationConfirmMessage(): string {
        let message = `<p>Are you sure you want to personalize the content for <b>${
            this.pageState.viewAs.persona.name
        }</b>?</p>`;

        if (this.shouldAskToLock()) {
            message += `<p><b>NOTE:</b>This page is is locked by <b>${
                this.pageState.page.lockedByName
            }</b>, you'll be also stealing the lock for this user.</p>`;
        }
        return message;
    }

    private updatePageState(params: DotPageState) {
        this.dotPageStateService.set(this.pageState.page, params);
    }
}
