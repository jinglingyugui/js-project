/**
 * @author yt
 * @description 绘制贝塞尔曲线图
 * @param data 传入的数据
 * @param id canvas id
 * 曲线阴影面积是多条线段围起来填充形成的
 */

// import { getHoursTime } from "./tool"

// 计算y轴height
const yHeight = (padding, value, minNum, maxNum, yLength) => {
  const y = padding + (1 - (value - minNum) / (maxNum - minNum)) * yLength
  return y
}

// 绘制曲线
const drawChart = (
  ctx,
  data,
  padding,
  minNum,
  maxNum,
  yLength,
  pointsWidth,
  len
) => {
  ctx.moveTo(
    0,
    padding + (1 - (data[0].close - minNum) / (maxNum - minNum)) * yLength
  )

  for (let i = 0; i < len - 1; i++) {
    const az = 0.25 // 分别对于a控制点的一个正数，可以分别自行调整
    const bz = 0.25 // 分别对于b控制点的一个正数，可以分别自行调整
    let ax
    let ay
    let bx
    let by

    if (i === 0) {
      ax = i * pointsWidth + ((i + 1) * pointsWidth - i * pointsWidth) * az
      ay = data[i].close + (data[i + 1].close - data[i].close) * az
      ay = yHeight(padding, ay, minNum, maxNum, yLength)
    } else {
      ax = pointsWidth * i + ((i + 1) * pointsWidth - i * pointsWidth) * az // 设置模拟点A,B坐标
      ay = data[i].close + (data[i + 1].close - data[i - 1].close) * az // 设置模拟点A,B坐标
      ay = yHeight(padding, ay, minNum, maxNum, yLength)
    }
    if (i === len - 2) {
      bx =
        (i + 1) * pointsWidth - ((i + 1) * pointsWidth - i * pointsWidth) * bz

      by = data[i + 1].close - (data[i + 1].close - data[i].close) * bz
      by = yHeight(padding, by, minNum, maxNum, yLength)
    } else {
      bx =
        pointsWidth * (i + 1) - ((i + 2) * pointsWidth - i * pointsWidth) * bz // 设置模拟点A,B坐标

      by = data[i + 1].close - (data[i + 2].close - data[i].close) * bz // 设置模拟点A,B坐标
      by = yHeight(padding, by, minNum, maxNum, yLength)
    }

    ctx.bezierCurveTo(
      ax,
      ay,
      bx,
      by,
      pointsWidth * [i + 1],
      yHeight(padding, data[i + 1].close, minNum, maxNum, yLength)
    )
  }
}

// 初始化配置
const initChart = (data, id, width, height, color, text) => {
  if (!data) {
    data = []
  }
  const cv = document.getElementById(id)
  if (!cv.getContext) return
  cv.width = width
  cv.height = height
  const ctx = cv.getContext("2d")
  const len = data.length
  let padding = 45 // 上边距
  let paddingBottom = 25 // 上边距

  // 计算data中最大值和最小值并取出开始和结束时间, 绘制时间轴刻度
  let maxNum = Number.NEGATIVE_INFINITY // 无限小
  let minNum = Number.POSITIVE_INFINITY // 无限大
  for (let j = 0; j < len; j++) {
    if (maxNum < data[j].close) {
      maxNum = data[j].close
    }
    if (minNum > data[j].close) {
      minNum = data[j].close
    }
  }

  // （最高价格 - 最低价格）/ 最低价格 < 3% 就在中间区域取最高最低值显示；
  if ((maxNum - minNum) / minNum < 0.03) {
    padding = 65
    paddingBottom = 45
  }
  const timeHeight = 20 // 时间轴高度
  const spaceLength = Math.floor(len / 4) // 间距
  const remainder = len % 4 // 余数
  const xLength = cv.width // x轴的长度
  const yLength = cv.height - padding - paddingBottom - timeHeight // y轴作图区域的长度
  const pointsWidth = xLength / (data.length - 1) // 折线上每个点之间的距离

  // 处理无数据的情况
  if (len === 0) {
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, width / 2, height / 2)

    ctx.beginPath()
    ctx.moveTo(0, height - timeHeight + 0.5)
    ctx.lineTo(width, height - timeHeight + 0.5)
    ctx.lineWidth = 1
    ctx.strokeStyle = "#505665"
    ctx.stroke()
    return
  }

  // 当最高价等于最低价，则为直线
  if (maxNum === minNum) {
    ctx.beginPath()
    ctx.moveTo(0, (height - timeHeight) / 2)
    ctx.lineTo(width, (height - timeHeight) / 2)
    ctx.lineTo(width, height - timeHeight)
    ctx.lineTo(0, height - timeHeight)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.07
    ctx.fill()
    ctx.globalCompositeOperation = "source-over" // 全局合成操作
    ctx.beginPath()
    ctx.moveTo(0, (height - timeHeight) / 2)
    ctx.lineTo(width, (height - timeHeight) / 2)
    ctx.strokeStyle = color
    ctx.globalAlpha = 1
    ctx.stroke()
  } else {
    // 阴影面积
    ctx.beginPath() // 控制绘制的曲线不受坐标轴样式属性的影响
    drawChart(ctx, data, padding, minNum, maxNum, yLength, pointsWidth, len)
    ctx.lineTo(width, height - timeHeight)
    ctx.lineTo(0, height - timeHeight)
    ctx.lineTo(0, yHeight(padding, data[0].close, minNum, maxNum, yLength))
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.miterLimit = 1
    ctx.lineWidth = 1
    ctx.fillStyle = color
    ctx.globalAlpha = 0.07
    ctx.fill()

    // 曲线
    ctx.globalCompositeOperation = "source-over" // 全局合成操作
    ctx.beginPath()
    drawChart(ctx, data, padding, minNum, maxNum, yLength, pointsWidth, len)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.miterLimit = 1
    ctx.lineWidth = 1
    ctx.strokeStyle = color
    ctx.globalAlpha = 1
    ctx.stroke()
  }

  // 时间轴
  ctx.font = "14px sans-serif"
  for (let i = 0; i < 5; i++) {
    const index = i * spaceLength + remainder - 1
    ctx.fillStyle = "#858792"
    ctx.globalAlpha = 1
    // ctx.fillText(getHoursTime(data[index].time), 60 * i, height)
    ctx.fillText(data[index].time, 60 * i, height)
  }
  ctx.beginPath()
  ctx.moveTo(0, height - timeHeight + 0.5)
  ctx.lineTo(width, height - timeHeight + 0.5)
  ctx.lineWidth = 1
  ctx.strokeStyle = "#505665"
  ctx.globalAlpha = 1
  ctx.stroke()
}

// export default initChart
