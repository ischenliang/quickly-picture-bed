function dispatchEventStroage() {
  const signSetItem = localStorage.setItem
  localStorage.setItem = function(key, val) {
      let setEvent: any = new Event('setItemEvent')
      setEvent.key = key
      setEvent.newValue = val
      window.dispatchEvent(setEvent)
      signSetItem.apply(this, arguments)
  }
}
export default dispatchEventStroage


// 使用
// 1、在main.ts中注册插件
// import tool from '@/plugins/localStorage'
// app.use(tool)
// 2、使用地方时
// window.addEventListener('setItemEvent', () => {
//   console.log(123)
// })