// pages/temp/temp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },
  // onLoad: function () {
    
  //   wx.reLaunch({
  //     url: '../web_disp/web_disp'
  //   })
  //   this.tabBar();
  //   console.log("llll")
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  
  onShow: function () {
    wx.reLaunch({
      url: '../web_disp/web_disp'
    })
    this.tabBar() ;
  },

})