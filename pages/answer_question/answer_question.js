const app = getApp()
var util = require('../../utils/util.js');
const db = wx.cloud.database();

/*实现功能
  获取表单中输入的回答以及图片(暂未)，上传到数据库，在对应回答处回答数+1 */
Page({

  data: {
    PostUserId: '',//
    inputMessage: '',//输入的内容
    SendTime: '',//发送时间
    Time: '',
    telValue: "",//输入的文字
    inputMessage: '',
    UserName: '',//这个需要吗
    PageId: '',
    ReplyOpenId: '',
    image:'',
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


  // 提交回答到数据库中
  upload_answer:function () 
  {
    var that=this
    return db.collection('My_ReplyData').add
    ({ 
      data: 
      {
        context: that.data.inputMessage,
        image: that.data.image,
        time: that.data.SendTime,
        name: that.data.UserName,
        PageId: that.data.PageId,
        PostUserId: that.data.PostUserId,
        PageTime: that.data.Time
      }
    })
  },


  //添加回答数到数据库中
  update_answer_number:function()
  {
    //在对应问题处增加回答数
    var that = this;
    wx.cloud.callFunction
    ({
      name: 'Reply_post',
      data: 
      {
        PageId: that.data.PageId,//根据pageid 索引
      },
      success: function (res) 
      {
        console.log("Reply_post OK!");
        wx.navigateBack
        ({
              url: '../question/question',
        })
      },
    })
  },


  //点击提交按钮后操作
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
      //先添加回答到数据库中
      this.upload_answer().then(res => 
      {
        //然后增加对应问题评论数
        that.update_answer_number();
      })
    },

  
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
          PostUserId: res.data.postopenid,
          ReplyOpenId:app.globalData.openid
        })
      }
    })
  }
})