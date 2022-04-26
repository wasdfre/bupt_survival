//logs.js
var util = require('../../utils/util.js')
var app = getApp()
const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
const _ = db.command
Page({
  data: {
    motto: 'Hello World',
    // userInfo: {}
    Username:'',
    User_head_url:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: ''
    })
  },
  //初始加载
  onShow: function () 
  {
    console.log('onLoad')
    var that = this
    //根据openid从数据库中获取信息
    db.collection('Assistant_User').where
    ({
      _openid: wx.getStorageSync("myOpenId"),
      //根据本地缓存获取我的openid，然后从数据库中获取我的信息
    }).get
    ({
      success: res => 
      {
        console.log(1111,res)
        that.setData
        ({
          Username:res.data[0].Username,//姓名
          User_head_url:res.data[0].User_head_url//头像
        })
      },
      fail: err =>
       {
        console.log('error:', err)
      }
    })
  },
  discussbutton: function () {
    var data = new Date()
    wx.cloud.callFunction({
      name: 'upDateDiscuss',
      data: {
        youid: wx.getStorageSync("myOpenId"),
        time: data.getTime()
      },
      success: function (res) {
        console.log(res, "++++++++++++++")
      }
    })
    this.setData({
      replyNumber: 0
    })
    wx.navigateBack({
      url: '../Mine_Reply/Mine_Reply',
    })
  },
})