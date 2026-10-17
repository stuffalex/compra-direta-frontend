import axios from 'axios'
import eventBus from '@/core/utils/eventBus'

const http = axios.create({
	baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080/api',
})

http.interceptors.response.use(
	(response) => response,
	(error) => {
		const mensagem =
			(error.response && error.response.data && error.response.data.mensagem) ||
			'Erro inesperado ao comunicar com o servidor.'
		eventBus.$emit('api-error', mensagem)
		return Promise.reject(error)
	}
)

export default http
