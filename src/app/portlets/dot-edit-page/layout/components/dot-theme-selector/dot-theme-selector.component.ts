import { Component, OnInit } from '@angular/core';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import { DotTheme } from '../../../shared/models/dot-theme.model';

@Component({
    selector: 'dot-theme-selector',
    templateUrl: './dot-theme-selector.component.html',
    styleUrls: ['./dot-theme-selector.component.scss']
})
export class DotThemeSelectorComponent implements OnInit {
    themes: DotTheme[];
    selectedTheme: DotTheme;

    constructor(private dotThemesService: DotThemesService) {}

    ngOnInit() {
        this.dotThemesService.get().subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
    }
}
