import { Component, Input } from '@angular/core';
import { GravatarService } from '../../../../api/services/gravatar-service';
let md5 = require('md5');

@Component({
    selector: 'dot-gravatar',
    styles: [require('./gravatar.component.scss')],
    templateUrl: './gravatar.component.html'
})

export class GravatarComponent {
    @Input() email;
    public profile;

    constructor(private gravatarService: GravatarService) {
        const _email = md5(this.email);
        const profile$ = gravatarService.loadGravatarProfile(_email);
        console.log(_email);
        profile$.subscribe(
            data => console.log(data),
            error => console.error(error)
        );
    }

    showTest(param): void {
        console.log(param);
    }
}