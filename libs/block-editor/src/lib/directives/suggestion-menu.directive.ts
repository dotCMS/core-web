import {
    Directive,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewContainerRef,
    ViewChild

} from '@angular/core';
import { Editor, Range } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { DotContentTypeService } from '../services/dotContentType.service';
import { DotContentLetService } from '../services/dotContentLet.service';

@Directive({
    selector: 'dot-suggestion-menu[editor]'
})
export class SuggestionMenuDirective implements OnInit {
    @ViewChild('container', { read: ViewContainerRef })
    container!: ViewContainerRef;

    constructor(private _el: ElementRef<HTMLElement>) {}

    @Input() editor!: Editor;
    @Output() items = new EventEmitter<any>();
    @Input() set selected(value: any) {
        if (value) {
            this.handleSelected(value);
        }
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

        console.log(this.container)
    }

    // ngOnDestroy(): void {
    //     this.editor.unregisterPlugin(Suggestion);
    // }

    handleSelected(item: any): void {
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

    private render(): any {
        let popup;
        this.onStartTippy = popup;
        // const loader = this.getLoader();
        return {
            onStart: (props) => {
                this.onStartProps = props;
                popup = tippy('body', {
                    appendTo: 'parent',
                    placement: 'auto-start',
                    getReferenceClientRect: props.clientRect,
                    content: this.getLoader(),
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual'
                });
                // DotContentTypeService.get().then((items) => {
                //     popup[0].setContent(this._el.nativeElement);
                //     // dotListing.items = generateListOptions(items);
                //     this.items.emit(items);
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

    private isContentlet(item: any): boolean {
        return item.publishDate ? true : false;
    }
}
