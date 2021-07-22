// pages/sent/sent.js
const db = wx.cloud.database().collection("BOOK")
const app = getApp()
Page({
  data:{
    book_id:'',
    Name:'',
    comment:'不错',
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
    that.setData({
      book_id:BookId,
      Name:BookName
    })
    this.book_id=BookId
    console.log('sent界面'+BookId)
  },
  // 完成书评录入时
  finish:function(e){
    //this.comment=e.detail.value
    wx.cloud.database().collection('COMMENT').add({
      data:{
        Content:'diidee',
        book_id:that.book_id,
        user_id:that.user_openid
      },
      success(res){
        console.log('新增成功',res)
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
  }
})