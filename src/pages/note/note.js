import Vue from 'vue';
import '../../assets/css/reset.scss';
import './note.scss';
import articleList from './components/article-list.vue';

const name = 'note';

new Vue({
	el: '#app',
	data: function () {
		return {

		}
	},
	components: {
		articleList
	}
})
