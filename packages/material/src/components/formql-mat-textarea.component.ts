import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent, FormValidator } from '@formql/core';
import { RuleErrorMessage } from './rule-error-message';

@Component({
    selector: 'formql-mat-textarea',
    template: `<div *ngIf="formControl!=null">
  <mat-form-field style="width: 100%">
    <textarea [id]="field.componentId"
        [type]="field.type" [formControl]="formControl" matInput [placeholder]="field.label"></textarea>
  </mat-form-field>
  <mat-error *ngIf="!formControl.valid && formControl.touched">
        <span *ngIf="formControl.errors?.required">{{ getErrorMessage('required') }} </span>
        <span *ngIf="formControl.errors?.email">{{ getErrorMessage('email') }}</span>
        <span *ngIf="formControl.errors?.max">{{ getErrorMessage('max') }}</span>
        <span *ngIf="formControl.errors?.min">{{ getErrorMessage('min') }}</span>
        <span *ngIf="formControl.errors?.maxlength">{{ getErrorMessage('maxLength') }}</span>
        <span *ngIf="formControl.errors?.minlength">{{ getErrorMessage('minLength') }}</span>
        <span *ngIf="formControl.errors?.pattern">{{ getErrorMessage('pattern') }}</span>
        <span *ngIf="formControl.errors?.serverError">{{ formControl.errors?.errorMessage  }}</span>
        <span *ngIf="formControl.errors?.custom">{{ getErrorMessage('custom')  }}</span>
  </mat-error>
</div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLMatTextareaComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLMatTextareaComponent),
            multi: true
        }]
})
export class FormQLMatTextareaComponent implements ControlValueAccessor {
    static componentName = 'FormQLMatTextareaComponent';
    static formQLComponent = true;

    static validators = [];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    private _propagateChange = (_: any) => { };

    constructor() {
    }

    get value(): any {

        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this._propagateChange(this._value);
    }

    writeValue(value: string): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    getErrorMessage(errorType: string): string {
        const rule = this.field.rules.find(d => d.key === errorType);
        let defaultErrorMessage: any;
        if(typeof RuleErrorMessage[errorType] === 'function') {
            defaultErrorMessage = RuleErrorMessage[errorType](rule.value);
        } else {
            defaultErrorMessage = RuleErrorMessage[errorType] || null;
        }
        return rule.errorMessage || defaultErrorMessage;
    }
}
