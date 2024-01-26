import * as icons from '@icon-park/svg'
import zhHans from './zh_Hans.json'
import themes from 'juejin-markdown-themes'
// console.log(themes, icons.Theme({theme: "outline"}))


import type { BytemdPlugin } from 'bytemd'
import type { MermaidConfig } from 'mermaid'

export declare interface BytemdPluginThemeOptions extends MermaidConfig {
  locale?: Partial<Locale>
  callback?: Function
  theme?: string
}

declare type Locale = {
  juejin: string;
  github: string;
  smartblue: string;
  cyanosis: string;
  channingCyan: string;
  fancy: string;
  condensedNightPurple: string;
  greenwillow: string;
  vuePro: string;
  healerReadable: string;
  mkCute: string;
  jzman: string;
  geekBlack: string;
  awesomeGeen: string;
  qklhkChocolate: string;
  orange: string;
  scrollsLight: string;
  simplicityGreen: string;
  arknights: string;
  vuepress: string;
  ChineseRed: string;
  nico: string;
  devuiBlue: string;
  themeid: string;
}

/**
 * 修改主题
 * @param theme 
 */
function changeTheme (theme) {
  let $rm = document.getElementsByTagName('style')
  for (let i = 0; i < $rm.length; i++) {
    if ($rm[i].id.includes('md_')) {
      document.head.removeChild($rm[i])
    }
  }
  const $style = document.createElement('style');
  $style.id = 'md_' + theme
  const cssContent = themes[theme]?.style ?? themes.juejin.style
  $style.innerHTML = cssContent.replaceAll('.markdown-body', '#bytemd-container .markdown-body')
  document.head.appendChild($style);
  return () => {
    $style.remove();
  }
}

function theme ({
  locale: _locale,
  ...themeConfig
}: BytemdPluginThemeOptions = {}) {
  const locale = {
    ...zhHans,
    ..._locale
  }
  const actionItems = []
  for (const key in locale) {
    actionItems.push({ title: key, name: locale[key] })
  }

  return {
    viewerEffect: ({ file }) => {
      if (!!file) {
        themeConfig.callback(themeConfig.theme)
      }
    },
    actions: [
      {
        title: 'Markdown主题',
        // icon: icons.Theme({theme: "outline"}),
        icon: '<svg t="1706237411212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4232" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M264.090273 111.378908h146.607307c18.711012 0 34.14437 13.959435 37.6713 32.525996 4.352736 13.905745 12.482957 26.391258 23.038182 34.830836a62.572018 62.572018 0 0 0 40.372425 14.521903 63.719964 63.719964 0 0 0 40.651103-14.521903 69.494211 69.494211 0 0 0 23.885718-37.745444c4.602012-17.978525 20.036647-29.606275 36.570653-29.606274h146.603472c11.931993 0 21.961822 4.635248 28.991395 13.959435l208.417437 222.941897a42.288652 42.288652 0 0 1 0 57.738627L853.822723 559.302927a36.064431 36.064431 0 0 1-53.681187 0l-0.525397-0.884609-1.624765-1.150503v314.419662c0 22.666186-16.784559 40.938728-38.497106 40.938728H264.090273c-21.136017 0-37.920576-18.272543-37.920576-40.938728V557.266537l-2.45185 2.03639a36.371232 36.371232 0 0 1-53.954751 0L26.682719 406.020146c-14.633119-15.940857-14.633119-41.801606 0-57.738627l1.876598-1.76794L236.975476 123.006658a37.470601 37.470601 0 0 1 27.114797-11.632863z m120.868 81.289422h-105.158522L107.42757 377.29848l89.17548 95.195168 40.372426-43.238456a37.786351 37.786351 0 0 1 27.114797-11.8962c21.111728 0 37.946143 18.272543 37.946142 40.644711v372.443358h419.511711V457.998589a41.312003 41.312003 0 0 1 11.377195-28.748511c14.658685-15.96898 39.022502-15.96898 54.20147 0l39.859813 43.24357 89.699598-95.195168-172.625291-184.63015h-105.434643a144.386837 144.386837 0 0 1-40.12315 51.100226c-24.113263 19.746465-54.20147 31.642665-86.723631 31.642665-32.492759 0-62.334248-11.8962-86.448789-31.642665a148.496689 148.496689 0 0 1-40.372425-51.093834z" fill="#3B3F51" p-id="4233"></path></svg>',
        handler: {
          type: "dropdown",
          actions: actionItems.map(({ title, name }) => {
            return {
              title: name === themeConfig.theme ? `${title}(当前)` : title,
              handler: {
                type: "action",
                click({ editor, appendBlock, codemirror }) {
                  // changeTheme(name)
                  themeConfig.callback(name)
                }
              }
            }
          }),
          ...locale
        }
      }
    ]
  }
}

export default theme