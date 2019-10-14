import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/api/system/api/list', data)
}

export function rows(data: any) {
  return httpGet('/api/system/api/rows', data)
}

export function detail(data: any) {
  return httpGet('/api/system/api/detail', data)
}

export function add(data: any) {
  return httpPost('/api/system/api/add', data)
}

export function edit(data: any) {
  return httpPost('/api/system/api/edit', data)
}

export function freeze(data: any) {
  return httpPost('/api/system/api/freeze', data)
}

export function unfreeze(data: any) {
  return httpPost('/api/system/api/unfreeze', data)
}

export function del(data: any) {
  return httpPost('/api/system/api/del', data)
}
