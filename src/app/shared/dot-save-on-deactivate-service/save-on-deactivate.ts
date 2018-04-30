import { Observable } from 'rxjs/Observable';
import { DotDialog } from '../models/dot-confirmation/dot-confirmation.model';

export interface OnSaveDeactivate {
    modelChanged(): boolean;
    onDeactivateSave(): Observable<any>;
    saveWarningMessages(): DotDialog;
}
