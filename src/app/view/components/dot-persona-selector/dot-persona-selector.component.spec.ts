import { ComponentFixture } from '@angular/core/testing';
import { DotPersonaSelectorComponent } from './dot-persona-selector.component';
import { DebugElement } from '@angular/core';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotMessageService } from '@services/dot-messages-service';
import { DotPersonasService } from '@services/dot-personas/dot-personas.service';
import { DotPersonasServiceMock } from '../../../test/dot-personas-service.mock';
import { By } from '@angular/platform-browser';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { Dropdown } from 'primeng/primeng';
import { of } from 'rxjs';

describe('DotPersonaSelector2Component', () => {
    let dotPersonasService: DotPersonasService;

    let component: DotPersonaSelectorComponent;
    let fixture: ComponentFixture<DotPersonaSelectorComponent>;
    let de: DebugElement;
    const defaultPersona: DotPersona = { name: 'Default Persona', identifier: '0' };
    const messageServiceMock = new MockDotMessageService({
        'modes.persona.no.persona': 'Default Persona'
    });

    beforeEach(() => {
        const testbed = DOTTestBed.configureTestingModule({
            declarations: [DotPersonaSelectorComponent],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: DotPersonasService,
                    useClass: DotPersonasServiceMock
                },
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotPersonaSelectorComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        dotPersonasService = testbed.get(DotPersonasService);
    });

    it('should emmit the selected persona', () => {
        const pDropDown: DebugElement = de.query(By.css('p-dropdown'));

        spyOn(component.selected, 'emit');
        spyOn(component, 'change').and.callThrough();

        pDropDown.triggerEventHandler('onChange', { value: defaultPersona });

        expect(component.change).toHaveBeenCalledWith(defaultPersona);
        expect(component.selected.emit).toHaveBeenCalledWith(defaultPersona);
    });

    it('should add Default persona as first position', () => {
        fixture.detectChanges();
        expect(component.options[0]).toEqual(defaultPersona);
    });

    it('shoudl set fixed width to dropdown', () => {
        fixture.detectChanges();
        const pDropDown: Dropdown = de.query(By.css('p-dropdown')).componentInstance;
        expect(pDropDown.style).toEqual({ width: '100px' });
    });

    it('should disabled when just hava the default persona', () => {
        spyOn(dotPersonasService, 'get').and.returnValue(of([]));

        fixture.detectChanges();

        const pDropDown: DebugElement = de.query(By.css('p-dropdown'));
        expect(pDropDown.componentInstance.disabled).toBeTruthy();
    });
});
