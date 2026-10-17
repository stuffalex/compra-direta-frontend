import http from '@/core/apiclient/http'

const URL_PATH = '/fornecedores'

class FornecedorApiClient {
	async listar() {
		return await http.get(URL_PATH)
	}
}

export default new FornecedorApiClient()
