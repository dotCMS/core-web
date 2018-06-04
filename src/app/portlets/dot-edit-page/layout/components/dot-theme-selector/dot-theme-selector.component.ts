import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import { DotTheme } from '../../../shared/models/dot-theme.model';
import { Site } from 'dotcms-js/core/treeable/shared/site.model';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-theme-selector',
    templateUrl: './dot-theme-selector.component.html',
    styleUrls: ['./dot-theme-selector.component.scss']
})
export class DotThemeSelectorComponent implements OnInit {
    themes: DotTheme[];
    @Input() value: any;
    @Output() selected = new EventEmitter<DotTheme>();
    current: DotTheme;
    visible: boolean;

    constructor(private dotThemesService: DotThemesService, public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['editpage.layout.theme.header', 'editpage.layout.theme.search', 'dot.common.apply', 'dot.common.cancel'])
            .subscribe();

        this.themes = [
            {
                name: 'test',
                title: 'test 01',
                inode: '1234',
                host: {
                    hostName: 'test',
                    inode: '12',
                    identifier: '456'
                }
            },
            {
                name: 'test',
                title: 'test 01',
                inode: '12345',
                host: {
                    hostName: 'test',
                    inode: '123',
                    identifier: '456'
                }
            },
            {
                name: 'test1',
                title: 'test 01',
                inode: '1234g',
                host: {
                    hostName: 'test',
                    inode: '43red',
                    identifier: '456'
                }
            },
            {
                name: 'test2',
                title: 'test 01',
                inode: '1s234g',
                host: {
                    hostName: 'test',
                    inode: 'dvdfsd',
                    identifier: '456'
                }
            },
            {
                name: 'test3',
                title: 'test 08',
                inode: '1234dg',
                host: {
                    hostName: 'test',
                    inode: '32423',
                    identifier: '456'
                }
            },
            {
                name: 'test4',
                title: 'test 06',
                inode: '1234a3g',
                host: {
                    hostName: 'test',
                    inode: 'rew2',
                    identifier: '456'
                }
            },
            {
                name: 'test5',
                title: 'test 04',
                inode: '123224g',
                host: {
                    hostName: 'test',
                    inode: '3423',
                    identifier: '456'
                }
            },
            {
                name: 'test6',
                title: 'test 03',
                inode: '123wd4g',
                host: {
                    hostName: 'test',
                    inode: '3432',
                    identifier: '456'
                }
            },
            {
                name: 'test636',
                title: 'test 02',
                inode: '1fd234g',
                host: {
                    hostName: 'test',
                    inode: '43r2',
                    identifier: '456'
                }
            },
            {
                name: 'test69',
                title: 'test 01',
                inode: '123fed4g',
                host: {
                    hostName: 'test',
                    inode: '3432regr',
                    identifier: '456'
                }
            }
        ];

        debugger;
        this.dotThemesService.get(this.value).subscribe((response: DotTheme[]) => {
            this.current = response[0];
        });
    }

    siteChange(site: Site) {
        console.log(site);
        this.dotThemesService.get(site.inode).subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
    }

    selectTheme(theme: DotTheme) {
        this.current = theme;
    }

    apply() {
        this.selected.emit(this.current);
        this.toogleDialog();
    }

    toogleDialog() {
        this.visible = !this.visible;
    }
}
