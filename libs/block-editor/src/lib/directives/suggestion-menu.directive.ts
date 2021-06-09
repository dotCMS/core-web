import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Editor, Range } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { DotContentTypeService } from '../services/dotContentType.service';
import { DotContentLetService } from '../services/dotContentLet.service';

@Directive({
    selector: 'dot-suggestion-menu[editor]'
})
export class SuggestionMenuDirective {
    constructor(private _el: ElementRef<HTMLElement>) {}

    @Input() editor!: Editor;
    @Output() items = new EventEmitter<any>();
    @Input() set selected(value: any) {
        this.handleSelected(value);
    }

    private onStartProps: any;
    private onStartTippy: any;

    ngOnInit(): void {
        if (!this.editor) {
            throw new Error('Required: Input `editor`');
        }

        DotContentTypeService.get().then((items) => {
            this.editor.registerPlugin(
                Suggestion({
                    editor: this.editor,
                    char: '/c',
                    allowSpaces: true,
                    startOfLine: true,
                    command: this.command,
                    allow: ({ editor, range }) => {
                        return editor
                            .can()
                            .insertContentAt(range, { type: 'dotContentAutoComplete' });
                    },
                    items: () => items,
                    render: this.render.bind(this)
                })
            );
        });
    }

    // ngOnDestroy(): void {
    //     this.editor.unregisterPlugin(Suggestion);
    // }

    handleSelected(item: any): void {
        console.log('selected', item);
        if (this.isContentlet(item)) {
            this.onStartProps.command({ contentlet: item });
        } else {
            DotContentLetService.get(item.variable).then((items) => {
                this.items.emit(items);
            });
        }
    }

    private command({ editor, range, props }: { editor: Editor; range: Range; props: any }): void {
        editor
            .chain()
            .focus()
            .insertContentAt(range, {
                type: 'dotContent',
                attrs: {
                    data: props.contentlet
                }
            })
            .run();
    }

    private getItems(): any {
        return [{ name: 'A' }, { name: 'B' }];
    }

    private render(): any {
        let dotListing;
        let popup;
        this.onStartTippy = popup;
        // const loader = this.getLoader();
        return {
            onStart: (props) => {
                this.onStartProps = props;
                dotListing = document.createElement('dot-listing');
                popup = tippy('body', {
                    appendTo: 'parent',
                    getReferenceClientRect: props.clientRect,
                    content: this.getLoader(),
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual'
                });
                DotContentTypeService.get().then((items) => {
                    // dotListing.items = generateListOptions(items);
                    this.items.emit(items);
                    popup[0].setContent(this._el.nativeElement);
                });

                // dotListing.addEventListener('selected', (item: CustomEvent) => {
                //     const data: DotListItemModel = item.detail;
                //     if (isContentlet(data.value)) {
                //         props.command({ contentlet: data.value });
                //     } else {
                //         popup[0].setContent(loader);
                //         getContentlets(data.value.variable, dotListing, popup[0]);
                //     }
                // });
            },
            onUpdate(props) {
                console.log('onUpdate: ', props);
            },
            onKeyDown(props) {
                //   return handleKeyDown(props, dotListing);
            },
            onExit() {
                console.log('onExit');
                popup[0].destroy();
            }
        };
    }

    private getLoader(): HTMLElement {
        const loader = document.createElement('dot-loading');
        loader.innerHTML = '<div></div>';
        return loader;
    }

    // function getContentlets(variable: string, dotListing, tippy): void {
    //     DotContentLetService.get(variable).then((items) => {
    //         dotListing.items = generateContentOptions(items);
    //         tippy.setContent(dotListing);
    //     });
    // }

    private isContentlet(item: any): boolean {
        return item.publishDate ? true : false;
    }
}
