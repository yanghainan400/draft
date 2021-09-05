// pages/admin/admin.js
Page({
  data:{
    Book:'1',
    User:'',
    BookList:[],
    DefectList:[],
    UserList:[]
  },
  onLoad(){

  },
  ShowBooks(){//显示图书
    let that = this
    wx.cloud.database().collection("BOOK").where({
      IsShow:true
    }).get({
      success(res){
        console.log("查询成功",res)
        that.setData({
          // 将图书列表赋值给DefectList
        DefectList:res.data
        })
        that.DefectList=res.data
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
    wx.cloud.database().collection("DEFECT").get({
      success(res){
        console.log("查询成功",res)
        that.setData({
          // 将图书列表赋值给booklist
        DefectList:res.data
        })
        that.BookList=res.data
      },
      fail(res) {
        console.log("查询失败",res)
      }
    })
  },
  LookingUser(){

  },
  BookChange(){//修改图书

  },
  DefectChange(){

  },
  UserChange(){

  }
})