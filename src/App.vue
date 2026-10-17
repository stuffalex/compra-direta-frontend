<template>
	<v-app>
		<v-navigation-drawer app permanent>
			<v-list nav dense>
				<v-list-item-group color="primary">
					<v-list-item to="/compras-diretas" link>
						<v-list-item-icon>
							<v-icon>mdi-file-document-outline</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Compras Diretas</v-list-item-title>
					</v-list-item>
					<v-list-item to="/fornecedores" link>
						<v-list-item-icon>
							<v-icon>mdi-domain</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Fornecedores</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app color="primary" dark>
			<v-toolbar-title>Compra Direta — Desafio Técnico</v-toolbar-title>
		</v-app-bar>

		<v-main>
			<v-container fluid>
				<router-view />
			</v-container>
		</v-main>

		<v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="6000">
			{{ snackbar.text }}
			<template #action="{ attrs }">
				<v-btn text v-bind="attrs" @click="snackbar.show = false">Fechar</v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>
import eventBus from '@/core/utils/eventBus'

export default {
	name: 'App',

	data() {
		return {
			snackbar: {
				show: false,
				text: '',
				color: 'error',
			},
		}
	},

	created() {
		eventBus.$on('api-error', this.exibirErro)
	},

	beforeDestroy() {
		eventBus.$off('api-error', this.exibirErro)
	},

	methods: {
		exibirErro(mensagem) {
			this.snackbar = { show: true, text: mensagem, color: 'error' }
		},
	},
}
</script>
