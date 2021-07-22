//index.js
const app = getApp()

Page({
  // 扫码录入图书
  ScanDonate(){
    wx.scanCode({
      success (res) {
        console.log(res)
        wx.showModal({
          cancelColor: 'cancelColor',
          title:'ISBN码',
          content:res.result
        })
      }
    })
  }
})
