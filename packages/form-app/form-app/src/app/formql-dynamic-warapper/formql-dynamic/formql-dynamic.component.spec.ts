import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormqlDynamicComponent } from './formql-dynamic.component';

describe('FormqlDynamicComponent', () => {
  let component: FormqlDynamicComponent;
  let fixture: ComponentFixture<FormqlDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormqlDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormqlDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
