const defaultDocumentTitle = '城市韧性电网' //默认html页面 title 值

// vue.config.js
module.exports = {
	lintOnSave: false,
	chainWebpack: (config) => {
		config.plugin('html').tap((args) => {
			args[0].title = defaultDocumentTitle
			return args
		})
	},
	// 去掉console.log
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
		}
	},
	// terser: {
	// 	terserOptions: {
	// 		compress: {
	// 			drop_console: true,
	// 			drop_debugger: true,
	// 		}
	// 	},
	// },
	// publicPath: './',
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	assetsDir: 'static',
	filenameHashing: false,
	productionSourceMap: false,
	devServer: {
		proxy: {
			// python接口
			'/py': {
				/* 设置对象路径 */
				// target: "http://10.19.37.68:8000/",
				target: "http://101.43.63.11:8001/",
				/* 开启跨域 */
				changeOrigin: true,
				// pathRewrite: {
				// 	'^/py': ''
				// }
			},
			// ruoyi接口
			'/api': {
				// 远程服务器，不需要本地跑
				target: "http://101.43.63.11:8081/",
				//secure:false,					//如果是https接口，需要配置这个参数
				/* 开启跨域 */
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
		}
	}
}