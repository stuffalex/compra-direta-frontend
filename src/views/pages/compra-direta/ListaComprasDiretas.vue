<template>
	<div>
		<div class="d-flex justify-space-between align-center mb-4">
			<h1 class="text-h5">Compras Diretas</h1>
			<v-btn color="primary" to="/compras-diretas/novo">
				<v-icon left>mdi-plus</v-icon>
				Nova Compra Direta
			</v-btn>
		</div>

		<v-data-table :headers="headers" :items="itens" :loading="carregando" item-key="id" class="elevation-1">
			<template #item.modalidade="{ item }">
				{{ modalidadeLabels[item.modalidade] }}
			</template>
			<template #item.criterioJulgamento="{ item }">
				{{ criterioLabels[item.criterioJulgamento] }}
			</template>
			<template #item.status="{ item }">
				<v-chip :color="statusCores[item.status]" dark small>
					{{ statusLabels[item.status] }}
				</v-chip>
			</template>
			<template #item.valorEstimadoTotal="{ item }">
				{{ formatarMoeda(item.valorEstimadoTotal) }}
			</template>
			<template #item.dataLimitePropostas="{ item }">
				{{ formatarData(item.dataLimitePropostas) }}
			</template>
			<template #item.acoes="{ item }">
				<v-btn icon small :to="`/compras-diretas/${item.id}`" title="Ver detalhe">
					<v-icon small>mdi-eye</v-icon>
				</v-btn>
				<v-btn
					v-if="item.status === STATUS_COMPRA_DIRETA.RASCUNHO"
					icon
					small
					:to="`/compras-diretas/${item.id}/editar`"
					title="Editar"
				>
					<v-icon small>mdi-pencil</v-icon>
				</v-btn>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { MODALIDADE_LABELS } from '@/core/constants/modalidade'
import { CRITERIO_JULGAMENTO_LABELS } from '@/core/constants/criterio-julgamento'
import { STATUS_COMPRA_DIRETA, STATUS_COMPRA_DIRETA_LABELS, STATUS_COMPRA_DIRETA_CORES } from '@/core/constants/status-compra-direta'
import { formatarMoeda, formatarData } from '@/core/utils/formatadores'

export default {
	name: 'ListaComprasDiretas',

	data() {
		return {
			carregando: false,
			STATUS_COMPRA_DIRETA,
			modalidadeLabels: MODALIDADE_LABELS,
			criterioLabels: CRITERIO_JULGAMENTO_LABELS,
			statusLabels: STATUS_COMPRA_DIRETA_LABELS,
			statusCores: STATUS_COMPRA_DIRETA_CORES,
			headers: [
				{ text: 'Número', value: 'numero' },
				{ text: 'Objeto', value: 'objeto' },
				{ text: 'Modalidade', value: 'modalidade' },
				{ text: 'Critério', value: 'criterioJulgamento' },
				{ text: 'Status', value: 'status' },
				{ text: 'Valor Estimado', value: 'valorEstimadoTotal' },
				{ text: 'Data Limite', value: 'dataLimitePropostas' },
				{ text: 'Ações', value: 'acoes', sortable: false },
			],
		}
	},

	computed: {
		itens() {
			return this.$store.state.compraDireta.lista
		},
	},

	created() {
		this.carregar()
	},

	methods: {
		formatarMoeda,
		formatarData,

		async carregar() {
			this.carregando = true
			try {
				await this.$store.dispatch('compraDireta/listar')
			} finally {
				this.carregando = false
			}
		},
	},
}
</script>
