import { Injectable, Inject, ComponentFactoryResolver } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, concatMap, debounceTime, switchMap, first, catchError } from 'rxjs/operators';
import { FormWindow, FormState, FormDataSource } from '../models/form-window.model';
import { FormComponent, ComponentControl } from '../models/form-component.model';
import { UUID } from 'angular2-uuid';
import { HelperService } from './helper.service';
import { IFormQLService } from '../interfaces/formql-service';
import { HttpClient } from '@angular/common/http';
import { FormRule } from '../models/rule.model';
import { BasicValidatorTypes } from './basic-validator';
import { Validators, FormControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    private service: IFormQLService;

    constructor(
        @Inject('FormQLService') srv,
        private http: HttpClient
    ) {
        this.service = srv;
    }

    getFormAndData(structureData: any, data: any, formName?: string): Observable<FormState> {
        if (data) {
            return of(this.populateComponents(structureData, data));
        } else {
            return of(this.populateComponents(structureData, null));
        }
    }

    populateComponents(form: FormWindow, data: any): FormState {
        let formState = {
            components: new Array<FormComponent<any>>(),
            data: { ...data },
            form
        } as FormState;
        form.pages.forEach(page => {
            if (!page.pageId) {
                page.pageId = UUID.UUID();
            }

            if (page.sections != null) {
                page.sections.forEach(section => {

                    if (!section.sectionId) {
                        section.sectionId = UUID.UUID();
                    }

                    if (section.components != null) {
                        section.components.forEach(component => {
                            if (!component.componentId) {
                                component.componentId = UUID.UUID();
                            }
                            component.value = this.getValue(component.schema, data, component.type);
                            formState.components.push(component);

                            if (!data) {
                                formState.data = this.initiateData(formState.data, component.schema);
                            }
                        });
                    }
                });
            }
        });
        // formState = this.resolveConditions(formState);
        return formState;
    }

    initiateData(data: any, schema: string) {
        if (schema && schema.indexOf('.') !== -1) {
            const arr = schema.split('.');
            let item = data;
            let key = '';
            for (let i = 0; i <= arr.length - 2; i++) {
                key = arr[i];
                if (!item[key]) {
                    item[key] = {};
                }

                if (i !== arr.length - 2) {
                    item = item[key];
                }
            }
        }
        return data;
    }


    getValue(schema: string, data: any, type: string) {
        const evaluatedValue = HelperService.evaluateValue(schema, data);
        if (evaluatedValue.error) {
            return null;
        } else {
            return HelperService.resolveType(evaluatedValue.value, type);
        }
    }

    setValue(schema: string, value: any, data: any) {
        if (value === undefined || value === '') {
            value = null;
        }
        if (schema) {
            if (!data) {
                data = {};
            }
            let key = schema;
            if (schema.indexOf('.') !== -1) {
                const arr = schema.split('.');
                let item = data;
                for (let i = 0; i <= arr.length - 1; i++) {
                    key = arr[i];
                    if (!item[key]) {
                        item[key] = {};
                    }

                    if (i !== arr.length - 1) {
                        item = item[key];
                    }
                }
                item[key] = value;
            } else {
                data[key] = value;
            }
        }
        return data;
    }

    getData(query: FormDataSource, ids: Array<string>) {
        return this.service.getData(query, ids).pipe(
            map((data: any) => {
                if (data) {
                    return data;
                } else {
                    return {};
                }
            }));
    }

    getForms() {
        return this.service.getForms().pipe(
            map((data: any) => {
                return data;
            }));
    }

    getForm(name: string) {
        return this.service.getForm(name).pipe(
            map((data: FormWindow) => {
                return data;
            }));
    }

    saveForm(name: string, form: FormWindow) {
        // remove all transactional data
        const updateForm = HelperService.deepCopy(form);
        updateForm.pages.forEach(page => {
            page.sections.forEach(section => {
                section.components.forEach(component => {
                    component.value = null;
                    if (component.rules != null) {
                        Object.keys(component.rules).forEach(p => {
                            component.rules[p].value = null;
                        });
                    }
                });
            });
        });

        return this.service.saveForm(name, updateForm).pipe(
            map((response: any) => {
                return response;
            }));
    }

    saveData(dataSource: FormDataSource, ids: Array<string>, data: any) {
        return this.service.saveData(dataSource, ids, data).pipe(
            map((result: any) => {
                return result;
            }));
    }

    updateComponent(component: FormComponent<any>, formState: FormState) {
        const value = HelperService.resolveType(component.value, component.type);
        formState.data = this.setValue(component.schema, value, formState.data);
        return formState;
    }

    /**
     * 执行value的表达式计算
     * @param formState 
     */
    // resolveValueCondition(formState: FormState, reRun = false): FormState {
    //     let recalculate = false;
    //     const componentsWithValueRule = formState.components.filter((c: FormComponent<any>) => {
    //         return c.rules && Array.isArray(c.rules) && c.rules.find(rule => rule.key === 'value' && rule.condition)
    //     });
    //     componentsWithValueRule.forEach(component => {
    //         const rule = component.rules.find(rule => rule.key === 'value');
    //         const evaluatedValue = HelperService.evaluateValue(rule.condition, formState.data);
    //         if (!evaluatedValue.error) {
    //             const value = HelperService.resolveType(evaluatedValue.value, component.type);
    //             if (component.value !== value) {
    //                 component.value = value;
    //                 formState.data = this.setValue(component.schema, value, formState.data);
    //                 recalculate = true;
    //             }
    //         }
    //     });
    //     if (recalculate && !reRun) {
    //         recalculate = false;
    //         this.resolveValueCondition(formState, true);
    //     }
    //     return formState;
    // }

    /**
     * 找寻组件的formControl
     * @param component 
     * @param formControls 
     */
    findComponentFormControl(component: FormComponent<any>, formControls: Array<ComponentControl>) {
        let componentFormControl: ComponentControl;
        if (formControls && Array.isArray(formControls)) {
            componentFormControl = formControls.find(x => x.key === component.componentId);
        }
        return componentFormControl;
    }

    /**
     * 重置表单的校验
     */
    resetValidators(formState: FormState, formControls: Array<ComponentControl>): Array<ComponentControl> {
        for (let i = 0; i < formState.components.length; i++) {
            const currentComponent = formState.components[i];
            let componentFormControl: ComponentControl;
            if (formControls && Array.isArray(formControls)) {
                componentFormControl = formControls.find(x => x.key === currentComponent.componentId);
            }
            if (!componentFormControl) { continue; }
            if (!currentComponent.rules || !Array.isArray(currentComponent.rules || currentComponent.rules.length === 0)) {
                continue;
            }

            const validators = [];
            const asynValidators = [];
            componentFormControl.control.clearValidators();
            componentFormControl.control.clearAsyncValidators();

            for (let j = 0; j < currentComponent.rules.length; j++) {
                const currentRule = currentComponent.rules[j];
                if (!currentRule.condition) { continue; }

                const evaluatedValue = HelperService.evaluateCondition(currentRule.condition, formState.data);
                evaluatedValue.value = HelperService.resolveType(evaluatedValue.value, currentComponent.type);

                if (BasicValidatorTypes.includes(currentRule.key)) {
                    if (!evaluatedValue.value) { continue; }
                    if (currentRule.key === 'required') {
                        validators.push(Validators.required);
                    } else if (currentRule.key === 'requiredTrue') {
                        validators.push(Validators.requiredTrue);
                    } else if (currentRule.key === 'max') {
                        validators.push(Validators.max(currentRule.value));
                    } else if (currentRule.key === 'min') {
                        validators.push(Validators.min(currentRule.value));
                    } else if (currentRule.key === 'maxLength') {
                        validators.push(Validators.maxLength(currentRule.value));
                    } else if (currentRule.key === 'minLength') {
                        validators.push(Validators.minLength(currentRule.value));
                    } else if (currentRule.key === 'pattern') {
                        validators.push(Validators.pattern(currentRule.value));
                    } else if (currentRule.key === 'email') {
                        validators.push(Validators.email);
                    }
                } else if (currentRule.key === 'readonly') {
                    if (!evaluatedValue.error && Boolean(evaluatedValue.value)) {
                        componentFormControl.control.disable();
                    } else {
                        componentFormControl.control.enable();
                    }
                } else if (currentRule.key === 'hidden') {  // 因为组件内部是使用样式来控制的
                    if (!evaluatedValue.error) {
                        currentComponent.rules[j].conditionValue = Boolean(evaluatedValue.value);
                    }
                } else if (currentRule.key === "value") {
                    if (!evaluatedValue.error && currentComponent.value !== evaluatedValue.value) {
                        currentComponent.value = evaluatedValue.value;
                        componentFormControl.control.setValue(evaluatedValue.value);
                        formState.data = this.setValue(currentComponent.schema, evaluatedValue.value, formState.data);
                    }
                } else if (currentRule.key === 'server') {
                    asynValidators.push(this.createAsynValidator(currentRule, formState.data));
                } else if (currentRule.key === 'custom') {
                    asynValidators.push(this.createValidator(currentRule.condition, formState.data));
                } else if (currentRule.key === 'style') {
                    const styleValue = HelperService.evaluateCondition(currentRule.condition, formState.data)
                    if (!evaluatedValue.error) {
                        currentComponent.styleStr = styleValue.value;
                    } else {
                        currentComponent.styleStr = '';
                    }
                }
            }
            if (validators.length > 0) {
                componentFormControl.control.setValidators(validators);
            }
            if (asynValidators.length > 0) {
                componentFormControl.control.setAsyncValidators(asynValidators);
            }
            if (currentComponent.type === 'select' && currentComponent.dataSource === 'api') {
                this.getComponentConfiguration(currentComponent.apiAddress, formState.data).then(data => {
                    if (JSON.stringify(data) !== JSON.stringify(currentComponent.configuration)) {
                        currentComponent.configuration = data || [];
                    }                    
                });
            }
        }
        return formControls;
    }

    /**
     * 创建异步校验器
     * @param rule 
     */
    public createValidator(condition: string, data: any) {
        return (control: FormControl) => {
            return control.valueChanges.pipe(
                debounceTime(200),
                switchMap(() => of(HelperService.evaluateCondition(condition, data))),
                map(res => res.value ? null : {'custom': true } ),
                first()
            )
        }
    }

    /**
     * 服务端异步服务端校验器
     */
    public createAsynValidator(rule: FormRule, params: any) {
        return (control: FormControl) => {
            return control.valueChanges.pipe(
                // 防抖时间,最后一次
                debounceTime(400),
                // 将订阅的值指向新的订阅的返回值
                switchMap(() => this.filedIsValid(rule.serverUrl, params)),
                // 对返回值做处理
                map(res => res.success ? null : { serverError: true, errorMessage: res.message }),
                // 每次验证的结果是唯一的，截断流，类型unsubscribe()
                first()
            );
        }
    }

    /**
     * 远端校验字段是否合法
     * @param serverUrl 
     * @param params 
     */
    private filedIsValid(serverUrl: string, params = {}): Observable<any> {
        return this.http.post(serverUrl, params);
    }

    /**
     * 当formComponent的configration的是需要根据某个值动态加载的，需要调用这个函数
     * @param component
     * @param data
     */
    private getComponentConfiguration(apiAddress: string, data: any): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            let configuration = [];
            const reg = new RegExp(/\${.+}/g);
            const matchedStr = apiAddress.match(reg);
            const schema = matchedStr.length > 0 ? matchedStr[0].slice(2, -1) : null;
            if (schema !== null) {
                const value = HelperService.evaluateValue(schema, data).value;
                if (value) {
                    const apiAddr = apiAddress.replace(reg, value);
                    this.http.get(apiAddr).subscribe(res => {
                        // TODO 这边需要根据后端定义的json进行调整
                        configuration = res["data"] || [];
                        resolve(configuration);
                    }, err => {
                        resolve(configuration)
                    });
                   
                } else {
                    resolve(configuration);
                }

            } else {
                resolve(configuration);
            }
        });
    }



    /**
     * 根据规则进行值计算
     * 根据值规则进行初始值计算
     * @param formState
     * @param reRun
     */
    // resolveConditions(formState: FormState, reRun = false): FormState {
    //     let recalculate = false;
    //     formState.components.forEach(component => {

    //         const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
    //         const type = factories.find((x: any) => x.componentName === component.componentName);

    //         let formControl = null;
    //         if (formState.formControls && Array.isArray(formState.formControls)) {
    //             formControl = formState.formControls.find(x => x.key === component.componentId);
    //         }

    //         if (component.rules && Array.isArray(component.rules) && component.rules.length > 0) {
    //             component.rules.forEach((ruleItem: FormRule) => {

    //                 if (ruleItem.condition) {
    //                     if (ruleItem.key === 'value') {
    //                         const evaluatedValue = HelperService.evaluateCondition(ruleItem.condition, formState.data);
    //                         if (!evaluatedValue.error) {
    //                             const value = HelperService.resolveType(evaluatedValue.value, component.type);
    //                             if (component.value !== value) {
    //                                 recalculate = true;
    //                                 formState.data = this.setValue(component.schema, value, formState.data);
    //                             }
    //                         } else {
    //                             recalculate = false;
    //                         }
    //                     } else if (ruleItem.key === 'readonly') {
    //                         const evaluatedValue = HelperService.evaluateCondition(ruleItem.condition, formState.data);
    //                         if (formControl) {
    //                             if (!evaluatedValue.error && evaluatedValue.value === true) {
    //                                 formControl.control.disable();
    //                             } else {
    //                                 formControl.control.enable();
    //                             }
    //                         }
    //                         recalculate = false;
    //                     } else if (ruleItem.key === 'hidden') {
    //                         const evaluatedValue = HelperService.evaluateCondition(ruleItem.condition, formState.data);
    //                         ruleItem.conditionValue = evaluatedValue.value;
    //                         recalculate = false;
    //                     } else if (ruleItem.key === 'server') {
    //                         recalculate = false;
    //                     } else if (BasicValidatorTypes.includes(ruleItem.key)) {
    //                         recalculate = false;
    //                     }
    //                 }

    //             });
    //         }
    //     });

    //     // recalculate the calculated values as they might be dependant from each other
    //     if (recalculate) {
    //         recalculate = false;
    //         const componentsWithValueRule = formState.components.filter((c: FormComponent<any>) => {
    //             return c.rules && Array.isArray(c.rules) && c.rules.find(rule => rule.key === 'value' && rule.condition)
    //         });
    //         componentsWithValueRule.forEach(component => {
    //             const rule = component.rules.find(rule => rule.key === 'value');
    //             const evaluatedValue = HelperService.evaluateValue(rule.condition, formState.data);
    //             if (!evaluatedValue.error) {
    //                 const value = HelperService.resolveType(evaluatedValue.value, component.type);
    //                 if (component.value !== value) {
    //                     recalculate = true;
    //                     component.value = value;
    //                     formState.data = this.setValue(component.schema, value, formState.data);
    //                     rule.value = true;
    //                 }
    //             }
    //         });
    //         if (recalculate && !reRun) {
    //             formState = this.resolveConditions(formState, true);
    //         }
    //     }
    //     const configurationPromiseArr = [];
    //     formState.components.forEach(component => {
    //         if (component.type === 'select' && component.dataSource === 'api') {
    //             configurationPromiseArr.push(this.getComponentConfiguration(component.apiAddress, formState.data));
    //         }
    //     });
    //     Promise.all(configurationPromiseArr).then(data => {
    //         data.forEach(c => {
    //             let item = formState.components.find(d => d.componentId === c.componentId);
    //             if (item) {
    //                 item = Object.assign(item, c);
    //             }
    //         });
    //     });
    //     return formState;
    // }

}

