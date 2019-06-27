import { DotFieldStatus } from './dot-field-status.model';

export interface DotFieldEvent {
    name: string;
}

export interface DotFieldStatusEvent extends DotFieldEvent {
    status: DotFieldStatus;
}

export interface DotInputCalendarStatusEvent extends DotFieldStatusEvent {
    isValidRange: boolean;
}

export interface DotFieldValueEvent extends DotFieldEvent {
    fieldType?: string;
    value: string;
}

export interface DotBinaryFileEvent {
    file: string | File;
    errorType: string;
}

export interface DotBinaryTextStatusEvent extends DotFieldStatusEvent {
    errorType: string;
}
