// pages/setting/setting.js
const app = getApp()
Page({
  data: {
    openid:'',
    degree:0,
    IsAdmin:''
  },
  onLoad:function(){
    let that = this
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    wx.cloud.callFunction({
      name:'login',
      data:{
        message:'login',
      }
    }).then(res=>{
      console.log(res),
      this.openid=res.result.openid
      // 获取openid后
      wx.cloud.database().collection("USER").where({
        OpenID:this.openid
      }).get({
        success(res){
          //console.log("查询成功",res)
          //console.log(res.data[0].IsAdmin)
          that.IsAdmin=res.data[0].IsAdmin
          that.setData({
            IsAdmin: res.data[0].IsAdmin
          })
        },
        fail(res) {
          console.log("查询失败",res)
        }
      })
    })
  },
  JumpTo(){
    console.log(this.IsAdmin)
    if(this.IsAdmin==true){
      wx.navigateTo({
        url: '../admin/admin'
      })
    }
    else{
      wx.navigateTo({
        url: '../userset/userset'
      })
    }
  }
})