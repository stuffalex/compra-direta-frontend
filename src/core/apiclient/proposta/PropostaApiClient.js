import http from '@/core/apiclient/http'

class PropostaApiClient {
	async registrar(compraDiretaId, proposta) {
		return await http.post(`/compras-diretas/${compraDiretaId}/propostas`, proposta)
	}

	async listar(compraDiretaId) {
		return await http.get(`/compras-diretas/${compraDiretaId}/propostas`)
	}
}

export default new PropostaApiClient()
