import { ResolvedPos } from 'prosemirror-model';
import { NodeTypes } from '@dotcms/block-editor';

/**
 * Get the parent node of the ResolvedPos sent
 * @param selectionStart ResolvedPos
 * @param nodeToFind NodeTypes
 */
export const findParentNode = (selectionStart: ResolvedPos, nodeToFind: NodeTypes = null) => {
    let depth = selectionStart.depth;
    let parent;
    do {
        parent = selectionStart.node(depth);
        if (parent) {
            if (nodeToFind != null) {
                if (parent.type.name === nodeToFind) {
                    break;
                }
            }
            depth--;
        }
    } while (depth > 0 && parent);

    return parent;
};

/**
 * Get the number of childs of a node
 * @param node Prosemirror Node
 */
export const getCountChildNodes = (node) => {
    return node ? node.content.content.length : 0;
};

/**
 * Get the type of the node sent
 * @param node Prosemirror Node
 */
export const getNodeType = (node) => {
    return node ? node?.type.name : null;
};
