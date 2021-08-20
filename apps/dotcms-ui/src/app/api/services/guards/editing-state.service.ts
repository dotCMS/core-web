import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditingStateService {
  
  public isTheSame = new BehaviorSubject(false);

  change(next: boolean) {
    this.isTheSame.next(next);
  }

}
