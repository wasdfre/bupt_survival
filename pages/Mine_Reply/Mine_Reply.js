var app = getApp()
var util = require('../../utils/util.js');
var template = require('../../template/template.js');
var db = wx.cloud.database()
const _ = db.command;//宏定义一个_指代数据库操作符
/*目的就是根据openid获取用户自己发布过的问题 */
Page({

  data: {
    currentTab: 0,
    DataPostArry: [],
    UserId: '',//app.globalData.openid
  },


  //  预览图片
  previewImage: function (e)
  {
    wx.previewImage
    ({
      urls: [e.target.dataset.myimg], // 需要预览的图片http链接列表
    })
  },


  //删除回答
  Remove_Post: function (e) {
    let that = this
    wx.showModal
    ({
      title: '提示',
      content: '请问是否删除本条问题？',
      success: function (res) 
      {
        if (res.confirm) 
        {
          console.log(e.currentTarget.dataset.post_id)//事件的id
          wx.cloud.callFunction
          ({
            name: 'Remove_Assistant_DataSheet',
            data: 
            {
              youid: e.currentTarget.dataset.post_id,
            },
            success: function (res)
            {
              //删除成功后重新获取问题列表
              that.get_DBinf()
            }
          })
        }
      }
    })
  },


  //点击某一个回答前去问题页面
  to_Reply: function (e) 
  {
    let that = this
    that.setData
    ({
      replyData: e.currentTarget.dataset
    })
    console.log(that.data.replyData)
    wx.setStorage
    ({
      key: "key",
      data: that.data.replyData
    })
    wx.navigateTo
    ({

      url: '../question/question',
      success: function (res) { console.log("我去回答页啦！") },
      fail: function (res) { console.log("诶，我怎么还在原地？") }
    })
  },


  onShow() 
  {
    this.get_DBinf();
  },


  //获取使用者信息
  get_DBinf: function () 
  {
    var that = this
    wx.getStorage
    ({
      key: 'User_openid',
      success(res) 
      {
        that.setData
        ({
          UserId: res.data
        })
        that.get_question()
      }
    })
  },



  //获得问题数据
  get_question:function()
  {
    //获取全部数据
    var that = this
    db.collection('Assistant_DataSheet').where
    ({
      _openid: that.data.UserId
    }).get
    ({
      success: res => 
      {
        that.setData
        ({
          DataPostArry: res.data
        })
        console.log(111,res)
        this.get_question_uesrdata();
      }
    })
  },



  //获取发布问题人数据
  get_question_uesrdata:function()
  {
    var res_temp=this.data.DataPostArry;
    Promise.all(res_temp.map((item)=>item["_openid"])).then
    (
      res=>
      {
        //根据所有用户的openid获取用户数据，在数据库Assistant_User
        db.collection('Assistant_User').where
        ({
          _openid:_.in(res)//根据在res中的openid检索数据
        }).get().then
        (
          res => 
          {
            // 为每一条问题添加用户头像与姓名
            for (let i = 0; i < res_temp.length;i++)
            {
              //根据每个问题的open进行匹配
              let openId = res_temp[i]._openid;
              for(let j=0;j<res.data.length;j++)
              {
                if(openId == res.data[j]._openid)
                {
                  res_temp[i]['Username']=res.data[j].Username;
                  res_temp[i]['UserHeadurl']=res.data[j].User_head_url;
                }
              }
            }       
            this.setData
            ({
              DataPostArry: res_temp.reverse(),//按照时间排序
            });
            console.log(2222,res)
          }
        )
      }
    ).catch((ex)=>
      {
        console.log(ex);
      }
    )
  },
})