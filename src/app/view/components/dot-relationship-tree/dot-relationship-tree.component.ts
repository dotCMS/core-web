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
    // currentContentTypeId: string;
    parent: string;
    fieldName: string;

    // constructor(private route: ActivatedRoute) {}
    constructor() {}

    ngOnInit(): void {
        // If velocityVar has a dot it means it's the child of the relationship
        this.isRelationshipChild = this.velocityVar.indexOf('.') !== -1;
        // this.currentContentTypeId = this.route.snapshot.paramMap.get('id');

        const [parent, fieldName] = this.velocityVar.split('.');

        if (this.isRelationshipChild) {
            this.parent = parent;
            this.fieldName = fieldName;
        } else {
            this.parent = parent;
        }
    }
}
