export default [
	// {
	// 	path: '/',
	// 	name: '登录',
	// 	redirect: '/login',
	// },
	{
		path: '/',
		name: '主页',
		redirect: '/main',
	},
	{
		path: '/home',
		name: '首页',
		meta: { isTab: false, auth: true },
		component: () =>
			import(/* webpackChunkName: "pages" */ '@/pages/home/index.vue'),
		children: [
			{
				path: '/digitalTwin',
				meta: { isTab: false, auth: true },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/home/digitalTwin.vue'),
			},
			{
				path: '/gdDev',
				meta: { isTab: false, auth: true },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/home/gdDev.vue'),
			},
			{
				path: '/gdEditor',
				meta: { isTab: false, auth: true },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/home/gdEditor.vue'),
			},
		]
	},
	{
		path: '/earlyWarning',
		name: '评估与预警',
		meta: { isTab: false, auth: true, keepAlive: false },
		component: () =>
			import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/index.vue'),
		children: [
			{
				path: '/yujing',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/yujing.vue'),
			},
			{
				path: '/kuozhan',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/kuozhan.vue'),
			},
			{
				path: '/pingu',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/pingu.vue'),
			},
			{
				path: '/yujing_warning',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/yujing_warning.vue'),
			},
			{
				path: '/zhenduan',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/zhenduan.vue'),
			},
			{
				path: '/deeplyIntegrated',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/earlyWarning/deeplyIntegrated.vue'),
			},
		]
	},
	{
		path: '/energyMulti',
		name: '储能配置和多能调度',
		meta: { isTab: false, auth: true, keepAlive: false },
		component: () =>
			import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/index.vue'),
		children: [
			{
				path: '/energyModle',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/energyModle.vue'),
			},
			{
				path: '/topology',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/topology.vue'),
			},
			{
				path: '/restoration',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/restoration.vue'),
			},
			{
				path: '/regulate',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/regulate.vue'),
			},
			{
				path: '/cruise',
				meta: { isTab: false, auth: true, keepAlive: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/cruise.vue'),
			},
			// {
			// 	path: '/assessment',
			// 	meta: { isTab: false, auth: true, keepAlive: true },
			// 	component: () =>
			// 		import(/* webpackChunkName: "pages" */ '@/pages/energyMulti/assessment.vue'),
			// },
		]
	},
	{
		path: '/emergencyScheduling',
		name: '应急调度决策',
		meta: { isTab: false, auth: false },
		component: () =>
			import(/* webpackChunkName: "pages" */ '@/pages/emergencyScheduling/index.vue'),
		children: [
			{
				path: '/stereoStrategy',
				meta: { isTab: false, auth: false },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/emergencyScheduling/stereoStrategy.vue'),
			},
			{
				path: '/assessment',
				meta: { isTab: false, auth: false, },
				component: () =>
					import(/* webpackChunkName: "pages" */ '@/pages/emergencyScheduling/assessment.vue'),
			},
			// {
			// 	path: '/scheduling3D',
			// 	meta: { isTab: false, auth: true },
			// 	component: () =>
			// 		import(/* webpackChunkName: "pages" */ '@/pages/emergencyScheduling/scheduling3D.vue'),
			// },
		]
	},
	{
		path: '/main',
		name: '数据详情',
		meta: { isTab: false, auth: true },
		component: () =>
			import(/* webpackChunkName: "pages" */ '@/pages/main/index.vue'),
	},
	{
		path: '/login',
		name: 'Login',
		meta: { isTab: false },
		component: () =>
			import('@/pages/login.vue'),
	},
	{
		path: '/register',
		name: 'Register',
		meta: { isTab: false },
		component: () =>
			import('@/pages/register.vue'),
	},
]
