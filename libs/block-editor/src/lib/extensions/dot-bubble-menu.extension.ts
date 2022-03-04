import { ViewContainerRef, Type } from '@angular/core';
import BubbleMenu, { BubbleMenuOptions } from '@tiptap/extension-bubble-menu';
import { Props } from 'tippy.js';
import { DotBubbleMenuPlugin } from '../plugins/dot-bubble-menu.plugin';
import { shouldShowBubbleMenu } from '../utils/bubble-menu.utils';

const defaultTippyOptions: Partial<Props> = {
    duration: 500,
    maxWidth: 'none',
    placement: 'top-start',
    trigger: 'manual'
};

// TODO: Create a Type for this Generic Component
export function DotBubbleMenuExtension(type: Type<any>, viewContainerRef: ViewContainerRef) {
    // Create Instance Component
    const angularComponent = viewContainerRef.createComponent(type);
    const htmlElement = angularComponent.location.nativeElement;

    return BubbleMenu.extend<BubbleMenuOptions>({
        // Default Options
        addOptions(): BubbleMenuOptions {
            return {
                element: null,
                tippyOptions: defaultTippyOptions,
                pluginKey: 'bubbleMenu',
                shouldShow: shouldShowBubbleMenu
            };
        },

        addProseMirrorPlugins() {
            if (!htmlElement) {
                return [];
            }

            // Temporary, while we move all the methods that use the editor inside the component to the plugin
            angularComponent.instance.editor = this.editor;

            return [
                DotBubbleMenuPlugin({
                    component: angularComponent,
                    pluginKey: this.options.pluginKey,
                    editor: this.editor,
                    element: htmlElement,
                    tippyOptions: this.options.tippyOptions,
                    shouldShow: this.options.shouldShow
                })
            ];
        }
    });
}
