import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotLanguagesService } from '../../../api/services/dot-languages/dot-languages.service';
import { DotLanguage } from '../../../shared/models/dot-language/dot-language.model';
import { StringPixels } from '../../../api/util/string-pixels-util';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-language-selector',
    templateUrl: './dot-language-selector.component.html',
    styleUrls: ['./dot-language-selector.component.scss']
})
export class DotLanguageSelectorComponent implements OnInit {
    @Input() value: DotLanguage;
    @Output() selected = new EventEmitter<DotLanguage>();

    languagesOptions: DotLanguage[];
    dropdownWidth: string;

    constructor(private dotLanguagesService: DotLanguagesService) {}

    ngOnInit() {
        this.dotLanguagesService
            .get()
            .pipe(take(1))
            .subscribe((languages: DotLanguage[]) => {
                this.languagesOptions = languages;
                this.dropdownWidth = StringPixels.getDropdownWidth(
                    this.languagesOptions.map((languageOption: DotLanguage) => languageOption.language)
                );
            });
    }

    /**
     * Track changes in the dropdown
     * @param {DotLanguage} language
     */
    change(language: DotLanguage): void {
        this.selected.emit(language);
    }
}
