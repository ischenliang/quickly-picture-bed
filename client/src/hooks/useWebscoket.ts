function useWebsocket (url, options) {
  const webSocket = new WebSocket(url)
  webSocket.onopen = () => {
    console.log('连接成功')
  }
  webSocket.onmessage = options.onMessage
  // (data) => {
  //   console.log('接收数据', data)
  // }
  webSocket.onerror = () => {
    console.log('报错了')
  }
  webSocket.onclose = () => {
    console.log('连接关闭了')
  }
  return webSocket
}


export default useWebsocket