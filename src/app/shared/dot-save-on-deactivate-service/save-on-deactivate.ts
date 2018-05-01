import { Observable } from 'rxjs/Observable';
import { DotDialog } from '../models/dot-confirmation/dot-confirmation.model';

export interface OnSaveDeactivate {
    isModelChanged(): boolean;
    onDeactivateSave(): Observable<any>;
    getSaveWarningMessages(): DotDialog;
}
