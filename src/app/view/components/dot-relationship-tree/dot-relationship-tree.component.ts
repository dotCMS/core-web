import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { DotCMSContentType } from 'dotcms-models';

@Component({
    selector: 'dot-relationship-tree',
    templateUrl: './dot-relationship-tree.component.html',
    styleUrls: ['./dot-relationship-tree.component.scss']
})
export class DotRelationshipTreeComponent implements OnInit {
    @Input() velocityVar: string;
    @Input() contentType: DotCMSContentType;

    isRelationshipChild: boolean = false;
    relatedContentType: string;
    fieldName: string;
    child: string;
    parent: string;

    constructor() {}

    ngOnInit(): void {
        this.setInitialValues();
    }
    /**
     * Sets initial values of the relationship tree component
     *
     * @memberof DotRelationshipTreeComponent
     */
    setInitialValues(): void {
        // If velocityVar has a dot it means it's the child of the relationship
        this.isRelationshipChild = this.velocityVar?.indexOf('.') !== -1;

        const [relatedContentType] = this.velocityVar?.split('.') || '';

        if (this.isRelationshipChild) {
            this.child = this.contentType?.name;
            this.parent = relatedContentType;
        } else {
            this.parent = this.contentType?.name;
            this.child = relatedContentType;
        }
    }
}
