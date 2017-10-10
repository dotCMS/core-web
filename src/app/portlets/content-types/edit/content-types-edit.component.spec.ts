import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { ContentTypesEditComponent } from './content-types-edit.component';
import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { Field } from '../fields';
import { FieldService } from '../fields/service';
import { CrudService } from '../../../api/services/crud/crud.service';

@Component({
    selector: 'dot-content-type-fields-drop-zone',
    template: ''
})
class TestContentTypeFieldsDropZoneComponent {
    @Input() fields: Field[];
    @Output() saveFields = new EventEmitter<Field[]>();
    @Output() removeFields = new EventEmitter<Field[]>();
}

@Component({
    selector: 'dot-content-type-layout',
    template: '<ng-content></ng-content>'
})
class TestContentTypeLayoutComponent {
    @Input() contentTypeId: string;
}

@Component({
    selector: 'dot-content-types-form',
    template: ''
})
class TestContentTypesFormComponent {
    @Input() data: any;
    @Input() fields: Field[];
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    resetForm = jasmine.createSpy('resetForm');
}

describe('ContentTypesEditComponent', () => {
    let comp: ContentTypesEditComponent;
    let fixture: ComponentFixture<ContentTypesEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let route: ActivatedRoute;
    let crudService: CrudService;

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                declarations: [
                    ContentTypesEditComponent,
                    TestContentTypeFieldsDropZoneComponent,
                    TestContentTypesFormComponent,
                    TestContentTypeLayoutComponent
                ],
                imports: [
                    RouterTestingModule.withRoutes([
                        {
                            component: ContentTypesEditComponent,
                            path: 'test'
                        }
                    ])
                ],
                providers: [
                    { provide: LoginService, useClass: LoginServiceMock },
                    {
                        provide: ActivatedRoute,
                        useValue: { params: Observable.from([{ id: '1234' }]) }
                    },
                    CrudService,
                    FieldService
                ]
            });

            fixture = DOTTestBed.createComponent(ContentTypesEditComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            route = fixture.debugElement.injector.get(ActivatedRoute);

            crudService = fixture.debugElement.injector.get(CrudService);
        })
    );

    it('should have Content Types Layout', () => {
        const contentTypeLayout = de.query(By.css('dot-content-type-layout'));
        expect(contentTypeLayout).toBeTruthy();
    });

    it('should have Content Types Form', () => {
        const contentTypeForm = de.query(By.css('dot-content-types-form'));
        expect(contentTypeForm).toBeTruthy();
    });

    it('should NOT have Content Types Fields Drop Zone', () => {
        const contentTypeForm = de.query(By.css('dot-content-type-fields-drop-zone'));
        expect(contentTypeForm).toBeFalsy();
    });

    it('should have Content Types Fields Drop Zone', () => {
        route.data = Observable.of({
            contentType: {
                id: '123'
            }
        });
        fixture.detectChanges();
        const contentTypeForm = de.query(By.css('dot-content-type-fields-drop-zone'));
        expect(contentTypeForm).toBeTruthy();
    });

    it('should create content type', () => {
        spyOn(crudService, 'postData').and.returnValue(Observable.of([{ id: '123' }]));

        route.data = Observable.of({
            contentType: {
                baseType: 'WIDGET'
            }
        });
        fixture.detectChanges();

        const contentTypeForm = de.query(By.css('dot-content-types-form')).componentInstance;
        contentTypeForm.onSubmit.emit({
            name: 'Hello World',
            clazz: 'com.dotcms.contenttype.model.type.ImmutableWidgetContentType',
            owner: '123'
        });

        expect(crudService.postData).toHaveBeenCalledWith('v1/contenttype', {
            clazz: 'com.dotcms.contenttype.model.type.ImmutableWidgetContentType',
            defaultType: false,
            fixed: false,
            folder: 'SYSTEM_FOLDER',
            host: null,
            name: 'Hello World',
            owner: '123',
            system: false
        });
        expect(contentTypeForm.resetForm).toHaveBeenCalledTimes(1);
    });

    it('should udpate content type', () => {
        spyOn(crudService, 'putData').and.returnValue(Observable.of({}));

        route.data = Observable.of({
            contentType: {
                id: '1234567890'
            }
        });
        fixture.detectChanges();

        const contentTypeForm = de.query(By.css('dot-content-types-form')).componentInstance;
        contentTypeForm.onSubmit.emit({
            name: 'New name',
            description: 'New description'
        });

        expect(crudService.putData).toHaveBeenCalledWith('v1/contenttype/id/1234567890', {
            name: 'New name',
            description: 'New description',
            id: '1234567890'
        });
        expect(contentTypeForm.resetForm).toHaveBeenCalledTimes(1);
    });

    it('should save fields on dropzone event', () => {
        const currentFieldsInServer: Field[] = [
            {
                name: 'fieldName',
                id: '4',
                clazz: 'fieldClass',
                sortOrder: 1
            }
        ];
        route.data = Observable.of({
            contentType: {
                id: '1234567890',
                clazz: 'com.dotcms.contenttype.model.type.ImmutableWidgetContentType',
                fields: currentFieldsInServer,
                defaultType: true,
                fixed: true,
                folder: 'folder',
                host: 'host',
                name: 'name',
                owner: 'owner',
                system: false
            }
        });
        fixture.detectChanges();

        const newFieldsAdded: Field[] = [
            {
                name: 'field 1',
                id: '1',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableLineDividerField',
                sortOrder: 1
            },
            {
                name: 'field 2',
                id: '2',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
                sortOrder: 2
            }
        ];

        const fieldsReturnByServer: Field[] = newFieldsAdded.concat(currentFieldsInServer);
        const fieldService = fixture.debugElement.injector.get(FieldService);
        spyOn(fieldService, 'saveFields').and.returnValue(Observable.of(fieldsReturnByServer));

        const contentTypeFieldsDropZone = de.query(By.css('dot-content-type-fields-drop-zone'));

        // when: the saveFields event is tiggered in content-type-fields-drop-zone
        contentTypeFieldsDropZone.componentInstance.saveFields.emit(newFieldsAdded);

        // then: the saveFields method has to be called in FileService ...
        expect(fieldService.saveFields).toHaveBeenCalledWith('1234567890', newFieldsAdded);
        // ...and the comp.data.fields has to be set to the fields return by the service
        expect(comp.fields).toEqual(fieldsReturnByServer);
    });

    it('should remove fields on dropzone event', () => {
        const currentFieldsInServer: Field[] = [
            {
                name: 'field 1',
                id: '1',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableLineDividerField',
                sortOrder: 1
            },
            {
                name: 'field 2',
                id: '2',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
                sortOrder: 2
            },
            {
                name: 'field 3',
                id: '3',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
                sortOrder: 3
            }
        ];

        route.data = Observable.of({
            contentType: {
                id: '1234567890',
                clazz: 'com.dotcms.contenttype.model.type.ImmutableWidgetContentType',
                fields: currentFieldsInServer,
                defaultType: true,
                fixed: true,
                folder: 'folder',
                host: 'host',
                name: 'name',
                owner: 'owner',
                system: false
            }
        });
        fixture.detectChanges();

        const fieldsReturnByServer: Field[] = currentFieldsInServer.slice(-1);
        const fieldService = fixture.debugElement.injector.get(FieldService);
        spyOn(fieldService, 'deleteFields').and.returnValue(
            Observable.of({ fields: fieldsReturnByServer })
        );

        const contentTypeFieldsDropZone = de.query(By.css('dot-content-type-fields-drop-zone'));

        const fieldToRemove = {
            name: 'field 3',
            id: '3',
            clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
            sortOrder: 3
        };

        // when: the saveFields event is tiggered in content-type-fields-drop-zone
        contentTypeFieldsDropZone.componentInstance.removeFields.emit(fieldToRemove);

        // then: the saveFields method has to be called in FileService ...
        expect(fieldService.deleteFields).toHaveBeenCalledWith('1234567890', fieldToRemove);
        // ...and the comp.data.fields has to be set to the fields return by the service
        expect(comp.fields).toEqual(fieldsReturnByServer);
    });
});
