import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, pluck, startWith } from 'rxjs/operators';

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
        const type$ = this.activatedRoute.params.pipe(
            pluck('type'),
            filter((type: string) => !!type)
        );

        this.template$ = this.activatedRoute.data.pipe(
            pluck('template'),
            filter((template) => !!template),
            startWith({
                identifier: '',
                title: '',
                friendlyName: '',
                layout: {
                    header: true,
                    footer: true,
                    body: {
                        rows: []
                    },
                    sidebar: null,
                    title: '',
                    width: null
                },
                containers: {}
            })
        );

        this.isAdvaced$ = type$.pipe(
            map((type: string) => type === 'advanced'),
            mergeMap((isAdvanced: boolean) => {
                return this.template$.pipe(
                    pluck('drawed'),
                    map((isDrawed: boolean) => isDrawed === false || isAdvanced)
                );
            })
        );
    }
}
