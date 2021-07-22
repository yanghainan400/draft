# 开发指引
* 目前需要解决的问题
  在查询不到图书时将图书添加到DEFECT数据库中
  正则表达式查询数据库
  还书界面绑定监听书评文本框函数
  捐赠完图书后应该跳转回借阅界面
  连接ISBN数据库
  获取用户头像和昵称，而非只是用openid去显示

  如何通过图书ID获取图书信息-解决-res.data[0].Name
  如何获取用户openid-解决-通过login云函数
  
* 目前遇到的bug
  跳转back时只跳转1个界面
  
  捐赠图书时不填写书名和作者也可以捐书--解决
  lend界面一刷新就报错--解决
  在浏览图书界面点击已借出图书和缺失图书也可以跳转到借阅界面--解决
  不显示书名--解决

* 新的想法和思路
  ISBN可能需要爬虫
  管理员界面--不单独设置管理员界面而是通过权限增加按钮

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

