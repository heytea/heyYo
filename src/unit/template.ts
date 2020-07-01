const reg = /<%=([\w_-])+%>/g
export const isTemplate = (str: string) => reg.test(str)
const template = (text = '', params: { [key: string]: string | number }) => {
  return text.replace(reg, function (match) {
    const matchKey = (match.slice && match.slice(3, -2) || '').trim()
    return (matchKey ? (typeof params[matchKey] === 'undefined' ? matchKey : params[matchKey]) : '') + ''
  })
}
export const templateToBoolean = (text = '', params: { [key: string]: string | number }): boolean => {
  const str = template(text, params)
  if (str.indexOf('===') > 0) {
    const arr = str.split('===')
    return arr[0] === arr[1]
  }
  if (str.indexOf('>') > 0) {
    const arr = str.split('>')
    return arr[0] > arr[1]
  }
  if (str.indexOf('>=') > 0) {
    const arr = str.split('>=')
    return arr[0] >= arr[1]
  }
  if (str.indexOf('<') > 0) {
    const arr = str.split('<')
    return arr[0] > arr[1]
  }
  if (str.indexOf('<=') > 0) {
    const arr = str.split('<=')
    return arr[0] >= arr[1]
  }
  return false
}
export default template
