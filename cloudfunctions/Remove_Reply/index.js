// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'a123-4gjil6fj4c251504' })
// 云函数入口函数
exports.main = async (event, context) => {
  const Page_id = event.Page_id
  console.log(event)
  return db.collection('My_ReplyData').doc(Page_id).remove({
  }).then(res => { 
    console.log(res);
  })
}