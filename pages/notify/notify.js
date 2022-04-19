//logs.js
const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
var util = require("../../utils/util.js")
const _ = db.command
const app = getApp()
const myOpenId = wx.getStorageSync("myOpenId")
Page({
  data: {
    navTab: ["通知", "赞与感谢"],
    currentNavtab: "0",
    discussList:[],
    upList: []
  },
  onShow:function () {
    this.discussMe()
    this.searchAssistantUp()
  },
  // onLoad: function () {
  //   this.discussMe()
  //   this.searchAssistantUp()
  // },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
//别人评论我
discussMe: function () {
  var that = this
  this.setData({
    discussList: []
  })
  //openid获取方式修改
  console.log("1111fr",app.globalData.openid)
  db.collection('My_ReplyData').where({ //别人评论我
    PostUserId: app.globalData.openid
  }).get
  ({
    success: res => 
    {
      console.log("1111ffr",res.data.length)

      for (let i = 0; i < res.data.length; i++) 
      {
        // console.log("0000",i)
        let index = res.data.length - i - 1
        
        var postOpenid = 'discussList[' + index + '].discussUserId';

        var discussPostId = 'discussList[' + index + '].discussPostId';
        var discussTimeHour = 'discussList[' + index + '].discussTimeHour';
        var discussTimeDay = 'discussList[' + index + '].discussTimeDay';
        // console.log("0000",i)
        var time = util.formatTime(res.data[i].time)//格式化时间
        
        that.setData
        ({
          [postOpenid]: res.data[index]._openid,
          [discussPostId]: res.data[index].PageId,
          [discussTimeHour]: time.substr(time.indexOf(" ") + 1, 5),
          [discussTimeDay]: time.substr(time.indexOf("-") + 1, 5),
        })
        console.log("-------", res.data[index]._openid)
        db.collection('Assistant_User').where
        ({
          _openid: res.data[index]._openid
        }).get
        ({
          success: res => 
          {
            var postUserName = 'discussList[' + index + '].postUserName';
            var postHeadUrl = 'discussList[' + index + '].postHeadUrl';
            that.setData
            ({
              [postUserName]: res.data[0].Username,
              [postHeadUrl]: res.data[0].User_head_url,
            })
          }
        })
        db.collection('Assistant_DataSheet').where
        ({
          _id: res.data[index].PageId,
        }).get
        ({
          success: res => 
          {
            var postContext = 'discussList[' + index + '].postContext';
            that.setData
            ({
              [postContext]: res.data[0].Question,
            })
            // console.log(122121,res.data)
          }
        })
      } 
      // console.log("0000",11)
    }
  })
},
//别人点赞我
searchAssistantUp: function ()
{
  var that = this
  this.setData({
    upList: []
  })
  db.collection('Assistant_Up').where({ //点赞列表有自己说明有人点赞
    Up_id: app.globalData.openid
  }).get({
    success: res => {
      // console.log(2233,res.data)
      for (var j = 0; j < res.data.length; j++) {

        let index = res.data.length - j - 1
        var upUserTimeHour = 'upList[' + index + '].upUserTimeHour';
        var upUserTimeDay = 'upList[' + index + '].upUserTimeDay';
        var upUserId = 'upList[' + index + '].upUserId';
        var upPostId = 'upList[' + index + '].upPostId';
        var upOpenId = 'upList[' + index + '].upOpenId';
        var time = util.formatTime(res.data[j].Time_s)//格式化时间

        that.setData({
          [upUserTimeHour]: time.substr(time.indexOf(" ") + 1, 5),//时
          [upUserTimeDay]: time.substr(time.indexOf("-") + 1, 5), //分
          [upUserId]: res.data[index].Up_id,  //点赞谁的id
          [upPostId]: res.data[index].Up_Post_id,//谁点赞的帖子id
          [upOpenId]: res.data[index]._openid,//是谁点赞id
        })

        db.collection('Assistant_DataSheet').where({
          _id: res.data[index].Up_Post_id
        }).get({
          success: res => {
            console.log(2233,res)
            var context = 'upList[' + index + '].context';//获取帖子内容
            that.setData({
              [context]: res.data[0].Question
            })
            console.log(sss,res.data[0].Question)
            // console.log
          }
        })
        db.collection('Assistant_User').where({
          _openid: res.data[index]._openid
        }).get({
          success: res => {
            let headUrl = 'upList[' + index + '].headUrl';//获取头像
            let userName = 'upList[' + index + '].userName';//获取名字
            that.setData({
              [headUrl]: res.data[0].User_head_url,
              [userName]: res.data[0].Username
            })
          }
        })
      }

    },

  })

}
})