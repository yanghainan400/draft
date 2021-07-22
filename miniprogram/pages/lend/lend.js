// pages/lend/lend.js
// 借阅图书界面
const db = wx.cloud.database().collection("BOOK")
const app = getApp()
Page({
  data:{
    book_id:'',
    book_name:'',
    user_openid:'',
    IsAdmin:'',
    comlist:[]
  },
  onLoad: function (options) {
    // 接受其他JS传来的数据
    var BookId = options.book_id
    var BookName = options.book_name
    var Admin = options.IsAdmin
    this.setData({
      book_id:BookId,
      book_name:BookName,
      IsAdmin:Admin
    }),
    this.book_id=BookId
    this.book_name=BookName
    this.IsAdmin=Admin
    console.log(this.IsAdmin)

    //获取openid
    if (app.globalData.openid) {
      this.setData({
        user_openid: app.globalData.openid
      })
    }
    wx.cloud.callFunction({
      name:'login',
      data:{
        message:'login',
      }
    }).then(res=>{
      console.log(res),
      this.user_openid=res.result.openid
    })
    //获取书评
    let that = this
    wx.cloud.database().collection("COMMENT").where({
      book_id:this.book_id
    }).get({
      success(res){
        console.log("查询成功",res)
        that.setData({
        comlist:res.data
        })
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
  },
  //借阅图书
  lend(){
    let that = this
    wx.cloud.database().collection('BOOK').where({
      book_id:that.book_id
    }).update({
      // 更新图书信息为已被借阅
      data: {
        IsLend:true,
        lend_openid:that.user_openid,
      },
      success: function(res) {
        console.log(that.user_openid)
        wx.showToast({
          title: '借书成功',
          icon:'success'
        })
        // 跳转回上一个界面
        wx.navigateBack({
          detail:1
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  }
})