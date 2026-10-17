<template>
	<div v-if="compra">
		<v-alert v-if="avisoEdicaoBloqueada" type="warning" dismissible class="mb-4">
			Esta compra direta não está mais em Rascunho e por isso não pode ser editada.
		</v-alert>

		<div class="d-flex justify-space-between align-center mb-4 flex-wrap">
			<div>
				<h1 class="text-h5">Compra Direta {{ compra.numero }}</h1>
				<v-chip :color="statusCores[compra.status]" dark small class="mt-1">
					{{ statusLabels[compra.status] }}
				</v-chip>
			</div>
			<div>
				<v-btn v-if="compra.status === STATUS.RASCUNHO" text class="mr-2" :to="`/compras-diretas/${compra.id}/editar`">
					<v-icon left small>mdi-pencil</v-icon>
					Editar
				</v-btn>
				<v-btn v-if="compra.status === STATUS.RASCUNHO" color="primary" class="mr-2" @click="dialogPublicar = true">
					<v-icon left small>mdi-send</v-icon>
					Publicar
				</v-btn>
				<v-btn
					v-if="podeApurarVencedor"
					color="primary"
					class="mr-2"
					@click="dialogApurar = true"
				>
					<v-icon left small>mdi-trophy</v-icon>
					Apurar Vencedor
				</v-btn>
				<v-btn v-if="podeCancelar" color="error" outlined @click="dialogCancelar = true">
					<v-icon left small>mdi-close-circle</v-icon>
					Cancelar
				</v-btn>
			</div>
		</div>

		<v-card v-if="compra.status === STATUS.HOMOLOGADA" color="green lighten-5" class="mb-4">
			<v-card-text>
				<div class="text-h6">Fornecedor Vencedor</div>
				<div>{{ compra.fornecedorVencedor ? compra.fornecedorVencedor.razaoSocial : '-' }}</div>
				<div class="mt-1">Data de Homologação: {{ formatarData(compra.dataHomologacao) }}</div>
			</v-card-text>
		</v-card>

		<v-card v-if="compra.status === STATUS.CANCELADA" color="red lighten-5" class="mb-4">
			<v-card-text>
				<div class="text-h6">Motivo do Cancelamento</div>
				<div>{{ compra.motivoCancelamento }}</div>
			</v-card-text>
		</v-card>

		<v-card class="mb-4">
			<v-card-title>Dados Gerais</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" sm="6"><strong>Objeto:</strong> {{ compra.objeto }}</v-col>
					<v-col cols="12" sm="6"><strong>Justificativa:</strong> {{ compra.justificativa }}</v-col>
					<v-col cols="12" sm="6"><strong>Modalidade:</strong> {{ modalidadeLabels[compra.modalidade] }}</v-col>
					<v-col cols="12" sm="6"><strong>Critério de Julgamento:</strong> {{ criterioLabels[compra.criterioJulgamento] }}</v-col>
					<v-col cols="12" sm="6"><strong>Unidade Compradora:</strong> {{ compra.unidadeCompradora.nome }}</v-col>
					<v-col cols="12" sm="6"><strong>Categoria de Compra:</strong> {{ compra.categoriaCompra.nome }}</v-col>
					<v-col cols="12" sm="6"><strong>Data de Abertura:</strong> {{ formatarData(compra.dataAbertura) }}</v-col>
					<v-col cols="12" sm="6"><strong>Data Limite para Propostas:</strong> {{ formatarData(compra.dataLimitePropostas) }}</v-col>
					<v-col cols="12"><strong>Valor Estimado Total:</strong> {{ formatarMoeda(compra.valorEstimadoTotal) }}</v-col>
				</v-row>
			</v-card-text>
		</v-card>

		<v-card class="mb-4">
			<v-card-title>Itens</v-card-title>
			<v-simple-table>
				<thead>
					<tr>
						<th>Descrição</th>
						<th>Unidade</th>
						<th>Quantidade</th>
						<th>Valor Unitário</th>
						<th>Valor Total</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in compra.itens" :key="item.id">
						<td>{{ item.descricao }}</td>
						<td>{{ item.unidadeMedida }}</td>
						<td>{{ item.quantidade }}</td>
						<td>{{ formatarMoeda(item.valorUnitarioEstimado) }}</td>
						<td>{{ formatarMoeda(item.valorTotalEstimado) }}</td>
					</tr>
				</tbody>
			</v-simple-table>
		</v-card>

		<v-card class="mb-4">
			<v-card-title>Fornecedores Convidados</v-card-title>
			<v-simple-table>
				<thead>
					<tr>
						<th>Razão Social</th>
						<th>Tipo</th>
						<th>E-mail</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="fornecedor in compra.fornecedoresConvidados" :key="fornecedor.id">
						<td>{{ fornecedor.razaoSocial }}</td>
						<td>{{ tipoFornecedorLabels[fornecedor.tipoFornecedor] }}</td>
						<td>{{ fornecedor.email }}</td>
					</tr>
				</tbody>
			</v-simple-table>
		</v-card>

		<v-card class="mb-4">
			<v-card-title>Propostas Recebidas</v-card-title>
			<v-simple-table>
				<thead>
					<tr>
						<th>Fornecedor</th>
						<th>Valor Proposto</th>
						<th>Percentual de Desconto</th>
						<th>Prazo de Entrega (dias)</th>
						<th>Data de Envio</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="propostas.length === 0">
						<td colspan="5" class="text-center">Nenhuma proposta recebida até o momento.</td>
					</tr>
					<tr v-for="proposta in propostas" :key="proposta.id">
						<td>{{ proposta.fornecedorNome }}</td>
						<td>{{ proposta.valorProposto != null ? formatarMoeda(proposta.valorProposto) : '-' }}</td>
						<td>{{ proposta.percentualDesconto != null ? `${proposta.percentualDesconto}%` : '-' }}</td>
						<td>{{ proposta.prazoEntregaDias }}</td>
						<td>{{ formatarData(proposta.dataEnvio) }}</td>
					</tr>
				</tbody>
			</v-simple-table>
		</v-card>

		<v-card v-if="mostrarFormProposta" class="mb-4">
			<v-card-title>Registrar Proposta</v-card-title>
			<v-card-text>
				<v-form ref="formProposta" v-model="propostaFormValido">
					<v-row>
						<v-col cols="12" sm="4">
							<v-select
								v-model="propostaForm.fornecedorId"
								label="Fornecedor"
								:items="compra.fornecedoresConvidados"
								item-text="razaoSocial"
								item-value="id"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col v-if="compra.criterioJulgamento === CRITERIO.MENOR_PRECO" cols="12" sm="4">
							<v-text-field
								v-model.number="propostaForm.valorProposto"
								type="number"
								min="0"
								step="0.01"
								label="Valor Proposto"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col v-if="compra.criterioJulgamento === CRITERIO.MAIOR_DESCONTO" cols="12" sm="4">
							<v-text-field
								v-model.number="propostaForm.percentualDesconto"
								type="number"
								min="0"
								max="100"
								step="0.01"
								label="Percentual de Desconto (%)"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col cols="12" sm="4">
							<v-text-field
								v-model.number="propostaForm.prazoEntregaDias"
								type="number"
								min="0"
								label="Prazo de Entrega (dias)"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
					</v-row>
					<div class="text-right">
						<v-btn color="primary" :loading="enviandoProposta" @click="enviarProposta">Registrar Proposta</v-btn>
					</div>
				</v-form>
			</v-card-text>
		</v-card>

		<v-card class="mb-4">
			<v-card-title>Notificações Enviadas aos Fornecedores</v-card-title>
			<v-simple-table>
				<thead>
					<tr>
						<th>Fornecedor</th>
						<th>Data de Envio</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="notificacoes.length === 0">
						<td colspan="3" class="text-center">Nenhuma notificação enviada até o momento.</td>
					</tr>
					<tr v-for="notificacao in notificacoes" :key="notificacao.fornecedorId">
						<td>{{ notificacao.fornecedorNome }}</td>
						<td>{{ formatarData(notificacao.dataEnvio) }}</td>
						<td>
							<v-chip :color="statusNotificacaoCores[notificacao.status]" dark small>
								{{ statusNotificacaoLabels[notificacao.status] }}
							</v-chip>
						</td>
					</tr>
				</tbody>
			</v-simple-table>
		</v-card>

		<ConfirmDialog
			v-model="dialogPublicar"
			title="Publicar Compra Direta"
			message="Deseja realmente publicar esta compra direta? Após publicada, ela não poderá mais ser editada."
			:carregando="processando"
			@confirmar="confirmarPublicar"
			@cancelar="dialogPublicar = false"
		/>

		<ConfirmDialog
			v-model="dialogApurar"
			title="Apurar Vencedor"
			message="Deseja realmente apurar o vencedor desta compra direta com base nas propostas recebidas?"
			:carregando="processando"
			@confirmar="confirmarApurar"
			@cancelar="dialogApurar = false"
		/>

		<v-dialog v-model="dialogCancelar" max-width="500">
			<v-card>
				<v-card-title>Cancelar Compra Direta</v-card-title>
				<v-card-text>
					<v-textarea v-model="motivoCancelamento" label="Motivo do Cancelamento" rows="3" :rules="[regras.obrigatorio]" />
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn text :disabled="processando" @click="dialogCancelar = false">Voltar</v-btn>
					<v-btn color="error" text :loading="processando" :disabled="!motivoCancelamento" @click="confirmarCancelar">
						Confirmar Cancelamento
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import ConfirmDialog from '@/views/components/ConfirmDialog.vue'
import { MODALIDADE_LABELS } from '@/core/constants/modalidade'
import { CRITERIO_JULGAMENTO as CRITERIO, CRITERIO_JULGAMENTO_LABELS } from '@/core/constants/criterio-julgamento'
import { STATUS_COMPRA_DIRETA as STATUS, STATUS_COMPRA_DIRETA_LABELS, STATUS_COMPRA_DIRETA_CORES } from '@/core/constants/status-compra-direta'
import { STATUS_NOTIFICACAO_LABELS, STATUS_NOTIFICACAO_CORES } from '@/core/constants/status-notificacao'
import { TIPO_FORNECEDOR_LABELS } from '@/core/constants/tipo-fornecedor'
import { formatarMoeda, formatarData } from '@/core/utils/formatadores'

function propostaFormVazio() {
	return { fornecedorId: null, valorProposto: null, percentualDesconto: null, prazoEntregaDias: null }
}

export default {
	name: 'CompraDiretaDetalhe',

	components: { ConfirmDialog },

	data() {
		return {
			compra: null,
			notificacoes: [],
			propostas: [],
			dialogPublicar: false,
			dialogCancelar: false,
			dialogApurar: false,
			processando: false,
			enviandoProposta: false,
			motivoCancelamento: '',
			propostaFormValido: false,
			propostaForm: propostaFormVazio(),
			STATUS,
			CRITERIO,
			modalidadeLabels: MODALIDADE_LABELS,
			criterioLabels: CRITERIO_JULGAMENTO_LABELS,
			statusLabels: STATUS_COMPRA_DIRETA_LABELS,
			statusCores: STATUS_COMPRA_DIRETA_CORES,
			statusNotificacaoLabels: STATUS_NOTIFICACAO_LABELS,
			statusNotificacaoCores: STATUS_NOTIFICACAO_CORES,
			tipoFornecedorLabels: TIPO_FORNECEDOR_LABELS,
			regras: {
				obrigatorio: (valor) => (valor !== null && valor !== undefined && valor !== '') || 'Campo obrigatório',
			},
		}
	},

	computed: {
		compraId() {
			return this.$route.params.id
		},

		avisoEdicaoBloqueada() {
			return this.$route.query.avisoEdicaoBloqueada === '1'
		},

		mostrarFormProposta() {
			return this.compra && [STATUS.PUBLICADA, STATUS.EM_JULGAMENTO].includes(this.compra.status)
		},

		podeApurarVencedor() {
			return this.compra && [STATUS.PUBLICADA, STATUS.EM_JULGAMENTO].includes(this.compra.status)
		},

		podeCancelar() {
			return this.compra && ![STATUS.HOMOLOGADA, STATUS.CANCELADA].includes(this.compra.status)
		},
	},

	created() {
		this.carregar()
	},

	methods: {
		formatarMoeda,
		formatarData,

		async carregar() {
			this.compra = await this.$store.dispatch('compraDireta/buscarPorId', this.compraId)
			this.notificacoes = await this.$store.dispatch('compraDireta/listarNotificacoes', this.compraId)
			this.propostas = await this.$store.dispatch('compraDireta/listarPropostas', this.compraId)
		},

		async confirmarPublicar() {
			this.processando = true
			try {
				await this.$store.dispatch('compraDireta/publicar', this.compraId)
				this.dialogPublicar = false
				await this.carregar()
			} finally {
				this.processando = false
			}
		},

		async confirmarApurar() {
			this.processando = true
			try {
				await this.$store.dispatch('compraDireta/apurarVencedor', this.compraId)
				this.dialogApurar = false
				await this.carregar()
			} finally {
				this.processando = false
			}
		},

		async confirmarCancelar() {
			this.processando = true
			try {
				await this.$store.dispatch('compraDireta/cancelar', { id: this.compraId, motivo: this.motivoCancelamento })
				this.dialogCancelar = false
				this.motivoCancelamento = ''
				await this.carregar()
			} finally {
				this.processando = false
			}
		},

		async enviarProposta() {
			if (!this.$refs.formProposta.validate()) return

			const proposta = {
				fornecedorId: this.propostaForm.fornecedorId,
				prazoEntregaDias: this.propostaForm.prazoEntregaDias,
			}
			if (this.compra.criterioJulgamento === CRITERIO.MENOR_PRECO) {
				proposta.valorProposto = this.propostaForm.valorProposto
			}
			if (this.compra.criterioJulgamento === CRITERIO.MAIOR_DESCONTO) {
				proposta.percentualDesconto = this.propostaForm.percentualDesconto
			}

			this.enviandoProposta = true
			try {
				await this.$store.dispatch('compraDireta/registrarProposta', { id: this.compraId, proposta })
				this.propostaForm = propostaFormVazio()
				this.$refs.formProposta.resetValidation()
				await this.carregar()
			} finally {
				this.enviandoProposta = false
			}
		},
	},
}
</script>
