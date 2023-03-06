import { Setting } from '../types';
import SettingModel from '../models/Setting';
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
export  async function useGetClientInfoByIp (ip: string) {
  const res = await SettingModel.findOne() as Setting
  const { map_type, map_key } = res.system
  if (map_key && map_type) {
    switch (map_type) {
      case 'baidu':
        return useBaiduService(ip, map_key)
      case 'gaode':
        return useGaodeService(ip, map_key)
    }
  }
}

// 高德地图方式
export function useGaodeService (ip: string, key: string) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=${key}`
    }).then(res => {
      const { province, city, adcode, rectangle } = res.data
      resolve({
        province: province && province.length ? province : '未知',
        city: city && city.length ? city : '未知',
        adcode: adcode && adcode.length ? adcode : '未知',
        rectangle: rectangle && rectangle.length ? rectangle : '未知'
      })
    }).catch(error => {
      console.log('错误信息：' + error)
      resolve({
        ip: ip,
        province: '未知',
        city: '未知',
        adcode: '未知',
        rectangle: '未知'
      })
    })
  })
}

// 百度地图方式
export function useBaiduService (ip: string, key: string) {
  return new Promise((resolve, reject) => {
    // 百度地图方式
    axios({
      method: 'GET',
      url: `https://api.map.baidu.com/location/ip?ak=${key}&ip=${ip}&coor=bd09ll`
    }).then(res => {
      const content = res.data.content
      const { province, city, adcode } = content && content.address_detail
      resolve({
        ip: ip,
        province: province && province.length ? unistrToCnstr(province) : '未知',
        city: city && city.length ? unistrToCnstr(city) : '未知',
        adcode: adcode && adcode.length ? adcode : '未知',
        rectangle: content.point ? content.point : '未知'
      })
    }).catch(error => {
      console.log('错误信息：' + error)
      resolve({
        ip: ip,
        province: '未知',
        city: '未知',
        adcode: '未知',
        rectangle: '未知'
      })
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