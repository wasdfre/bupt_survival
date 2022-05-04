//answer.js
var util = require('../../utils/util.js')
var time = require('../../utils/util.js')
var app = getApp()
const db = wx.cloud.database();
//这里的命名规范实际需要修改
Page({
  data: {
    motto: '提问',//上方标题
    discussShow: false,//不管这个
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
  //加载函数
  //使用用户id作用用户标识，使用问题id作为问题标识
  //逻辑就是查找用户的，查找自己的
  //每次显示

  //获取对应问题内容
  get_one_question:function(PageId)
  {
    //注意this与that的使用
    var that=this
    //根据贴子ID来查找贴子的内容
    db.collection('Assistant_DataSheet').doc(PageId).get
    ({
      success: function (res) 
      {
        that.setData
        ({
          PageData: res.data,
          Up_Record_num:res.data.Up_Record_num,
          Reply_Record_num:res.data.Reply_Record_num,
        })
      }
    })
  },


  //获取对应问题回复
  get_answer:function()
  {
     var that=this
     //根据贴子的ID获取贴子下面的回复内容
     db.collection('My_ReplyData').where
     ({
       PageId: this.data.PageId
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

  },


  //获得回答者信息
  get_answer_uesrdata:function()
  {
    var that=this
    //根据发帖人的openid查找他的头像和用户名信息
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
  },


  //每次显示
  onShow:function()
  {
    this.get_DBinf()
  },


  //第一次加载
  onLoad: function () 
  {
    //获取正在使用的用户信息
    wx.getStorage
    ({
      key: 'Userinfo',
    })
    //调用加载函数
    this.get_DBinf()
  },


  //获取信息
  get_DBinf:function(e){
    var that = this;
    //获取缓存中当前帖子id与发帖人openid
    wx.getStorage
    ({
      key: 'key',
      success(res)
      {
        //存储对应信息
        that.setData
        ({
          PageId: res.data.post_id,
          PostUserId: res.data.postopenid
        }),
        // }
        //根据贴子ID来查找问题的内容
        that.get_one_question(res.data.post_id);
        //根据问题的ID获取问题下面的回答内容
        that.get_answer();
        //根据回答的openid查找他的头像和用户名
        that.get_answer_uesrdata();
        //空余，是否对自己的回答特殊处理，如删除等
      }
    })
  },


//不管
  tapName: function(event){
    console.log(event)
  },


//数据库增加点赞信息
upload_up_data:function()
{
  var that = this;
  db.collection('Assistant_Up').add
  ({ 
    data: 
    {
      Up_Post_id:this.data.PageId,
      Up_id: this.data.PostUserId,
      Time_s: Date.now()
    }
  }).then
  (
    res => 
    {
      //向对应问题数据增加赞数
      console.log(that.data.PageId)
      that.add_up_number()
    }
  )
},

//点踩后，数据库向对应问题数据减少赞数
add_down_number:function()
{
  var that = this;
  wx.cloud.callFunction
  ({
    name: 'Down_Assistant_Post',
    data: 
    {
      Post_id:that.data.PageId,
    },
    success: function (res)
    {
      console.log("Up_Assistant_Post OK!");
      //重新渲染页面
      that.get_DBinf()
      //显示已点赞图标
      wx.showToast
      ({
        title: '已点踩',
        image: '../../images/Up_heart.png',
        duration: 2000
      })
    }
  })
},

//数据库向对应问题数据增加赞数
add_up_number:function()
{
  var that = this;
  wx.cloud.callFunction
  ({
    name: 'Up_Assistant_Post',
    data: 
    {
      Post_id:that.data.PageId,
    },
    success: function (res)
    {
      console.log("Up_Assistant_Post OK!");
      //重新渲染页面
      that.get_DBinf()
      //显示已点赞图标
      wx.showToast
      ({
        title: '已点赞',
        image: '../../images/Up_heart.png',
        duration: 2000
      })
    }
  })
},

//点击点赞按钮时
upclickbutton: function (e) 
{
  if (1)//说明没点赞过，这里设置为1是为了方便调试
  {

    // var nowup = 'UpArray[' + ind + ']'//设置为点赞过
    //添加点赞信息
    this.upload_up_data()
  }
  else{
    wx.showToast
    ({
      title: '已点赞过',
      image: '../../images/Up_heart2.png',
      duration: 2000
    })
    }
  },


  //点击点踩按钮时
  downclickbutton: function (e)
  {
    var that = this
    if (1)//this.data.UpArray[ind] == 0)//说明没点过
    {
        that.add_down_number()
    }
    else{
      wx.showToast({
        title: '已点踩过',
        image: '../../images/Up_heart2.png',
        duration: 2000
      })
    }
  },

  //点击回答问题，跳转到回答问题界面
  Touch:function(e)
  {
    var that = this
    console.log(e)
    that.setData
    ({
      replyData: e.currentTarget.dataset
    })
    console.log('1',that.data.replyData)
    wx.navigateTo
    ({
      url: '../answer_question/answer_question',
    
    })
  },

})
