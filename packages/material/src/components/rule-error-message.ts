export const RuleErrorMessage = {
    required: "必填",
    max: function(val) {
        return `数字不能大于${val}`;
    },
    min: function(val) {
        return `数字不能小于${val}`
    },
    maxLength: function(val) {
        return `长度不能超过${val}位`
    },
    minLength: function(val) {
        return `长度不能小于${val}位`
    },
    pattern: "格式匹配错误",
    email: "邮件格式错误",
    requiredTrue: "必须设定为true"
};