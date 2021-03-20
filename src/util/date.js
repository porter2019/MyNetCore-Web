/**
 * 格式化中金支付时间
 * @param {String} date 
 */
export function formatCPCNDate(date) {
    if (!date) return '';
    let len = date.length;
    if (len == 8) {
        //20210201
        return insertStr(insertStr(date, 4, '-'), 7, '-');
    } else if (len == 6) {
        //151027
        return insertStr(insertStr(date, 2, ':'), 5, ':');
    } else if (len == 14) {
        //20210201151027
        return insertStr(insertStr(insertStr(insertStr(insertStr(date, 4, '-'), 7, '-'), 10, ' '), 13, ':'), 16, ':');
    } else if (len == 15) {
        return insertStr(insertStr(insertStr(insertStr(date, 4, '-'), 7, '-'), 13, ':'), 16, ':');
    } else {
        return date;
    }
}

function insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
}

/**
 * 计算时间查
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 * @param {String} action 取值类别 ad=总天数,ah=总小时,am=总分钟,as=总秒,ms=总毫秒
 * @returns {Int} 差值 
 */
export function dateTimeDiff(startTime, endTime, action) {
    if (!startTime || !endTime || !action) {
        return 0;
    }
    if (typeof (startTime) === 'string') {
        startTime = new Date(startTime.replace(/-/g, "/"));
    }
    if (typeof (endTime) === 'string') {
        endTime = new Date(endTime.replace(/-/g, "/"));
    }
    //总毫秒数
    let totalMillisecond = endTime.getTime() - startTime.getTime();
    //总秒数
    let totalSecond = Math.floor(totalMillisecond / 1000);
    //总分钟
    let totalMinute = Math.floor(totalMillisecond / (1000 * 60));
    //总小时
    let totalHour = Math.floor(totalMillisecond / (1000 * 60 * 60));
    //总天数
    let totalDay = Math.floor(totalMillisecond / (1000 * 60 * 60 * 24));
    switch (action) {
        case 'ms'://总毫秒
            return totalMillisecond;
        case 'as'://总秒
            return totalSecond;
        case 'am'://总分钟
            return totalMinute;
        case 'ah'://总小时
            return totalHour;
        case 'ad'://总天数
            return totalDay;
        default:
            return 0;
    }
}

/**
 * 时间格式化
 * @param {(Object|string|number)} date
 * @param {string} fmt
 * @returns {string | null}
 */
export function formatDate(date, fmt) {
    if (!date) {
        return '';
    }
    if (typeof (date) === 'string') {
        date = new Date(date);
    }
    if (!fmt) {
        fmt = 'yyyy-MM-dd';
    }
    //正则匹配/(y+)/ 字符串fmt--'yyyy-MM-dd hh:mm'，如果匹配到，就获取第一个匹配的文本，即yyyy,
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        //将yyyy替换成年份，如1970
        // date.getFullYear()的类型是number,(date.getFullYear() + '') 加个空字符串将number转成字符串类型
        // substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null
    }
    console.log(cFormat);
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string')) {
            if ((/^[0-9]+$/.test(time))) {
                // support "1548221490638"
                time = parseInt(time)
            } else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/')
            }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
    })
    return time_str
}