import {Component, Input, OnDestroy} from '@angular/core';

@Component({

    selector: 'accordion',
    template: `
        <ng-content></ng-content>
    `
})
export class Accordion {
    groups: Array<AccordionGroup> = [];

    addGroup(group: AccordionGroup): void {
        this.groups.push(group);
    }

    closeOthers(openGroup: AccordionGroup): void {
        this.groups.forEach((group: AccordionGroup) => {
            if (group !== openGroup) {
                // group.isOpen = false;
            }
        });
    }

    removeGroup(group: AccordionGroup): void {
        const index = this.groups.indexOf(group);
        if (index !== -1) {
            this.groups.splice(index, 1);
        }
    }
}

@Component({

    selector: 'accordion-group',
    styles: [require('./accordion-group.scss')],
    template: `
        <a href="#" dotRipple (click)="toggleOpen($event)" class="accordion-group__title" [ngClass]="{'is-active': isOpen}">
            <i class="fa fa-th-list {{icon}}" aria-hidden="true" *ngIf="icon"></i>
            <span class="accordion-group__title-text">
                {{heading}}
            </span>
            
        </a>
        <div class="accordion-group__content" [ngClass]="{'is-open': isOpen}">
            <ng-content></ng-content>
        </div>
    `
})
export class AccordionGroup implements OnDestroy {
    @Input('open') _isOpen = false;

    @Input() heading: string;
    @Input() icon: string;

    set isOpen(value: boolean) {
        this._isOpen = value;
        if (this._isOpen) {
            this.accordion.closeOthers(this);
        }
    }

    constructor(private accordion: Accordion) {
        this.accordion.addGroup(this);
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    open(): void {
        this._isOpen = true;
    }

    toggleOpen(event: MouseEvent): void {
        event.preventDefault();
        this.isOpen = !this.isOpen;
    }

    ngOnDestroy(): void {
        this.accordion.removeGroup(this);
    }

}