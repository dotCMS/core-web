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
