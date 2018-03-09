export interface Workflow {
    assignable: boolean;
    commentable: boolean;
    condition?: string;
    icon: string;
    id: string;
    name: string;
    nextAssign: string;
    nextStep: string;
    nextStepCurrentStep: string;
    order: number;
    owner?: string;
    requiresCheckout: boolean;
    roleHierarchyForAssign: boolean;
    schemeId: string;
    shown: string[];
    stepId?: string;
}
