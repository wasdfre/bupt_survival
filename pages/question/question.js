//answer.js
var util = require('../../utils/util.js')
var time = require('../../utils/util.js')
var app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    motto: '知乎--微信小程序版',//上方标题
    discussShow: false,//不管这个
    // inputMessage: '',
    // SendTime: '',
    // Time: '',
    // HeadImageUrl: '',
    // UserName: '',
    PageId: '',//页面id
    UpPageId: '',//点赞人id
    RemoveId: '',//删除id
    PostUserId: '',//问题人open
    ReplyOpenId: '',//回复人open
    PageData: [],
    dataArray: [],
    PostUserData: [],
    Up_Record_num:'',
    Reply_Record_num:'',
  },
  //点击回答本身
  // bindItemTap: function() {
  //   wx.navigateTo({
  //     url: '../answer/answer'
  //   })
  // },
  //加载函数
  //使用用户id作用用户标识，使用问题id作为问题标识
  //逻辑就是查找用户的，查找自己的
  //一加载
  onShow:function()
  {
    this.get_DBinf()
  },
  onLoad: function () 
  {
    //获取正在使用的用户信息
    wx.getStorage({
      key: 'Userinfo',
    })
    //调用加载函数
    this.get_DBinf()
  },
  //加载函数
  get_DBinf:function(e){
    var that = this;
    //获取缓存中当前帖子id与发帖人openid
    wx.getStorage
    ({
      key: 'key',
      success(res)
      {
        that.setData
        ({
          PageId: res.data.post_id,
          PostUserId: res.data.postopenid
        })
        //根据贴子ID来查找贴子的内容
        db.collection('Assistant_DataSheet').doc(that.data.PageId).get
        ({
          success: function (res) 
          {
            that.setData
            ({
              PageData: res.data,
              Up_Record_num:res.data.Up_Record_num,
              Reply_Record_num:res.data.Reply_Record_num,
            })
           console.log("我是第一个", that.data.Up_Record_num)
          }
        })
        //根据贴子的ID获取贴子下面的回复内容
        db.collection('My_ReplyData').where
        ({
          PageId: that.data.PageId
        }).get
        ({
          success: function (res) 
          {
            console.log(res.data._id)
            that.setData
            ({
              dataArray: res.data
            })
          }
        })

        //根据发帖人的openid查找他的头像和用户名
        db.collection('Assistant_User').where
        ({
          _openid: that.data.PostUserId
        }).get
        ({
          success: function (res) 
          {
            that.setData
            ({
              PostUserData: res.data
            })
          }
        })

        //获取自己的头像和用户名，使其可以在评论栏显示。
        db.collection('Assistant_User').where
        ({
          _openid: app.globalData.openid
        }).get
        ({
          success: function (res) 
          {
            that.setData
            ({
              HeadImageUrl: res.data[0].User_head_url,
              UserName: res.data[0].Username,
              ReplyOpenId: res.data[0]._openid
            })
          }
        })
      }
    })
  },
  //不管
  tapName: function(event){
    console.log(event)
  },
  //点赞部分
  upclickbutton: function (e) {
    var that = this
    // var ind = e.currentTarget.dataset.nowindex
    const postuserid = e.currentTarget.dataset.postopenid

    // console.log(e)
    if (1)//this.data.UpArray[ind] == 0)//说明没点赞过，这里设置为1是为了方便调试
    {

      // var nowup = 'UpArray[' + ind + ']'//设置为点赞过
      // this.setData({
      //   [nowup]: 1
      // })
      //添加点赞信息
      const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
      return db.collection('Assistant_Up').add
      ({ 
        data: 
        {
          Up_Post_id:e.currentTarget.dataset.post_id,
          Up_id: e.currentTarget.dataset.postopenid,
          Time_s: Date.now()
        }
      }).then(res => {
        console.log("Assistant_Up OK!");
        //增加赞数
        wx.cloud.callFunction({
          name: 'Up_Assistant_Post',
          data: {
            Post_id: e.currentTarget.dataset.post_id,
          },
          success: function (res) {
            console.log("Up_Assistant_Post OK!");
            that.get_DBinf()
            wx.showToast({
              title: '已点赞',
              image: '../../images/Up_heart.png',
              duration: 2000
            })
          },
          fail: err => {
            console.log('error:', err)
          }
        })
      })
    }
    else{
      wx.showToast({
        title: '已点赞过',
        image: '../../images/Up_heart2.png',
        duration: 2000
      })
    }
  },
  //跳转到回答问题界面
  Touch:function(e)
  {
    var that = this
    console.log(e)
    that.setData({
      replyData: e.currentTarget.dataset
    })
    console.log('1',that.data.replyData)
    wx.navigateTo({
      url: '../answer_question/answer_question',
    
    })
  },
  //点踩函数，和点赞相同，就是云函数变了一下
  downclickbutton: function (e)
  {
    var that = this
    // var ind = e.currentTarget.dataset.nowindex
    // const postuserid = e.currentTarget.dataset.postopenid

    if (1)//this.data.UpArray[ind] == 0)//说明没点赞过
    {
        wx.cloud.callFunction({
          name: 'Down_Assistant_Post',
          data: {
            Post_id: e.currentTarget.dataset.post_id,
          },
          success: function (res) {
            console.log("Up_Assistant_Post OK!");
            that.get_DBinf()
            wx.showToast({
              title: '已点赞',
              image: '../../images/Up_heart.png',
              duration: 2000
            })
          },
          fail: err => {
            console.log('error:', err)
          }
        })
    }
    else{
      wx.showToast({
        title: '已点赞过',
        image: '../../images/Up_heart2.png',
        duration: 2000
      })
    }
  },

})
