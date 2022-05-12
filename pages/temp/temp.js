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
  
  onShow: function () {
    wx.reLaunch({
      url: '../web_disp/web_disp'
    })
    this.tabBar() ;
  },

})