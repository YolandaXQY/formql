import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { FormComponent, FormValidator, HelperService } from '@formql/core';
import { createNumberMask, createAutoCorrectedDatePipe } from 'text-mask-addons';
import { RuleErrorMessage } from './rule-error-message';

@Component({
    selector: 'formql-mat-form-field',
    template: `<div *ngIf="formControl!=null" class="{{field.styleStr}}">
    <mat-form-field style="width:100%">
      <input *ngIf="currencyMask" [textMask]="{mask: currencyMask}" [id]="field.componentId"
        [type]="field.type == 'number' ? 'text' : field.type" [formControl]="formControl" matInput [placeholder]="field.label">
      <input *ngIf="!currencyMask" [id]="field.componentId"
        [type]="field.type" [formControl]="formControl" matInput [placeholder]="field.label" >
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
    </mat-form-field>
  </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLMatFormFieldComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLMatFormFieldComponent),
            multi: true
        }]
})
export class FormQLMatFormFieldComponent implements OnInit, ControlValueAccessor {

    static componentName = 'FormQLMatFormFieldComponent';   // 可废弃
    static formQLComponent = true;  // 可废弃

    static validators = []; // 可废弃

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    currencyMask: any;

    private _propagateChange = (_: any) => { };

    constructor() {}

    ngOnInit(): void {
        // if (this.field && this.field.textMask)
        //     this.currencyMask = createNumberMask(this.field.textMask);
        if (this.field && this.field.textMask && this.field.type) {
            switch (this.field.type) {
                case 'number':
                    this.currencyMask = createNumberMask(this.field.textMask);
                    break;

                case 'date':
                    this.currencyMask = createAutoCorrectedDatePipe(this.field.textMask);
                    break;

                case 'text':
                    this.currencyMask = HelperService.maskToArray(this.field.textMask);
                    break;
            }
        }
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
