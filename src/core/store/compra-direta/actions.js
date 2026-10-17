import CompraDiretaApiClient from '@/core/apiclient/compra-direta/CompraDiretaApiClient'
import PropostaApiClient from '@/core/apiclient/proposta/PropostaApiClient'

export default {
	async listar({ commit }) {
		const { data } = await CompraDiretaApiClient.listar()
		commit('SET_LISTA', data)
		return data
	},

	async buscarPorId({ commit }, id) {
		const { data } = await CompraDiretaApiClient.buscarPorId(id)
		commit('SET_COMPRA_ATUAL', data)
		return data
	},

	async criar({ commit }, dados) {
		const { data } = await CompraDiretaApiClient.criar(dados)
		return data
	},

	async atualizar({ commit }, { id, dados }) {
		const { data } = await CompraDiretaApiClient.atualizar(id, dados)
		return data
	},

	async publicar({ commit }, id) {
		const { data } = await CompraDiretaApiClient.publicar(id)
		return data
	},

	async cancelar({ commit }, { id, motivo }) {
		const { data } = await CompraDiretaApiClient.cancelar(id, motivo)
		return data
	},

	async apurarVencedor({ commit }, id) {
		const { data } = await CompraDiretaApiClient.apurarVencedor(id)
		return data
	},

	async registrarProposta({ commit }, { id, proposta }) {
		const { data } = await PropostaApiClient.registrar(id, proposta)
		return data
	},

	async listarPropostas({ commit }, id) {
		const { data } = await PropostaApiClient.listar(id)
		return data
	},

	async listarNotificacoes({ commit }, id) {
		const { data } = await CompraDiretaApiClient.listarNotificacoes(id)
		return data
	},
}
