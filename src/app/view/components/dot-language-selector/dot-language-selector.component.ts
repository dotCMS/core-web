import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotLanguagesService } from '../../../api/services/dot-languages/dot-languages.service';
import { DotLanguage } from '../../../shared/models/dot-language/dot-language.model';
import { Observable } from 'rxjs/Observable';
import { StringPixels } from '../../../api/util/stringPixels';
import { tap, take } from 'rxjs/operators';

@Component({
    selector: 'dot-language-selector',
    templateUrl: './dot-language-selector.component.html',
    styleUrls: ['./dot-language-selector.component.scss']
})
export class DotLanguageSelectorComponent implements OnInit {
    @Input() value: DotLanguage;
    @Output() selected = new EventEmitter<DotLanguage>();

    languagesOptions: DotLanguage[];
    arrowDropdownlComponentSize = 32;
    dropdownWidth: string;

    constructor(private dotLanguagesService: DotLanguagesService, private stringPixels: StringPixels) {}

    ngOnInit() {
        this.dotLanguagesService
            .get()
            .pipe(take(1))
            .subscribe((languages: DotLanguage[]) => {
                this.languagesOptions = languages;
                this.setDropdownWidth(languages);
            });
    }

    /**
     * Track changes in the dropdown
     * @param {DotLanguage} language
     */
    change(language: DotLanguage): void {
        this.selected.emit(language);
    }

    private setDropdownWidth(languagesOptions: DotLanguage[]): void {
        const maxTextOption = _.maxBy(languagesOptions, (languageOption: DotLanguage) => languageOption.language.length).language;
        const dropdownSize = this.stringPixels.getTextWidth(maxTextOption) + this.arrowDropdownlComponentSize;
        this.dropdownWidth = `${dropdownSize}px`;
    }
}
