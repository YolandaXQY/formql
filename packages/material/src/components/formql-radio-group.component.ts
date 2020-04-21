import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormComponent } from '@formql/core';

@Component({
  selector: 'formql-form-radio-group',
  styles: [
    `.mat-radio-button { margin-right:20px;}`
  ],
  template: `
  <div *ngIf="formControl!=null">
    <div>
      <mat-radio-group  [formControl]="formControl">
        <mat-radio-button *ngFor="let item of field.configuration" [value]="item.value">{{item.name}}</mat-radio-button>
      </mat-radio-group>
    </div>
  </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormqlRadioGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormqlRadioGroupComponent),
      multi: true
    }
  ]
})
export class FormqlRadioGroupComponent implements OnInit, ControlValueAccessor {

  static componentName = 'FormqlRadioGroupComponent';
  static formQLComponent = true;
  static validators = [];

  @Input() formControl: FormControl;
  @Input() field: FormComponent<any>;

  constructor() {
   }

  writeValue(obj: any): void {
    // throw new Error("Method not implemented.");
  }

  registerOnChange(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
  }

}
