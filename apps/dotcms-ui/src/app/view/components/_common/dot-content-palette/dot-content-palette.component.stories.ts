import { DotContentPaletteComponent } from '@components/_common/dot-content-palette/dot-content-palette.component';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotIconModule } from '@dotcms/ui';

export default {
    title: 'DotCMS/ Content Palette',
    component: DotContentPaletteComponent,
    decorators: [
        moduleMetadata({
            declarations: [DotContentPaletteComponent],
            imports: [CommonModule, DotPipesModule, DotIconModule]
        })
    ]
} as Meta;

export const Default: Story<DotContentPaletteComponent> = (props) => {
    return {
        moduleMetadata: {
            declarations: [DotContentPaletteComponent]
        },
        component: DotContentPaletteComponent,
        props,
        template: `<dot-content-palette></dot-content-palette>`
    };
};
