import { Injectable } from '@angular/core';
import { FormWindow, FormDataSource } from '@formql/core';
import { of, throwError, Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormqlService {

  constructor(private http: HttpClient) { }

  public commonParamProcess(params) {
    for (const key in params) {
      if (params[key] === null) {
        delete params[key];
      }
    }
  }

  public get(url: string, params: { [param: string]: string | string[] }): Observable<any> {
    const myUrl = 'https://www.studyinghome.com/mock/5e69c7288f77ec19c7ddc89d/form/' + url;
    this.commonParamProcess(params);
    const options = { params };
    return this.http.get(myUrl, options);
  }

  getData(dataSource: FormDataSource, ids: Array<string>) {
    if (!ids) {
      throwError('no ids provided!');
    }

    const item = localStorage.getItem(ids[0]);
    if (item) {
      return of(JSON.parse(item));
    }
    return this.http.get(`/assets/api/data.json`);
    return of({});
  }

  getFormData(param): Observable<any> {
    // const url = 'getFormData';
    // return this.get(url, param);
    return this.http.get(`assets/api/${param}.json`);
  }

  getForm(param) {
    // const url = 'getFormStructure';
    // return this.get(url, param);
    const item = localStorage.getItem(param);
    if (item) {
      return of(JSON.parse(item));
    } else {
      return this.http.get(`assets/api/${param}.json`);
    }
  }

  getForms() {
    return of(new Array<FormWindow>());
  }

  saveForm(name: string, form: FormWindow) {
    localStorage.setItem(name, JSON.stringify(form));
    return of(form);
  }

  saveData(dataSource: FormDataSource, ids: Array<string>, data: any) {
    if (!ids) {
      throwError('no ids provided!');
    }

    localStorage.setItem(ids[0], JSON.stringify(data));
    return of(data);
  }

  /**
   * 根据url获取数据
   * @param url 
   */
  getDataByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }
}
