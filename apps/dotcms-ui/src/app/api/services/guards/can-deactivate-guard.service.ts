import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanDesactiveGuardService implements CanDeactivate<unknown> {
  
  private _canBeDesactivated = new BehaviorSubject(true);
  private _showAlert = new BehaviorSubject(false);

  get showAlert$() {
    return this._showAlert;
  }

  changeState(next: boolean) {
    this._canBeDesactivated.next(next);
  }

  canDeactivate(): Observable<boolean>{
    return this._canBeDesactivated.pipe(
      filter(res => {
        this._showAlert.next(!res);
        return res;
      })
    )
  }
}
