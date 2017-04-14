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
    @Input() size;
    public gravatarProfileStyles;
    public gravatarProfile;
    public dotAvatarProfile;
    public dotAvatarProfileStyles;

    constructor(private gravatarService: GravatarService) {

    }

    ngOnInit(): void {
        const hash = md5(this.email);
        const profile$ = this.gravatarService.loadGravatarProfile(hash);
        profile$.subscribe(
            data => {
                this.gravatarProfileStyles = {
                    'background': 'url("' + data.entry[0].photos[0].value + '?s=' + this.size + '")',
                    'border-radius': this.size / 2 + 'px',
                    'height': this.size + 'px',
                    'width': this.size + 'px'
                };

                this.gravatarProfile = true;
            },
            error => {
                this.gravatarProfile = false;
                this.dotAvatarProfile = this.setDotAvatar(this.email);
                this.dotAvatarProfileStyles = {
                    'border-radius': this.size / 2 + 'px',
                    'font-size': this.size - ((this.size * 25) / 100) + 'px',
                    'height': this.size + 'px',
                    'width': this.size + 'px'
                };
            }
        );
    }

    public setDotAvatar(email): any {
        const firstLetter = email.substring(0, 1).toUpperCase();
        return firstLetter;
    }
}