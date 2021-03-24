import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

// NgRx
import { ComponentStore } from '@ngrx/component-store';

// Models
import { EditorState, Params } from './model/image-editor.model';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreImageService extends ComponentStore<EditorState> {

  constructor() { 
    super({
      params: {
        cropFlipRotate: '',
        format: '_q/100',
        fp: '',
        HBS: '',
        brightness: '',
        hue: '', 
        saturation: '',
        quality: '/quality',
        resize: '',
      },
      url: '_q/100/quality',
      loading: false,
    });
  }

  // SELECTOR
  readonly state: Observable<EditorState> = this.select((state) => state);

  // UPDATERS
  readonly setLoading = this.updater((state: EditorState, loading: boolean)=>{
    return {
      ...state,
      loading
    }
  })

  readonly updateURL = this.updater((state: EditorState, params: Params) => {
    const url = params.cropFlipRotate + params.HBS + params.format + params.quality + params.fp;
    return {
      ...state,
      url
    }
  });

  readonly updateParams = this.updater((state: EditorState, params: Params) => {
    console.log('UpdateParam',params);
    return {
      ...state,
      params
    }
  });

  // EFFECTS
  readonly changeURL = this.effect((params: Observable<Params>) => {
    this.setLoading(true);
    return params.pipe(
      tap({
        next: (params) => this.updateURL(params),
        // error: (e) => this.updateError(e)
      }),
      finalize(()=>this.setLoading(true)),
      catchError(()=>EMPTY)
    )
  })

}
