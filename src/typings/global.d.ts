// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module 'bytemd/lib/locales/zh_Hans.json'
declare module '@bytemd/plugin-breaks'
declare module '@bytemd/plugin-highlight'
declare module '@bytemd/plugin-footnotes'
declare module '@bytemd/plugin-frontmatter'
declare module '@bytemd/plugin-gfm'
declare module '@bytemd/plugin-medium-zoom'
declare module '@bytemd/plugin-gemoji'