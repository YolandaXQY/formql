import { Component, OnInit, Input, Self } from '@angular/core';
import { FormQLDynamicWarpperService } from './formql-dynamic-warpper.service';
import { FormService, StoreService } from '@formql/core';

@Component({
  selector: 'app-formql-dynamic-warapper',
  template: `<ng-content></ng-content>`,
  providers: [
    StoreService,
    FormService,
    FormQLDynamicWarpperService,
    { provide: 'FormQLService', useExisting: FormQLDynamicWarpperService }
  ]
})
export class FormqlDynamicWarapperComponent implements OnInit {

  @Input()
  set formData(form: string) {
    this.service.form$.next(form);
  }
  @Input()
  set data(ids: string[]) {
    this.service.data$.next(ids);
  }
  constructor(@Self() private service: FormQLDynamicWarpperService) {
  }

  ngOnInit() {

  }

}
