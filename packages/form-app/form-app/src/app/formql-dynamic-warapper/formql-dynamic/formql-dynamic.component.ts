import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormQLMode } from '@formql/core';
import { zip } from 'rxjs';
import { DynamicFormqlService } from '../../service/dynamic-formql.service';

@Component({
  selector: 'app-formql-dynamic',
  templateUrl: './formql-dynamic.component.html',
  styleUrls: ['./formql-dynamic.component.less']
})
export class FormqlDynamicComponent implements OnInit {

  mode: FormQLMode = FormQLMode.View;

  @Input() layout: any;
  @Input() data: any;
  @Input() loading: boolean = true;

  @Input() params: any;

  @Output() onSaveEvent = new EventEmitter();


  constructor(private dynamicService: DynamicFormqlService) { }

  ngOnInit(): void {
    console.log(this.layout)
    if (this.params) {
      this.getPageData();
    }
  }

  /**
   * 动态根据url渲染页面
   */
  private getPageData(): void {

    const dataUrl = this.params.dataUrl;
    const layoutUrl = this.params.layoutUrl;
    if (!layoutUrl) return;

    this.loading = true;

    zip(
      this.dynamicService.getDataByUrl(dataUrl),
      this.dynamicService.getDataByUrl(layoutUrl)
    ).subscribe(res => {
      this.data = res[0];
      this.layout = res[1];
      this.loading = false;
    })
  }

  /**
   * 保存事件
   * @param data 
   */
  save(data: any): void {
    this.onSaveEvent.emit(data)
  }

}
