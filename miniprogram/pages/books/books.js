// pages/books/books.js
const db = wx.cloud.database().collection("BOOK")
var DB = wx.cloud.database()
const app = getApp()
const util = require('../../util/util.js') 
Page({
  data:{
    bookList:[],
    book_id:'',
    book_name:'',
    nav:'',
    user_openid:'',
    lend_id:'',
    IsAdmin:0,
    state:'未借出'
  },
  onLoad:function(){
    // 获取openid
    let that = this
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
      // console.log(res),
      this.user_openid=res.result.openid
      // 获取USER 的 Admin信息
      wx.cloud.database().collection("USER").where({
        OpenID:this.openid
      }).get({
        success(res){
          console.log("查询成功",res)
          // console.log(res.data[0].IsAdmin)
          this.IsAdmin=res.data[0].IsAdmin
          console.log('Onload',this.IsAdmin)
          that.setData({
            IsAdmin:res.data[0].IsAdmin
          })
        },
        fail(res) {
          console.log("查询失败",res)
        }
      })
    })
  },

  // 现存的图书（未被借出的）
  NowBook(){
    this.nav=1
    console.log(this.nav)
    let that=this
    console.log(that.user_openid)
    wx.cloud.database().collection("BOOK").where({
      IsShow:true,
      IsLend:false
    }).get({
      success(res){
        console.log("查询成功",res)
        that.setData({
          // 将图书列表赋值给booklist
        bookList:res.data
        })
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
  },

  // 通过书名查询书籍
  GetLookName:function(e){
    this.book_name=e.detail.value
    let that = this
    var pattern_name = this.book_name
    wx.cloud.database().collection("BOOK").where({
      Name:DB.RegExp({
        regexp:pattern_name,
        options:'s',
      })
    }).get({
      success(res){
        console.log("查询成功",res)
        that.setData({
          bookList:res.data
        })
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
  },

  // 已经被借出的图书
  LendBook(){
    this.nav=2
    console.log(this.nav)
    let that=this
    wx.cloud.database().collection("BOOK").where({
      // 书籍被借出而且是可显示的
      IsShow:true,
      IsLend:true
    }).get({
      success(res){
        console.log("查询成功",res)
        that.setData({
          // 将被借出的书籍列表给booklist
          bookList:res.data
        })
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
  },

  // 缺失书籍
  DefectBook(){
    this.nav=3
    console.log(this.nav)
    let that=this
    wx.cloud.database().collection("DEFECT").get({
      success(res){
        console.log("查询成功",res)
        that.setData({
          bookList:res.data
        })
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
  },
  onReady(){
    wx.cloud.callFunction({
      name:'login',
      data:{
        message:'login',
      }
    }).then(res=>{
      // console.log(res),
      this.user_openid=res.result.openid
      // 获取USER 的 Admin信息
      wx.cloud.database().collection("USER").where({
        OpenID:this.openid
      }).get({
        success(res){
          console.log("查询成功",res)
          // console.log(res.data[0].IsAdmin)
          this.IsAdmin=res.data[0].IsAdmin
          console.log('OnReady',this.IsAdmin)
          that.setData({
            IsAdmin:res.data[0].IsAdmin
          })
        },
        fail(res) {
          console.log("查询失败",res)
        }
      })
    })
  },
  // 点击图书信息后的界面跳转
  PageJump:function(e){
    // 从前端传入的图书信息

    let that = this 
    this.book_id=e.currentTarget.dataset.book_id,
    this.book_name=e.currentTarget.dataset.book_name,
    this.lend_id=e.currentTarget.dataset.lend_id,
    this.state=e.currentTarget.dataset.state
    var item=e.currentTarget.dataset.item
    if(this.state==true){
      this.state='已借出'
    }
    else{
      this.state='未借出'
    }
    console.log('item!!',item)
    // console.log('book界面'+this.book_name)
    console.log('Admin_books',this.data.IsAdmin)
    if(this.nav==1)
    {
      // 借书界面
      wx.navigateTo({
        url: '../lend/lend?book_id='+this.book_id+'&book_name='+this.book_name+
        '&IsAdmin='+this.data.IsAdmin+'&state='+this.state+'&Auth='+item.Auth
      })
    }
    else if(this.nav==2)
    {
      // 还书界面
      console.log(this.lend_id)
      console.log('book_IsAdmin',this.data.IsAdmin)
      if(this.lend_id==this.user_openid){
        // openid匹配则跳转至还书界面
        wx.navigateTo({
          url: '../sent/sent?book_id='+this.book_id+'&book_name='+this.book_name+'&IsAdmin='+this.data.IsAdmin
        })
      }
      // 否则显示content
      else{
        wx.showModal({
          cancelColor: 'cancelColor',
          content:'并非您借阅的书籍'
        })
      }
    }
    else if(this.nav==3){
      // 跳转至捐赠图书界面
      wx.navigateTo({
        url: '../donate/donate?IsDefect=2&DefectName='+this.book_name
      })
    }
  },
  // 以缺失图书的条件跳转到donate
  JumpTo(){
    wx.navigateTo({
      url: '../donate/donate?IsDefect=1'
    })
  },
  // 下拉刷新
  onPullDownRefresh(){
    console.log('refresh')
    wx.showToast({
      title: '刷新中',
      icon:'loading'
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }
})