import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

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
        dragulaService.over().subscribe(this.toggleOverClass);
        dragulaService.out().subscribe(this.toggleOverClass);

        // (4) ["fields-bag", li.content-types-fields-list__item.gu-transit, span.row-columns__item.row-columns__item--over, ul.content-types-fields-list]

        dragulaService.dropModel().subscribe((value: any) => {
            this.handleDrop(value.name, value.source.dataset.dragType);
        });

        dragulaService.removeModel().subscribe((value) => {
            // this.handleDrop(value[0], value[3].dataset.dragType);
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
            this.dragulaService.createGroup(FieldDragDropService.FIELD_BAG_NAME, {
                copy: this.shouldCopy,
                accepts: this.shouldAccepts,
                moves: this.shouldMovesField,
                copyItem: (item: any) => {
                    console.log('setFieldBagOptions', item);
                    return item;
                }
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
            this.dragulaService.createGroup(FieldDragDropService.FIELD_ROW_BAG_NAME, {
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

<<<<<<< HEAD
    private toggleOverClass([bag, el, target, source]: [string, HTMLElement, HTMLElement, HTMLElement]): void {
        if (target.classList.contains('row-columns__item') && source !== target) {
            target.classList.toggle('row-columns__item--over');
=======
    private toggleOverClass(group: {
        name: string;
        el: Element;
        container: Element;
        source: Element;
    }): void {
        if (group.container.classList.contains('row-columns__item')) {
            group.container.classList.toggle('row-columns__item--over');
>>>>>>> d4030622... Update ng-dragula (WIP)
        }
    }

    private handleDrop(dragType: string, source: string) {
        console.log(dragType, source);
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

    private shouldCopy(el: HTMLElement, source: HTMLElement): boolean {
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
