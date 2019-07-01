import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dot-avatar',
    styleUrls: ['./dot-avatar.component.scss'],
    templateUrl: './dot-avatar.component.html'
})
export class DotAvatarComponent implements OnInit {
    @Input()
    url: string;

    @Input()
    showDot = false;

    avatarPlaceholder: string;
    avatarStyles;

    private _label: string;
    private _size: number;

    ngOnInit(): void {
        if (!this.size) {
            this.size = 32;
        }
    }

    @Input()
    set label(value: string) {
        this._label = value;
        this.avatarPlaceholder = this.getDotAvatar(this._label);
    }

    get label(): string {
        return this._label;
    }

    @Input()
    set size(value: number) {
        this._size = value;
        this.avatarStyles = {
            'font-size': value - (value * 25) / 100 + 'px',
            height: value + 'px',
            'line-height': value + 'px',
            width: value + 'px'
        };
    }

    get size(): number {
        return this._size;
    }

    public getDotAvatar(label: string): any {
        return !!label ? label.substring(0, 1).toUpperCase() : null;
    }
}
