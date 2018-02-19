import { Component, ViewEncapsulation, Input, OnInit, AfterViewChecked } from '@angular/core';
import { FormatDateService } from '../../../../api/services/format-date-service';
import { Subject } from 'rxjs/Subject';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-custom-time',
    styleUrls: ['./custom-time.scss'],
    templateUrl: 'custom-time.html'
})
export class CustomTimeComponent implements OnInit, AfterViewChecked {
    @Input() time;

    private formattedTime: Subject<string> = new Subject();

    constructor(private formatDateService: FormatDateService) {}

    ngOnInit(): void {
        this.formattedTime.next(this.formatDateService.getRelative(this.time));
    }

    // TODO: this it's running every time the UI changes no matter where, need to fix it, should only run when custom-time shows
    ngAfterViewChecked(): void {
        // TODO: this is triggering even when open other dropdown component instance, need to check that.
        this.formattedTime.next(this.formatDateService.getRelative(this.time));
    }
}
