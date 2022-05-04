
//discovery.js
//常参数设定
const app = getApp()//创建APP类的实例
var util = require('../../utils/util.js')//调用其它文件模块
const db = wx.cloud.database()//初始化数据库 宏定义一个db指代
const _ = db.command;//宏定义一个_指代数据库操作符
var data = {env: 'a123-4gjil6fj4c251504'}//云开发环境id
Page({
  data: 
  {
    navTab: ["最新", "热门",],      //切换类别
    currentNavtab: "0",            //目前类别
    //轮播图图片列表
    imgUrls: 
    [
      '../../images/24213.jpg',
      '../../images/24280.jpg',
      '../../images/1444983318907-_DSC1826.jpg'
    ],
    //按时间排序问题内容列表
    DataPostArry:[], 
    //按热度排序问题内容列表
    DataPostArry_Heat:[],                         
    //回复信息列表
    replyData: []   
  },


  //切换上方选择页面的函数
  switchTab: function(e)
  {
    this.setData
    ({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },


  //点击某个问题后对应动作
  bindQueTap: function(e)
  {
    let that = this
    // console.log(1111,e)
    //缓存点击问题的序号，postid，问题者openid
    wx.setStorage
    ({
      key: "key",
      data:  e.currentTarget.dataset
    })
    //跳转至对应回答显示界面
    wx.navigateTo
    ({
      url: '../question/question'
    })
  },


  // 排序函数
  sort_heat:function (a,b)
  {
    var heat_a=a.Up_Record_num*0.3+a.Reply_Record_num*0.7;
    var heat_b=b.Up_Record_num*0.3+b.Reply_Record_num*0.7;
    return heat_b-heat_a;
  },


  //获得问题数据
  get_question:function()
  {
    //获取全部数据
    db.collection('Assistant_DataSheet').get
    ({
      success: res => 
      {
        this.setData
        ({
          DataPostArry: res.data
        })
        this.get_question_uesrdata();
      }
    })
  },


  //获取发布问题人数据
  get_question_uesrdata:function()
  {
    var res_temp=this.data.DataPostArry;
    console.log('dwdawdwa',res_temp)
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
              DataPostArry_Heat: res_temp.sort(this.sort_heat)//按照热度排序
            });
          }
        )
      }
    ).catch((ex)=>
      {
        console.log(ex);
      }
    )
  },

  //启动函数
  onLoad: function () 
  {
    //从数据库Assistant_DataSheet中，获取问题列表
    // 获取用户数据嵌套在获取问题列表后的success中
    this.get_question();
  },
  



search:function(res)
{
  this.setData({
    'inputValue':''
  })
  wx.navigateTo({
    url: '/pages/search/search'
  })
},
 //获取输入框内容
 keyInput:function(e){
  this.setData({
    keyInput:e.detail.value
  })
  wx.setStorageSync('input_content', this.data.keyInput)
},
onReachBottom() {
  this.more();
},
})