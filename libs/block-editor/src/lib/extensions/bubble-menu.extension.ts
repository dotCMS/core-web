import { ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';
import { Editor, Extension } from '@tiptap/core';

// ProseMirror
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// BubbleMenu
import { BubbleMenuComponent, BubbleMenuItem } from './components/bubble-menu/bubble-menu.component';
import { BubbleMenuPlugin } from '../plugins/bubble-menu.plugin';

// BubbleMenuOptions
import { BubbleMenuOptions } from '@tiptap/extension-bubble-menu';

function menuActions(editor: Editor, item: BubbleMenuItem): void {
    const markActions = {
        bold: () => {
            editor.commands.toggleBold();
        },
        italic: () => {
            editor.commands.toggleItalic();
        },
        strike: () => {
            editor.commands.toggleStrike();
        },
        underline: () => {
            editor.commands.toggleUnderline()
        },
        left: () => {
            toggleTextAlign(editor, 'left', item.active);
        },
        center: () => {
            toggleTextAlign(editor, 'center', item.active);
        },
        right: () => {
            toggleTextAlign(editor, 'right', item.active);
        },
        bulletList: () => {
            editor.commands.toggleBulletList();
        },
        orderedList: () => {
            editor.commands.toggleOrderedList();
        },
        indent: () => {
            if (isListNode(editor)) {
                editor.commands.sinkListItem('listItem');
            }
        },
        outdent: () => {
            if (isListNode(editor)) {
                editor.commands.liftListItem('listItem');
            }
        },
        clearAll: () => {
            editor.commands.unsetAllMarks();
            editor.commands.unsetTextAlign();
        }
    };

    markActions[item.markAction] ? markActions[item.markAction]() : null;
}

function toggleTextAlign(editor: Editor, aligment: string, active: boolean) {
    if(active) {
        editor.commands.unsetTextAlign();
    } else {
        editor.commands.setTextAlign(aligment);        
    }
}

function isListNode(editor: Editor) {
    return editor.isActive('bulletList') || editor.isActive('orderedList')
}

export const BubbleMenu = (injector: Injector, resolver: ComponentFactoryResolver) => {

    return Extension.create<BubbleMenuOptions>({
        name: 'bubbleMenu',

        addKeyboardShortcuts() {
            return {
                Tab: () => {
                    if (isListNode(this.editor)) {
                        return this.editor.commands.sinkListItem('listItem');
                    }
                },
                'Shift-Tab': () => {
                    if (isListNode(this.editor)) {
                        return this.editor.commands.liftListItem('listItem');
                    }
                }
            };
        },

        addProseMirrorPlugins() {
            const factoryMenu = resolver.resolveComponentFactory(BubbleMenuComponent);
            const bubbleMenu: ComponentRef<BubbleMenuComponent> = factoryMenu.create(injector);

            function onOpen(view: EditorView, key: PluginKey): void {
                bubbleMenu.instance.execMark = (item: BubbleMenuItem) => menuActions(this.editor, item);
                bubbleMenu.changeDetectorRef.detectChanges();
                changeState(view, key, true);
            }

            function updateActiveMarks(marks: string[]) {
                bubbleMenu.instance.activeMarks = marks;
                bubbleMenu.instance.updateActiveItems();
                bubbleMenu.changeDetectorRef.detectChanges();
            }

            function changeState(view: EditorView, key: PluginKey, open: boolean) {
                const transaction = view.state.tr.setMeta(key, {
                    open: open
                });
                view.dispatch(transaction);
            }

            return [
                BubbleMenuPlugin({
                    editor: this.editor,
                    element: bubbleMenu.location.nativeElement,
                    onOpen,
                    updateActiveMarks,
                    changeState
                })
            ];
        }
    });
};


