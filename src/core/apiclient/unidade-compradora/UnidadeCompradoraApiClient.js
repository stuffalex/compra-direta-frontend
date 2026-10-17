import http from '@/core/apiclient/http'

const URL_PATH = '/unidades-compradoras'

class UnidadeCompradoraApiClient {
	async listar() {
		return await http.get(URL_PATH)
	}
}

export default new UnidadeCompradoraApiClient()
