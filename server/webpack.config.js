const path = require('path')
const nodeExtenals = require('webpack-node-externals')

module.exports = {
  // Node.js环境编译代码: fs path等node模块不会被打包到结果文件中
  target: 'node',
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        // 排除node_modules
        exclude: /node_modules/
      }
    ]
  },
  // 解析
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  externals: [
    // 排除node_modules中的包
    nodeExtenals()
  ]
}