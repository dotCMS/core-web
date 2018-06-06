import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import { DotTheme } from '../../../shared/models/dot-theme.model';
import { Site } from 'dotcms-js/core/treeable/shared/site.model';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { PaginatorService } from '../../../../../api/services/paginator/paginator.service';

@Component({
    selector: 'dot-theme-selector',
    templateUrl: './dot-theme-selector.component.html',
    styleUrls: ['./dot-theme-selector.component.scss']
})
export class DotThemeSelectorComponent implements OnInit {
    themes: DotTheme[];
    @Input() value: any;
    @Output() selected = new EventEmitter<DotTheme>();
    current: DotTheme;
    initialValue: DotTheme;
    visible: boolean;

    constructor(
        private dotThemesService: DotThemesService,
        public dotMessageService: DotMessageService,
        public paginationService: PaginatorService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['editpage.layout.theme.header', 'editpage.layout.theme.search', 'dot.common.apply', 'dot.common.cancel'])
            .subscribe();
        this.setCurrentTheme();
        this.loadHostThemes();

        this.paginationService.url = 'v1/themes';







    //         getByIdentifier(identifier?: string): Observable<DotTheme[]> {
    //         const params = identifier ? { hostId: identifier } : {};
    //     return this.coreWebService
    //         .requestView({
    //             method: RequestMethod.Get,
    //             url: 'v1/themes',
    //             params: params
    //         })
    //         .pluck('entity');
    // }


    }

    siteChange(site: Site) {
        this.loadHostThemes(site.identifier);
    }

    selectTheme(theme: DotTheme) {
        this.current = theme;
    }

    apply() {
        this.selected.emit(this.current);
        this.initialValue = this.current;
        this.toogleDialog();
    }

    toogleDialog() {
        this.visible = !this.visible;
        if (this.visible) {
            this.setCurrentTheme();
        }
    }

    private setCurrentTheme() {
        if (this.initialValue) {
            this.current = this.initialValue;
        } else {
            this.dotThemesService.get(this.value).subscribe((response: DotTheme[]) => {
                this.initialValue = response[0];
                this.current = response[0];
            });
        }
    }

    private loadHostThemes(identifier?: string) {
        this.dotThemesService.getByIdentifier(identifier).subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
    }
}
