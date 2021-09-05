// pages/donate/donate.js
const db = wx.cloud.database().collection("BOOK")
const app = getApp()
const util = require('../../util/util.js') 
Page({
  data:{
    Auth:'',
    ISBN:'',
    Name:'',
    DefectName:'',
    Date:'',
    dona_openid:'',
    IsDefect:'0',
    TimeStamp:'',
    HasImage:''
  },
  //获取openid
  onLoad:function(options){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.setData({
      TimeStamp:String(timestamp)
    })
    this.TimeStamp=timestamp
    // console.log('TimeStamp',this.TimeStamp)
    // console.log('Donate.defect',this.IsDefect)
    var DE=options.IsDefect
    var DeName=options.DefectName
    this.setData({
      IsDefect:DE,
      DefectName:DeName
    })
    this.IsDefect=DE
    this.DefectName=DeName
    // console.log('Donate.defect',this.IsDefect)
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
      this.dona_openid=res.result.openid
    })
  },

  //捐赠图书
  donateBook(){
    // 获取当前时间
    let that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    // console.log(Y+M+D)
    // // 新增图书条目
    // console.log(this.Auth)
    // console.log(this.Name)
    if(this.Auth!=null&&this.Name!=null)
    {
      // 如果是上传缺失图书
      if(this.IsDefect==1){
        wx.cloud.database().collection("DEFECT").add({
          data:{  
            Auth:this.Auth,
            Name:this.Name,
            Times:1
          },
          success(res){
            console.log("添加成功",res),
            wx.showToast({
             title: '提交成功',
             icon: 'success',
             duration: 2000
           }),
           // 等待固定时间片后返回上一界面
           setTimeout(function () {
             wx.navigateBack({
               detail:1
             })
           }, 1050)
         },
         fail(res){
           console.log("添加失败",res)
         }
        })
      }
      // 如果是正常的上传图书
      else{
        wx.cloud.database().collection("BOOK").add({
          data:{
            Auth:this.Auth,
            ISBN:null,
            IsLend:false,
            IsShow:true,
            Name:this.Name,
            Time:Y+'-'+M+'-'+D,
            LendTime:'',
            book_id:String(this.TimeStamp),
            dona_openid:this.dona_openid,
            lend_openid:'',
            HasImage:this.HasImage
          },
          success(res){
             console.log("添加成功",res),
             wx.showToast({
              title: '捐赠图书成功',
              icon: 'success',
              duration: 2000
            })
            // 而后根据书名删除缺失数据库中的数据
            // 这个IsDefect为2表示是从缺失图书页进来的上传图书
            // 要删去对应的缺失图书
            if(that.IsDefect==2){
              // console.log('enter 2')
              // console.log(that.DefectName)
              wx.cloud.database().collection("DEFECT").where({
                Name:that.DefectName
              }).remove({
                success:function(res){
                  // console.log('删除成功',res.data)
                }
              })
            }
            // 等待固定时间片后返回上一界面
            setTimeout(function () {
              wx.navigateBack({
                detail:1
              })
            }, 1150)
          },
          fail(res){
            console.log("添加失败",res)
          }
        })
      }
    }
    else
    {
      wx.showToast({
        title: '请输入完整信息',
        icon:'none'
      })
    }
  },
  // 上传书籍封面
  ChooseImage(){
    var ImageID=this.TimeStamp
    let that = this
    // console.log(this.TimeStamp)
    wx.chooseImage({
      count: 1,
      sizeType:['compressed'],
      // sourceType:['camera'],
      success(res){
        console.log(res)
        var filepath=res.tempFilePaths[0]
        wx.cloud.uploadFile({
          // 将书籍ID当做封面ID
          cloudPath:'Book_image/'+ImageID,
          filePath:filepath,
          success(res){
            that.setData({
              HasImage:1
            })
            that.HasImage=1
            // this.onLoad()
          }
        })
      }
    })
  },
  GetName:function(e){
    this.Name=e.detail.value
  },
  GetAuth:function(e){
    this.Auth=e.detail.value
  }
})