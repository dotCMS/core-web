import {
    Component,
    Input,
    EventEmitter,
    Output,
    HostBinding,
    HostListener,
    ViewChild,
    ElementRef,
    OnInit
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dot-dialog',
    templateUrl: './dot-dialog.component.html',
    styleUrls: ['./dot-dialog.component.scss']
})
export class DotDialogComponent implements OnInit {
    @ViewChild('content')
    content: ElementRef;

    @ViewChild('headerEl')
    headerEl: ElementRef;

    @Input()
    @HostBinding('class.active')
    show: boolean;

    @Input()
    header = '';

    @Input()
    ok: DotDialogAction;

    @Input()
    cancel: DotDialogAction;

    @Output()
    close: EventEmitter<any> = new EventEmitter();

    contentScrolled$: Observable<boolean>;

    constructor() {}

    ngOnInit() {
        this.contentScrolled$ = fromEvent(this.content.nativeElement, 'scroll').pipe(
            map((e: { target: HTMLInputElement; }) => e.target.scrollTop > 0)
        );
    }

    @HostListener('click', ['$event.target'])
    closeDialogByMask(target: HTMLElement) {
        if (target.className === 'active') {
            this.closeDialog();
        }
    }

    /**
     * Action when pressed Cancel button
     *
     * @memberof DotDialogComponent
     */
    cancelAction(): void {
        this.closeDialog();
        this.cancel.action(this);
    }

    /**
     * Callback when dialog hide
     *
     * @memberof DotDialogComponent
     */
    closeDialog(): void {
        this.show = false;
        this.close.emit();
    }
}

export interface DotDialogAction {
    action: (dialog: any) => void;
    disabled?: boolean;
    label: string;
}
