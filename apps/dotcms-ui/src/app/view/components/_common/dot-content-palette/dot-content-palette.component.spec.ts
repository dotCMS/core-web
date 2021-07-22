import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DotContentPaletteComponent } from './dot-content-palette.component';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotIconModule } from '@dotcms/ui';
import { DotCMSContentType } from '@dotcms/dotcms-models';
import { By } from '@angular/platform-browser';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-message/dot-messages.service';

const data = [
    {
        icon: 'cloud',
        id: 'a1661fbc-9e84-4c00-bd62-76d633170da3',
        name: 'Product'
    },
    {
        icon: 'alt_route',
        id: '799f176a-d32e-4844-a07c-1b5fcd107578',
        name: 'Blog'
    },
    {
        icon: 'cloud',
        id: '897cf4a9-171a-4204-accb-c1b498c813fe',
        name: 'Contact'
    },
    {
        icon: 'person',
        id: '6044a806-f462-4977-a353-57539eac2a2c',
        name: 'Long name Blog Comment'
    }
];

fdescribe('DotContentPaletteComponent', () => {
    let component: DotContentPaletteComponent;
    let fixture: ComponentFixture<DotContentPaletteComponent>;

    const messageServiceMock = new MockDotMessageService({
        structures: 'Content Type'
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotContentPaletteComponent],
            imports: [DotPipesModule, DotIconModule],
            providers: [{ provide: DotMessageService, useValue: messageServiceMock }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotContentPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list items correctly', () => {
        component.items = (data as unknown) as DotCMSContentType[];
        fixture.detectChanges();
        const contents = fixture.debugElement.queryAll(By.css('.dot-content-palette__items a'));
        expect(contents.length).toEqual(4);
        expect(JSON.parse(contents[0].nativeElement.dataset.content)).toEqual(data[0]);
        expect(contents[0].nativeElement.draggable).toEqual(true);
        //TODO: Check fot data attributes need to be defined.
    });

    it('should show correct search Box', () => {
        const icon = fixture.debugElement.query(By.css('[data-testId="searchIcon"]'));
        const input = fixture.debugElement.query(By.css('[data-testId="searchInput"]'));
        expect(icon.componentInstance.name).toEqual('search');
        expect(icon.componentInstance.size).toEqual('14');
        expect(input.nativeElement.placeholder).toEqual('CONTENT TYPE');
    });

    it('should emit event on search', fakeAsync(() => {
        spyOn(component.filterChange, 'emit');
        const input = fixture.debugElement.query(By.css('[data-testId="searchInput"]'));
        input.nativeElement.value = 'test';
        input.nativeElement.dispatchEvent(new Event('keyup'));
        tick(550);
        expect(component.filterChange.emit).toHaveBeenCalledOnceWith('test');
    }));
});
