import Dict from "./types/Dict"

const arr = [
  { lable: 'a1', value: 'b1' },
  { lable: 'a2', value: 'b2' },
  { lable: 'a3', value: 'b3', listOptions: 'qiniu_region' },
  { lable: 'a4', value: 'b4' }
]

const dict = new Dict()
async function getInfo (item) {
  const res: any = await dict.detailByPro('code', 'qiniu_region')
  item.listOptions_arr = res.data.values
  return item
}
let promise = arr.map((item, index) => {
  if (item.listOptions) {
    return getInfo(item)
  }
  return item
})

Promise.all(promise).then(res => {
  console.log(res)
})