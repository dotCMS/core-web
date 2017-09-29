import { Injectable } from '@angular/core';
import { ContentletService } from '../../../api/services/contentlet.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StructureTypeView } from '../../../shared/models/contentlet';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';
import { MenuItem } from 'primeng/primeng';
import { DotcmsEventsService } from 'dotcms-js/dotcms-js';

@Injectable()
export class ToolbarAddContenletService {
    main$: BehaviorSubject<StructureTypeView[]> = new BehaviorSubject([]);
    more$: BehaviorSubject<StructureTypeView[]> = new BehaviorSubject([]);
    recent$: BehaviorSubject<StructureTypeView[]> = new BehaviorSubject([]);

    constructor(
        private contentletService: ContentletService,
        private dotcmsEventsService: DotcmsEventsService
    ) {
        this.loadData();
        dotcmsEventsService
            .subscribeToEvents([
                'SAVE_BASE_CONTENT_TYPE',
                'UPDATE_BASE_CONTENT_TYPE',
                'DELETE_BASE_CONTENT_TYPE'
            ])
            .subscribe(() => {
                this.reloadContentlets();
            });
    }

    private loadData() {
        this.contentletService
            .getMainContentTypes()
            .subscribe((structureTypeViews: StructureTypeView[]) => {
                this.main$.next(structureTypeViews);
            });

        this.contentletService
            .getMoreContentTypes()
            .subscribe((structureTypeViews: StructureTypeView[]) => {
                this.more$.next(structureTypeViews);
            });

        this.contentletService
            .getRecentContentTypes()
            .subscribe((structureTypeViews: StructureTypeView[]) => {
                this.recent$.next(structureTypeViews);
            });
    }

    private reloadContentlets() {
        this.contentletService.reloadContentTypes().subscribe(() => {
            this.loadData();
        });
    }
}
