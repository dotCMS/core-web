import { forwardRef, Input } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs';

import { SiteService } from 'dotcms-js';

import { DotThemeSelectorDropdownComponent } from './dot-theme-selector-dropdown.component';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { PaginatorService } from '@services/paginator';
import { By } from '@angular/platform-browser';
import { mockDotThemes } from '@tests/dot-themes.mock';

@Component({
    selector: 'dot-searchable-dropdown',
    template: ``,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TestSearchableComponent)
        }
    ]
})
class TestSearchableComponent implements ControlValueAccessor {
    @Input() placeholder;
    @Input() data;
    @Input() rows;
    @Input() externalItemListTemplate;
    @Input() totalRecords;

    propagateChange = (_: any) => {};
    writeValue(): void {}
    registerOnChange(): void {}
    registerOnTouched(): void {}
}

describe('DotThemeSelectorDropdownComponent', () => {
    let component: DotThemeSelectorDropdownComponent;
    let fixture: ComponentFixture<DotThemeSelectorDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotThemeSelectorDropdownComponent, TestSearchableComponent],
            providers: [
                {
                    provide: PaginatorService,
                    useValue: {
                        url: '',
                        paginationPerPage: '',

                        setExtraParams() {},
                        getWithOffset() {
                            return of([...mockDotThemes]);
                        }
                    }
                },
                {
                    provide: SiteService,
                    useValue: {
                        getCurrentSite() {
                            return of({
                                identifier: '123'
                            });
                        }
                    }
                },
                {
                    provide: DotThemesService,
                    useValue: {
                        get() {
                            return of({});
                        }
                    }
                }
            ],
            imports: [FormsModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotThemeSelectorDropdownComponent);
        component = fixture.componentInstance;

        spyOn(component, 'propagateChange');
        fixture.detectChanges();
    });

    describe('html', () => {
        it('should pass themes', () => {
            const searchable = fixture.debugElement.query(By.css('dot-searchable-dropdown'))
                .componentInstance;

            expect(searchable.data).toEqual(mockDotThemes);
        });
    });

    describe('events', () => {
        it('should do something with change', () => {
            const searchable = fixture.debugElement.query(By.css('dot-searchable-dropdown'));
            const value = mockDotThemes[0];

            searchable.triggerEventHandler('change', { ...value });
            expect(component.value).toEqual(value);
            expect(component.propagateChange).toHaveBeenCalledWith(value.identifier);
        });
    });
});
