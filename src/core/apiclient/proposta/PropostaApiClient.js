import http from '@/core/apiclient/http'

class PropostaApiClient {
	async registrar(compraDiretaId, proposta) {
		return await http.post(`/compras-diretas/${compraDiretaId}/propostas`, proposta)
	}

	async listar(compraDiretaId, paramsOrPage = 0, sizeParam = 20) {
		let page = 0
		let size = 20

		if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
			page = paramsOrPage.page !== undefined ? paramsOrPage.page : 0
			size = paramsOrPage.size !== undefined ? paramsOrPage.size : 20
		} else if (typeof paramsOrPage === 'number') {
			page = paramsOrPage
			size = sizeParam !== undefined ? sizeParam : 20
		}

		return await http.get(`/compras-diretas/${compraDiretaId}/propostas`, { params: { page, size } })
	}
}

export default new PropostaApiClient()
