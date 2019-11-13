import Http from '../http'

const { httpGet } = Http

export function rows() {
  return httpGet('/api/system/db/rows')
}

export function tableRows(db: string) {
  return httpGet('/api/system/db/table_rows', { db })
}
