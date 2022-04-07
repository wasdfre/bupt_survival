const app = getApp()
var util = require('../../utils/util.js');
const db = wx.cloud.database();
Page({

  data: {
    PostUserId: '',//发帖人
    ReplyOpenId: '',//回答人
    inputMessage: '',//输入的内容
    SendTime: '',//发送时间
    Time: '',
    telValue: "",//输入的文字
    UserInfo:'',
    inputMessage: '',
    SendTime: '',
    Time: '',
    HeadImageUrl: '',
    UserName: '',
    PageId: '',
    UpPageId: '',
    PostUserId: '',
    ReplyOpenId: '',
    userName:''


  },
  actionSheetTap: function () 
  {
    this.setData
    ({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () 
  {
    this.setData
    ({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function ()
  {
    this.setData
    ({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //获得输入区输入
  getInput: function (e) 
  {
    this.setData
    ({
      telValue: e.detail.value
    })
    console.log("efwef w",e)
  },
formSubmit: function (e) 
{
    var that = this;
    wx.showToast
    ({
      title: '评论成功',
      icon: 'none'
    })
    this.setData
    ({
      // discussShow: true,
      inputMessage:that.data.telValue,
      SendTime: Date.now(),
      Time: util.formatTime(new Date)
    })

    wx.cloud.callFunction({
      name: 'reply',
      data: 
      {
        Page_id: that.data.PageId
      },
      success: function (res) {
      //  console.log("deqwfwefw",res.result)
      }
    })

    db.collection('My_ReplyData').add
    ({
      data: 
      {
        context: that.data.inputMessage,
        image: that.data.HeadImageUrl,
        time: that.data.SendTime,
        name: that.data.UserName,
        PageId: that.data.PageId,
        PostUserId: that.data.PostUserId,
        PageTime: that.data.Time
      }, success: function (res) 
      {
        that.setData
        ({
          inputMessage: ''
        })
        //但是会叠好多层
        wx.navigateTo({
          url: '../question/question',
        
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options)
  {
    var that = this;
    wx.getStorage({
      key: 'key',
      success(res) 
      {
        //需要传入的参数
        that.setData
        ({
          PageId: res.data.post_id,
          PostUserId: res.data.postopenid
        })
        console.log(1111111,res)
        //获取自己的头像和用户名，使其可以在评论栏显示。、
        db.collection('Assistant_User').where
        ({
          _openid: app.globalData.openid
        }).get
        ({
          success: function (res)
           {
            that.setData({
              HeadImageUrl: res.data[0].User_head_url,
              UserName: res.data[0].Username,
              ReplyOpenId: res.data[0]._openid
            })
            console.log("我是用户的头像和姓名：", that.data)
          }
        })
      }
    })
  }
})