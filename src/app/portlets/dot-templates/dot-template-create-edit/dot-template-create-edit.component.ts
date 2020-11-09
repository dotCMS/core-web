import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';

@Component({
    selector: 'dot-dot-template-create-edit',
    templateUrl: './dot-template-create-edit.component.html',
    styleUrls: ['./dot-template-create-edit.component.scss']
})
export class DotTemplateCreateEditComponent implements OnInit {
    isAdvaced$: Observable<boolean>;
    template$: Observable<DotTemplate>;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const type$ = this.activatedRoute.params.pipe(pluck('type'));
        this.template$ = this.activatedRoute.data.pipe(pluck('template'));

        this.isAdvaced$ = type$.pipe(
            map((type: string) => type === 'advanced'),
            mergeMap((isAdvanced: boolean) =>
                this.template$.pipe(
                    pluck('drawed'),
                    map((isDrawed: boolean) => !isDrawed || isAdvanced)
                )
            )
        );
    }
}
