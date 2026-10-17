import http from '@/core/apiclient/http'

const URL_PATH = '/categorias-compra'

class CategoriaCompraApiClient {
	async listar() {
		return await http.get(URL_PATH)
	}
}

export default new CategoriaCompraApiClient()
