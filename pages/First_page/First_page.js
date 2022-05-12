const app=getApp()
const db = wx.cloud.database()//初始化数据库 宏定义一个db指代
Page({
  data: 
  {
  },

  /**
   * 生命周期函数--监听页面加载
   */

  judge:function()
  {
    wx.cloud.callFunction
    ({
        //先获取openid
        name: 'login',
        data: {},
        success: res => 
        {
          var that=this
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          wx.setStorageSync("myOpenId", res.result.openid);
          //判断是否在数据库中
          db.collection('Assistant_User').where
          ({
            _openid:res.result.openid//根据在res中的openid检索数据
          }).get().then
          (
            res=>
            {
              console.log(res.data)
              if(res.data.length!=0)//如果在数据库中，代表已经授权
              {
                //userinfo中的信息
                console.log(res)
                wx.setStorage
                ({
                  key: "Userinfo",
                  data: res.data.userinfo
                })
                wx.setStorage
                ({
                  key: "User_openid",
                  data: app.globalData.openid
                })
                wx.switchTab({
                              url: '../discovery/discovery',
                            })
              }else
              {
                wx.redirectTo
                ({
                      url: '../Login/Login',//否则没有授权
                })
              }
            }
          )
        }
        
    })
  },
  onLoad: function (options) 
  {
    if (!wx.cloud) {
      wx.showToast({
        title: '尚未登录',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 判断是否授权
    this.judge()
  }
})