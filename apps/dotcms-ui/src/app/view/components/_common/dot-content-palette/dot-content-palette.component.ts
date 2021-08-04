import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { DotCMSContentType } from '@dotcms/dotcms-models';
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DotContentletEditorService } from '@components/dot-contentlet-editor/services/dot-contentlet-editor.service';

@Component({
    selector: 'dot-content-palette',
    templateUrl: './dot-content-palette.component.html',
    styleUrls: ['./dot-content-palette.component.scss']
})
export class DotContentPaletteComponent implements OnInit, OnDestroy {
    @Input() items: DotCMSContentType[];
    @Output() filterChange: EventEmitter<string> = new EventEmitter();

    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private dotContentletEditorService: DotContentletEditorService) {}

    ngOnInit(): void {
        observableFromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500), takeUntil(this.destroy$))
            .subscribe((keyboardEvent: Event) => {
                this.filterChange.emit(keyboardEvent.target['value']);
            });
    }

    dragStart(event: DragEvent, item: DotCMSContentType): void {
        const element = event.target as HTMLAnchorElement;
        const data = { variable: item.variable, id: item.id };
        this.dotContentletEditorService.setDraggedContentType(item);
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        element.classList.toggle('dragging');
    }

    dragEnd(event: DragEvent): void {
        const element = event.target as HTMLAnchorElement;
        element.classList.toggle('dragging');
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
