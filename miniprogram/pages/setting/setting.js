// pages/setting/setting.js
var app = getApp()
Page({
  data: {
    openid:'null',
    degree:0,
    IsAdmin:'',
    userInfo: {},
    hasUserInfo: false,
    User_url:'',
    User_name:''
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
      console.log(res)
      this.openid=res.result.openid
      app.globalData.openid = res.result.openid
      console.log("用户openid：" + app.globalData.openid);
      // 获取openid后--无法显示
      // console.log(this.openid)
      // this.onShow()
      wx.cloud.database().collection("USER").where({
        OpenID:this.openid
      }).get({
        success(res){
          console.log("查询成功",res)
          // console.log(res.data[0].IsAdmin)
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
  // 废弃代码，跳转到管理员界面
  // JumpTo(){
  //   // console.log(this.IsAdmin)
  //   if(this.IsAdmin==true){
  //     wx.navigateTo({
  //       url: '../admin/admin'
  //     })
  //   }
  //   else{
  //     wx.navigateTo({
  //       url: '../userset/userset'
  //     })
  //   }
  // },
  // 获取用户信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        this.data.User_name=res.userInfo.nickName
        this.data.User_url=res.userInfo.avatarUrl
        this.setData({
          userInfo: res.userInfo,
          User_name:res.userInfo.nickName,
          User_url:res.userInfo.avatarUrl,
          hasUserInfo: true
        })
        this.onLoad()
      }
    })
  },
})