import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, { components, directives })

export default new Vuetify({
	icons: {
		iconfont: 'mdi',
	},
})
