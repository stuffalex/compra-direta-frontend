import http from '@/core/apiclient/http'

const URL_PATH = '/compras-diretas'

class CompraDiretaApiClient {
	async listar() {
		return await http.get(URL_PATH)
	}

	async buscarPorId(id) {
		return await http.get(`${URL_PATH}/${id}`)
	}

	async criar(dados) {
		return await http.post(URL_PATH, dados)
	}

	async atualizar(id, dados) {
		return await http.put(`${URL_PATH}/${id}`, dados)
	}

	async publicar(id) {
		return await http.post(`${URL_PATH}/${id}/publicar`)
	}

	async cancelar(id, motivo) {
		return await http.post(`${URL_PATH}/${id}/cancelar`, { motivo })
	}

	async apurarVencedor(id) {
		return await http.post(`${URL_PATH}/${id}/apurar-vencedor`)
	}

	async listarNotificacoes(id) {
		return await http.get(`${URL_PATH}/${id}/notificacoes`)
	}
}

export default new CompraDiretaApiClient()
