//discovery.js
const app = getApp()
var util = require('../../utils/util.js')
var that = this
const get_inf_db = wx.cloud.database()
let _ =get_inf_db.command
var data = {
  //云开发环境id
  env: 'a123-4gjil6fj4c251504'
  }


Page({
  data: {
    navTab: ["最新", "热门",],      //切换类别
    currentNavtab: "0",            //目前类别
    //问题内容列表
    DataPostArry:[], 
    DataPostArry_Heat:[], 
    //用户头像列表             
    UserHeadurlArry:[],    
    //点赞信息列表
    UpArray: [],
    //用户名列表                    
    UsernameArry: [],   
    //用户openid列表            
    UserId:'',                      
    //回复信息列表
    replyData: []
  },

  onLoad: function () 
  {
    get_inf_db.collection('Assistant_DataSheet')
      .where(_.or([
        {//问题
          Question: get_inf_db.RegExp({ //使用正则查询，实现对搜索的模糊查询
            regexp:wx.getStorageSync('input_content'),
            options: 'i', //大小写不区分
          }),
        },
        {//问题描述
          Questiondes: get_inf_db.RegExp({
            regexp:wx.getStorageSync('input_content'),
            options: 'i',
          }),
        }
      ])).get
    ({
      success: res => 
      {
        console.log("搜索传递数据",wx.getStorageSync('input_content'))
        var res_temp=res.data.reverse();
        console.log("搜索进程1",res_temp)
        var that=this
        that.setData
        ({
          DataPostArry: res_temp,//获取全部数据

        })
        //异步promise对象，不用管
        //map，每个对象调用一个函数，item赋为空值
        Promise.all(res_temp.map((item)=>item["_openid"])).then
        (
          res=>
          {
            var postdata=res_temp;
            console.log("搜索进程2",postdata)
            //根据所有用户的openid获取用户数据，在数据库Assistant_User
            get_inf_db.collection('Assistant_User').where
            ({
              // _openid: "oSe9A5dvjrhoLCUz4pAKmN9487PY"
              _openid:_.in(res)
              // _.in(res)//在res中的openid
            }).get().then
            (res => 
              {
                // that.data.UsernameArry = [];//用户名
                // that.data.UserHeadurlArry=[];//头像
                for (let i = 0; i < postdata.length;i++)
                {
                  //已知问题列表中每个问题对应的openid
                  let openId = postdata[i]._openid;
                  for(let j=0;j<res.data.length;j++)
                  {
                    if(openId == res.data[j]._openid)
                    {//获取对应用户名和头像
                      postdata[i]['Username']=res.data[j].Username;
                      //这里有什么区别
                      postdata[i]['UserHeadurl']=res.data[j].User_head_url;
                      // that.data.UsernameArry.push(res.data[j].Username);
                      // that.data.UserHeadurlArry.push(res.data[j].User_head_url);
                    }
                  }
                }
                that.setData
                ({
                  DataPostArry: postdata,
                  DataPostArry_Heat: postdata.sort(function (a,b)
                  {
                    return b.Up_Record_num*0.3+b.Reply_Record_num*0.7-a.Up_Record_num*0.3+a.Reply_Record_num*0.7;
                  },)
                  // UserHeadurlArry: that.data.UserHeadurlArry
                });
                console.log("头像",that.data.DataPostArry_Heat)
              }
            )
          }).catch((ex)=>
          {
            console.log(ex);
          }
        )  

       }
     })
    // this.refresh();
  },
  

//   //获取本地记录
   gethis() {
     let that = this;
     wx.getStorage({
           key: 'history',
           success: function(res) {
                 let hislist = JSON.parse(res.data);
                 //限制长度
                 if (hislist.length > 5) {
                       hislist.length = 5
                 }
                that.setData({
                       hislist: hislist
                 })
           },
     })
 },

gotop() {
  wx.pageScrollTo({
        scrollTop: 0
  })
},
//监测屏幕滚动
onPageScroll: function (e) {
  this.setData({
        scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
  })
},

  //点击问题对应的函数
  bindQueTap: function(e)
  {
    let that = this
    //获取当前点击问题的postid，问题者openid
    that.setData
    ({
      replyData: e.currentTarget.dataset
    })
    console.log(that.data.replyData)
    // 缓存相关信息
    wx.setStorage
    ({
      key: "key",
      data: that.data.replyData
    })
    //跳转页面
    wx.navigateTo({
      url: '../question/question'
    })
  },
  search_content(event){
    console.log("搜索内容：", event.detail.value)    //这里可以让我们在开发的时候在console控制台上看到我们的结果
    Rname1 = event.detail.value //这里的Rname1 也是需要在前面进行宏定义的格式为（ let Rname1 = "" ） ，然后给它赋值
  },
 
  //使用本地 fake 数据实现刷新效果
  getData: function(){
    var feed = util.getData2();
    var feed_data = feed.data;
    this.setData({
      feed:feed_data,
      feed_length: feed_data.length
    });
  },
  refresh: function(){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed:feed_data,
      feed_length: feed_data.length
    });
    setTimeout(function(){
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    },3000)
  },

  // 使用本地 fake 数据实现继续加载效果
  nextLoad: function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    var next = util.getNext();
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
    setTimeout(function(){
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      })
    },3000)
  }


})