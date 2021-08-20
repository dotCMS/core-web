import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DotEditLayoutDesignerComponent } from '@components/dot-edit-layout-designer/dot-edit-layout-designer.component';
import { map, filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { EditingStateService } from './editing-state.service';

@Injectable({
  providedIn: 'root'
})
export class EditTemplateGuardGuard implements CanDeactivate<DotEditLayoutDesignerComponent> {

  constructor(
    private editingStateService: EditingStateService
  ){
    this.editingStateService.isTheSame.subscribe();
  }

  canDeactivate(
    component: DotEditLayoutDesignerComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // console.log('Trigger');
      // console.log(this.editingStateService.isTheSame);
    return this.editingStateService.isTheSame.pipe(
      filter(res => res),
      map( res => { 
        console.log(res);
        if(res) return true 
      })
    )
  }
  
}
