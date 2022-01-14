import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { DotContentCompareTableData } from '@components/dot-content-compare/store/dot-content-compare.store';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotFormatDateService } from '@services/dot-format-date-service';

@Component({
    selector: 'dot-content-compare-table',
    templateUrl: './dot-content-compare-table.component.html',
    styleUrls: ['./dot-content-compare-table.component.scss']
})
export class DotContentCompareTableComponent {
    @Input() data: DotContentCompareTableData;
    @Input() showDiff: boolean;

    @Output() changeVersion = new EventEmitter<DotCMSContentlet>();
    @Output() changeDiff = new EventEmitter<boolean>();
    @Output() bringBack = new EventEmitter<string>();

    displayOptions = [
        { label: this.dotMessageService.get('diff'), value: true },
        { label: this.dotMessageService.get('plain'), value: false }
    ];

    constructor(
        private dotMessageService: DotMessageService,
        private dotFormatDateService: DotFormatDateService
    ) {}

    /**
     * Formats the label from the modDate, to show the relative date if modDate less than a week
     * and author
     *
     * @param {DotCMSContentlet} item
     * @returns {string}
     * @memberof DotContentCompareTableComponent
     */
    transformVersionItemLabel(item: DotCMSContentlet): string {
        const modDateClean = new Date(item.modDate.replace('- ', ''));
        const currentServerDate = new Date(
            this.dotFormatDateService.formatTZ(new Date(), 'MM/dd/yyyy hh:mm:ss aa')
        );

        const diffDays = this.dotFormatDateService.differenceInCalendarDays(
            currentServerDate,
            modDateClean
        );

        const dateLabel =
            diffDays > 6
                ? item.modDate
                : this.dotFormatDateService.getRelative(
                      new Date(modDateClean).getTime().toString(),
                      currentServerDate
                  );

        const itemLabel = `${dateLabel} ${this.dotMessageService.get('by')} ${item.modUserName}`;

        return itemLabel;
    }
}
