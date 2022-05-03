import { ResolvedPos } from 'prosemirror-model';
import { NodeTypes } from '@dotcms/block-editor';

/**
 * Get the parent node of the ResolvedPos sent
 * @param selectionStart ResolvedPos
 * @param NodesTypesToFind NodeTypes
 */
export const findParentNode = (
    selectionStart: ResolvedPos,
    NodesTypesToFind?: Array<NodeTypes>
) => {
    let depth = selectionStart.depth;
    let parent;
    do {
        parent = selectionStart.node(depth);
        if (parent) {
            if (Array.isArray(NodesTypesToFind)) {
                if (NodesTypesToFind.includes(parent.type.name)) {
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
