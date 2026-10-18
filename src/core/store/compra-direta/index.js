import state from './state'
import actions from './actions'

const mutations = {
	SET_LISTA(state, lista) {
		state.lista = Array.isArray(lista) ? lista : (lista && lista.content ? lista.content : [])
	},
	SET_COMPRA_ATUAL(state, compra) {
		state.compraAtual = compra
	},
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
}
