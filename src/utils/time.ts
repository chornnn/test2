/* eslint-disable */

// eslint-disable-next-line no-extend-native
function format(fmt, date) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, date.getFullYear() + '');
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}
function getDateDiff(tmpTime) {
  var mm = 1000; //1000毫秒 代表1秒

  var minute = mm * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;
  var ansTimeDifference = ''; //记录时间差

  var tmpTimeStamp = tmpTime;

  var nowTime = new Date().getTime(); //获取当前时间戳
  // var nowTime = new Date().getTime() + 200000000000;//获取当前时间戳

  var tmpTimeDifference = nowTime - tmpTimeStamp; //计算当前与需要计算的时间的时间戳的差值

  if (tmpTimeDifference < 0) {
    //时间超出，不能计算

    alert('开始日期大于结束日期，计算失败！');
    return 0;
  }
  /**

     * 通过最开始强调的各个时间段用毫秒表示的数值，进行时间上的取整，为0的话，则没有到达

     * */
  var DifferebceYear = tmpTimeDifference / year; //进行年份取整
  var DifferebceMonth = tmpTimeDifference / month; //进行月份取整

  var DifferebceWeek = tmpTimeDifference / (7 * day); //进行周取整

  var DifferebceDay = tmpTimeDifference / day; //进行天取整

  var DifferebceHour = tmpTimeDifference / hour; //进行小时取整

  var DifferebceMinute = tmpTimeDifference / minute; //进行分钟取整

  if (DifferebceYear >= 1) {
    return format('yy/MM/dd', new Date(tmpTime)); //大于一个月 直接返回时间
  }

  if (DifferebceMonth >= 1) {
    return format('MM/dd', new Date(tmpTime)); //大于一个月 直接返回时间
  } else if (DifferebceDay >= 1) {
    ansTimeDifference = DifferebceDay.toFixed(0) + 'd';
  } else if (DifferebceHour >= 1) {
    ansTimeDifference = DifferebceHour.toFixed(0) + 'h';
  } else if (DifferebceMinute >= 1) {
    ansTimeDifference = DifferebceMinute.toFixed(0) + 'm';
  } else {
    if (tmpTime === undefined) {
      return '';
    }
    ansTimeDifference = 'Just now';
  }
  return ansTimeDifference;
}

export { getDateDiff };
