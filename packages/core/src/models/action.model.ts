export enum FormActionType {
    Validate = 'validate',
    ValidateAndSave = 'validateAndSave',
    Save = 'save',
    Custom = 'custom',
    Switch = 'Switch'
}

export interface FormAction {
    key: FormActionType;
    customkey: string;
    parameters: any;
}


