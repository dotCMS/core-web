import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class DotTemplateStore extends ComponentStore<DotTemplate> {
    constructor() {
        super(null);
    }

    readonly name$: Observable<string> = this.select((state: DotTemplate) => state.name);
}
