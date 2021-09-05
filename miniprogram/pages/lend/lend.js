// pages/lend/lend.js
// 借阅图书界面
const db = wx.cloud.database().collection("BOOK")
const app = getApp()
Page({
  data:{
    book_id:'',
    book_name:'',
    Auth:'',
    user_openid:'',
    IsAdmin:'ss',
    state:'未借出',
    comlist:[]
  },
  onLoad: function (options) {
    let that = this 
    // 接受其他JS传来的数据
    var BookId = options.book_id
    var BookName = options.book_name
    var Admin = options.IsAdmin
    var St = options.state
    var Au = options.Auth
    console.log(Admin)
    this.setData({
      book_id:BookId,
      book_name:BookName,
      IsAdmin:Admin,
      state:St,
      Auth:Au
    }),
    this.book_id=BookId
    this.data.IsAdmin=Admin
    this.state=St
    this.Auth=Au
    console.log('Admin',this.data.IsAdmin)
    
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
  // 获取当前时间的函数
  GetTime(){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y+'-'+M+'-'+D
  },
  //借阅图书
  lend(){
    let that = this
    var NowTime=this.GetTime()
    // console.log(NowTime)
    wx.cloud.database().collection('BOOK').where({
      book_id:that.book_id
    }).update({
      // 更新图书信息为已被借阅
      data: {
        IsLend:true,
        lend_openid:that.user_openid,
        LendTime:NowTime
      },
      success: function(res) {
        // console.log(that.user_openid)
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
  },
  GetName:function(e){
    this.book_name=e.detail.value
  },
  GetAuth:function(e){
    this.Auth=e.detail.value
  },

  // 以下为管理员内容
  // 管理员更新书名
  ReName(){
    let that = this
    // console.log('RENAME',this.book_id)
    // console.log('RENAME',this.book_name)
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
        console.log('fail',res)
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
  // 删除图书
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
        console.log('fail')
      }
    })
  },
  // 变更图书是否被借出
  ChangeSwitch(e){
    var lend=e.detail.value
    var lendID
    var NowTime=this.GetTime()
    // console.log(NowTime)
    if(lend==true){
      lendID = this.user_openid
    }
    else{
     lendID = ''
    }
    // console.log(lend)
    // console.log('lend_openid',this.user_openid)
    // console.log('lendID',lendID)
    let that = this
    wx.cloud.database().collection('BOOK').where({
      book_id:this.book_id
    }).update({
      data: {
        IsLend:lend,
        lend_openid:lendID,
        LendTime:NowTime
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
        console.log('fail')
      }
    })
  }
})