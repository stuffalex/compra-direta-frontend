import FornecedorApiClient from '@/core/apiclient/fornecedor/FornecedorApiClient'

export default {
	async listar({ commit }) {
		const { data } = await FornecedorApiClient.listar()
		commit('SET_LISTA', data)
		return data
	},
}
