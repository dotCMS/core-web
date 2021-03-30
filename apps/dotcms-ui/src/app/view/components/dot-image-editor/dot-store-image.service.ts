import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

// NgRx
import { ComponentStore } from '@ngrx/component-store';

// Services
import { DotImageUrlBuilder } from './services/dot-image-url-builder.service';

// Models
import { EditorState, Params } from './model/image-editor.model';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DotStoreImageService extends ComponentStore<EditorState> {

  constructor(
    private _dotUB: DotImageUrlBuilder,
  ) { 
    super({
      params: {
        brightness: '',
        cropFlipRotate: '',
        crop    : '',
        cropX   : '',
        cropY   : '',
        format  : '',
        fpX     : '',
        fpY     : '',
        hue     : '', 
        quality : '',
        resize  : '',
        rotate  : '',
        flip    : '',
        cropped : false,
        saturation: '',
      },
      url: '',
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
    const url = this._dotUB.buildULR(params);
    return {
      ...state,
      url
    }
  });

  readonly updateParams = this.updater((state: EditorState, params: Params) => {
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
