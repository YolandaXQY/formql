import {
    OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver,
    Input, OnInit, Output, EventEmitter, SimpleChanges, ElementRef, Renderer2
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormWindow, FormError, FormState } from '../models/form-window.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventHandler, InternalEventType } from '../models/internal-event.model';
import { HelperService } from '../services/helper.service';
import { FormComponent } from '../models/form-component.model';
import { StoreService } from '../services/store.service';
import { FormQLMode } from '../models/type.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionHandlerService } from '../services/action-handler.service';
import { FormActionType, FormAction } from '../models/action.model';
import { take } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'formql',
    styleUrls: ['./formql.component.scss'],
    template: `
                <head #headDiv></head>
                <div *ngIf="error" class="fql-error-message">
                    <h4>{{error?.title}}</h4>
                    <span>{{error?.message}}</span>
               </div>
               <ng-container #target></ng-container>`
})
export class FormQLComponent implements OnDestroy, OnInit {
    static componentName = 'FormQLComponent';

    @Input() formName: string;
    @Input() ids: Array<string>;
    @Input() mode: FormQLMode = FormQLMode.View;

    @Input() reactiveForm: FormGroup;
    @Input() customMetadata: any;
    // 从外部接收页面结构需要的所有数据
    @Input() formStructureData: any;
    // 从外部接收页面内数据
    @Input() formData: any;

    @Output() onSaveEvent = new EventEmitter();

    @Output() formLoaded: EventEmitter<boolean> = new EventEmitter();
    @Output() formSaveStart: EventEmitter<any> = new EventEmitter();
    @Output() formSaveEnd: EventEmitter<boolean> = new EventEmitter();
    @Output() formError: EventEmitter<boolean> = new EventEmitter();
    @Output() formSwitch: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('headDiv', {static: true}) headDiv: ElementRef;
    @ViewChild('target', { read: ViewContainerRef, static: true }) target: ViewContainerRef;

    private componentDestroyed = new Subject();

    form: FormWindow;
    data: any;
    allComponents: FormComponent<any>[] = [];

    data$ = this.storeService.getData();
    formState$ = this.storeService.getFormState();

    error: FormError;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private internalEventHandlerService: InternalEventHandlerService,
        private actionHandlerService: ActionHandlerService,
        private storeService: StoreService,
        private renderer2: Renderer2
    ) {
    }

    // tslint:disable-next-line:use-lifecycle-interface
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.formStructureData && changes.formStructureData.currentValue) {
            this.storeService.getAll(this.ids, this.formStructureData, null, this.formName);
            
            if (this.formStructureData.styleUrl) {
                this.addCss(this.formStructureData.styleUrl);
            }
        }

        if (changes.formData && changes.formData.currentValue && this.formStructureData) {
            this.formData = changes.formData.currentValue;
            this.storeService.updateFormData(this.formData);
        }
    }

    ngOnInit() {
        if (this.mode === FormQLMode.Edit) {
            this.loadInternalEventHandlers();
        }

        this.loadActionHandlers();

        this.formState$.pipe(takeUntil(this.componentDestroyed)).subscribe(formState => {
            this.loadForm(formState);
        });

        this.data$.pipe(takeUntil(this.componentDestroyed)).subscribe(data => this.data = data);


        if (this.formStructureData) {
            console.warn(this.formData);
        }
        // this.storeService.getAll(this.formName, this.ids);
    }

    addCss(path) {
        if (path) {
            const link = this.renderer2.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            this.renderer2.appendChild(this.headDiv.nativeElement, link);
        }
    }

    removeCss(path) {
        if (path) {
            const link = this.headDiv.nativeElement;
            this.renderer2.removeChild(this.headDiv.nativeElement, link);
        }
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
        // this.removeCss(this.formStructureData.styleUrl);
    }

    loadForm(formState: FormState) {
        this.form = formState.form;
        this.reactiveForm = formState.reactiveForm;
        this.allComponents = formState.components;

        if (this.target) {
            this.target.clear();
        }

        const componentRef = this.vcRef.createComponent(
            HelperService.getFactory(this.componentFactoryResolver, formState.form.layoutComponentName));

        const component = (componentRef as any);
        component.instance.form = formState.form;
        component.instance.reactiveForm = formState.reactiveForm;
        component.instance.mode = this.mode;

        this.target.insert(component.hostView);

        this.formLoaded.emit(true);
    }

    saveForm() {
        this.storeService.saveForm();
    }

    saveData() {
        const data = this.storeService.saveData();
        // this.formSaveStart.emit(data);
        this.onSaveEvent.emit(data);
        // this.storeService.saveData().subscribe(response => {
        //     this.formSaveEnd.emit(true);
        // },
        //     error => {
        //         this.formError.emit(error);
        //     });
    }

    switchForm() {
        this.formSwitch.emit(true);
    }

    loadInternalEventHandlers() {
        this.internalEventHandlerService.event.pipe(takeUntil(this.componentDestroyed)).subscribe(response => {
            this.storeService.reSetForm((response as InternalEventHandler).eventType, response.event);
        });
    }

    resetForm(objectId: string) {
        this.storeService.reSetForm(InternalEventType.EditingForm, objectId);
    }

    refreshComponent(component: FormComponent<any>) {
        this.storeService.setComponet(component);
    }
    loadActionHandlers() {
        this.actionHandlerService.action.pipe(takeUntil(this.componentDestroyed)).subscribe(response => {
            const actionHandler = response as FormAction;

            switch (actionHandler.key) {
                case FormActionType.Save:
                    this.saveData();
                    break;

                case FormActionType.Validate:
                    this.storeService.validateForm();
                    break;

                case FormActionType.ValidateAndSave:
                    // 校验表单的合理性
                    this.storeService.validateForm();
                    // 订阅表单校验事件(里面有异步校验)
                    this.storeService.isFormValid().pipe(take(1)).subscribe(valid => {
                        if (valid) {
                            this.saveData();
                        }
                    })
                    break;

                case FormActionType.Switch:
                    this.switchForm();
                    break;
            }
        });
    }
}
