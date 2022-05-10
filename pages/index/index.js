const app = getApp()//创建APP类的实例
var util = require('../../utils/util.js')//调用其它文件模块
const db = wx.cloud.database()//初始化数据库 宏定义一个db指代
const _ = db.command;//宏定义一个_指代数据库操作符
var data = {env: 'a123-4gjil6fj4c251504'}//云开发环境id
Page({

  data: {
    index: null,
    number: 0,
    PostType:'',
    avatarUrl: '../../images/user-unlogin.png',
    user_openid: app.globalData.openid,
    telValue: "",
    question: "",
    questiondes: "",
    imgList: [],
    UserInfo:''
    

  },
  //获得输入区输入
  getQuestion: function (e) 
  {
    this.setData
    ({
      question: e.detail.value
    })
  },
  getQuestiondes: function (e) 
  {
    this.setData
    ({
      questiondes: e.detail.value
    })
  },
  //点击查看
  clickimage: function (e) 
  {
    // var index = e.target.dataset.index
    //var current = e.target.dataset.src;
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
    // console.log(e)
    // wx.previewImage
    // ({
    //   //current: current, // 当前显示图片的http链接
    //   urls: [this.data.imgList[index]], // 需要预览的图片http链接列表
      
    // })
  },
  //从相册中添加相片
  addImage: function (e)
  {
    var that = this

    wx.chooseImage
    ({
      count: 6,
      sizeType: ['compressed'],//默认压缩图片
      sourceType: ['album', 'camera'],
      success: function (res) 
      {
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          that.setData({
            imgList: res.tempFilePaths,
            number: res.tempFilePaths.length + 1
          })
        }

        // that.setData
        // ({
        //   Filepath: res.tempFilePaths,
        //   number: res.tempFilePaths.length + 1
        // })
      }
    })
  },
  //长按删除
  deleteImage: function (e) 
  {
    var that = this
    var index = e.target.dataset.index
    // console.log("+++++++++", index)
    var tempFilePaths = that.data.imgList
    wx.showModal
    ({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) 
      {
        if (res.confirm)
        {
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) 
        {
          return false;
        }
        that.setData
        ({
          imgList: tempFilePaths,
          number: that.data.number //这里是不是要改一下
        });
        console.log(that.data.imgList);
      }
    })

  },
  
  //计算图片地址
  upload_photo_question:function()
  {
    var that=this 
    Promise.all(that.data.imgList.map((value) => {
      return wx.cloud.uploadFile
      ({
        //云存储路径,使用时间+随机数+regex匹配
        cloudPath: Date.now() + parseInt(Math.random() * 100) + value.match(/\.[^.]+?$/)[0],
        filePath: value,//本地地址
      })
    })).then(res => 
    { 
      return res.map((res) =>
      {
        return res.fileID
      });
    }).then(res => 
    {
      that.upload_question(res)
    })
  },
  

  //上传问题,参数为图片地址
  upload_question:function(arr)
  {
      //添加帖子
      var that=this
      return db.collection('Assistant_DataSheet').add
      ({ 
            data: 
            {
              Question: that.data.question,
              Questiondes:that.data.questiondes,
              Photo_arr: arr,
              Reply_Record_num:0,
              Up_Record_num:0,
              Time: util.formatTime(new Date()),
              Type: that.data.PostType,
            }
      }).then(res => 
      {
        wx.hideLoading();
        wx.showToast
        ({
          title: '成功',
          icon: 'success',
          duration: 1000,
          success: function () {
            console.log(res)
          }
        })
      }).catch((ex) => 
      {
        console.log(ex);
      })
  },


  //发布问题
  upload: function () 
  {
    var that = this
    //达到字数限制才可以上传
    if (that.data.question.length > 2&&that.data.questiondes.length > 2) 
    {
      wx.showLoading({
        title: '上传中...',
      })
      if (that.data.number > 0)//即有图片上传
      {//保存键值对
        that.upload_photo_question();
      }
      else{//无图片上传
        that.upload_question([]);

      }
    }
    else {
      wx.showToast({
        title: '话题内容字数不够',
        duration: 1000,
        mask: true,
        icon: 'none',
      })
    }


  },


  onLoad: function (options) 
  {
    
    var that = this
    wx.getStorage({
      key: 'PostType',//获得数据
      
      success(res) {
        that.setData({
          PostType:res.data
        })
        console.log(res);
       }
    })
    wx.getStorage({
      key: 'Userinfo',
      success(res) {
        // console.log(res);  
        that.setData({
          UserInfo : res
        })
      }
    })
    //用于调试时快速删除
    // const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
    // const cccc= db.command
    // // My_ReplyData
    // // Assistant_Up
    // return db.collection('Assistant_User').where
    // ({
    //   "_id": cccc.exists(true)
    // })
    // .remove().then(res => { 
    //   console.log("delet yes",res);
    // })
  },

  onShow: function () {
    this.tabBar() ;
  },
  
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:2
      })
    }
  },

})