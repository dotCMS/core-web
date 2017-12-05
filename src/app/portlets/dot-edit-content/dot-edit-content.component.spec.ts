import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditContentComponent } from './dot-edit-content.component';
import { DialogModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('DotEditContentComponent', () => {
    let component: DotEditContentComponent;
    let fixture: ComponentFixture<DotEditContentComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [DotEditContentComponent],
                imports: [DialogModule, BrowserAnimationsModule]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
