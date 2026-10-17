export function formatarMoeda(valor) {
	const numero = Number(valor) || 0
	return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarData(data) {
	if (!data) return '-'
	const [ano, mes, dia] = data.substring(0, 10).split('-')
	return `${dia}/${mes}/${ano}`
}

export function formatarDataHora(data) {
	if (!data) return '-'
	const partes = data.split('T')
	const dataFormatada = formatarData(partes[0])
	if (!partes[1]) return dataFormatada
	return `${dataFormatada} ${partes[1].substring(0, 5)}`
}
