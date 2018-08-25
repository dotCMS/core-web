import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { By } from '@angular/platform-browser';

import { DotNavigationComponent } from './dot-navigation.component';
import { DotNavIconModule } from './components/dot-nav-icon/dot-nav-icon.module';
import { DotNavigationService } from './services/dot-navigation.service';
import { DotMenuService } from '../../../api/services/dot-menu.service';

fdescribe('DotNavigationComponent', () => {
    let comp: DotNavigationComponent;
    let fixture: ComponentFixture<DotNavigationComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotNavigationComponent],
            imports: [DotNavIconModule],
            providers: [DotNavigationService, DotMenuService]
        });

        fixture = DOTTestBed.createComponent(DotNavigationComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
    });

    it('should have...', () => {
        expect(de.query(By.css('nav'))).toBeDefined();
    });
});
