Component({
  properties: {

  },
  data: {
    selected:1,
    tabList:[
        {
          "pagePath": "pages/temp/temp",
          "text": "发现"
        },
        {
          "pagePath": "pages/discovery/discovery",
          "text": "首页"
        },
        {
          "pagePath": "pages/index/index",
          "text": "发布"
        },
        {
          "pagePath": "pages/notify/notify",
          "text": "消息"
        },
        {
          "pagePath": "pages/more/more",
          "text": "我的"
        }
    ]
  },
  methods: {
    switchTab(e){
      console.log(this.data)
      let key = Number(e.currentTarget.dataset.index);
      let tabList = this.data.tabList;
      let selected = this.data.selected;

      if(selected !== key){
        this.setData({
          selected:key
        });
        wx.switchTab({
          url: `/${tabList[key].pagePath}`,
        })
      }
    }
  }
})