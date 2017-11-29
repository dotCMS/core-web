import { DotLayoutSidebarComponent } from './dot-layout-property-sidebar.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { OverlayPanelModule, ButtonModule } from 'primeng/primeng';
import { DotLayoutPropertiesItemModule } from './../dot-layout-properties-item/dot-layout-properties-item.module';
import { MockMessageService } from './../../../../test/message-service.mock';
import { DOTTestBed } from './../../../../test/dot-test-bed';
import { MessageService } from './../../../../api/services/messages-service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'dot-test-host-component',
    template:   `<form [formGroup]="group">
                    <dot-layout-property-sidebar formControlName="sidebar"></dot-layout-property-sidebar>
                </form>`
})
class TestHostComponent {
    group: FormGroup;
    constructor() {
        this.group = new FormGroup({
            sidebar: new FormControl({
                sidebar: {}
            })
        });
    }
}

fdescribe('DotLayoutSidebarComponent', () => {
    let comp: DotLayoutSidebarComponent;
    let fixture: ComponentFixture<DotLayoutSidebarComponent>;
    let de: DebugElement;
    let hostComponentfixture: ComponentFixture<TestHostComponent>;

    const messageServiceMock = new MockMessageService({
        'editpage.toolbar.primary.action': 'Hello',
        'editpage.toolbar.secondary.action': 'World'
    });

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotLayoutSidebarComponent, TestHostComponent],
            imports: [DotLayoutPropertiesItemModule],
            providers: [
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(DotLayoutSidebarComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should propagate change after sidebar property item is clicked', () => {
        spyOn(comp, 'propagateChange');
        comp.setValue(true, 'left');

        expect(comp.propagateChange).toHaveBeenCalled();
    });

    it('should check left value and unchecked right value', () => {
        spyOn(comp.propertyItemLeft, 'setChecked');
        spyOn(comp.propertyItemRight, 'setUnchecked');
        comp.setValue(true, 'left');

        expect(comp.propertyItemLeft.setChecked).toHaveBeenCalled();
        expect(comp.propertyItemRight.setUnchecked).toHaveBeenCalled();
    });

    it('should check right value and unchecked left value', () => {
        spyOn(comp.propertyItemLeft, 'setUnchecked');
        spyOn(comp.propertyItemRight, 'setChecked');
        comp.setValue(true, 'right');

        expect(comp.propertyItemLeft.setUnchecked).toHaveBeenCalled();
        expect(comp.propertyItemRight.setChecked).toHaveBeenCalled();
    });

    it('should call writeValue to define the initial value of sidebar item', () => {
        hostComponentfixture = DOTTestBed.createComponent(TestHostComponent);
        de = hostComponentfixture.debugElement.query(By.css('dot-layout-property-sidebar'));
        const component: DotLayoutSidebarComponent = de.componentInstance;
        spyOn(component, 'writeValue');
        hostComponentfixture.detectChanges();

        expect(component.writeValue).toHaveBeenCalledWith(({ sidebar: {} }));
    });
});
