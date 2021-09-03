import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state';
import { serializeForClipboard } from 'prosemirror-view/src/clipboard';
import { EditorView } from 'prosemirror-view';

export const DragHandler = Extension.create({
    name: 'dragHandler',

    addProseMirrorPlugins() {
        const brokenClipboardAPI = false; // (browser.ie && browser.ie_version < 15) || (browser.ios && browser.webkit_version < 604)

        function createRect(rect) {
            if (rect == null) {
                return null;
            }
            let newRect = {
                left: rect.left + document.body.scrollLeft,
                top: rect.top + document.body.scrollTop,
                width: rect.width,
                height: rect.height,
                bottom: 0,
                right: 0
            };
            newRect.bottom = newRect.top + newRect.height;
            newRect.right = newRect.left + newRect.width;
            return newRect;
        }

        function absoluteRect(element: HTMLElement): ClientRect {
            return createRect(element.getBoundingClientRect());
        }

        function removeNode(node) {
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }

        function blockPosAtCoords(coords, view) {
            let pos = view.posAtCoords(coords);
            let node = view.domAtPos(pos.pos);

            node = node.node;
            while (node && node.parentNode) {
                if (node.parentNode.classList.contains('ProseMirror')) {
                    // todo
                    break;
                }
                node = node.parentNode;
            }
            if (node && node.nodeType === 1) {
                let desc = view.docView.nearestDesc(node, true);
                if (!(!desc || desc === view.docView)) {
                    return desc.posBefore;
                }
            }
            return null;
        }

        function dragStart(e, view: EditorView) {
            if (!e.dataTransfer) return;

            let coords = { left: e.clientX + 50, top: e.clientY };
            let pos = blockPosAtCoords(coords, view);
            if (pos != null) {
                view.dispatch(
                    view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos))
                );

                let slice = view.state.selection.content();
                let { dom, text } = serializeForClipboard(view, slice);

                e.dataTransfer.clearData();
                e.dataTransfer.setData(brokenClipboardAPI ? 'Text' : 'text/html', dom.innerHTML);
                if (!brokenClipboardAPI) e.dataTransfer.setData('text/plain', text);

                view.dragging = { slice, move: true };
            }
        }

        let dropElement;
        const WIDTH = 24;

        return [
            new Plugin({
                key: new PluginKey('dragHandler'),
                view: (editorView) => {
                    dropElement = document.createElement('div');
                    dropElement.setAttribute('draggable', 'true');
                    dropElement.className = 'noteDragHandle';
                    dropElement.setAttribute('data-drag-handle', '');
                    dropElement.addEventListener('dragstart', (e) => dragStart(e, editorView));
                    dropElement.textContent = '⠿';
                    document.body.appendChild(dropElement);
                    return {
                        update(view, prevState) {},
                        destroy() {
                            removeNode(dropElement);
                            dropElement = null;
                        }
                    };
                },
                props: {
                    handleDOMEvents: {
                        drop(view, event) {
                            // debugger;
                            // setTimeout(() => {
                            //     let node = document.querySelector('.ProseMirror-hideselection');
                            //     if (node) {
                            //         node.classList.remove('ProseMirror-hideselection');
                            //     }
                            // }, 50);
                            event.stopPropagation();
                            return false;
                        },
                        mousemove(view, event) {
                            let coords = { left: event.clientX, top: event.clientY };
                            let pos = view.posAtCoords(coords);
                            let node: any = view.domAtPos(pos.pos, 0);
                            console.log('node----INICIAL----', node);

                            node = node.node;
                            while (node && node.parentNode) {
                                console.log('node.parentNode.classList', node.parentNode.classList);
                                if (node.classList?.contains('ProseMirror')) {
                                    break;
                                }
                                if (node.parentNode.classList?.contains('ProseMirror')) {
                                    break;
                                }
                                node = node.parentNode;
                            }

                            console.log('node procesado', node);
                            if (node && !node.classList?.contains('ProseMirror')) {
                                // console.log('node.innerText', node.innerText === null);
                                // if (node.innerText === '') {
                                //     dropElement.style.left = '-10000px';
                                // }
                                let rect = absoluteRect(node);
                                let win = node.ownerDocument.defaultView;
                                rect.top += win.pageYOffset;
                                rect.left += win.pageXOffset;
                                // rect.width = WIDTH + 'px';
                                dropElement.style.left = -WIDTH + rect.left + 'px';
                                dropElement.style.top = rect.top + 'px';
                            } else {
                                console.log('no hay node');
                            }

                            return true;
                        }
                    }
                }
            })
        ];
    }
});
