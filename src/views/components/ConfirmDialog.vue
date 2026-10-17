<template>
	<v-dialog :value="value" max-width="500" @input="$emit('input', $event)">
		<v-card>
			<v-card-title>{{ title }}</v-card-title>
			<v-card-text>{{ message }}</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text :disabled="carregando" @click="$emit('cancelar')">Cancelar</v-btn>
				<v-btn color="primary" text :loading="carregando" @click="$emit('confirmar')">Confirmar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'ConfirmDialog',

	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: 'Confirmação' },
		message: { type: String, default: 'Deseja realmente continuar?' },
		carregando: { type: Boolean, default: false },
	},
}
</script>
