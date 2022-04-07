//discovery.js
var util = require('../../utils/util.js')
Page({
  data: {
    navTab: ["最新", "热门",],      //切换类别
    currentNavtab: "0",            //目前类别
    //轮播图参数
    imgUrls: [//图片列表
      '../../images/24213.jpg',
      '../../images/24280.jpg',
      '../../images/1444983318907-_DSC1826.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    feed: [],
    feed_length: 0,
    //问题内容列表
    DataPostArry:[],  
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
  //一载入页面
  onLoad: function () 
  {
    //获取正在使用的用户信息
    wx.getStorage
    ({
      key: 'Userinfo',
    })
    //获取问题信息，在数据库Assistant_DataSheet中
    var that = this
    const get_inf_db = wx.cloud.database()
    get_inf_db.collection('Assistant_DataSheet').get
    ({
      success: res => 
      {
        that.setData
        ({
          DataPostArry: res.data//获取全部数据
        })
        console.log(res)
        //异步promise对象，不用管
        Promise.all(res.data.map((item)=>{})).then
        (
          res=>
          {
            let _ = get_inf_db.command;
            //根据所有用户的openid获取用户数据，在数据库Assistant_User
            get_inf_db.collection('Assistant_User').where
            ({
              _openid: _.in(res)//在res中的openid
            }).get().then
            (res => 
              {
                that.data.UsernameArry = [];//用户名
                that.data.UserHeadurlArry=[];//头像
                for (let i = 0; i < this.data.DataPostArry.length;i++)
                {
                  //已知问题列表中每个问题对应的openid
                  let openId = this.data.DataPostArry[i]._openid;
                  for(let j=0;j<res.data.length;j++)
                  {
                    if(openId == res.data[j]._openid)
                    {//获取对应用户名和头像
                      that.data.UsernameArry.push(res.data[j].Username);
                      that.data.UserHeadurlArry.push(res.data[j].User_head_url);
                    }
                  }
                }
                that.setData
                ({
                  UsernameArry: that.data.UsernameArry,
                  UserHeadurlArry: that.data.UserHeadurlArry
                });
              }
            )
          }).catch((ex)=>
          {
            console.log(ex);
          })

       }
     })
    this.refresh();
  },
  //切换上方选择页面的函数
  switchTab: function(e)
  {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
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

  
  //下面的暂时不管
  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
    console.log("lower")
  },

  //网络请求数据, 实现刷新
  refresh0: function(){
    var index_api = '';
    util.getData(index_api)
        .then(function(data){
          //this.setData({
          //
          //});
          console.log(data);
        });
  },

  //使用本地 fake 数据实现刷新效果
  refresh: function(){
    var feed = util.getDiscovery();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed:feed_data,
      feed_length: feed_data.length
    });
  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function(){
    var next = util.discoveryNext();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
  }
});
