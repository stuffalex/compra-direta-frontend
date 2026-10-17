import state from './state'
import actions from './actions'

const mutations = {
	SET_LISTA(state, lista) {
		state.lista = lista
	},
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
}
