import { By } from '@angular/platform-browser';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement, OnInit, Component } from '@angular/core';
import { SiteSelectorFieldComponent } from './site-selector-field.component';
import { SiteSelectorModule } from '../site-selector/site-selector.module';
import { SiteService } from 'dotcms-js/dotcms-js';
import { SiteServiceMock } from '../../../../test/site-service.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaginatorService } from '../../../../api/services/paginator/index';


@Component({
    selector: 'dot-fake-form',
    template: `
        <form [formGroup]="form">
            <dot-site-selector-field formControlName="site"></dot-site-selector-field>
        </form>
    `,
})
class FakeFormComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        /*
            This should go in the ngOnInit but I don't want to detectChanges everytime for
            this fake test component
        */
        this.form = this.fb.group({
            site: '',
        });
    }
}

describe('SiteSelectorFieldComponent', () => {
    let component: SiteSelectorFieldComponent;
    let fakeForm: FakeFormComponent;
    let fixture: ComponentFixture<SiteSelectorFieldComponent>;
    let de: DebugElement;

    beforeEach(
        async(() => {
            const siteServiceMock = new SiteServiceMock();

            DOTTestBed.configureTestingModule({
                declarations: [SiteSelectorFieldComponent, FakeFormComponent],
                imports: [SiteSelectorModule],
                providers: [
                    { provide: SiteService, useValue: siteServiceMock }
                ]
            });
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SiteSelectorFieldComponent);
        component = fixture.componentInstance;
        fakeForm = TestBed.createComponent(FakeFormComponent).componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should have a site selector component', () => {
        const siteSelector = de.query(By.css('dot-site-selector'));
        expect(siteSelector).not.toBe(null);
    });
});
