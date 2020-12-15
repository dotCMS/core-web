import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, take } from 'rxjs/operators';
import { DotStarterService } from '@services/dot-starter/dot-starter.service';

@Component({
    selector: 'dot-starter',
    templateUrl: './dot-starter.component.html',
    styleUrls: ['./dot-starter.component.scss']
})
export class DotStarterComponent implements OnInit {
    username: string;

    constructor(private route: ActivatedRoute, private dotStarterService: DotStarterService) {}

    ngOnInit() {
        this.route.data.pipe(pluck('username'), take(1)).subscribe((username: string) => {
            this.username = username;
        });
    }

    handleVisibility(hide: boolean): void {
        console.log(hide);
        hide
            ? this.dotStarterService.hide().pipe(take(1)).subscribe()
            : this.dotStarterService.show().pipe(take(1)).subscribe();
    }
}
