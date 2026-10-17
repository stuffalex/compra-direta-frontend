export const MODALIDADE = {
	DISPENSA_DE_LICITACAO: 'DISPENSA_DE_LICITACAO',
	INEXIGIBILIDADE: 'INEXIGIBILIDADE',
}

export const MODALIDADE_LABELS = {
	[MODALIDADE.DISPENSA_DE_LICITACAO]: 'Dispensa de Licitação',
	[MODALIDADE.INEXIGIBILIDADE]: 'Inexigibilidade',
}

export const MODALIDADE_OPTIONS = Object.values(MODALIDADE).map((value) => ({
	value,
	text: MODALIDADE_LABELS[value],
}))
