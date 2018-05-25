import { Component, OnInit } from '@angular/core';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import { DotTheme } from '../../../shared/models/dot-theme.model';
import { Site } from 'dotcms-js/core/treeable/shared/site.model';

@Component({
    selector: 'dot-theme-selector',
    templateUrl: './dot-theme-selector.component.html',
    styleUrls: ['./dot-theme-selector.component.scss']
})
export class DotThemeSelectorComponent implements OnInit {
    themes: DotTheme[];
    selectedTheme: DotTheme;
    visible: boolean;

    constructor(private dotThemesService: DotThemesService) {}

    ngOnInit() {
        this.themes = [
            {
                name: 'test',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test1',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test2',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test3',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test4',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test5',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test6',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test636',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test69',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            }
        ];

        // this.dotThemesService.get().subscribe((response: DotTheme[]) => {
        //     this.themes = response;
        // });
    }

    siteChange(site: Site) {
        console.log(site);
        debugger;
        this.dotThemesService.get(site.inode).subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
    }

    toogleDialog() {
        this.visible = !this.visible;
    }
}
