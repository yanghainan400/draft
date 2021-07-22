// pages/nowlend/nowlend.js
// 用户当前借阅到的书籍
var app = getApp()
Page({
  data:{
    lendList:[],
    book_id:'',
    openid:'',
    book_name:''
  },
  onLoad:function(){
    let that = this
    //获取openID
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
      // 获取openid后开始查询当前用户借阅的图书
      wx.cloud.database().collection("BOOK").where({
        lend_openid:this.openid,
        IsLend:true,
        IsShow:true
      }).get({
        success(res){
          console.log("查询成功",res)
          that.setData({
            lendList:res.data
          })
        },
        fail(res) {
          console.log("查询失败",res)
        }
      })
    })
  },
  // 还书界面
  sent(options){
    //获取当前书籍信息
    this.book_id=options.currentTarget.dataset.book_id,
    this.book_name=options.currentTarget.dataset.book_name
    // console.log('nowlend界面'+this.book_id)
    //跳转
    let that = this
    //console.log(that.openid)
    wx.navigateTo({
      url: '../sent/sent?book_id='+that.book_id+'&book_name='+that.book_name
    })
  }
})