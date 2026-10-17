<template>
	<div>
		<h1 class="text-h5 mb-4">{{ editando ? 'Editar Compra Direta' : 'Nova Compra Direta' }}</h1>

		<v-form ref="form" v-model="formValido" @submit.prevent="salvar">
			<v-card class="mb-4">
				<v-card-title>Dados Gerais</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field v-model="form.objeto" label="Objeto" :rules="[regras.obrigatorio]" required />
						</v-col>
						<v-col cols="12">
							<v-textarea v-model="form.justificativa" label="Justificativa" :rules="[regras.obrigatorio]" required rows="3" />
						</v-col>
						<v-col cols="12" sm="6">
							<v-select
								v-model="form.modalidade"
								label="Modalidade"
								:items="opcoesModalidade"
								:rules="[regras.obrigatorio]"
								required
								@change="aoAlterarModalidade"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-select
								v-model="form.criterioJulgamento"
								label="Critério de Julgamento"
								:items="opcoesCriterio"
								:disabled="criterioDesabilitado"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-select
								v-model="form.unidadeCompradoraId"
								label="Unidade Compradora"
								:items="unidadesCompradoras"
								item-text="nome"
								item-value="id"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-select
								v-model="form.categoriaCompraId"
								label="Categoria de Compra"
								:items="categoriasCompra"
								item-text="nome"
								item-value="id"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field v-model="form.dataAbertura" type="date" label="Data de Abertura" :rules="[regras.obrigatorio]" required />
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field
								v-model="form.dataLimitePropostas"
								type="date"
								label="Data Limite para Propostas"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>

			<v-card class="mb-4">
				<v-card-title class="d-flex justify-space-between align-center">
					Itens
					<v-btn small color="primary" @click="adicionarItem">
						<v-icon left small>mdi-plus</v-icon>
						Adicionar Item
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-row v-for="(item, index) in form.itens" :key="index" align="center">
						<v-col cols="12" sm="4">
							<v-text-field v-model="item.descricao" label="Descrição" :rules="[regras.obrigatorio]" required />
						</v-col>
						<v-col cols="6" sm="2">
							<v-text-field v-model="item.unidadeMedida" label="Unidade" :rules="[regras.obrigatorio]" required />
						</v-col>
						<v-col cols="6" sm="2">
							<v-text-field
								v-model.number="item.quantidade"
								type="number"
								min="0"
								label="Quantidade"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col cols="6" sm="2">
							<v-text-field
								v-model.number="item.valorUnitarioEstimado"
								type="number"
								min="0"
								step="0.01"
								label="Valor Unitário"
								:rules="[regras.obrigatorio]"
								required
							/>
						</v-col>
						<v-col cols="4" sm="1" class="text-right">
							{{ formatarMoeda(valorTotalItem(item)) }}
						</v-col>
						<v-col cols="2" sm="1" class="text-right">
							<v-btn icon small :disabled="form.itens.length === 1" @click="removerItem(index)">
								<v-icon small>mdi-delete</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" class="text-right text-h6">Valor Estimado Total: {{ formatarMoeda(valorEstimadoTotal) }}</v-col>
					</v-row>
				</v-card-text>
			</v-card>

			<v-card class="mb-4">
				<v-card-title>Fornecedores Convidados</v-card-title>
				<v-card-text>
					<v-select
						v-model="form.fornecedoresConvidadosIds"
						label="Fornecedores"
						:items="fornecedores"
						item-text="razaoSocial"
						item-value="id"
						multiple
						chips
						small-chips
						deletable-chips
						:rules="[regras.listaObrigatoria]"
					/>
				</v-card-text>
			</v-card>

			<div class="d-flex justify-end">
				<v-btn text class="mr-2" :to="voltarPara">Cancelar</v-btn>
				<v-btn color="primary" type="submit" :loading="salvando">Salvar</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script>
import UnidadeCompradoraApiClient from '@/core/apiclient/unidade-compradora/UnidadeCompradoraApiClient'
import CategoriaCompraApiClient from '@/core/apiclient/categoria-compra/CategoriaCompraApiClient'
import FornecedorApiClient from '@/core/apiclient/fornecedor/FornecedorApiClient'
import { MODALIDADE, MODALIDADE_OPTIONS } from '@/core/constants/modalidade'
import { CRITERIO_JULGAMENTO, CRITERIO_JULGAMENTO_OPTIONS } from '@/core/constants/criterio-julgamento'
import { STATUS_COMPRA_DIRETA } from '@/core/constants/status-compra-direta'
import { formatarMoeda } from '@/core/utils/formatadores'

function itemVazio() {
	return { descricao: '', unidadeMedida: '', quantidade: null, valorUnitarioEstimado: null }
}

export default {
	name: 'CompraDiretaForm',

	data() {
		return {
			formValido: false,
			salvando: false,
			unidadesCompradoras: [],
			categoriasCompra: [],
			fornecedores: [],
			form: {
				objeto: '',
				justificativa: '',
				modalidade: null,
				criterioJulgamento: null,
				unidadeCompradoraId: null,
				categoriaCompraId: null,
				dataAbertura: '',
				dataLimitePropostas: '',
				itens: [itemVazio()],
				fornecedoresConvidadosIds: [],
			},
			regras: {
				obrigatorio: (valor) => (valor !== null && valor !== undefined && valor !== '') || 'Campo obrigatório',
				listaObrigatoria: (valor) => (Array.isArray(valor) && valor.length > 0) || 'Selecione ao menos um fornecedor',
			},
		}
	},

	computed: {
		editando() {
			return this.$route.name === 'CompraDiretaEditar'
		},

		compraId() {
			return this.$route.params.id
		},

		voltarPara() {
			return this.editando ? `/compras-diretas/${this.compraId}` : '/compras-diretas'
		},

		opcoesModalidade() {
			return MODALIDADE_OPTIONS
		},

		opcoesCriterio() {
			if (this.form.modalidade === MODALIDADE.INEXIGIBILIDADE) {
				return CRITERIO_JULGAMENTO_OPTIONS.filter((opcao) => opcao.value === CRITERIO_JULGAMENTO.NAO_SE_APLICA)
			}
			if (this.form.modalidade === MODALIDADE.DISPENSA_DE_LICITACAO) {
				return CRITERIO_JULGAMENTO_OPTIONS.filter((opcao) => opcao.value !== CRITERIO_JULGAMENTO.NAO_SE_APLICA)
			}
			return CRITERIO_JULGAMENTO_OPTIONS
		},

		criterioDesabilitado() {
			return this.form.modalidade === MODALIDADE.INEXIGIBILIDADE
		},

		valorEstimadoTotal() {
			return this.form.itens.reduce((total, item) => total + this.valorTotalItem(item), 0)
		},
	},

	async created() {
		await this.carregarListas()
		if (this.editando) {
			await this.carregarCompra()
		}
	},

	methods: {
		formatarMoeda,

		async carregarListas() {
			const [unidades, categorias, fornecedores] = await Promise.all([
				UnidadeCompradoraApiClient.listar(),
				CategoriaCompraApiClient.listar(),
				FornecedorApiClient.listar(),
			])
			this.unidadesCompradoras = unidades.data
			this.categoriasCompra = categorias.data
			this.fornecedores = fornecedores.data
		},

		async carregarCompra() {
			const compra = await this.$store.dispatch('compraDireta/buscarPorId', this.compraId)

			if (compra.status !== STATUS_COMPRA_DIRETA.RASCUNHO) {
				this.$router.replace(`/compras-diretas/${this.compraId}?avisoEdicaoBloqueada=1`)
				return
			}

			this.form = {
				objeto: compra.objeto,
				justificativa: compra.justificativa,
				modalidade: compra.modalidade,
				criterioJulgamento: compra.criterioJulgamento,
				unidadeCompradoraId: compra.unidadeCompradora ? compra.unidadeCompradora.id : null,
				categoriaCompraId: compra.categoriaCompra ? compra.categoriaCompra.id : null,
				dataAbertura: compra.dataAbertura ? compra.dataAbertura.substring(0, 10) : '',
				dataLimitePropostas: compra.dataLimitePropostas ? compra.dataLimitePropostas.substring(0, 10) : '',
				itens: compra.itens.map((item) => ({
					descricao: item.descricao,
					unidadeMedida: item.unidadeMedida,
					quantidade: item.quantidade,
					valorUnitarioEstimado: item.valorUnitarioEstimado,
				})),
				fornecedoresConvidadosIds: compra.fornecedoresConvidados.map((fornecedor) => fornecedor.id),
			}
		},

		aoAlterarModalidade(modalidade) {
			if (modalidade === MODALIDADE.INEXIGIBILIDADE) {
				this.form.criterioJulgamento = CRITERIO_JULGAMENTO.NAO_SE_APLICA
			} else if (modalidade === MODALIDADE.DISPENSA_DE_LICITACAO) {
				if (this.form.criterioJulgamento === CRITERIO_JULGAMENTO.NAO_SE_APLICA) {
					this.form.criterioJulgamento = null
				}
			}
		},

		valorTotalItem(item) {
			const quantidade = Number(item.quantidade) || 0
			const valorUnitario = Number(item.valorUnitarioEstimado) || 0
			return quantidade * valorUnitario
		},

		adicionarItem() {
			this.form.itens.push(itemVazio())
		},

		removerItem(index) {
			this.form.itens.splice(index, 1)
		},

		async salvar() {
			if (!this.$refs.form.validate()) return

			this.salvando = true
			try {
				const dados = { ...this.form }
				if (this.editando) {
					await this.$store.dispatch('compraDireta/atualizar', { id: this.compraId, dados })
					this.$router.push(`/compras-diretas/${this.compraId}`)
				} else {
					const compraCriada = await this.$store.dispatch('compraDireta/criar', dados)
					this.$router.push(`/compras-diretas/${compraCriada.id}`)
				}
			} finally {
				this.salvando = false
			}
		},
	},
}
</script>
