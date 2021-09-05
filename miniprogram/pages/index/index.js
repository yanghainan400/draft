//index.js
const app = getApp()
Page({
  data:{
    ISBN_code:0
  },
  // 扫码录入图书
  ScanDonate(){
    let that = this
    wx.scanCode({
      success (res) {
        // console.log(res)
        // console.log(res.result)
        that.ISBN_code=res.result
        // console.log(that.ISBN_code)
        // 从ISBN数据库中查找对应图书
        wx.cloud.database().collection('ISBN').where({
          ISBN:that.ISBN_code
        }).get({
          success(result){
            console.log('查询成功',result)
            wx.showToast({
              title: result.data[0].Name
            })
          }
        })
      }
    })
  }
})