/* tslint:disable:no-unused-variable */
import { async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { DotEditContentletComponent } from './dot-edit-contentlet.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotIframeDialogModule } from '../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotIframeDialogComponent } from '../dot-iframe-dialog/dot-iframe-dialog.component';

@Component({
    selector: 'dot-test-host-component',
    template: '<dot-edit-contentlet [inode]="inode"></dot-edit-contentlet>'
})
class TestHostComponent {
    inode: string;
}


describe('DotEditContentletComponent', () => {
    let component: DotEditContentletComponent;
    let de: DebugElement;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;

    let dotIframeDialogComponent: DotIframeDialogComponent;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotEditContentletComponent, TestHostComponent],
            imports: [DotIframeDialogModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(TestHostComponent);
        hostDe = hostFixture.debugElement;
        hostComponent = hostFixture.componentInstance;
        de = hostDe.query(By.css('dot-dot-edit-contentlet'));
        component = de.componentInstance;
    });

    describe('basic', () => {
        beforeEach(() => {
            hostFixture.detectChanges();
            dotIframeDialogComponent = de.query(By.css('dot-iframe-dialog')).componentInstance;
        });

        it('should have DotIframeDialogComponent', () => {
            expect(dotIframeDialogComponent).toBeFalsy();
        });
    });
});
