// 判断图片是否正常
export function useJudgeImageNormal (blob, suffix) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      const image = new Image()
      image.onload = () => {
        // 图片正常加载
        resolve(true)
      }
      image.onerror = () => {
        // 图片加载失败
        resolve(false)
      }
      // image.src = `data:image/${suffix};base64,` + this.result
      image.src = this.result.toString()
    };
  })
}