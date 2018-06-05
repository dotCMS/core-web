import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotContentletEditorService } from '../../services/dot-contentlet-editor.service';
import { DotDialogService } from '../../../../../api/services/dot-dialog';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';

/**
 * Allow user to edit a contentlet to DotCMS instance
 *
 * @export
 * @class DotEditContentletComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-contentlet',
    templateUrl: './dot-edit-contentlet.component.html',
    styleUrls: ['./dot-edit-contentlet.component.scss']
})
export class DotEditContentletComponent implements OnInit {
    @Input() inode: string;
    @Output() load: EventEmitter<boolean> = new EventEmitter();
    @Output() close: EventEmitter<any> = new EventEmitter();

    url: Observable<string>;

    private isContentletModified = false;

    constructor(
        private dotContentletEditorService: DotContentletEditorService,
        private dotDialogService: DotDialogService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.url = this.dotContentletEditorService.editUrl$;

        this.dotMessageService.getMessages([
            'editcontentlet.lose.dialog.header',
            'editcontentlet.lose.dialog.message',
            'editcontentlet.lose.dialog.accept'
        ]).subscribe();
    }

    /**
     * Habdle the before close dialog event
     *
     * @param {*} $event
     * @memberof DotEditContentletComponent
     */
    onBeforeClose($event?: { originalEvent: MouseEvent | KeyboardEvent; close: () => void }): void {
        if (this.isContentletModified) {
            this.dotDialogService.confirm({
                accept: () => {
                    $event.close();
                    this.onClose();
                },
                reject: () => {},
                header: this.dotMessageService.get('editcontentlet.lose.dialog.header'),
                message: this.dotMessageService.get('editcontentlet.lose.dialog.message'),
                footerLabel: {
                    accept: this.dotMessageService.get('editcontentlet.lose.dialog.accept')
                }
            });
        } else {
            this.onClose();
        }
    }

    /**
     * Handle the custome events from the DotDialogIframe component
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onCustomEvent($event) {
        if ($event.detail.name === 'close') {
            this.onBeforeClose();
        }

        if ($event.detail.name === 'edit-contentlet-data-updated') {
            this.isContentletModified = $event.detail.payload;
        }
    }

    /**
     * Call the keyDown method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onKeyDown($event): void {
        if (this.dotContentletEditorService.keyDown) {
            this.dotContentletEditorService.keyDown($event);
        }
    }

    /**
     * Call the load method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onLoad($event): void {
        if (this.dotContentletEditorService.load) {
            this.dotContentletEditorService.load($event);
        }
    }

    private onClose(): void {
        this.dotContentletEditorService.clear();
        this.close.emit();
        this.isContentletModified = false;
    }
}
