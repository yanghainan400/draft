//这是一个放置公共函数的地方
const FormatDate = date => {
  const year = date.getFullYear()
  const mouth = date.getMonth() + 1
  const day = date.getDate()

  return [year, mouth, day].map(FormatNumber).join('-')
}
//在这里对外暴露接口
module.exports = {
  FormatDate:FormatDate
}