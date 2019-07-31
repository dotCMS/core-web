import { DotCMSContentType } from '../dot-content-types';

export interface DotWorkflowAction {
    assignable: boolean;
    commentable: boolean;
    condition: string;
    icon: string;
    id: string;
    name: string;
    nextAssign: string;
    nextStep: string;
    nextStepCurrentStep: boolean;
    order: number;
    owner?: string;
    roleHierarchyForAssign: boolean;
    schemeId: string;
    showOn: string[];
}

export enum DotSystemActionType {
    UNPUBLISH = 'UNPUBLISH',
    UNARCHIVE = 'UNARCHIVE',
    PUBLISH = 'PUBLISH',
    NEW = 'NEW',
    EDIT = 'EDIT',
    DESTROY = 'DESTROY',
    DELETE = 'DELETE',
    ARCHIVE = 'ARCHIVE'
}

export interface DotSystemActionMappings {
    [key: string]: DotSystemAction | string;
}

export interface DotSystemAction {
    identifier: string;
    systemAction: string;
    workflowAction: DotWorkflowAction;
    owner: DotCMSContentType;
    ownerContentType: boolean;
    ownerScheme: boolean;
}
