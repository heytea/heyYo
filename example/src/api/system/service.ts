import Http from '../http'

const { httpGet } = Http

export function rows() {
  return httpGet('/api/system/service/rows')
}
