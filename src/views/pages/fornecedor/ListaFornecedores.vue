<template>
	<div>
		<h1 class="text-h5 mb-4">Fornecedores</h1>

		<v-data-table :headers="headers" :items="itens" :loading="carregando" item-key="id" class="elevation-1">
			<template #item.tipoFornecedor="{ item }">
				{{ tipoFornecedorLabels[item.tipoFornecedor] }}
			</template>
			<template #item.ativo="{ item }">
				<v-chip :color="item.ativo ? 'green' : 'red'" dark small>
					{{ item.ativo ? 'Sim' : 'Não' }}
				</v-chip>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { TIPO_FORNECEDOR_LABELS } from '@/core/constants/tipo-fornecedor'

export default {
	name: 'ListaFornecedores',

	data() {
		return {
			carregando: false,
			tipoFornecedorLabels: TIPO_FORNECEDOR_LABELS,
			headers: [
				{ text: 'Razão Social', value: 'razaoSocial' },
				{ text: 'CPF/CNPJ', value: 'cpfCnpj' },
				{ text: 'Tipo', value: 'tipoFornecedor' },
				{ text: 'E-mail', value: 'email' },
				{ text: 'Telefone', value: 'telefone' },
				{ text: 'Ativo', value: 'ativo' },
			],
		}
	},

	computed: {
		itens() {
			return this.$store.state.fornecedor.lista
		},
	},

	created() {
		this.carregar()
	},

	methods: {
		async carregar() {
			this.carregando = true
			try {
				await this.$store.dispatch('fornecedor/listar')
			} finally {
				this.carregando = false
			}
		},
	},
}
</script>
