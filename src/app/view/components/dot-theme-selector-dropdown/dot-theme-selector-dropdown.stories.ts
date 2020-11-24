import { Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { PaginatorService } from '@services/paginator';
import { moduleMetadata } from '@storybook/angular';
import { SiteService } from 'dotcms-js';
import { of } from 'rxjs';
import { DotThemeSelectorDropdownComponent } from './dot-theme-selector-dropdown.component';
import { DotThemeSelectorDropdownModule } from './dot-theme-selector-dropdown.module';

@Pipe({
    name: 'dm'
})
class DotMessagePipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
}

export default {
    title: 'DotCMS/Forms/ThemeSelector',
    component: DotThemeSelectorDropdownComponent,
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: PaginatorService,
                    useValue: {
                        setExtraParams() {},
                        getWithOffset() {
                            return of([]);
                        }
                    }
                },
                {
                    provide: SiteService,
                    useValue: {
                        getCurrentSite() {
                            return of({ identifier: 'asasasa' });
                        }
                    }
                },
                {
                    provide: DotThemesService,
                    useValue: {
                        get() {
                            return of({});
                        }
                    }
                }
            ],
            imports: [ReactiveFormsModule, DotThemeSelectorDropdownModule],
            declarations: [DotMessagePipe]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: 'DotCMS Theme Selector'
            },
            iframeHeight: 800
        }
    },
    args: {
        name: 'hello',
        themeid: 'themeid',
        onThemeSelectorChange: (event) => {
            console.log(event);
        },
        data: [],
        placeholder: 'Select Theme'
    }
};

const ThemeSelectorTemplate = `
  <dot-theme-selector-dropdown
          formControlName="themeid"
          (change)="onThemeSelectorChange($event)"
  ></dot-theme-selector-dropdown>
`;

export const Basic = (props) => {
    console.log(props);
    return {
        template: ThemeSelectorTemplate,
        props
    };
};
Basic.parameters = {
    docs: {
        source: {
            code: ThemeSelectorTemplate
        }
    }
};
