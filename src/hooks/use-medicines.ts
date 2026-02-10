import api from '../lib/api'

export async function getMedicines(params?: Record<string, any>) {
	const res = await api.get('/medicines', { params })
	return res.data
}

export async function getMedicineById(id: string) {
	const res = await api.get(`/medicines/${id}`)
	return res.data
}

export async function searchMedicines(query: string) {
	const res = await api.get('/medicines', { params: { q: query } })
	return res.data
}
