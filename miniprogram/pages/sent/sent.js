// pages/sent/sent.js
const db = wx.cloud.database().collection("BOOK")
var app = getApp()
Page({
  data:{
    book_id:'',
    Name:'',
    IsAdmin:'',
    comment:'',
    user_openid:''
  },
  onLoad:function(options){
    //获取openid
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
      this.user_openid=res.result.openid
    })
    //获取bookID
    let that = this
    var BookId = options.book_id
    var BookName = options.book_name
    var IsAd = options.IsAdmin
    that.setData({
      book_id:BookId,
      Name:BookName,
      IsAdmin:IsAd
    })
    this.book_id=BookId
    this.data.IsAdmin=IsAd
    this.Name=BookName
    console.log('sent_IsAdmin',this.data.IsAdmin)
    // console.log('sent界面'+BookId)
  },
  // 完成书评录入时
  finish:function(e){
    wx.cloud.database().collection('COMMENT').add({
      data:{
        Content:this.comment,
        book_id:this.book_id,
        user_id:this.user_openid,
        user_name:app.globalData.userName
      },
      success(res){
        console.log('新增成功',res)
        console.log(app.globalData.userName);
        wx.showToast({
          title: '评论成功！',
          icon:'success'
        })
      }
    })
  },
  // 还书按钮
  send:function(e){
    let that = this
    wx.cloud.database().collection('BOOK').where({
      book_id:that.book_id
    }).update({
      data: {
        IsLend:false,
        Lend_openid:''
      },
      success: function(res) {
        // console.log('还书中'+that.book_id)
        wx.showToast({
          title: '还书成功',
          icon:'success'
        })
        wx.navigateBack({
          detail:2
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  },
  GetName:function(e){
    this.book_name=e.detail.value
  },
  GetComment:function(e){
    this.comment=e.detail.value
  },
  GetAuth:function(e){
    this.Auth=e.detail.value
  },
  //管理员更新图书信息
  ReName(){
    let that = this
    // console.log(this.book_id)
    // console.log(this.book_name)
    wx.cloud.database().collection('BOOK').where({
      book_id:this.book_id
    }).update({
      data: {
        Name:this.book_name
      },
      success: function(res) {
        wx.showToast({
          title: '修改书名成功',
          icon:'success'
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  },
  //管理员更新作者信息
  ReAuth(){
    let that = this
    // console.log(this.book_id)
    // console.log(this.book_name)
    wx.cloud.database().collection('BOOK').where({
      book_id:this.book_id
    }).update({
      data: {
        Auth:this.Auth
      },
      success: function(res) {
        wx.showToast({
          title: '修改作者成功',
          icon:'success'
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  },
  Delete(){
    let that = this
    wx.cloud.database().collection('BOOK').where({
      book_id:this.book_id
    }).remove({
      success: function(res) {
        wx.showToast({
          title: '删除成功',
          icon:'success'
        })
        setTimeout(function () {
          wx.navigateBack({
            detail:1
          })
        }, 950)
      },
      fail(res){
        console.log('fail',res)
      }
    })
  },
  ChangeSwitch(e){
    var lend=e.detail.value
    // console.log(lend)
    let that = this
    wx.cloud.database().collection('BOOK').where({
      book_id:this.book_id
    }).update({
      data: {
        IsLend:lend
      },
      success: function(res) {
        wx.showToast({
          title: '修改成功',
          icon:'success'
        })
        setTimeout(function () {
          wx.navigateBack({
            detail:1
          })
        }, 950)
      },
      fail(res){
        console.log('fail',res)
      }
    })
  }
})