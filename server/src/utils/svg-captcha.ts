import svgCaptcha from 'svg-captcha'

interface SvgCaptchaConfig {
  size: number // 随机验证码长度
  noise: number // 干扰线数量
  ignoreChars: string // 忽略容易造成勿扰的字符
  color: boolean // 颜色是否多变
  background: string // 背景色
  fontSize: number // 字体大小
  width: number // 宽度
  height: number // 高度
}

// const colors = ['#e4f8fe', ]

/**
 * 生成图形验证码
 * @param config 图形验证码配置
 */
export function generateVerifyCode (config: SvgCaptchaConfig = {
  size: 4,
  width: 100,
  height: 40,
  fontSize: 38,
  color: true,
  ignoreChars: '0o1iIl',
  noise: 3,
  background: '#e4f8fe'
}): { text: string, data: string } {
  const captcha = svgCaptcha.create(config)
  const data = Buffer.from(captcha.data).toString('base64')
  return {
    text: captcha.text,
    data: 'data:image/svg+xml;base64,' + data
  }
}