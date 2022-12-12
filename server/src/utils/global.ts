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