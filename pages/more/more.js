//logs.js
var util = require('../../utils/util.js')
var app = getApp()
const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
const _ = db.command
Page({
  data: {
    Username:'',
    User_head_url:'',
  },
 

  //获取用户信息
  get_user_data:function()
  {
    var that = this
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

   //初始加载
  onShow: function () 
  {
    //根据openid从数据库中获取信息
    this.tabBar() ;
    this.get_user_data();
    
   
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:4
      })
    }
  },

  antuorize:function()
  {

  },
  change:function()
  {

  },
  login_or_change:function(e)
  {
      wx.getUserProfile({
        desc: '业务需要',
        success: res => 
        {
            console.log(res)
        }
      })
  },

  //点击我的回答
  discussbutton: function ()
   {
    var data = new Date()
    //更新最后一次回答的时间，这个函数位置在这里好像不太对
    // wx.cloud.callFunction
    // ({
    //   name: 'upDateDiscuss',
    //   data: {
    //     youid: wx.getStorageSync("myOpenId"),
    //     time: data.getTime()
    //   },
    //   success: function (res) 
    //   {
    //     console.log(res, "++++++++++++++")
    //   }
    // })
    wx.navigateTo
    ({
      url: '../Mine_Reply/Mine_Reply',
    })
  },
  //等待添加一个反馈函数
})