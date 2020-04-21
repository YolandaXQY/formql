import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormqlMatSelectComponent } from './formql-mat-select.component';

describe('FormqlMatSelectComponent', () => {
  let component: FormqlMatSelectComponent;
  let fixture: ComponentFixture<FormqlMatSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormqlMatSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormqlMatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
