import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/api/system/page/list', data)
}

export function rows(data: any) {
  return httpGet('/api/system/page/rows', data)
}

export function detail(data: any) {
  return httpGet('/api/system/page/detail', data)
}

export function add(data: any) {
  return httpPost('/api/system/page/add', data)
}

export function edit(data: any) {
  return httpPost('/api/system/page/edit', data)
}
