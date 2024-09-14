import { MyPlugin } from "./interface";

/**
 * 插件管理器
 */
export default class PluginManager {
  private plugins: { [name: string]: MyPlugin } = {}
  constructor() {
    // 插件列表
    this.plugins = {};
  }
  // 注册插件
  register (plugin: MyPlugin) {
    const { name, version, config, uploader } = plugin;
    this.plugins[name] = {
      name,
      version,
      config,
      uploader
    }
  }
  // 加载插件 | 获取插件
  load (name: string) {
    return this.plugins[name]
  }
  // 卸载插件
  unRegister (name: string) {
    delete this.plugins[name]
  }
}