<template>
	<div id="app">
		<!-- <keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive> -->
		<!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'App',

	components: {},
	data() {
		return {
			timer: 0
		};
	},
	created() {
		// 提交action中的selection接口
		this.$store.dispatch('fetchSelectOptions')
	},
	mounted() {
		//窗口尺寸改变
		// window.addEventListener("resizeWindow", () => this.Refresh());
	},
	methods: {
		// Refresh() {
		// 	// 窗口大小改变，页面渲染，防抖
		// 	if (this.timer) {
		// 		clearTimeout(this.timer);
		// 	}
		// 	this.timer = setTimeout(() => {
		// 		this.$router.go(0);
		// 	}, 1500)
		// },
	},
	destroyed() {
		// 销毁
		// window.removeEventListener("resizeWindow", this.Refresh());
	},

}
</script>

<style lang="scss">
#app {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	left: 0;
	top: 0;
}
</style>
