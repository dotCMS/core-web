import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DotCMSContentlet, DotCMSContentType } from '@dotcms/dotcms-models';
import { DotContentTypeService } from '@services/dot-content-type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DotContentCompareState {
    working: string;
    compare: string;
    versions: DotCMSContentlet[];
    contentType: DotCMSContentType;
}

@Injectable()
export class DotContentCompareStore extends ComponentStore<DotContentCompareState> {
    constructor(private dotContentTypeService: DotContentTypeService) {
        super({ working: null, compare: null, versions: [], contentType: null });
    }

    readonly vm$ = this.state$;

    private readonly versions$: Observable<DotCMSContentlet[]> = this.select(
        (state) => state.versions
    );
    private readonly working$: Observable<string> = this.select((state) => state.working);
    private readonly compare$: Observable<string> = this.select((state) => state.compare);

    //Effects
    // readonly getContentTypeVersions = this.effect((id$: Observable<string>) => {
    //     return id$.pipe(
    //         map((id: string) => {
    //             return dotContentTypeService.getContentTypeHistory(id);
    //         })
    //     );
    // });
}
