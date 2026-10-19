import http from '@/core/apiclient/http'

const URL_PATH = '/compras-diretas'

class CompraDiretaApiClient {
	async listar(paramsOrPage = 0, sizeParam = 20) {
		let page = 0
		let size = 20

		if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
			page = paramsOrPage.page !== undefined ? paramsOrPage.page : 0
			size = paramsOrPage.size !== undefined ? paramsOrPage.size : 20
		} else if (typeof paramsOrPage === 'number') {
			page = paramsOrPage
			size = sizeParam !== undefined ? sizeParam : 20
		}

		return await http.get(URL_PATH, { params: { page, size } })
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
