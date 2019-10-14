import Http from '../http'

const { httpPost, httpGet } = Http

export function add(data: any) {
  return httpPost('/api/system/dict/add', data)
}

export function detail(data: any) {
  return httpGet('/api/system/dict/detail', data)
}

export function list(data: any) {
  return httpGet('/api/system/dict/list', data)
}

export function rows(data?: any) {
  return httpGet('/api/system/dict/rows', data || {})
}

export function edit(data: any) {
  return httpPost('/api/system/dict/edit', data)
}

export function getMap(name: string) {
  return httpGet('/api/system/dict/getMap', { name })
}


