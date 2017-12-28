import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'dot-edit-page',
    templateUrl: './dot-edit-page.component.html',
    styleUrls: ['./dot-edit-page.component.scss'],
})
export class DotEditPageComponent {
    @ViewChild('contentEl') contentEl: ElementRef;
    @ViewChild('editMain') editMain: ElementRef;

    setActiveClass(addClass: boolean): void {
        this.editMain.nativeElement.children[1].children[2].classList.remove('dot-edit__layout--active');
        if (addClass) {
            this.contentEl.nativeElement.classList.add('active');
        } else {
            this.contentEl.nativeElement.classList.remove('active');
            this.editMain.nativeElement.children[1].children[2].classList.add('dot-edit__layout--active');
        }
    }
}
