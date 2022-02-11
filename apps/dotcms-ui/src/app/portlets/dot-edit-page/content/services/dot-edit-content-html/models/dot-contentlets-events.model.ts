import { DotPageContent } from '@portlets/dot-edit-page/shared/models/dot-page-content.model';
import { DotPageContainer } from '@models/dot-page-container/dot-page-container.model';

export interface DotContentletEvent<T> {
    name: string;
    data: T;
}

export type DotContentletEventDragAndDropDotAsset = DotContentletEvent<DotAssetPayload>
export type DotContentletEventRelocate = DotContentletEvent<DotRelocatePayload>
export type DotContentletEventSelect = DotContentletEvent<DotPageContent>
export type DotContentletEventSave = DotContentletEvent<DotPageContent>

export interface DotAssetPayload {
    contentlet: DotPageContent;
    placeholderId: string;
}

export interface DotRelocatePayload {
    container: DotPageContainer;
    contentlet: DotPageContent;
}

export interface DotInlineDataset {
    mode: string;
    inode: string;
    fieldName: string;
    language: string;
}

export interface DotInlineEditContent {
    innerHTML: string;
    dataset: DotInlineDataset;
    element: HTMLElement;
    isNotDirty: boolean;
    eventType: string;
}
