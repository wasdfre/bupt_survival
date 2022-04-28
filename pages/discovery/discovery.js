//discovery.js
const app = getApp()
var util = require('../../utils/util.js')
const db = wx.cloud.database().collection("Assistant_DataSheet")//初始化数据库 宏定义一个db指代
var data = {
  //云开发环境id
  env: 'a123-4gjil6fj4c251504'
  }
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
    replyData: [],
    keyInput:'',
    inputValue:''
  },

  //获取输入框内容
  keyInput:function(e){
    this.setData({
      keyInput:e.detail.value
    })
    wx.setStorageSync('input_content', this.data.keyInput)
  },
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
  //一载入页面
  sort_index:function (a,b){
    a_heat=a.Up_Record_num*0.3+a.Reply_Record_num*0.7;
    b_heat=b.Up_Record_num*0.3+b.Reply_Record_num*0.7;
    return a.Up_Record_num*0.3+a.Reply_Record_num*0.7-b.Up_Record_num*0.3+b.Reply_Record_num*0.7;
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
  
  onLoad: function () 
  {
    // this.gethis();
    // this.getnew();
    //获取正在使用的用户信息
    //wx.getStorage
    //({
    //  key: 'Userinfo'
  //})
    //获取问题信息，在数据库Assistant_DataSheet中
    var that = this
    const get_inf_db = wx.cloud.database()
    get_inf_db.collection('Assistant_DataSheet').get
    ({
      success: res => 
      {
        var res_temp=res.data.reverse();
        
        that.setData
        ({
          DataPostArry: res_temp//获取全部数据

        })

        //异步promise对象，不用管
        //map，每个对象调用一个函数，item赋为空值
        Promise.all(res_temp.map((item)=>item["_openid"])).then
        (
          res=>
          {
            var postdata=res_temp;
            console.log("数据库数据",postdata)
            //这里是_定
            let _ = get_inf_db.command;
            // console.log('dadwadaw',res.data.map((item)=>item[key]))
            //根据所有用户的openid获取用户数据，在数据库Assistant_User
            // console.log("头像ers",res)
            get_inf_db.collection('Assistant_User').where
            ({
              // _openid: "oSe9A5dvjrhoLCUz4pAKmN9487PY"
              _openid:_.in(res)
              // _.in(res)//在res中的openid
            }).get().then
            (res => 
              {
                
                // console.log("头像",res)
                // that.data.UsernameArry = [];//用户名
                // that.data.UserHeadurlArry=[];//头像
                // console.log("1111232",res)
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
                
                // console.log("11113dwadw23232",postdata)
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
     //let that = this;
     wx.getStorage({
           key: 'history',
           success: function(res) {
                 let hislist = JSON.parse(res.data);
                 //限制长度
                 if (hislist.length > 5) {
                       hislist.length = 5
                 }
                 //here
                that.setData({
                       hislist: hislist
                 })
           },
     })
 },

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
//onReachBottom() {
///  this.more();
//},
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
  search_content(event){
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