const app = getApp()
var util = require('../../utils/util.js');

Page({

  data: {
    index: 0,
    number: 1,
    PostType:'',
    avatarUrl: '../../images/user-unlogin.png',
    user_openid: app.globalData.openid,
    telValue: "",
    question: "",
    questiondes: "",
    UserInfo:''

  },
  //获得输入区输入
  getQuestion: function (e) {
    this.setData({
      question: e.detail.value
    })
  },
  getQuestiondes: function (e) {
    this.setData({
      questiondes: e.detail.value
    })
  },
  //获得选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    // console.log(e)
  },
  //点击查看
  clickimage: function (e) {
    var index = e.target.dataset.index
    //var current = e.target.dataset.src;
    console.log(e)
    wx.previewImage({
      //current: current, // 当前显示图片的http链接
      urls: [this.data.Filepath[index]], // 需要预览的图片http链接列表
      
    })
  },
  //从相册中添加相片
  addImage: function (e) {
    var that = this
    wx.chooseImage({
      count: 6,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths)
        that.setData({
          Filepath: res.tempFilePaths,
          number: res.tempFilePaths.length + 1
        })
      }
    })
  },
  //长按删除
  deleteImage: function (e) {
    var that = this
    var index = e.target.dataset.index
    console.log("+++++++++", index)

    var tempFilePaths = that.data.Filepath
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          Filepath: tempFilePaths,
          number: that.data.number - 1
        });
        console.log(that.data.Filepath);
      }
    })


  },
  //发布
  upload: function () {

    var that = this
    //达到字数限制才可以上传
    if (that.data.question.length > 2&&that.data.questiondes.length > 2) {
      wx.showLoading({
        title: '上传中...',
      })
      if (that.data.number > 1)//图片数量大于1实际是0,即有图片上传
      {//保存键值对
        Promise.all(that.data.Filepath.map((value) => {//异步
        return wx.cloud.uploadFile({
          //云存储路径,使用时间+随机数+regex匹配
          cloudPath: Date.now() + parseInt(Math.random() * 100) + value.match(/\.[^.]+?$/)[0],
          filePath: value,//本地地址
        })
      })).then(res => {
        return res.map((res) => {
          return res.fileID
        });
      }).then(res => {
        // console.log(that.data.UserInfo.nickName, that.data.UserInfo.avatarUrl)
        // console.log(app.globalData.openid)
        const _id=app.globalData.openid
        const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
        return db.collection('Assistant_DataSheet').add({ //添加帖子
              data: {
                Question: that.data.question,
                Questiondes:that.data.questiondes,
                Photo_arr: res,
                Reply_Record_num:0,
                Up_Record_num:0,
                Time: util.formatTime(new Date()),
                Type: that.data.PostType,
              }
            }).then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                console.log(res)
                // wx.switchTab({
                //   url: '../Main_page/Main_page',
                // })
              }
            })
          }).catch((ex) => {
            console.log(ex);
          })
      })
      }
      else{//无图片上传
          
        const _id = app.globalData.openid
        const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
        return db.collection('Assistant_DataSheet').add({ //添加帖子
          data: {
            Question: that.data.question,
            Questiondes:that.data.questiondes,
            Photo_arr: [],
            Reply_Record_num: 0,
            Up_Record_num: 0,
            Time: util.formatTime(new Date()),
            Type: that.data.PostType,
          }
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              console.log(res)
              wx.switchTab({
                url: '../discovery/discovery',
              })
            }
          })
        })

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
  /**
   * 生命周期函数--监听页面加载
   */
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
    
    const db = wx.cloud.database({ env: 'a123-4gjil6fj4c251504' })
    const cccc= db.command
    // My_ReplyData
    // Assistant_Up
    return db.collection('My_ReplyData').where
    ({
      "_id": cccc.exists(true)
    })
    .remove().then(res => { 
      console.log("delet yes",res);
    })
  }

})
// return await db.collection('todos').where({
//   done: true
// }).remove()
// } catch(e) {
// console.error(e)
// }