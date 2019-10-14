import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/api/system/table/list', data)
}

export function getFields({ db, name }: { db: string, name: string }) {
  return httpGet('/api/system/table/getFields', { db, name })
}

export function detail(data: any) {
  return httpGet('/api/system/table/detail', data)
}

export function add(data: any) {
  return httpPost('/api/system/table/add', data)
}

export function edit(data: any) {
  return httpPost('/api/system/table/edit', data)
}
