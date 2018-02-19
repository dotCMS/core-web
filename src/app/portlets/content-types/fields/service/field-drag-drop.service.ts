import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs/Subject';

/**
 * Provide method to handle with the Field Types
 */
@Injectable()
export class FieldDragDropService {
    private static readonly FIELD_BAG_NAME = 'fields-bag';
    private static readonly FIELD_ROW_BAG_NAME = 'fields-row-bag';

    private _fieldDropFromSource: Subject<any> = new Subject();
    private _fieldDropFromTarget: Subject<any> = new Subject();
    private _fieldRowDropFromSource: Subject<any> = new Subject();
    private _fieldRowDropFromTarget: Subject<any> = new Subject();

    constructor(private dragulaService: DragulaService) {
        dragulaService.dropModel.subscribe((value) => {
            this.handleDrop(value[0], value[3].dataset.dragType);
        });

        dragulaService.removeModel.subscribe((value) => {
            this.handleDrop(value[0], value[3].dataset.dragType);
        });
    }

    /**
     * Set options for fields bag and rows bag
     *
     * @memberof FieldDragDropService
     */
    setBagOptions(): void {
        this.setFieldBagOptions();
        this.setFieldRowBagOptions();
    }

    /**
     * Set the options for the 'fields-bag' dragula group
     * @memberof FieldDragDropService
     */
    setFieldBagOptions(): void {
        const fieldBagOpts = this.dragulaService.find(FieldDragDropService.FIELD_BAG_NAME);
        if (!fieldBagOpts) {
            this.dragulaService.setOptions(FieldDragDropService.FIELD_BAG_NAME, {
                copy: this.shouldCopy,
                accepts: this.shouldAccepts,
                moves: this.shouldMovesField
            });
        }
    }

    /**
     * Set the options for the 'fields-row-bag' dragula group
     * @memberof FieldDragDropService
     */
    setFieldRowBagOptions(): void {
        const fieldRowBagOpts = this.dragulaService.find(FieldDragDropService.FIELD_ROW_BAG_NAME);
        if (!fieldRowBagOpts) {
            this.dragulaService.setOptions(FieldDragDropService.FIELD_ROW_BAG_NAME, {
                copy: this.shouldCopy,
                moves: this.shouldMoveRow
            });
        }
    }

    get fieldDropFromSource$(): Observable<any> {
        return this._fieldDropFromSource.asObservable();
    }

    get fieldDropFromTarget$(): Observable<any> {
        return this._fieldDropFromTarget.asObservable();
    }

    get fieldRowDropFromSource$(): Observable<any> {
        return this._fieldRowDropFromSource.asObservable();
    }

    get fieldRowDropFromTarget$(): Observable<any> {
        return this._fieldRowDropFromTarget.asObservable();
    }

    private handleDrop(dragType: string, source: string) {
        if (dragType === 'fields-bag') {
            this.handleDropField(dragType, source);
        } else if (dragType === 'fields-row-bag') {
            this.handleDropFieldRow(dragType, source);
        }
    }

    private handleDropField(_dragType: string, source: string) {
        if (source === 'source') {
            this._fieldDropFromSource.next();
        } else if (source === 'target') {
            this._fieldDropFromTarget.next();
        }
    }

    private handleDropFieldRow(_dragType: string, source: string) {
        if (source === 'source') {
            this._fieldRowDropFromSource.next();
        } else if (source === 'target') {
            this._fieldRowDropFromTarget.next();
        }
    }

    private shouldCopy(_el: HTMLElement, source: HTMLElement, _handle: HTMLElement, _sibling: HTMLElement): boolean {
        return source.dataset.dragType === 'source';
    }

    private shouldMoveRow(_el: HTMLElement, source: HTMLElement, handle: HTMLElement, _sibling: HTMLElement): boolean {
        const isDragButton =
            handle.parentElement.classList.contains('row-header__drag') ||
            handle.classList.contains('row-header__drag');
        return source.dataset.dragType === 'source' || isDragButton;
    }

    private shouldAccepts(_el: HTMLElement, source: HTMLElement, _handle: HTMLElement, _sibling: HTMLElement): boolean {
        return source.dataset.dragType !== 'source';
    }

    private shouldMovesField(el: HTMLElement, _source: HTMLElement, _handle: HTMLElement, _sibling: HTMLElement): boolean {
        return el.dataset.dragType !== 'not_field';
    }
}
