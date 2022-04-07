const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'a123-4gjil6fj4c251504' })
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const buypost_id = event.buypost_id
  //寻找指定参数
  //重新部署
  console.log(event)
  return db.collection('Assistant_Sell_DataSheet').doc(buypost_id).update({
    data: {
      Intention_Record_num: _.inc(1)
    },
  }).then(res => {
    console.log(event)
  })
}