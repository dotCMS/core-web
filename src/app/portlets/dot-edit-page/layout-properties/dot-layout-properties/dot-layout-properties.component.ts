import { FormGroup } from '@angular/forms';
import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-layout-properties',
    templateUrl: './dot-layout-properties.component.html',
    styleUrls: ['./dot-layout-properties.component.scss']
})
export class DotLayoutPropertiesComponent {
    @Input() group: FormGroup;
}




