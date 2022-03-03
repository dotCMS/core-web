import BubbleMenu, { BubbleMenuOptions } from '@tiptap/extension-bubble-menu';
import { DotBubbleMenuPlugin } from '../plugins/dot-bubble-menu.plugin';
import { ViewContainerRef } from '@angular/core';
import { BubbleMenuComponent } from './components/bubble-menu/bubble-menu.component';

export const DotBubbleMenuExtension = (viewContainerRef: ViewContainerRef) => {
    const mile = viewContainerRef.createComponent(BubbleMenuComponent);

    debugger;
    return BubbleMenu.extend<BubbleMenuOptions>({
        addProseMirrorPlugins() {
            if (!this.options.element) {
                return [];
            }

            return [
                DotBubbleMenuPlugin({
                    pluginKey: this.options.pluginKey,
                    editor: this.editor,
                    element: this.options.element,
                    tippyOptions: this.options.tippyOptions,
                    shouldShow: this.options.shouldShow
                })
            ];
        }
    });
};

// export const DotBubbleMenuExtension = BubbleMenu.extend<BubbleMenuOptions>({
//     addProseMirrorPlugins() {
//         if (!this.options.element) {
//             return [];
//         }
//
//         return [
//             DotBubbleMenuPlugin({
//                 pluginKey: this.options.pluginKey,
//                 editor: this.editor,
//                 element: this.options.element,
//                 tippyOptions: this.options.tippyOptions,
//                 shouldShow: this.options.shouldShow
//             })
//         ];
//     }
// });
