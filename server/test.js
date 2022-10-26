// const config = {
//   host: 'https://api.github.com/repos',
//   username: 'ischenliang',
//   repo: 'imgs',
//   path: 'img/',
//   token: 'asd1as6d8a4sda68s7d'
// }
// const file = {
//   filename: '01.png',
//   content: 'hahaha',
//   file: ''
// }

// // 构建请求
// const requestURL = `{
//   method: 'POST',
//   url: '${config.host}/${config.username}/${config.repo}/contents/${config.path}${file.filename}',
//   data: {
//     branch: '${config.branch}',
//     content: '${file.content}',
//     message: 'upload ${file.filename}'
//   },
//   headers: {
//     Authorization: 'token ${config.token}',
//     Accept: 'application/vnd.github.v3+json'
//   }
// }`
// console.log(eval('(' + requestURL + ')'))






// 方式一：形成了闭包，所以还需要加上dom()
// var func = `function test(){
//   console.log(123)
// }`;
// var dom = new Function(`return ${func}`)();
// dom();


// 方式二
// var func = `function test() {
//   console.log(123)
// }`
// const fn = new Function(`return ${func}()`)
// fn()


// 方式三
// var func = `{
//   uploader: function() {
//     var a = 1;
//     console.log(123, a)
//   }
// }`
// const fn = new Function(`return ${func}['uploader']()`)
// fn()


// 可行：注意在函数内定义的变量不用再加上${}标识，即下面的a
// var func = `{
//   uploader: function() {
//     var a = 1;
//     return {
//       headers: {
//         'Content-Type': a
//       }
//     }
//   }
// }`
// const fn = new Function(`return ${func}['uploader']()`)
// console.log(fn())




const config = {
  host: 'https://api.github.com/repos',
  username: 'ischenliang',
  repo: 'imgs',
  path: 'img/',
  token: 'asd1as6d8a4sda68s7d',
  branch: 'main'
}
const file = {
  filename: '01.png',
  content: 'hahaha',
  file: '',
  suffix: 'png'
}
// 构建请求
var func = `function uploader () {
  const mimeTypes = {
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'tiff': 'image/tiff'
  }
  return {
    url: '${config.host}/${config.username}/${config.repo}/contents/${config.path}${file.filename}',
    method: 'POST',
    data: {
      branch: '${config.branch}',
    },
    headers: {
      'Content-Type': mimeTypes['${file.suffix}'],
      Authorization: 'token ${config.token}',
      Accept: 'application/vnd.github.v3+json'
    }
  }
}`
const fn = new Function(`return ${func}()`)
console.log(fn())

// 还需要构建出response