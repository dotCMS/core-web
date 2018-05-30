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
    @Input() value: string;
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
                host: {
                    hostName: 'test',
                    inode: '12',
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
                    inode: '43red',
                    identifier: '456'
                }
            },
            {
                name: 'test2',
                host: {
                    hostName: 'test',
                    inode: 'dvdfsd',
                    identifier: '456'
                }
            },
            {
                name: 'test3',
                host: {
                    hostName: 'test',
                    inode: '32423',
                    identifier: '456'
                }
            },
            {
                name: 'test4',
                host: {
                    hostName: 'test',
                    inode: 'rew2',
                    identifier: '456'
                }
            },
            {
                name: 'test5',
                host: {
                    hostName: 'test',
                    inode: '3423',
                    identifier: '456'
                }
            },
            {
                name: 'test6',
                host: {
                    hostName: 'test',
                    inode: '3432',
                    identifier: '456'
                }
            },
            {
                name: 'test636',
                host: {
                    hostName: 'test',
                    inode: '43r2',
                    identifier: '456'
                }
            },
            {
                name: 'test69',
                host: {
                    hostName: 'test',
                    inode: '3432regr',
                    identifier: '456'
                }
            }
        ];

        // TODO: with the ID bring the theme
        this.current = {
            name: 'test1',
            host: {
                hostName: 'test',
                inode: '43red',
                identifier: '456'
            }
        };

        // this.dotThemesService.get().subscribe((response: DotTheme[]) => {
        //     this.themes = response;
        // });
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
