import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { MockDotMessageService } from '../../../../test/dot-message-service.mock';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { PushPublishEnvSelectorComponent } from './dot-push-publish-env-selector.component';
import { PushPublishService } from '../../../../api/services/push-publish/push-publish.service';
import { FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

class PushPublishServiceMock {
    pushPublishContent(contentTypeId: string, formValue: any): Observable<any> {
        return Observable.of([]);
    }

    getEnvironments(): Observable<any> {
        return Observable.of([
            {
                id: '22e332',
                name: 'my environment'
            },
            {
                id: 'joa08',
                name: 'my environment 2'
            }
        ]);
    }
}

@Component({
    selector: 'dot-test-host-component',
    template:   `<form [formGroup]="group">
                    <dot-push-publish-env-selector formControlName="environment" ></dot-push-publish-env-selector>
                </form>`
})
class TestHostComponent {
    group: FormGroup;
    constructor() {
        this.group = new FormGroup({
            environment: new FormControl({
                environment: ['22e332']
            })
        });
    }
}

fdescribe('PushPublishEnvSelectorComponent', () => {
    let comp: PushPublishEnvSelectorComponent;
    let fixture: ComponentFixture<PushPublishEnvSelectorComponent>;
    let de: DebugElement;
    let hostComponentfixture: ComponentFixture<TestHostComponent>;
    let pushPublishServiceMock: PushPublishServiceMock;

    const messageServiceMock = new MockDotMessageService({
        'contenttypes.content.push_publish.select_environment': 'Select environment'
    });

    beforeEach(() => {
        pushPublishServiceMock = new PushPublishServiceMock();

        DOTTestBed.configureTestingModule({
            declarations: [PushPublishEnvSelectorComponent, TestHostComponent],
            imports: [BrowserAnimationsModule],
            providers: [
                PushPublishService,
                { provide: PushPublishService, useValue: pushPublishServiceMock },
                { provide: DotMessageService, useValue: messageServiceMock}
            ]
        });

        fixture = DOTTestBed.createComponent(PushPublishEnvSelectorComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
    });

    it('should propagate change on value change', () => {
        comp.selectedEnvironmentIds = [];
        expect(comp.selectedEnvironmentIds).toEqual([]);

        spyOn(comp, 'propagateChange');
        comp.valueChange(new Event('MouseEvent'), [{
            id: '22e332',
            name: 'my environment'
        }]);

        expect(comp.selectedEnvironmentIds).toEqual(['22e332']);
        expect(comp.propagateChange).toHaveBeenCalled();
    });

    it('should propagate change on remove environment item', () => {
        comp.selectedEnvironments = [
            { id: '22e332', name: 'my environment' },
            { id: '832l', name: 'my environment 2' },
            { id: 'se232', name: 'my environment 3' }
        ];
        comp.removeEnvironmentItem(1);

        expect(comp.selectedEnvironmentIds).toEqual(['22e332', 'se232']);
    });

    it('should call writeValue to define the initial value of the environment id', () => {
        hostComponentfixture = DOTTestBed.createComponent(TestHostComponent);
        de = hostComponentfixture.debugElement.query(By.css('dot-push-publish-env-selector'));
        const component: PushPublishEnvSelectorComponent = de.componentInstance;
        comp.selectedEnvironmentIds = [];

        spyOn(component, 'writeValue');
        comp.valueChange(new Event('MouseEvent'), [{
            id: '22e332',
            name: 'my environment'
        }]);
        hostComponentfixture.detectChanges();

        expect(comp.selectedEnvironmentIds).toEqual(['22e332']);
        expect(component.writeValue).toHaveBeenCalledWith(({ environment: ['22e332'] }));
    });

    it('should get environments from PushPublishService', () => {
        fixture.detectChanges();
        spyOn(pushPublishServiceMock, 'getEnvironments');

        comp.pushEnvironments.subscribe(environments => {
            expect(environments).toEqual([
                {
                    id: '22e332',
                    name: 'my environment'
                },
                {
                    id: 'joa08',
                    name: 'my environment 2'
                }
            ]);
        });
    });
});
