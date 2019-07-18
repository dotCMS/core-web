import { of as observableOf } from 'rxjs';
import { async, ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement } from '@angular/core';
import { ContentTypesFieldsListComponent } from './content-types-fields-list.component';
import { By } from '@angular/platform-browser';
import { FieldService, FieldDragDropService } from '../service';

import { DragulaModule } from 'ng2-dragula';
import { DragulaService } from 'ng2-dragula';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';

describe('ContentTypesFieldsListComponent', () => {
    let fixture: ComponentFixture<ContentTypesFieldsListComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [ContentTypesFieldsListComponent],
            imports: [DragulaModule, DotIconModule],
            providers: [DragulaService, FieldDragDropService, FieldService]
        });

        fixture = DOTTestBed.createComponent(ContentTypesFieldsListComponent);
        de = fixture.debugElement;
    }));

    it('should renderer each items', () => {
        const fieldService = de.injector.get(FieldService);
        const itemsData = [
            {
                label: 'Text',
                clazz: 'text'
            },
            {
                label: 'Date',
                clazz: 'date'
            },
            {
                label: 'Checkbox',
                clazz: 'checkbox'
            },
            {
                label: 'Image',
                clazz: 'image'
            },
            {
                label: 'Tab Divider',
                id: 'tab_divider',
                clazz: 'tab'
            },
            {
                label: 'Line Divider',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableLineDividerField'
            }
        ];

        spyOn(fieldService, 'loadFieldTypes').and.returnValue(observableOf(itemsData));

        const fieldDragDropService = de.injector.get(FieldDragDropService);
        spyOn(fieldDragDropService, 'setFieldBagOptions');

        fixture.detectChanges();

        const itemsElements = de.queryAll(By.css('li span'));

        expect(itemsElements.length).toEqual(6);

        expect(itemsElements[0].nativeElement.textContent).toContain('Column');
        expect(itemsElements[1].nativeElement.textContent).toContain('Line Divider');

        itemsElements.forEach((el: DebugElement, index) => {
            if (index > 1) {
                expect(el.nativeElement.textContent).toContain(itemsData[index - 2].label);
            }
        });

        const ulElement = de.query(By.css('ul'));
        expect('fields-bag').toEqual(ulElement.attributes['ng-reflect-dragula']);
        expect('source').toEqual(ulElement.attributes['data-drag-type']);
    });
});
