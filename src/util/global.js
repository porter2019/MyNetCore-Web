//账户名，只能数字、字母、下划线组成
const RegEx_AccountName = /^[a-zA-Z0-9_]*$/;

//是不是有效的手机号
const RegEx_CellPhone = /^1[3456789]\\d{9}$/;

//是不是有效的金额，不允许为负
const RegEx_Money = /^0|(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/;

//是不是有效的金额，允许为负
const RegEx_MoneyMinus = /^-?(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/;

//是否为邮箱
const RegEx_Email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

//是否为身份证号码
const RegEx_IdNo = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;



export {
    RegEx_AccountName,
    RegEx_CellPhone,
    RegEx_Money,
    RegEx_MoneyMinus,
    RegEx_Email,
    RegEx_IdNo,
}