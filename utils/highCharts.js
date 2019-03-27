/**
 * @author yt
 * @description  封装一个折线图的函数
 * @param data
 * @param color
 * @param cv
 * @param average
 */
const getBrokenLine = (data, color, idContainer, average) => {
  const cv = document.getElementById(idContainer)
  cv.width = 156
  cv.height = 50
  cv.lineWidth = 1
  const ctx = cv.getContext("2d")
  const maxNum = Math.max.apply(null, data) // 求数组中的最大值
  const minNum = Math.min.apply(null, data) // 求数组中的最小值
  const padding = 5 // 边距
  const xLength = cv.width - 2 * padding // x轴的长度
  const yLength = cv.height - 2 * padding // y轴的长度
  const pointsWidth = xLength / (data.length + 1) // 折线上每个点之间的距离

  ctx.beginPath() // 控制绘制的折线不受坐标轴样式属性的影响

  // 绘制折线
  for (let i = 0; i < data.length; i += 1) {
    const pointX = padding + (i + 1) * pointsWidth
    let pointY =
      padding + (1 - (data[i] - minNum) / (maxNum - minNum)) * yLength
    if (minNum === maxNum) {
      pointY = padding + yLength / 2
    } else if (maxNum < average * 1.01) {
      pointY = 20 + ((1 - (data[i] - minNum) / (maxNum - minNum)) * yLength) / 4
    }
    ctx.lineTo(pointX, pointY)
  }
  ctx.strokeStyle = color
  ctx.stroke()
}
const initChart = (arr, idContainer) => {
  let total = 0
  let average = 0
  // cv.style.border = "1px solid red";
  if (arr !== null && arr !== undefined) {
    for (let j = 0; j < arr.length; j += 1) {
      total += arr[j] / 1
    }
    average = total / arr.length
    getBrokenLine(arr, "#00c1de", idContainer, average)
  }
}
