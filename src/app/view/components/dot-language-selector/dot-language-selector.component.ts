import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotLanguagesService } from '../../../api/services/dot-languages/dot-languages.service';
import { SelectItem } from 'primeng/primeng';
import { DotLanguage } from '../../../shared/models/dot-language/dot-language.model';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'dot-language-selector',
    templateUrl: './dot-language-selector.component.html',
    styleUrls: ['./dot-language-selector.component.scss']
})
export class DotLanguageSelectorComponent implements OnInit {
    @Input() value: DotLanguage;
    @Output() selectedLanguage = new EventEmitter<DotLanguage>();

    languagesOptions: Observable<DotLanguage[]>;

    constructor(private dotLanguagesService: DotLanguagesService) {}

    ngOnInit() {
        this.languagesOptions = this.dotLanguagesService.get();
    }

    /**
     * Track changes in the dropwdow
     * @param {DotLanguage} language
     */
    changeLanguage(language: DotLanguage) {
        this.selectedLanguage.emit(language);
    }
}
