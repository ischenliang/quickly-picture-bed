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
    // 高德地图方式
    // axios({
    //   method: 'GET',
    //   url: `https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=f37d5dff2f5a439a6d3c1bcdf9e3c4ae`
    // }).then(res => {
    //   const { province, city, adcode, rectangle } = res.data
    //   resolve({
    //     province: province && province.length ? province : '未知',
    //     city: city && city.length ? city : '未知',
    //     adcode: adcode && adcode.length ? adcode : '未知',
    //     rectangle: rectangle && rectangle.length ? rectangle : '未知'
    //   })
    // }).catch(error => {
    //   console.log('错误信息：' + error)
    // })

    // 百度地图方式
    axios({
      method: 'GET',
      url: `https://api.map.baidu.com/location/ip?ak=NRjNKoTLotrpA6bH4hUanMUbTyID1upT&ip=${ip}&coor=bd09ll`
    }).then(res => {
      const content = res.data.content
      const { province, city, adcode } = content.address_detail
      resolve({
        ip: ip,
        province: province && province.length ? unistrToCnstr(province) : '未知',
        city: city && city.length ? unistrToCnstr(city) : '未知',
        adcode: adcode && adcode.length ? adcode : '未知',
        rectangle: content.point ? content.point : '未知'
      })
    }).catch(error => {
      console.log('错误信息：' + error)
    })
  })
}



/**
 * unicode字符串转中文字符串
 * @param uni_str 
 */
export function unistrToCnstr (uni_str: string) {
  return unescape(uni_str.replace(/\\u/g, '%u'))
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