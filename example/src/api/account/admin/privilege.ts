import Http from '../../http'

const { httpPost, httpGet } = Http

export interface IAdd {
  parentId: string | number
  name: string,
  icon: string,
  api: string,
  type: string,
  path: string,
  page: string,
  desc: string,
  status: number,
  order: number,
}

export function list(data: any) {
  return httpGet('/api/account/admin/privilege/list', data)
}

export function rows(data: any) {
  return httpGet('/api/account/admin/privilege/rows', data)
}

export function detail(data: any) {
  return httpGet('/api/account/admin/privilege/detail', data)
}

export function add(data: any) {
  return httpPost('/api/account/admin/privilege/add', data)
}

export function edit(data: any) {
  return httpPost('/api/account/admin/privilege/edit', data)
}

export function tree(data: any) {
  return httpGet('/api/account/admin/privilege/tree', data)
}

export function del(data: any) {
  return httpPost('/api/account/admin/privilege/del', data)
}
