import {
    Component,
    Input,
    EventEmitter,
    Output,
    HostBinding,
    ViewChild,
    ElementRef,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'dot-dialog',
    templateUrl: './dot-dialog.component.html',
    styleUrls: ['./dot-dialog.component.scss']
})
export class DotDialogComponent implements OnChanges {
    @ViewChild('dialog')
    dialog: ElementRef;

    @Input()
    @HostBinding('class.active')
    visible: boolean;

    @Input()
    header = '';

    @Input()
    actions: DotDialogActions;

    @Input()
    closeable = true;

    @Input()
    contentStyle: {
        [key: string]: string;
    };

    @Input()
    headerStyle: {
        [key: string]: string;
    };

    @Input()
    width: string;

    @Input()
    height: string;

    @Input()
    hideButtons: boolean;

    @Output()
    hide: EventEmitter<any> = new EventEmitter();

    @Output()
    beforeClose: EventEmitter<{
        close: () => void;
    }> = new EventEmitter();

    @Output()
    visibleChange: EventEmitter<any> = new EventEmitter();

    isContentScrolled: boolean;

    private subscription: Subscription[] = [];

    constructor(private el: ElementRef) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible && changes.visible.currentValue) {
            this.bindEvents();
        }
    }

    /**
     * Accept button handler
     *
     * @memberof DotDialogComponent
     */
    acceptAction(): void {
        if (this.actions && this.canTriggerAction(this.actions.accept)) {
            this.actions.accept.action(this);
            this.unBindEvents();
        }
    }

    /**
     * Cancel button handler
     *
     * @memberof DotDialogComponent
     */
    cancelAction(): void {
        this.close();

        if (this.actions && this.canTriggerAction(this.actions.cancel)) {
            this.actions.cancel.action(this);
        }
    }

    /**
     * Close dialog
     *
     * @memberof DotDialogComponent
     */
    close($event?: MouseEvent): void {
        if (this.beforeClose.observers.length) {
            this.beforeClose.emit({
                close: () => {
                    this.handleClose();
                }
            });
        } else {
            this.handleClose();
        }

        if ($event) {
            $event.preventDefault();
        }
    }

    /**
     * Handle scroll event in the content
     *
     * @param {{ target: HTMLInputElement }} event
     * @memberof DotDialogComponent
     */
    onContentScroll(event: { target: HTMLInputElement }) {
        /*
            Absolute positioned overlays panels (in dropdowns, menus, etc...) inside the
            dialog content needs to be append to the body, this click is to hide them on
            scroll because they mantain their position relative to the body.
        */
        event.target.click();

        this.isContentScrolled = event.target.scrollTop > 0;
    }

    private bindEvents(): void {
        this.subscription.push(
            fromEvent(document, 'keydown').subscribe(this.handleKeyboardEvents.bind(this))
        );

        this.subscription.push(
            fromEvent(this.el.nativeElement, 'click')
                .pipe(
                    filter((event: MouseEvent) => {
                        const el = <HTMLElement>event.target;
                        return el.localName !== 'dot-dialog' && el.classList.contains('active');
                    })
                )
                .subscribe(this.close.bind(this))
        );
    }

    private canTriggerAction(item: DialogButton): boolean {
        return item && !item.disabled && !!item.action;
    }

    private handleClose(): void {
        this.visibleChange.emit(false);
        this.hide.emit();
        this.unBindEvents();
    }

    private handleKeyboardEvents(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Escape':
                this.cancelAction();
                break;
            case 'Enter':
                this.acceptAction();
                break;
            default:
                break;
        }
    }

    private unBindEvents(): void {
        this.subscription.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }
}

interface DialogButton {
    action?: (dialog?: any) => void;
    disabled?: boolean;
    label: string;
}

export interface DotDialogActions {
    accept?: DialogButton;
    cancel?: DialogButton;
}
