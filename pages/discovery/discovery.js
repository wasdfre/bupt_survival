//discovery.js
//常参数设定
const app = getApp()//创建APP类的实例
var util = require('../../utils/util.js')//调用其它文件模块
const db = wx.cloud.database()//初始化数据库 宏定义一个db指代
const _ = db.command;//宏定义一个_指代数据库操作符
var data = {env: 'a123-4gjil6fj4c251504'}//云开发环境id
Page({
  data: {
    navTab: ["最新", "热门",],      //切换类别
    currentNavtab: "0",            //目前类别
    //轮播图图片列表
    imgUrls: 
    [
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
    const db = wx.cloud.database()
    //获取全部数据
    db.collection('Assistant_DataSheet').get
    ({
      success: res => 
      {
        this.setData
        ({
          DataPostArry: res.data
        })
        this.get_uesrdata();
      }
    })
  },


  //获取发布问题人数据
  get_uesrdata:function()
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
    // this.gethis();
    // this.getnew();


    //从数据库Assistant_DataSheet中，获取问题列表
      // 获取用户数据嵌套在获取问题列表后的success中
    this.get_question();


    // this.refresh();
  },
  

//   //获取本地记录
//   gethis() {
//     let that = this;
//     wx.getStorage({
//           key: 'history',
//           success: function(res) {
//                 let hislist = JSON.parse(res.data);
//                 //限制长度
//                 if (hislist.length > 5) {
//                       hislist.length = 5
//                 }
//                 that.setData({
//                       hislist: hislist
//                 })
//           },
//     })
// },

// //跳转详情
// detail(e) {
//   let that = this;
//   wx.navigateTo({
//         url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
//   })
// },
// //搜索结果
// search(n) {
//   let that = this;
//   let key = that.data.key;
//   if (key == '') {
//         wx.showToast({
//               title: '请输入关键词',
//               icon: 'none',
//         })
//         return false;
//   }
//   wx.setNavigationBarTitle({
//         title:'"'+ that.data.key + '"的搜索结果',
//   })
//   wx.showLoading({
//         title: '加载中',
//   })
//   if (n !== 'his') {
//         that.history(key);
//   }
//   db.collection('publish').where({
//         status: 0,
//         dura: _.gt(new Date().getTime()),
//         key: db.RegExp({
//               regexp: '.*' + key + '.*',
//               options: 'i',
//         })
//   }).orderBy('creat', 'desc').limit(20).get({
//         success(e) {
//               wx.hideLoading();
//               that.setData({
//                     blank: true,
//                     page: 0,
//                     list: e.data,
//                     nomore: false,
//               })
//         }
//   })
// },
onReachBottom() {
  this.more();
},
keyInput(e) {
  this.data.key = e.detail.value
},
//至顶
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
//加载更多
// more() {
//   let that = this;
//   if (that.data.nomore || that.data.list.length < 20) {
//         return false
//   }
//   let page = that.data.page + 1;
//   if (that.data.collegeCur == -2) {
//         var collegeid = _.neq(-2); //除-2之外所有
//   } else {
//         var collegeid = that.data.collegeCur + '' //小程序搜索必须对应格式
//   }
//   db.collection('publish').where({
//         status: 0,
//         dura: _.gt(new Date().getTime()),
//         key: db.RegExp({
//               regexp: '.*' + that.data.key + '.*',
//               options: 'i',
//         })
//   }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
//         success: function (res) {
//               if (res.data.length == 0) {
//                     that.setData({
//                           nomore: true
//                     })
//                     return false;
//               }
//               if (res.data.length < 20) {
//                     that.setData({
//                           nomore: true
//                     })
//               }
//               that.setData({
//                     page: page,
//                     list: that.data.list.concat(res.data)
//               })
//         },
//         fail() {
//               wx.showToast({
//                     title: '获取失败',
//                     icon: 'none'
//               })
//         }
//   })
// },






  search_content(event)
  {
    console.log("搜索内容：", event.detail.value)    //这里可以让我们在开发的时候在console控制台上看到我们的结果
    Rname1 = event.detail.value //这里的Rname1 也是需要在前面进行宏定义的格式为（ let Rname1 = "" ） ，然后给它赋值
  },

  //搜索框
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
  //scroll: function (e) {
  //  console.log("scroll")
  //},

  // //网络请求数据, 实现首页刷新
  // refresh0: function(){
  //   var index_api = '';
  //   util.getData(index_api)
  //       .then(function(data){
  //         //this.setData({
  //         //
  //         //});
  //         console.log(data);
  //       });
  // },

  //使用本地 fake 数据实现刷新效果
  getData: function(){
    var feed = util.getData2();
    console.log("loaddata");
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
    console.log("continueload");
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