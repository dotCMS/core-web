import { ComponentFixture, async } from '@angular/core/testing';
import { Component, Input, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DotGravatarComponent } from './dot-gravatar.component';
import { DotGravatarService } from '@services/dot-gravatar-service';
import { DotAvatarModule } from '../dot-avatar/dot-avatar.module';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { DOTTestBed } from '@tests/dot-test-bed';
import * as md5 from 'md5';

@Component({
    selector: 'dot-test-component',
    template: `<dot-gravatar [email]='email'
                           [size]='size'
                >
               </dot-gravatar>`
})
class HostTestComponent {
    @Input()
    email: string;

    @Input()
    size: number;
}

class DotGravatarServiceMock {
    loadGravatarPhoto(): Observable<string> {
        return of('/avatar_url');
    }
}

describe('GravatarComponent', () => {
    let fixture: ComponentFixture<HostTestComponent>;
    let avatarComponent: DebugElement;
    let dotGravatarService: DotGravatarService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [HostTestComponent, DotGravatarComponent],
            imports: [DotAvatarModule, CommonModule],
            providers: [
                { provide: DotGravatarService, useClass: DotGravatarServiceMock },
            ]
        });
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(HostTestComponent);
        fixture.detectChanges();
        avatarComponent = fixture.debugElement.query(By.css('dot-avatar'));

        dotGravatarService = fixture.debugElement.injector.get(DotGravatarService);
    });

    it('should have a dot-avatar', () => {
        expect(avatarComponent).not.toBeNull();
    });

    it('should set dot-avatar size', () => {
        fixture.componentInstance.size = 20;
        fixture.detectChanges();
        expect(avatarComponent.componentInstance.size).toEqual(20);
    });

    it('should set dot-avatar label', () => {
        fixture.componentInstance.email = 'a@a.com';
        fixture.detectChanges();
        expect(avatarComponent.componentInstance.label).toEqual('a@a.com');
    });

    it('should set dot-avatar label', () => {
        fixture.componentInstance.email = 'a@a.com';
        spyOn(dotGravatarService, 'loadGravatarPhoto').and.callThrough();

        fixture.detectChanges();
        expect(avatarComponent.componentInstance.url).toEqual('/avatar_url');

        expect(dotGravatarService.loadGravatarPhoto).toHaveBeenCalledWith(md5(fixture.componentInstance.email));
    });
});
