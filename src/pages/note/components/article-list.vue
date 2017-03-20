<template>
	<div>
		<span class="msg">{{msg}}</span>
	</div>
</template>

<script>
	export default {
		name: 'articleList',
		data () {
			return {
				msg: 'hello world'
			}
		},
	}
</script>

<style lang="scss">
	.msg {
		font-size: 30px;
	}
</style>
