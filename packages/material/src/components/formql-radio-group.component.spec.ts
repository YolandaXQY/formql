import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormqlRadioGroupComponent } from './formql-radio-group.component';

describe('FormqlRadioGroupComponent', () => {
  let component: FormqlRadioGroupComponent;
  let fixture: ComponentFixture<FormqlRadioGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormqlRadioGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormqlRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
