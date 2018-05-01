import { Observable } from 'rxjs/Observable';
import { DotDialog } from '../models/dot-confirmation/dot-confirmation.model';
import { ResponseView } from 'dotcms-js/dotcms-js';

export interface OnSaveDeactivate {
    isModelChanged(): boolean;
    onDeactivateSave(): Observable<any>;
    onDeactivateSaveError(response: ResponseView): void;
    getSaveWarningMessages(): DotDialog;
}
