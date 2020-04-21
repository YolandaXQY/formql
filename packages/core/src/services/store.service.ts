import { Injectable, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, filter, startWith} from 'rxjs/operators';
import { FormError, FormState } from '../models/form-window.model';
import { FormService } from './form.service';
import { FormComponent, ComponentControl } from '../models/form-component.model';
import { HelperService } from './helper.service';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { InternalEventType } from '../models/internal-event.model';
import { FormPage } from '../models/form-page.model';
import { FormSection } from '../models/form-section.model';

@Injectable({ providedIn: 'root' })
export class StoreService implements OnDestroy {
    constructor(
        private formService: FormService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private formBuilder: FormBuilder
    ) { }

    private data$ = new Subject<any>();

    private formState$ = new Subject<FormState>();

    private readonly serviceDestroyed = new Subject();

    private formState: FormState;

    private formControls: ComponentControl[];


    ngOnDestroy(): void {
        this.data$.complete();
        this.data$.unsubscribe();
    }

    getData(): Observable<FormComponent<any>[]> {
        return this.data$.asObservable();
    }

    getFormState(): Observable<FormState> {
        return this.formState$.asObservable();
    }

    updateFormData(data: any): void {
        this.formState.data = data;
        this.formState$.next(this.formState);
        this.formState.components.forEach(component => {
           this.formState.components.forEach((c: FormComponent<any>) => {
                if (c.schema === component.schema || (c.schema && c.schema.indexOf('.') === -1)) {
                    c.value = this.formService.getValue(c.schema, this.formState.data, c.type);
                    this.formState.data = this.formService.setValue(c.schema, c.value, this.formState.data);
                }
            });
        });
        // 初始化值后需要更新校验。在layout执行完现在也会执行一次重置校验。
        this.formControls = this.formService.resetValidators(this.formState, this.formControls);
    }

    setComponet(component: FormComponent<any>) {
        this.formState = this.formService.updateComponent(component, this.formState);
        this.formControls = this.formService.resetValidators(this.formState, this.formControls);
        this.data$.next(this.formState.data);
    }

    getAll(ids: Array<string>, structureData: any, data: any, formName: string) {
        this.formService.getFormAndData(structureData, data, formName).pipe(takeUntil(this.serviceDestroyed)).subscribe(response => {
            this.formState = { ...response };
            this.formState.ids = ids;
            if (this.formState.form.pages != null && this.formState.form.pages.length > 0) {
                const reactiveFormStructure = HelperService.createReactiveFormStructure(this.formState.form);
                this.formControls = reactiveFormStructure.formControls;
                this.formState.reactiveForm = this.formBuilder.group(reactiveFormStructure.pageGroup);
                this.formControls = this.formService.resetValidators(this.formState, this.formControls);
                // this.validateForm();
               
                this.formState$.next(this.formState);
            }
            this.data$.next(response.data);
        },
            error => {
                this.formState$.next({
                    form: {
                        error: HelperService.formatError({
                            title: 'Error loading form or data',
                            error
                        } as FormError)
                    }
                } as FormState);
            });
    }

    saveForm() {
        this.formService.saveForm(this.formState.form.formName, this.formState.form);
    }

    saveData() {
        return this.formState.data;
        // return this.formService.saveData(this.formState.form.dataSource, this.formState.ids, this.formState.data);
    }

    validateForm() {
        HelperService.validateForm(this.formState.reactiveForm);
    }

    isFormValid() {
        return this.formState.reactiveForm.statusChanges.pipe(
            startWith(this.formState.reactiveForm.status),
            filter(status => status !== 'PENDING'),
            map(status => status === 'VALID' ? true : false)
        )
    }

    unsubscribeAll() {
        this.serviceDestroyed.next();
        this.serviceDestroyed.complete();
    }

    reSetForm(eventType: InternalEventType, event: any) {
        switch (eventType) {
            case InternalEventType.EditingForm:
                this.populateReactiveForm();
                break;

            case InternalEventType.DndFormChanged:
                const pageId = (event as FormPage).pageId;
                const indexDnd = this.formState.form.pages.findIndex(p => p.pageId === pageId);

                if (indexDnd >= 0) {
                    this.formState.form.pages[indexDnd] = event;
                }

                this.populateReactiveForm();
                break;

            case InternalEventType.RemoveComponent:
                const componentId = (event as FormComponent<any>).componentId;
                let updateSectionId = '';
                this.formState.form.pages.forEach(page => {
                    page.sections.forEach(section => {
                        const indexComponent = section.components.findIndex(c => c.componentId === componentId);
                        if (indexComponent >= 0) {
                            section.components.splice(indexComponent, 1);
                            updateSectionId = section.sectionId;
                        }
                    });
                });
                this.populateReactiveForm();
                break;

            case InternalEventType.RemoveSection:
                const sectionId = (event as FormSection).sectionId;
                let updatePageId = '';
                this.formState.form.pages.forEach(page => {
                    const indexSection = page.sections.findIndex(c => c.sectionId === sectionId);
                    if (indexSection >= 0) {
                        page.sections.splice(indexSection, 1);
                        updatePageId = page.pageId;
                    }
                });
                this.populateReactiveForm();
                break;
        }
    }

    private populateReactiveForm() {
        if (this.formState.form.pages != null && this.formState.form.pages.length > 0) {
            // 得到反应结构 -> 窗体控件/叶组和组件（如果是更新）
            const reactiveFormStructure = HelperService.createReactiveFormStructure(this.formState.form, true);
            this.formControls = reactiveFormStructure.formControls;

            // if it's an update, refresh reactive form, set all form controls, validators
            this.formState.form.pages.forEach(page => {
                this.formState.reactiveForm.setControl(page.pageId, reactiveFormStructure.pageGroup[page.pageId]);
            });
            this.formState.form = HelperService.updateTemplates(this.formState.form);
            if (reactiveFormStructure.components != null && reactiveFormStructure.components.length > 0) {
                this.formControls = this.formService.resetValidators(this.formState, this.formControls);
            }
        }
    }

};
