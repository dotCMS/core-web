export interface DotKeyValue {
    key: string;
    hidden?: boolean;
    value: string;
}

export interface DotKeyValueSaveData {
    variable: DotKeyValue;
    index: number;
}
