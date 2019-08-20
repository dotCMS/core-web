import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { DotLanguagesService } from '@services/dot-languages/dot-languages.service';
import { DotLanguage } from '@models/dot-language/dot-language.model';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-language-selector',
    templateUrl: './dot-language-selector.component.html',
    styleUrls: ['./dot-language-selector.component.scss']
})
export class DotLanguageSelectorComponent implements OnInit, OnChanges {
    @Input()
    value: DotLanguage;
    @Input()
    contentInode: string;
    @Output()
    selected = new EventEmitter<DotLanguage>();

    languagesOptions: DotLanguage[];

    constructor(private dotLanguagesService: DotLanguagesService) {}

    ngOnInit() {
        this.dotLanguagesService
            .get(this.contentInode)
            .pipe(take(1))
            .subscribe((languages: DotLanguage[]) => {
                this.languagesOptions = languages.map((language: DotLanguage) =>
                    this.decorateLabel(language)
                );
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value && changes.value.currentValue) {
            this.value = this.decorateLabel(changes.value.currentValue);
        }
    }

    /**
     * Track changes in the dropdown
     * @param DotLanguage language
     */
    change(language: DotLanguage): void {
        this.selected.emit(language);
    }

    private decorateLabel(language: DotLanguage): DotLanguage {
        const countryCodeLabel = language.countryCode ? ` (${language.countryCode})` : '';
        return { ...language, language: `${language.language}${countryCodeLabel}` };
    }
}
