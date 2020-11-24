import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { FormatDateService } from '@services/format-date-service';
import { PaginatorService } from '@services/paginator';
import { moduleMetadata } from '@storybook/angular';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { SiteService } from 'dotcms-js';
import { of } from 'rxjs';
import { DotThemeSelectorDropdownComponent } from './dot-theme-selector-dropdown.component';

const messageServiceMock = new MockDotMessageService({});

export default {
    title: 'DotCMS/Forms/ThemeSelector',
    component: DotThemeSelectorDropdownComponent,
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                },
                {
                    provide: FormatDateService,
                    useValue: {}
                },
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
            imports: [SearchableDropDownModule],
            declarations: [DotThemeSelectorDropdownComponent]
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
