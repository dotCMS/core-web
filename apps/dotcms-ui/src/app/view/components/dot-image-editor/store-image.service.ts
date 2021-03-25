import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

// NgRx
import { ComponentStore } from '@ngrx/component-store';

// Services
import { UrlValidatorService } from './service/url-validator.service';

// Models
import { EditorState, Params } from './model/image-editor.model';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreImageService extends ComponentStore<EditorState> {

  constructor(
    private urlValidatorService: UrlValidatorService,
  ) { 
    super({
      params: {
        brightness: '',
        cropFlipRotate: '',
        cropX   : '',
        cropY   : '',
        format  : '',
        fpX     : '',
        fpY     : '',
        hue     : '', 
        quality : '',
        resize  : '',
        rotate  : '',
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
    const url = this.urlValidatorService.buildULR(params);
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
