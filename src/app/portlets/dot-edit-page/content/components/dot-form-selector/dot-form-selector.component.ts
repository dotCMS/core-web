import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { PaginatorService } from '@services/paginator';
import { DotCMSContentType } from 'dotcms-models';
import { DotMessageService } from '@services/dot-messages-service';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { take } from 'rxjs/operators';
import { DotDialogComponent } from '@components/dot-dialog/dot-dialog.component';

@Component({
    providers: [PaginatorService],
    selector: 'dot-form-selector',
    templateUrl: './dot-form-selector.component.html',
    styleUrls: ['./dot-form-selector.component.scss']
})
export class DotFormSelectorComponent implements OnInit, OnChanges {
    @Input()
    show = false;

    @Output()
    select = new EventEmitter<DotCMSContentType>();

    @Output()
    close = new EventEmitter<any>();

    @ViewChild('datatable')
    datatable: DataTable;

    @ViewChild('dialog')
    dialog: DotDialogComponent;

    items: DotCMSContentType[];
    contentMinHeight: number;
    messages: {
        [key: string]: string;
    } = {};

    constructor(
        public paginatorService: PaginatorService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['contenttypes.form.name', 'Select', 'modes.Add-Form'])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
            });

        this.paginatorService.url = 'v1/contenttype?type=FORM';
    }
    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            if (changes.show.currentValue === true) {
                this.contentMinHeight =
                    this.dialog.dialog.nativeElement.getBoundingClientRect().height - 100;
            }
        }, 0);
    }

    /**
     * Call when click on any pagination link
     *
     * @param LazyLoadEvent event
     * @memberof DotFormSelectorComponent
     */
    loadData(event: LazyLoadEvent): void {
        this.paginatorService
            .getWithOffset(event.first)
            .pipe(take(1))
            .subscribe((items: DotCMSContentType[]) => {
                this.items = items;
            });
    }
}
