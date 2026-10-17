import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import modules from './core/store'

Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store({ modules })

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app')
