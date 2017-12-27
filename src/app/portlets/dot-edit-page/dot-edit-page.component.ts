import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'dot-edit-page',
    templateUrl: './dot-edit-page.component.html',
    styleUrls: ['./dot-edit-page.component.scss'],
})
export class DotEditPageComponent {
    @ViewChild('contentEl') contentEl: ElementRef;

    setActiveClass(addClass: boolean): void {
        addClass ? this.contentEl.nativeElement.classList.add('active') : this.contentEl.nativeElement.classList.remove('active');
    }
}
