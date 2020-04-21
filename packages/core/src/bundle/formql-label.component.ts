import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';


@Component({
    selector: 'formql-label',
    template: `<p>
    <span style="display: inline-block;min-width: 88px;">{{field.label}}:</span>
    <i class="{{field.className}}">{{field.value}}</i>
  </p>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLLabelComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLLabelComponent),
            multi: true
        }]
})
export class FormQLLabelComponent implements ControlValueAccessor {
    static componentName = 'FormQLLabelComponent';
    static formQLComponent = true;
    static validators = [];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    private _propagateChange = (_: any) => { };

    constructor() {
    }

    ngOnInit(): void {
        // console.warn(this.field);
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
}
