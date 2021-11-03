import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent as observableFromEvent, Subject } from 'rxjs';

@Component({
    selector: 'dot-palette-input-filter',
    templateUrl: './dot-palette-input-filter.component.html',
    styleUrls: ['./dot-palette-input-filter.component.scss']
})
export class DotPaletteInputFilterComponent implements OnInit {
    @Input() goBackBtn: boolean;
    @Output() goBack: EventEmitter<boolean> = new EventEmitter();
    @Output() filter: EventEmitter<string> = new EventEmitter();

    @ViewChild('searchInput', { static: true })
    searchInput: ElementRef;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor() {}

    ngOnInit() {
        observableFromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500), takeUntil(this.destroy$))
            .subscribe((keyboardEvent: Event) => {
                this.filter.emit(keyboardEvent.target['value']);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
