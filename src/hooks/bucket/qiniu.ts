export default {
  uploadFile () {
    const image = new Image()
    image.src = "http://imgs.itchenliang.club/img/20220825155536.png"
    image.onload = () => {
      console.log(image.width, image.height)
    }
  },
  deleteFile () {

  },
  updateFile () {

  }
}