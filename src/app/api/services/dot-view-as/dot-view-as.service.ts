import { Injectable } from '@angular/core';
import { DotEditPageViewAs } from '../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';

/**
 * Storage View As preference of the user.
 * @export
 * @class DotViewAsService
 */
@Injectable()
export class DotViewAsService {
    private _selected: DotEditPageViewAs;

    get selected(): DotEditPageViewAs {
        return this._selected;
    }

    set selected(value: DotEditPageViewAs) {
        this._selected = value;
    }
}
