import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { DotPageRenderState } from '@portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { mockDotRenderedPageState } from './dot-rendered-page-state.mock';

@Injectable()
export class DotPageStateServiceMock {
    get(_url: string): Observable<DotPageRenderState> {
        return of(mockDotRenderedPageState);
    }
}
