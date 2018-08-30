import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';

import { DotNavigationComponent } from './dot-navigation.component';
import { DotNavIconModule } from './components/dot-nav-icon/dot-nav-icon.module';
import { DotNavigationService } from './services/dot-navigation.service';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { DotSubNavComponent } from './components/dot-sub-nav/dot-sub-nav.component';
import { DotNavItemComponent } from './components/dot-nav-item/dot-nav-item.component';
import { DotIconModule } from '../_common/dot-icon/dot-icon.module';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { DotMenu } from '../../../shared/models/navigation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const dotMenuMock: DotMenu = {
    active: true,
    id: '123',
    isOpen: false,
    menuItems: [
        {
            active: false,
            ajax: true,
            angular: true,
            id: '123',
            label: 'Label 1',
            url: 'url/one',
            menuLink: 'url/link1'
        },
        {
            active: true,
            ajax: true,
            angular: true,
            id: '456',
            label: 'Label 2',
            url: 'url/two',
            menuLink: 'url/link2'
        }
    ],
    name: 'Menu 1',
    tabDescription: 'Description',
    tabIcon: 'icon',
    tabName: 'Name',
    url: '/url/index'
};

const dotMenuMock1: DotMenu = {
    ...dotMenuMock,
    active: false,
    id: '456',
    isOpen: true,
    name: 'Menu 2'
};

const data = [dotMenuMock, dotMenuMock1];

describe('DotNavigationComponent', () => {
    let comp: DotNavigationComponent;
    let fixture: ComponentFixture<DotNavigationComponent>;
    let de: DebugElement;
    let dotNavigationService: DotNavigationService;
    let navItem: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotNavigationComponent, DotSubNavComponent, DotNavItemComponent],
            imports: [DotNavIconModule, DotIconModule, RouterTestingModule, BrowserAnimationsModule],
            providers: [
                DotNavigationService,
                DotMenuService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotNavigationComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        dotNavigationService = de.injector.get(DotNavigationService);

        spyOnProperty(dotNavigationService, 'items$', 'get').and.returnValue(of(data));
        spyOn(dotNavigationService, 'goTo').and.returnValue(of(data));
        spyOn(dotNavigationService, 'reloadCurrentPortlet');
        fixture.detectChanges();
        navItem = de.query(By.css('dot-nav-item'));
    });

    it('should have dot-nav-item print correctly', () => {
        const items: DebugElement[] = de.queryAll(By.css('dot-nav-item'));
        expect(items.length).toBe(2);

        items.forEach((item: DebugElement, i: number) => {
            expect(item.componentInstance.data).toEqual(data[i]);
        });
    });

    it('should handle menuClick event', () => {
        let changeResult = false;

        comp.change.subscribe((e) => {
            changeResult = true;
        });

        expect(comp.menu.map((menuItem: DotMenu) => menuItem.isOpen)).toEqual([false, true]);

        navItem.triggerEventHandler('menuClick', { originalEvent: {}, data: data[0] });

        expect(changeResult).toBe(true);
        expect(comp.menu.map((menuItem: DotMenu) => menuItem.isOpen)).toEqual([true, false]);
        expect(dotNavigationService.goTo).not.toHaveBeenCalled();
    });

    it('should navigate to portlet', () => {
        comp.collapsed = true;
        navItem.triggerEventHandler('menuClick', { originalEvent: {}, data: data[0] });
        expect(dotNavigationService.goTo).toHaveBeenCalledWith('url/link1');
    });

    it('should reload portlet', () => {
        const stopProp = jasmine.createSpy();

        navItem.triggerEventHandler('itemClick', {
            originalEvent: {
                stopPropagation: stopProp,
                ctrlKey: false,
                metaKey: false
            },
            data: data[0]
        });

        expect(stopProp).toHaveBeenCalledTimes(1);
        expect(dotNavigationService.reloadCurrentPortlet).toHaveBeenCalledWith('123');
    });

    it('should NOT reload portlet', () => {
        const stopProp = jasmine.createSpy();

        navItem.triggerEventHandler('itemClick', {
            originalEvent: {
                stopPropagation: stopProp,
                ctrlKey: true,
                metaKey: false
            },
            data: data[0]
        });

        expect(stopProp).toHaveBeenCalledTimes(1);
        expect(dotNavigationService.reloadCurrentPortlet).not.toHaveBeenCalled();
    });
});
