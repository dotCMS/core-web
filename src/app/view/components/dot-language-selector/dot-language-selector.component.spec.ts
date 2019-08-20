import { ComponentFixture, async } from '@angular/core/testing';
import { DotLanguageSelectorComponent } from './dot-language-selector.component';
import { DotLanguagesService } from '@services/dot-languages/dot-languages.service';
import { DotLanguagesServiceMock } from '../../../test/dot-languages-service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DebugElement, Input, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { mockDotLanguage } from '../../../test/dot-language.mock';
import { Dropdown } from 'primeng/primeng';
import { DotLanguage } from '@shared/models/dot-language/dot-language.model';

@Component({
    selector: 'dot-test-component',
    template: `
        <dot-language-selector [value]="value" [contentInode]="contentInode">
        </dot-language-selector>
    `
})
class HostTestComponent {
    @Input()
    value: DotLanguage;

    @Input()
    contentInode: string;
}

describe('DotLanguageSelectorComponent', () => {
    let component: DotLanguageSelectorComponent;
    let fixture: ComponentFixture<HostTestComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [HostTestComponent, DotLanguageSelectorComponent],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: DotLanguagesService,
                    useClass: DotLanguagesServiceMock
                }
            ]
        });

        fixture = DOTTestBed.createComponent(HostTestComponent);
        de = fixture.debugElement;
        component = fixture.debugElement.query(By.css('dot-language-selector')).componentInstance;
    }));

    it('should load languages in the dropdown', () => {
        fixture.detectChanges();
        const decoratedLanguage = {
            ...mockDotLanguage,
            language: `${mockDotLanguage.language} (${mockDotLanguage.countryCode})`
        };
        expect(component.languagesOptions).toEqual([decoratedLanguage]);
    });

    it('should update language in the dropdown when updated from hostcomponent', () => {
        const decoratedLanguage = {
            ...mockDotLanguage,
            language: `${mockDotLanguage.language} (${mockDotLanguage.countryCode})`
        };
        fixture.componentInstance.value = mockDotLanguage;
        fixture.detectChanges();
        expect(component.value).toEqual(decoratedLanguage);
    });

    it('should emit the selected language', () => {
        const pDropDown: DebugElement = de.query(By.css('p-dropdown'));

        spyOn(component.selected, 'emit');
        spyOn(component, 'change').and.callThrough();

        pDropDown.triggerEventHandler('onChange', { value: mockDotLanguage });

        expect(component.change).toHaveBeenCalledWith(mockDotLanguage);
        expect(component.selected.emit).toHaveBeenCalledWith(mockDotLanguage);
    });

    it('shoudl set fixed width to dropdown', () => {
        fixture.detectChanges();
        const pDropDown: Dropdown = de.query(By.css('p-dropdown')).componentInstance;
        expect(pDropDown.style).toEqual({ width: '100px' });
    });
});
