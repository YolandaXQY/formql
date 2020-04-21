import { ValidatorFn } from '@angular/forms';

export declare interface FormRules {
    [key: string]: FormRule;
    
}

export interface FormRule {
    /* 规则标识符key的可选值: 
    "required" | "min" | "max" | "minLength" | "maxLength" | "pattern" | "value" | "server" | "style"  */
    key: string;
    /* 计算表达式 */
    condition: string;
    /* 计算出来的表达式 */
    conditionValue?: any;
    disableDateStart?: any;
    disableDateEnd?: any;
    /* key = "min" | "max" | "minLength" | "maxLength" */
    serverUrl?: string;
    /* 错误信息 */
    errorMessage?: string;
    /* 参数的值 */
    value: boolean | any;
    // 待删除
    dataSource: string;
}

export interface FormValidator {
    name: string;
    key: string;
    // 多加了一种类型
    validator: ValidatorFn | (() => ValidatorFn);
    parameters: any;
}
