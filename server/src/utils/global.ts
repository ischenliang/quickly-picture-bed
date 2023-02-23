import axios from 'axios'
import md5 from 'md5'
/**
 * 获取后缀
 * @param filePath 文件路径|文件名称
 * @param identify 截取标识符
 * @returns 后缀
 */
export function useGetSuffix (filePath: string, identify = '.') {
  // 获取以identify为标识符的位置
  var index = filePath.lastIndexOf(identify);
  // 获取后缀
  var value = filePath.substr(index + 1);
  return value;
}


/**
 * 根据ip地址获取客户端访问信息
 * @param ip 
 * @returns 
 */
export function useGetClientInfoByIp (ip: string) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=f37d5dff2f5a439a6d3c1bcdf9e3c4ae`
    }).then(res => {
      resolve(res.data)
    }).catch(error => {
      console.log('错误信息：' + error)
    })
  })
}




/**
 * 密码md5加密
 * @param pwd 密码
 * @param suffix 秘钥
 * @returns 
 */
export function useMd5 (pwd: string, suffix: string = 'a1b2c3') {
  return md5(pwd + suffix)
}