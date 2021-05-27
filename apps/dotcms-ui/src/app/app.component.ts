import { Component, OnInit } from '@angular/core';
import { DotcmsConfigService, DotUiColors } from '@dotcms/dotcms-js';
import { DotUiColorsService } from '@services/dot-ui-colors/dot-ui-colors.service';
import { take, pluck } from 'rxjs/operators';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
@Component({
    selector: 'dot-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    editor = new Editor({
        extensions: [StarterKit]
    });

    value = '<p>Hello, Tiptap!</p>'; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor(
        private dotCmsConfigService: DotcmsConfigService,
        private dotUiColors: DotUiColorsService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.dotMessageService.init(false);
        this.dotCmsConfigService
            .getConfig()
            .pipe(take(1), pluck('colors'))
            .subscribe((colors: DotUiColors) => {
                this.dotUiColors.setColors(document.querySelector('html'), colors);
            });
    }
}
