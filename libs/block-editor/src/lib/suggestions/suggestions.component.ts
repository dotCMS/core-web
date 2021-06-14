import {
    Component,
    ComponentFactoryResolver,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { Editor } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { SuggestionListComponent } from '../suggestion-list/suggestion-list.component';
import tippy from 'tippy.js';
import { DotContentTypeService } from '../services/dotContentType.service';

@Component({
    selector: 'dotcms-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
    @ViewChild('container', { read: ViewContainerRef })
    container!: ViewContainerRef;

    popup;

    @Input() editor!: Editor;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.editor.registerPlugin(
            Suggestion({
                editor: this.editor,
                char: '/c',
                allowSpaces: true,
                startOfLine: true,
                command: () => {
                    console.log('command');
                },
                allow: ({ editor, range }) => {
                    return editor.can().insertContentAt(range, { type: 'dotContentAutoComplete' });
                },
                items: () => [],
                render: this.render.bind(this)
            })
        );
    }

    private render(): unknown {
        return {
            onStart: (props) => {
                console.log('onStart', props);

                DotContentTypeService.get().then((items) => {
                    const dynamicComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
                        SuggestionListComponent
                    );

                    // add the component to the view
                    const componentRef = this.container.createComponent(dynamicComponentFactory);
                    componentRef.instance.items = items.map((item) => {
                        return {
                            label: item['name'],
                            icon: 'pi pi-fw pi-plus',
                            command: () => {
                                console.log(item);
                            }
                        };
                    });
                    componentRef.changeDetectorRef.detectChanges();
                    // get the element
                    console.log(componentRef.location.nativeElement.querySelector('.p-menu'));

                    console.log(this.editor.view.dom);

                    this.popup = tippy(this.editor.view.dom, {
                        appendTo: document.body,
                        content: componentRef.location.nativeElement.querySelector('.p-menu'),
                        placement: 'auto-start',
                        getReferenceClientRect: props.clientRect,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual'
                    });
                });
            },
            onUpdate: (props) => {
                console.log('onUpdate: ', props);
            },
            onKeyDown(props) {
                console.log('onKeyDown', props);
            },
            onExit: () => {
                console.log('onExit');
                this.popup.destroy();
            }
        };
    }
}
