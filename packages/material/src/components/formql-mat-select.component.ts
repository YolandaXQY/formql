import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { OptionValue, FormComponent, FormValidator } from '@formql/core';

@Component({
  selector: 'formql-mat-form-select',
  template: `
  <div *ngIf="formControl!=null">    
    <mat-form-field style="width:100%">
      <mat-label>{{field.label}}</mat-label>
      <select matNativeControl [formControl]="formControl">
        <option *ngFor="let item of field.configuration" [value]="item.value">{{item.name}}</option>
      </select>
      <mat-error *ngIf="!formControl.valid && formControl.touched">
        <span *ngIf="formControl.errors?.required">{{ getErrorMessage('required') }}</span>
      </mat-error>
    </mat-form-field>
  </div>      
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormQLMatSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormQLMatSelectComponent),
      multi: true
    }]
})
export class FormQLMatSelectComponent implements OnInit, ControlValueAccessor {

  static componentName = 'FormQLMatSelectComponent';
  static formQLComponent = true;
  static validators = [];

  private _value: string;
  list: Array<OptionValue> = [];

  @Input() formControl: FormControl;
  @Input() field: FormComponent<any>;


  private _propagateChange = (_: any) => { };
  constructor(
  ) { }

  ngOnInit(): void {

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
    return rule.errorMessage || null;
  }

}
