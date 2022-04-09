// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({ env: 'a123-4gjil6fj4c251504' })
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const PageId = event.PageId
  
  return db.collection('Assistant_DataSheet').doc(PageId).update({
    data: {
      Reply_Record_num: _.inc(1)
    },
  }).then(res => {
    console.log(res)
  })
}