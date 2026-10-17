import Vue from 'vue'
import VueRouter from 'vue-router'
import ListaComprasDiretas from '@/views/pages/compra-direta/ListaComprasDiretas.vue'
import CompraDiretaForm from '@/views/pages/compra-direta/CompraDiretaForm.vue'
import CompraDiretaDetalhe from '@/views/pages/compra-direta/CompraDiretaDetalhe.vue'
import ListaFornecedores from '@/views/pages/fornecedor/ListaFornecedores.vue'

Vue.use(VueRouter)

const routes = [
	{ path: '/', redirect: '/compras-diretas' },
	{ path: '/compras-diretas', name: 'ListaComprasDiretas', component: ListaComprasDiretas },
	{ path: '/compras-diretas/novo', name: 'CompraDiretaNovo', component: CompraDiretaForm },
	{ path: '/compras-diretas/:id/editar', name: 'CompraDiretaEditar', component: CompraDiretaForm, props: true },
	{ path: '/compras-diretas/:id', name: 'CompraDiretaDetalhe', component: CompraDiretaDetalhe, props: true },
	{ path: '/fornecedores', name: 'ListaFornecedores', component: ListaFornecedores },
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
