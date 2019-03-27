/**
 * 工具js
 * 存放所有公共方法
 */

// 9:19 => 09:19  ||   12:9 => 12:09
const add0 = m => {
  return m < 10 ? "0" + m : m
}

// 时间戳转化为时分格式   时间戳  => 12:56
const getHoursTime = t => {
  const time = new Date(t)
  const h = time.getHours()
  const mm = time.getMinutes()
  return add0(h) + ":" + add0(mm)
}
