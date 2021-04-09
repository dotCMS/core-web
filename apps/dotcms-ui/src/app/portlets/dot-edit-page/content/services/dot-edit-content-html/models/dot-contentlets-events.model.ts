import { DotPageContent } from '@portlets/dot-edit-page/shared/models/dot-page-content.model';
import { DotPageContainer } from '@models/dot-page-container/dot-page-container.model';

export interface DotContentletEvent<T> {
    name: string;
    data: T;
}

export interface DotContentletEventRelocate extends DotContentletEvent<DotRelocatePayload> {}
export interface DotContentletEventSelect extends DotContentletEvent<DotPageContent> {}
export interface DotContentletEventSave extends DotContentletEvent<DotPageContent> {}

export interface DotRelocatePayload {
    container: DotPageContainer;
    contentlet: DotPageContent;
}

export interface DotInlineEditContent {
    innerHTML: string;
    dataset: { mode: string; inode: string; fieldName: string; language: string };
    element: HTMLElement;
    isNotDirty: boolean;
    eventType: string;
}