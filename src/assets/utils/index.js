/**
 * 金额转中文
 * 思路：
 *                              个
 *      十     百      千       万
 *      十万   百万    千万     亿
 *      十亿   百亿    千亿
 *
 *                              1
 *      2      3       4        5
 *      6      7       8        9
 *      10
 *
 * 计算步骤
 * 1. 获取当前数值大小
 * 2. 排除个位后 数值按个，十，百，千有规律的重复 所以计算其和4的余数 pos % 4
 * 3. pos = 0 ~ 3 没有最大单位
 *    pos = 4 ~ 7 最大单位是万
 *    pos = 8 ~ 11 最大单位是亿
 * pos / 4 的整数就是最大单位
 *
 */
export function changeNumMoneyToChinese(val) {
  const amount = +val
  if (Number.isNaN(amount) || amount < 0) return ''
  const NUMBER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const N_UNIT1 = ['', '拾', '佰', '仟']
  const N_UNIT2 = ['', '万', '亿']
  const D_UNIT = ['角', '分', '厘', '毫']
  let [integer, decimal] = amount.toString().split('.')
  if (integer && integer.length > 12) return '金额过大无法计算'
  let res = ''
  // 整数部分
  if (integer) {
    for (let i = 0, len = integer.length; i < len; i++) {
      const num = integer.charAt(i)
      const pos = len - i - 1 // 排除个位后 所处的索引位置
      if (num === '0') {
        // 当前位 等于 0 且下一位也等于 0 则可跳过计算
        if (i === len - 1) {
          if (integer.length === 1) res += '零' // 0.35 这种情况不可跳过计算
          break
        }
        if (integer.charAt(i + 1) === '0') continue
      }
      res += NUMBER[num]
      if (parseInt(num)) res += N_UNIT1[pos % 4]
      res += N_UNIT2[Math.floor(pos / 4)]
    }
  }
  res += '圆'
  // 小数部分
  if (parseInt(decimal)) {
    for (let i = 0; i < 4; i++) {
      const num = decimal.charAt(i)
      if (parseInt(num)) res += NUMBER[num] + D_UNIT[i]
    }
  } else {
    res += '整'
  }
  return res
}

//************************* 把数字金额转换成中文大写数字的函数(可处理负值) *********************************//
export function getAmountChinese(money) {
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖') //汉字的数字
  var cnIntRadice = new Array('', '拾', '佰', '仟') //基本单位
  var cnIntUnits = new Array('', '万', '亿', '兆') //对应整数部分扩展单位
  var cnDecUnits = new Array('角', '分', '毫', '厘') //对应小数部分单位
  var cnInteger = '整' //整数金额时后面跟的字符
  var cnIntLast = '元' //整型完以后的单位
  var maxNum = 999999999999999.9999 //最大处理的数字
  var IntegerNum //金额整数部分
  var DecimalNum //金额小数部分
  var ChineseStr = '' //输出的中文金额字符串
  var parts //分离金额后用的数组，预定义
  var Symbol = '' //正负值标记
  if (money == '') {
    return ''
  }

  money = parseFloat(money)
  if (money >= maxNum) {
    alert('超出最大处理数字')
    return ''
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger
    return ChineseStr
  }
  if (money < 0) {
    money = -money
    Symbol = '负 '
  }
  money = money.toString() //转换为字符串
  if (money.indexOf('.') == -1) {
    IntegerNum = money
    DecimalNum = ''
  } else {
    parts = money.split('.')
    IntegerNum = parts[0]
    DecimalNum = parts[1].substr(0, 4)
  }
  if (parseInt(IntegerNum, 10) > 0) {
    //获取整型部分转换
    var zeroCount = 0
    var IntLen = IntegerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0]
        }
        zeroCount = 0 //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q]
      }
    }
    ChineseStr += cnIntLast
    //整型部分处理完毕
  }
  if (DecimalNum != '') {
    //小数部分
    var decLen = DecimalNum.length
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1)
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger
  }
  ChineseStr = Symbol + ChineseStr

  return ChineseStr
}
/**
 * 计算两个时间差经历的时间的文字描述
 * @param {*} timestamp - 毫秒
 */
export const timeCalculate = (start, end) => {
  const label = ['分钟', '小时', '天', '月', '年']
  const unit = [60, 60, 24, 30, 12]
  let restTime = Math.floor((end - start) / 1000)
  let res = ''
  for (let i = 0, len = unit.length; i < len; i++) {
    const pos = len - i // 从年开始算，分钟换算成年 === Math.pow(60, 4)
    const temp = unit.slice(0, pos).reduce((p, c) => p * c, 1)
    const time = Math.floor(restTime / temp)
    time > 0 && (res += time + label[pos - 1])
    restTime -= time * temp
  }
  return res
}

/**
 * 简易防抖函数
 * @param {Function} func -防抖目标函数
 * @param {Number}} gap - 防抖时间间隔
 */
export const debounce = (func, gap) => {
  let timer
  return function() {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, gap)
  }
}
/**
 * 下划线转驼峰
 * @param {String} name - 字符串
 */
export const toHump = name =>
  name.replace(/\_(\w)/g, function(all, letter) {
    return letter.toUpperCase()
  })
/**
 * 将用户输入的连续单个数字合并为一个数
 * @param {Array} expressions - 记录计算表达式的数组
 * @returns {Array} 新的数组
 */
export const mergeNumberOfExps = expressions => {
  const res = []
  const isNumChar = n => /^[\d|\.]$/.test(n)
  for (let i = 0; i < expressions.length; i++) {
    if (i > 0 && isNumChar(expressions[i - 1]) && isNumChar(expressions[i])) {
      res[res.length - 1] += expressions[i]
      continue
    }
    res.push(expressions[i])
  }
  return res
}
/**
 * 校验表达式是否符合计算法则
 * @param {Array} expressions - 合并数字后的表达式数组
 * @returns {Boolean}
 */
export const validExp = (expressions, mergeNum = true) => {
  const temp = mergeNum ? mergeNumberOfExps(expressions) : expressions
  const arr = temp.filter(t => !'()'.includes(t))
  // 去括号后 length应该为奇数  并且第一个字符和最后一个字符应该为数字而非计算符号
  if (temp.length % 2 === 0 || arr.length % 2 === 0 || Number.isNaN(+arr[0]) || Number.isNaN(+arr[arr.length - 1])) {
    return false
  }
  for (let i = 0; i < arr.length - 1; i += 2) {
    if (typeof +arr[i] !== 'number' || !Number.isNaN(+arr[i + 1])) {
      return false
    }
  }
  return true
}
/**
 * 校验表达式是否符合计算法则
 * @param {Array} expressions - 合并数字后的表达式数组
 * @returns {Boolean}
 */
export const validExpCon = (expressions, mergeNum = true) => {
  const temp = mergeNum ? mergeNumberOfExps(expressions) : expressions
  const arr = temp.filter(t => !'()'.includes(t))
  // 去括号后 length应该为奇数  并且第一个字符和最后一个字符应该为数字而非计算符号
  if (temp.length % 2 === 0 || arr.length % 2 === 0 || Number.isNaN(+arr[0]) || Number.isNaN(+arr[arr.length - 1])) {
    return false
  }
  for (let i = 0; i < arr.length - 1; i += 2) {
    if (typeof +arr[i] !== 'number' || !Number.isNaN(+arr[i + 1])) return false
  }
  return true
}
/**
 * 中缀转后缀（逆波兰 Reverse Polish Notation）
 * @param {Array} exps - 中缀表达式数组
 */
export const toRPN = exps => {
  const s1 = [] // 符号栈
  const s2 = [] // 输出栈
  const getTopVal = stack => (stack.length > 0 ? stack[stack.length - 1] : null)
  const levelCompare = (c1, c2) => {
    const getIndex = c => ['+-', '×÷', '()'].findIndex(t => t.includes(c))
    return getIndex(c1) - getIndex(c2)
  }
  exps.forEach(t => {
    if (typeof t === 'string' && Number.isNaN(Number(t))) {
      // 是符号
      if (t === '(') {
        s1.push(t)
      } else if (t === ')') {
        let popVal
        do {
          popVal = s1.pop()
          popVal !== '(' && s2.push(popVal)
        } while (s1.length && popVal !== '(')
      } else {
        let topVal = getTopVal(s1)
        if (!topVal) {
          // s1 为空 直接push
          s1.push(t)
        } else {
          while (topVal && topVal !== '(' && levelCompare(topVal, t) >= 0) {
            // 优先级 >= t 弹出到s2
            s2.push(s1.pop())
            topVal = getTopVal(s1)
          }
          s1.push(t)
        }
      }
      return
    }
    s2.push(t) // 数字直接入栈
  })
  while (s1.length) {
    s2.push(s1.pop())
  }
  return s2
}
/**
 * 计算后缀表达式的值
 * @param {Array} rpnExps - 后缀表达式
 */
export const calcRPN = rpnExps => {
  rpnExps = rpnExps.concat()
  const calc = (x, y, type) => {
    let a1 = Number(x),
      a2 = Number(y)
    if (type == '÷') {
      if (a2 == 0) {
        return a1
      }
    }
    switch (type) {
      case '+':
        return a1 + a2
      case '-':
        return a1 - a2
      case '×':
        return a1 * a2
      case '÷':
        return a1 / a2
    }
  }
  for (let i = 2; i < rpnExps.length; i++) {
    if ('+-×÷'.includes(rpnExps[i])) {
      let val = calc(rpnExps[i - 2], rpnExps[i - 1], rpnExps[i])
      rpnExps.splice(i - 2, 3, val)
      i = i - 2
    }
  }
  return rpnExps[0]
}

/**
 * 中缀转后缀（逆波兰 Reverse Polish Notation）
 * @param {Array} exps - 中缀表达式数组
 */
export const toRPNCompare = exps => {
  const s1 = [] // 符号栈
  const s2 = [] // 输出栈
  const getTopVal = stack => (stack.length > 0 ? stack[stack.length - 1] : null)
  const levelCompare = (c1, c2) => {
    const getIndex = c => ['+-', '×÷', '()', '>', '<', '>=', '<=', '=='].findIndex(t => t.includes(c))
    return getIndex(c1) - getIndex(c2)
  }
  exps.forEach(t => {
    if (typeof t === 'string' && Number.isNaN(Number(t))) {
      // 是符号
      if (t === '(') {
        s1.push(t)
      } else if (t === ')') {
        let popVal
        do {
          popVal = s1.pop()
          popVal !== '(' && s2.push(popVal)
        } while (s1.length && popVal !== '(')
      } else {
        let topVal = getTopVal(s1)
        if (!topVal) {
          // s1 为空 直接push
          s1.push(t)
        } else {
          while (topVal && topVal !== '(' && levelCompare(topVal, t) >= 0) {
            // 优先级 >= t 弹出到s2
            s2.push(s1.pop())
            topVal = getTopVal(s1)
          }
          s1.push(t)
        }
      }
      return
    }
    s2.push(t) // 数字直接入栈
  })
  while (s1.length) {
    s2.push(s1.pop())
  }
  return s2
}
/**
 * 计算后缀表达式的值
 * @param {Array} rpnExps - 后缀表达式
 */
export const calcRPNCompare = rpnExps => {
  rpnExps = rpnExps.concat()
  const calc = (x, y, type) => {
    let a1 = Number(x),
      a2 = Number(y)
    switch (type) {
      case '+':
        return a1 + a2
      case '-':
        return a1 - a2
      case '×':
        return a1 * a2
      case '÷':
        return a1 / a2
      case '>':
        return a1 > a2
      case '<':
        return a1 < a2
      case '>=':
        return a1 >= a2
      case '<=':
        return a1 <= a2
      case '==':
        return a1 == a2
    }
  }
  for (let i = 2; i < rpnExps.length; i++) {
    if ('+-×÷>>=<=<>=='.includes(rpnExps[i])) {
      let val = calc(rpnExps[i - 2], rpnExps[i - 1], rpnExps[i])
      rpnExps.splice(i - 2, 3, val)
      i = i - 2
    }
  }
  return rpnExps[0]
}

export const getUrlParam = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

export const isMobile = function() {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )

  return flag || window.innerWidth <= 600
}
